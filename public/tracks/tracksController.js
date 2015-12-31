app.controller('tracksCtrl', function($scope,$http,$log,angularPlayer) {
	$scope.tracks = [];
	$scope.playlists = [];
	$scope.trackSearch={name:""}

	$http.get("/api/playlists").success(function(data){
		$scope.playlists=data;
	});
	
	$scope.reloadTracks=function(){
		$http.get("/api/tracks").success(function(data){
			for (var i = data.length - 1; i >= 0; i--) {
				var track=data[i];
				track.id=track._id;
				track.title=track.name;
				track.artist="";
			}
			$scope.tracks=data;
		});
	}

	$scope.addToPlaylist=function(playlist,song){
		$http.post("/api/playlists/"+playlist._id,{trackId:song._id}).success(function(data){

		});
	}

	$scope.playSong=function(song){
		if($scope.isPlaying && song.id==$scope.currentPlaying.id){
			setTimeout(function() { 
				angularPlayer.pause();
			}, 0);
		}else{
			if($scope.currentPlaying&&song.id==$scope.currentPlaying.id){
				setTimeout(function() { 
					angularPlayer.play();
				}, 0);
			}else{
				setTimeout(function() { 
					angularPlayer.stop();
					angularPlayer.setCurrentTrack(null);
					angularPlayer.clearPlaylist(function(data) {
						var trackId = angularPlayer.addTrack(song);
						angularPlayer.playTrack(trackId);
					});
				}, 0);}
			}
		}

		$scope.deleteSong=function(song){
			$http.delete("/api/tracks/"+song._id).success(function(data){
				$scope.reloadTracks();
			})
		}

		$scope.reloadTracks();
	});