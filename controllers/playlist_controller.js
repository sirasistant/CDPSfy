var fs = require('fs');
var restler = require('restler');
var Track = require('./../models/track');
var Playlist = require('./../models/playlist');

exports.create =function(req,res){
	var name=req.body.name;
	if(name!==undefined){
		var playlist = new Playlist({
			name: name,
			songs:[]
		});
		playlist.save(function (err) {
			if (err)  
				return console.error(err);
			res.sendStatus(200);
		});
	}else{
		res.sendStatus(400);
	}
}

exports.list = function(req,res){
	Playlist.find().populate('songs').exec(function (err, playlists) {
		if (err) return console.error(err);
		console.log(playlists);
		res.send(playlists);
	});	
}

exports.addSongToPlaylist = function(req,res){
	var playlistId=req.params.playlistId;
	Playlist.find( { _id : playlistId } , function (err, playlists) {	
		if (err) return console.error(err);
		if(playlists.length===1){
			var playlist= playlists[0];
			Track.find( { _id : req.body.trackId } , function (err, tracks) {
				if (err) return console.error(err);
				var track=tracks[0];
				if(track!==undefined){
					playlist.songs.push(track._id);
					playlist.save(function(err){
						if (err)  
							return console.error(err);
						res.sendStatus(200);
					});
				}else{
					res.sendStatus(400);
				}
			});
		}else{
			res.sendStatus(400);}
		});
}

exports.deleteSongInPlaylist = function(req,res){
	var playlistId=req.params.playlistId;
	Playlist.find( { _id : playlistId } , function (err, playlists) {	
		if (err) return console.error(err);
		if(playlists.length===1){
			var playlist= playlists[0];
			var index=playlist.songs.indexOf(req.params.trackId);
			if(index!=-1){
				playlist.songs.splice(index,1);
				playlist.save(function(err){
					if (err)  
						return console.error(err);
					res.sendStatus(200);
				});
			}else{
				res.sendStatus(400);
			}
		}else{
			res.sendStatus(400);}
		});
}


