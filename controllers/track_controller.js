var fs = require('fs');
var restler = require('restler');
var Track = require('./../models/track');
var FILES_SERVER="http://localhost:3000/files"; //fileservers url here

// Devuelve una lista de las canciones disponibles y sus metadatos
exports.list = function (req, res) {
	Track.find(function (err, tracks) {
		if (err) return console.error(err);
		console.log(tracks);
		res.render('tracks/index', {tracks: tracks});
	});	
};

// Devuelve la vista del formulario para subir una nueva canción
exports.new = function (req, res) {
	res.render('tracks/new');
};

// Devuelve la vista de reproducción de una canción.
// El campo track.url contiene la url donde se encuentra el fichero de audio
exports.show = function (req, res) {
	var trackId=req.params.trackId;
	console.log("Finding track: ",trackId);
	Track.find( { _id : trackId } , function (err, tracks) {
		if (err) return console.error(err);
		var track = tracks[0];
		console.log("Found tracks ",track);
		res.render('tracks/show', {track: track});
	});
};

// Escribe una nueva canción en el registro de canciones.
exports.create = function (req, res) {
	var track = req.files.track&&req.files.track[0];
	var cover = req.files.cover&&req.files.cover[0];
	if(track){
		console.log('Nuevo fichero de audio. Datos: ', track);
		var id = track.filename;
		var name = track.originalname.split('.')[0];

		var then=function(song){
			song.save(function(err,song){
				if(err){
					return console.error(err);
				}
				res.redirect('/tracks');
			});
		}

	// Aquí debe implementarse la escritura del fichero de audio (track.buffer) en tracks.cdpsfy.es
	// Esta url debe ser la correspondiente al nuevo fichero en tracks.cdpsfy.es
	fs.stat(track.path, function(err, stats) {
		restler.post(FILES_SERVER, { 
			multipart: true,
			data: {
				"file": restler.file(track.path, null, stats.size, null, track.mimetype)
			}
		}).on("complete", function(data) {
			console.log('Response from files server:',data);
			var url = FILES_SERVER + "/" + data.filename;
			if(cover){
				fs.stat(cover.path, function(err, stats) {
					restler.post(FILES_SERVER, { 
						multipart: true,
						data: {
							"file": restler.file(cover.path, null, stats.size, null, cover.mimetype)
						}
					}).on("complete", function(data) {
						var coverUrl = FILES_SERVER + "/" + data.filename;
						var song = new Track({ name: name,url:url,coverUrl:coverUrl });
						then(song);
					});
				});
			}else{
				var song = new Track({ name: name,url:url });
				then(song);
			}
		});
	});
}else{
	res.status(400).send("No content");
}
};

// Borra una canción (trackId) del registro de canciones 
exports.destroy = function (req, res) {
	var trackId = req.params.trackId;
	Track.find( { _id : trackId } , function (err, tracks) {
		if (err) return console.error(err);
		var track = tracks[0];
		console.log("Destroying:",track);
		track.remove(function(err){
			console.log("Deleting track: ",track.url);
			restler.del(track.url,{}).on("complete", function(data) {
				if(track.coverUrl){
						console.log("Deleting cover: ",track.coverUrl);
						restler.del(track.coverUrl,{}).on("complete", function(data) {
							res.redirect('/tracks');
						});
				}else{
					res.redirect('/tracks');
				}
			});
		});
	})
};
