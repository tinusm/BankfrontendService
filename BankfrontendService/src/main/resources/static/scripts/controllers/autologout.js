'use strict';


angular.module('TechathonApp').controller('DemoCtrl', function($scope, $rootScope, $idle, $keepalive, $modal, $location, AUTH_EVENTS){
	$idle.watch();

/*	function closeModals() {
		if ($scope.warning) {
			$scope.warning.close();
			$scope.warning = null;
		}

		if ($scope.timedout) {
			$scope.timedout.close();
			$scope.timedout = null;
		}
	}*/

	$scope.$on('$idleStart', function() {
		//console.log('Event $idleStart');
		/*closeModals();

		$scope.warning = $modal.open({
			templateUrl: 'warning-dialog.html',
			windowClass: 'modal-danger'
		});*/
	});
	
	  $scope.$on('$idleWarn', function(e, countdown) {
          // follows after the $idleStart event, but includes a countdown until the user is considered timed out
          // the countdown arg is the number of seconds remaining until then.
          // you can change the title or display a warning dialog from here.
          // you can let them resume their session by calling $idle.watch()
		  //console.log('Event $idleWarn');
      });	

	$scope.$on('$idleTimeout', function() {
		//console.log('Event $idleTimeout');
/*		closeModals();
		$scope.timedout = $modal.open({
			templateUrl: 'timedout-dialog.html',
			windowClass: 'modal-danger'
		});
		
		$rootScope.user = {};
		$rootScope.role = undefined;
		$rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
		$rootScope.authenticated = false;
		$location.url('/home');*/
	});
	
	$scope.$on('$idleEnd', function() {
		//console.log('Event $idleEnd');
		/*closeModals();*/
	});
	
	 $scope.$on('$keepalive', function() {
         // do something to keep the user's session alive
			//console.log('Event $keepalive');
     });
})
.config(function($idleProvider, $keepaliveProvider) {
	// configure $idle settings
	$idleProvider.idleDuration(10*60); // in seconds
	$idleProvider.warningDuration(5); // in seconds
	$keepaliveProvider.interval(5*60); // in seconds
})
.run(['$idle', function($idle) {
	//console.log('Watch Started...');
	$idle.watch();
}]);

