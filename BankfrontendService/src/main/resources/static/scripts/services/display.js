angular.module('TechathonApp').factory('DisplayService', function($rootScope) {

	var messageService ={};
	$rootScope.notifications = [];	
	$rootScope.invalidNotification = false;
	var index = 0;

	function showError(message){

	};

	function showInfo(message){

	};

	function showSuccess(message){

	};
	
	messageService.cleanMessage = function(){
		$rootScope.notifications = [];	
		console.log('Statred Notification..' + $rootScope.notifications.length);
	};

	messageService.addNotification =  function (notification){	
		var i;
		if(!notification){
			$rootScope.invalidNotification = true;
			return;
		}

		i = index++;
		$rootScope.invalidNotification = false;
		$rootScope.notifications[0] = notification;
	};
	
	return messageService;
});