var fs = require('fs');
var restler = require('restler');
var Track = require('./../models/track');
var FILES_SERVER="http://localhost:3000/files"; //fileservers url here

// Devuelve una lista de las canciones disponibles y sus metadatos
exports.list = function (req, res) {
	Track.find(function (err, tracks) {
		if (err) return console.error(err);
		console.log(tracks);
		res.send(tracks);
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
		var track = tracks[0]; //Select the first element, since it is unique id, it should only exist one
		console.log("Found tracks ",track);
		res.render('tracks/show', {track: track});
	});
};

// Escribe una nueva canción en el registro de canciones.
exports.create = function (req, res) {
	var track = req.files.track&&req.files.track[0]; //Get the track from the request. See multer in npm website
	var cover = req.files.cover&&req.files.cover[0];  //Get the cover from the request. See multer in npm website
	if(track){
		console.log('Nuevo fichero de audio. Datos: ', track);
		var id = track.filename;
		var name = track.originalname.split('.')[0]; //Get the file name without extension

		var then=function(song){ //Function that saves the song in mongodb.
			song.save(function(err,song){
				if(err){
					return console.error(err);
				}
				res.sendStatus(200);
			});
		}
		//Get the statistics of track file using the fs library, needed for the restler library
		fs.stat(track.path, function(err, stats) {
			restler.post(FILES_SERVER, {  //Send the file via post multipart to the fileServer
				multipart: true,
				data: {
					"file": restler.file(track.path, null, stats.size, null, track.mimetype) //here we use the size obtained in stats
				}
			}).on("complete", function(data) {
				console.log('Response from files server:',data);
				var url = FILES_SERVER + "/" + data.filename; //We get the full url using the filename that the fileServer has assigned to the file
				if(cover){ //If cover was send, do the same thing with the cover
					fs.stat(cover.path, function(err, stats) {
						restler.post(FILES_SERVER, { 
							multipart: true,
							data: {
								"file": restler.file(cover.path, null, stats.size, null, cover.mimetype)
							}
						}).on("complete", function(data) {
							var coverUrl = FILES_SERVER + "/" + data.filename;
							var song = new Track({ name: name,url:url,coverUrl:coverUrl }); //Here we create the song with an extra attribute, coverUrl
							then(song);
						});
					});
				}else{ //else, save the song and end.
					var song = new Track({ name: name,url:url });
					then(song);
				}
			});
		});
	}else{
		res.status(400).send("No content"); //If no track sent, send error.
	}
};

// Borra una canción (trackId) del registro de canciones 
exports.destroy = function (req, res) {
	var trackId = req.params.trackId;

	Track.find( { _id : trackId } , function (err, tracks) { //Find the track in the BDD
		if (err) return console.error(err);
		var track = tracks[0];

		console.log("Destroying:",track);

		track.remove(function(err){ //remove it from the BDD
			if (err) return console.error(err);
			console.log("Deleting track: ",track.url);
			restler.del(track.url,{}).on("complete", function(data) { //then delete the track file from the fileServer
				if(track.coverUrl){ // if the track has cover, delete it too
						console.log("Deleting cover: ",track.coverUrl);
						restler.del(track.coverUrl,{}).on("complete", function(data) {
							res.sendStatus(200);
						});
				}else{
					res.sendStatus(200);
				}
			});
		});
	})
};
