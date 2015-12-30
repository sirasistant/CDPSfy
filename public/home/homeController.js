app.controller('homeCtrl', function($scope,$location) {
    $scope.gotoMyTracks=function(){
    	$location.path("/tracks");
    }
});