var app = angular.module('CDPSfy', ['ngRoute','angularSoundManager']);

app.controller('navCtrl', function($scope,$location) {
    $scope.tab = -1;

    $scope.$on('$routeChangeSuccess',function(){
    	switch($location.path()){
    		case "/":
    			$scope.tab=0;
    		break;
    		case "/tracks":
    			$scope.tab=1;
    		break;
    		case "/newTrack":
    			$scope.tab=2;
    		break;
    	}
    });

    $scope.selectTab = function (setTab) {
        $scope.tab = setTab;
        switch(setTab){
        	case 0:
        		$location.path("/");
        	break;
        	case 1:
        		$location.path("/tracks");
        	break;
        	case 2:
        		$location.path("/newTrack")
        	break;
        }
    };
    $scope.isTabSelected = function (checkTab) {
        return $scope.tab === checkTab;
    };

});

app.config(function($routeProvider, $locationProvider) {
  $routeProvider
   .when('/', {
    templateUrl: 'home/home.html',
    controller: 'homeCtrl'
  })
  .when('/tracks', {
    templateUrl: 'tracks/tracks.html',
    controller: 'tracksCtrl'
  }).when('/newTrack', {
    templateUrl: 'newTrack/newTrack.html',
    controller: 'newTrackCtrl'
  });;

  // configure html5 to get links working on jsfiddle
  $locationProvider.html5Mode(false);
});