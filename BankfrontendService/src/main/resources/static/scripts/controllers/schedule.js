'use strict';

angular.module('TechathonApp').controller('ScheduleController', function($scope,  $rootScope, $location, $http, APP_CONSTANTS,
		ScheduleService, ScheduleAllService, ScheduleControlService, SchedulesCreateService) {	
	var user = $rootScope.user;
	var role = $rootScope.role;
	$scope.schedules = [];
	$scope.schedule = {};
	$scope.scheduleControl = {};
	$scope.edit = false;
	$scope.format = 'yyyy/MM/dd';


	$scope.notifications = [];	
	$scope.invalidNotification = false;
	var index = 0;
	function addNotification(notification){	
		if(!notification){
			$scope.invalidNotification = true;
			return;
		}

		$scope.invalidNotification = false;
		$scope.notifications[index++] = notification;
	};

	function goHome(){
		console.log('Go Home !');
		$rootScope.user = {};
		$location.url(APP_CONSTANTS.NAV_HOME);
	};


	$scope.init = function(){	
		if(user && role){				
			loadSchedules();
			loadScheduleControl();
		}else{
			goHome();
		};

	};
	
	$scope.open = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.opened = true;
	};
	
	$scope.openEndDate = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.openedEndDate = true;
	};

	$scope.selectSchedule = function(schedule){
		if(user && schedule){	
			$scope.schedule = schedule;
			$scope.edit = true;
		}else{
			goHome();
		};
	};

	$scope.saveSchedule = function(){
		if(user &&  $scope.schedule &&  $scope.schedule.id){	
			ScheduleService.update({ id :  $scope.schedule.id}, $scope.schedule, function(success){
				addNotification($scope.schedule.name +' Schedule updated ');
				$scope.schedule = {};
				loadSchedules();
				loadScheduleControl();
				$scope.edit = false;
			}, function(error){
				addNotification(error.data.message);
			});
		}else{
			goHome();
		};
	};


	$scope.goBack = function(){
		if(user && role){
			$location.url('/inbox/'+role);
		}else{
			goHome();
		};
	};

	function loadSchedules(){
		ScheduleAllService.query({},function(response){
			$scope.schedules = response;
		},function(error){
			addNotification(error.data.message);
		});
	};
	
	function loadScheduleControl(){
		ScheduleControlService.query({},function(response){
			$scope.scheduleControl = response;
		},function(error){
			addNotification(error.data.message);
		});
	};



});