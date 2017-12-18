'use strict';

angular.module('TechathonApp').controller('EventRegistrationController', function($scope,  $rootScope, $location, $filter, ngTableParams, APP_CONSTANTS,
		TeamByRegistrationUserService, TeamAttendanceService, UserAttendanceService, LocationService ){
	var user = $rootScope.user;
	var role = $rootScope.role;

	$scope.searchUser = undefined;
	$scope.deskLocation = undefined;
	$scope.locations = [];
	$scope.team = {};
	$scope.attendanceUser = {};
	$scope.showTeam = false;
	$scope.showUser = false;
	$scope.info = undefined;
	$scope.error = undefined;

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
		//console.log('Go Home !');
		$rootScope.user = {};
		$location.url(APP_CONSTANTS.NAV_HOME);
	};



	$scope.init = function(){
		if(user && role){	
			loadLocation();
		}else{
			goHome();
		};
	};


	$scope.searchTeamByUser = function(){
		if(user && role){	
			if($scope.searchUser){	
				$scope.info = undefined;
				$scope.error = undefined;
				TeamByRegistrationUserService.get({id : $scope.searchUser }, function(success){
					if(success){
						if(success.team){
							$scope.team = success.team;	
							$scope.showTeam = true;
							$scope.showUser = false;
						}else if(success.user){
							$scope.attendanceUser = success.user;
							$scope.showTeam = false;
							$scope.showUser = true;
						}else{
							$scope.error = 'No View to display';
							$scope.showTeam = false;
							$scope.showUser = false;
						}
					}
				}, function(error){
					addNotification(error.data.message);
					$scope.error = error.data.message;
					$scope.showTeam = false;
					$scope.showUser = false;
				});	

			}else{
				addNotification('Please enter team user intranet id.');
			}

		}else{
			goHome();
		};
	};

	$scope.updateTeamAttendance = function(){
		if(user && role && $scope.team && $scope.team.members && $scope.deskLocation ){	
			$scope.info = undefined;
			$scope.error = undefined;
			TeamAttendanceService.update({ by : user.id, location : $scope.deskLocation}, $scope.team , function(success){
				//addNotification('Team attendance updated successfully !');
				$scope.info = $scope.team.name + ' Team attendance updated successfully !';
				$scope.searchUser = undefined;
				$scope.showTeam = false;
				$scope.showUser = false;
			}, function(error){					
				//addNotification(error.data.message);
				$scope.error = error.data.message;
			});
		}else{
			goHome();
		};
	};
	
	$scope.updateUserAttendance = function(){
		if(user && role && $scope.attendanceUser  ){	
			$scope.info = undefined;
			$scope.error = undefined;
			UserAttendanceService.update({ by : user.id, location : $scope.deskLocation}, $scope.attendanceUser , function(success){
				$scope.info = $scope.attendanceUser.name + ' User attendance updated successfully !';
				$scope.searchUser = undefined;
				$scope.showTeam = false;
				$scope.showUser = false;
			}, function(error){					
				//addNotification(error.data.message);
				$scope.error = error.data.message;
			});
		}else{
			goHome();
		};
	};

	function loadLocation(){
		LocationService.query({},function(response){
			$scope.locations = response;
		},function(error){
			addNotification(error.data.message);
		});
	};
});