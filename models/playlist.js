var mongoose = require('mongoose');

/* 
Modelo de datos de listas de reproduccion
*/

var playlistSchema = mongoose.Schema({
    name: String,
    songs: [{ type:  mongoose.Schema.Types.ObjectId, ref: 'Track' }] //Create an array of references to the Track model. 
});

var Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;