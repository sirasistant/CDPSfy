var fs = require('fs');
var restler = require('restler');
var Track = require('./../models/track');
var FILES_SERVER="http://tracks.cdpsfy.es/files"; //fileservers url here

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
	var track = req.file;
	console.log('Nuevo fichero de audio. Datos: ', track);
	var id = track.filename;
	var name = track.originalname.split('.')[0];

	// Aquí debe implementarse la escritura del fichero de audio (track.buffer) en tracks.cdpsfy.es
	// Esta url debe ser la correspondiente al nuevo fichero en tracks.cdpsfy.es
	fs.stat(track.path, function(err, stats) {
		console.log('Stats from file: ',stats);
		console.log('Target url: ',FILES_SERVER);
		restler.post(FILES_SERVER, { 
			multipart: true,
			data: {
				"file": restler.file(track.path, null, stats.size, null, track.mimetype)
			}
		}).on("complete", function(data) {
			console.log('Response from files server:',data);
			var url = FILES_SERVER + "/" + data.filename;

			// Escribe los metadatos de la nueva canción en el registro.
			var song = new Track({ name: name,url:url });
			song.save(function(err,song){
				if(err){
					return console.error(err);
				}
				res.redirect('/tracks');
			});
		});
	});
};

// Borra una canción (trackId) del registro de canciones 
exports.destroy = function (req, res) {
	var trackId = req.params.trackId;
	Track.find( { _id : trackId } , function (err, tracks) {
		if (err) return console.error(err);
		var track = tracks[0];
		console.log("Destroying:",track);
		track.remove(function(err){
			restler.del(track.url,{}).on("complete", function(data) {
				res.redirect('/tracks');
			});
		});
	})
};
