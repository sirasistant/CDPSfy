var express = require('express');
var router = express.Router();
var multer  = require('multer');
var upload = multer({dest:"tmp/"});

var tracks_dir = process.env.TRACKS_DIR || './media/';

var trackController = require('../controllers/track_controller');

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/tracks', trackController.list);

router.get('/tracks/new', trackController.new);

router.get('/tracks/:trackId', trackController.show);

router.post('/tracks', upload.single('track'), trackController.create);

router.delete('/tracks/:trackId', trackController.destroy);

module.exports = router;