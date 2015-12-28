var mongoose = require('mongoose');

/* 
Modelo de datos de canciones (track)

track_id: {
	name: nombre de la canción,
	url: url del fichero de audio
} 

*/

var trackSchema = mongoose.Schema({
    name: String,
    url: String
});

var Track = mongoose.model('Track', trackSchema);

module.exports = Track;