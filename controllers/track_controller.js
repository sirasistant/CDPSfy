var fs = require('fs');
var track_model = require('./../models/track');

exports.list = function (req, res) {
	var tracks = track_model.tracks;
	res.render('tracks/index', {tracks: tracks});
};

exports.new = function (req, res) {
	res.render('tracks/new');
};

exports.show = function (req, res) {
	var track = track_model.tracks[req.params.trackId];
	track.id = req.params.trackId;
	res.render('tracks/show', {track: track});
};

exports.create = function (req, res) {
	console.log(req.files);
	var id = req.files.track.name.split('.')[0];
	var name = req.files.track.originalname.split('.')[0];
	var url = '/TODO';
	track_model.tracks[id] = {
		name: name,
		url: url
	};

	res.redirect('/tracks');
};

exports.destroy = function (req, res) {

	delete track_model.tracks[req.params.trackId];

	res.redirect('/tracks');
};