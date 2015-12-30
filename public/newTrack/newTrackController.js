app.controller('newTrackCtrl', function($scope,$http,$location) {

	$scope.sendTrack = function(){
		var formData = new FormData();

		var trackFile= $('input#trackInput')[0].files[0];
		if(trackFile)
        	formData.append("track", trackFile);

        var coverFile= $('input#coverInput')[0].files[0];
        if(coverFile)
        	formData.append("cover", coverFile);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', window.location.origin + "/api/tracks");
        xhr.onload = function () {
            if (xhr.status === 200) {
                $location.path("/tracks")
            } else {
            	alert("Error uploading");
            }
            $scope.$apply();
        };

        xhr.send(formData);
	}

});