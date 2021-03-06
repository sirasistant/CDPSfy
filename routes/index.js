var express = require('express');
var router = express.Router();
var multer  = require('multer');
var upload = multer({dest:"tmp/"});

var tracks_dir = process.env.TRACKS_DIR || './media/';

var trackController = require('../controllers/track_controller');
var playlistController = require('../controllers/playlist_controller');

router.get('/', function(req, res) {
  res.render('index');
});

//Tracks routes

router.get('/tracks', trackController.list);

router.get('/tracks/new', trackController.new);

router.get('/tracks/:trackId', trackController.show);

router.post('/tracks', upload.fields([{ name: 'track', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), trackController.create);

router.delete('/tracks/:trackId', trackController.destroy);

//Playlists routes

router.post('/playlists',playlistController.create);

router.get('/playlists',playlistController.list);

router.post('/playlists/:playlistId',playlistController.addSongToPlaylist);

router.delete('/playlists/:playlistId/songs/:trackId',playlistController.deleteSongInPlaylist);

module.exports = router;