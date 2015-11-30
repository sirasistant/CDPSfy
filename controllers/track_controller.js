var fs = require('fs');

var tracks_dir = process.env.TRACKS_DIR || 'media/';

exports.list = function (req, res) {

	fs.readdir(tracks_dir, function (err, files) {
		console.log(files, err);
		var tracks = {};
		var index = 0;
		files.forEach (function (f) {
			tracks[index] = f;
			index++;
		});
		res.render('tracks/index', {tracks: tracks});
	});
};

exports.new = function (req, res) {
	res.render('tracks/new');
};

exports.show = function (req, res) {
	res.render('tracks/show', {track: req.params.trackId});
};

exports.create = function (req, res) {
	res.redirect('/tracks');
};

exports.destroy = function (req, res) {
	console.log('borrando', req.params.trackId);
	fs.unlinkSync(tracks_dir + req.params.trackId);
	res.redirect('/tracks');
};