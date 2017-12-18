
angular.module('TechathonApp').controller('HomeController', function AlertDemoCtrl($scope, $rootScope) {
	
	$rootScope.schedule = 'www.google.com';
	
	/*
	$rootScope.alerts = [
	                 { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
	                 { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
	                 ];

	$rootScope.addAlert = function() {
		$scope.alerts.push({msg: 'Another alert!'});
	};
	
	$rootScope.addError = function(message) {
		$scope.alerts.push({type: 'danger', msg: message});
	};
	
	$rootScope.addSuccess = function(message) {
		$scope.alerts.push({ type: 'success', msg: message});
	};

	$rootScope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};
*/
});