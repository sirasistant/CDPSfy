var fs = require('fs');
var restler = require('restler');
var track_model = require('./../models/track');
var FILES_SERVER="tracks.cdpsfy.es/files"; //fileservers url here

// Devuelve una lista de las canciones disponibles y sus metadatos
exports.list = function (req, res) {
	var tracks = track_model.tracks;
	res.render('tracks/index', {tracks: tracks});
};

// Devuelve la vista del formulario para subir una nueva canción
exports.new = function (req, res) {
	res.render('tracks/new');
};

// Devuelve la vista de reproducción de una canción.
// El campo track.url contiene la url donde se encuentra el fichero de audio
exports.show = function (req, res) {
	var track = track_model.tracks[req.params.trackId];
	track.id = req.params.trackId;
	res.render('tracks/show', {track: track});
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
    	restler.post(FILES_SERVER, { 
	        multipart: true,
	        data: {
	            "file": restler.file(track.path, null, stats.size, null, track.mimetype)
       	 	}
    	}).on("complete", function(data) {
        	var jsonRes=JSON.parse(data);
			var url = FILES_SERVER + "/" + jsonRes.filename;

			// Escribe los metadatos de la nueva canción en el registro.
			track_model.tracks[id] = {
				name: name,
				url: url
			};

			res.redirect('/tracks');
    	});
	});
};

// Borra una canción (trackId) del registro de canciones 
exports.destroy = function (req, res) {
	var trackId = req.params.trackId;

	// Aquí debe implementarse el borrado del fichero de audio indetificado por trackId en tracks.cdpsfy.es
	var track=track_model.tracks[trackId];
	restler.del(track.url,{}).on("complete", function(data) {
        // Borra la entrada del registro de datos
		delete track_model.tracks[trackId];
		res.redirect('/tracks');
    });
};