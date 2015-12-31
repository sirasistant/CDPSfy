app.controller('playlistsCtrl', function($scope,$http,$uibModal,$location,angularPlayer) {
	$scope.playlists=[];

	$scope.reloadPlaylists = function(){
		$http.get("/api/playlists").success(function(data){
			$scope.playlists=data;
		})
	}

	$scope.createPlaylist=function(){
		var modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'addPlaylistModal.html',
			controller: 'addPlaylistController',
			resolve: {
			}
		});

		modalInstance.result.then(function () {
			$scope.reloadPlaylists();
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	}

	$scope.playSongInPlaylist=function(playlist,song){
		setTimeout(function() { 
			angularPlayer.clearPlaylist(function(data) {
            //add songs to playlist
            for(var i = 0; i < playlist.songs.length; i++) {
            	var track=playlist.songs[i];
            	track.id=track._id;
            	track.title=track.name;
            	track.artist="";
            	angularPlayer.addTrack(track);
            }
            angularPlayer.playTrack(song._id);
       		});
		}, 0);
	}

	$scope.deleteSongInPlaylist=function(playlist,song){
		$http.delete("/api/playlists/"+playlist._id+"/songs/"+song._id).success(function(data){
			$scope.reloadPlaylists();
		});
	}

	$scope.reloadPlaylists();

});

app.controller('addPlaylistController', function ($scope, $uibModalInstance,$http) {

	$scope.ok = function () {
		$http.post("/api/playlists",{name:$scope.name}).success(function(data){
			$uibModalInstance.close();
		});
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
});