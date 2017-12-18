angular.module('TechathonApp').controller('SkillSetRequestController', function($scope,  $rootScope, $location, $http, APP_CONSTANTS,  
		SkillsetRequestCreateService, SkillsetRequestService, SkillsetRequestQueryService,  LocationService ) {	
	var user = $rootScope.user;
	var teamId = $rootScope.teamId;
	$scope.skillsetEnabled = false;
	$scope.skillsetStausEnabled = false;
	$scope.skillsetRequest = {};
	$scope.skillsetRequests = [];
	$scope.locations = [];
	$scope.skillsetRequestStatusList = [APP_CONSTANTS.SKILLSET_STATUS_POST, APP_CONSTANTS.SKILLSET_STATUS_RECEIVED_DROP, APP_CONSTANTS.SKILLSET_STATUS_DONOT_NEED_DROP];


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
		console.log('Launched Skillset Management');
		if(user && teamId){	
			if(teamId){
				loadLocation();
				loadSkillSetRequest();
			}

		}else{
			goHome();
		};

	};

	$scope.goBack = function(){
		if(user){
			$location.url('/team');
		}else{
			goHome();
		};
	};

	$scope.createSkillSetRequest = function(){
		if(user && teamId){	
			$scope.skillsetRequest.teamId = teamId;
			$scope.skillsetRequest.status = APP_CONSTANTS.SKILLSET_STATUS_POST;
			var createdBy = {};
			createdBy.id = user.id;
			createdBy.name = user.name;
			createdBy.email = user.email;
			$scope.skillsetRequest.createdBy = createdBy;
			if(validateSkillset($scope.skillsetRequest, $scope.skillsetRequests)){
				//Create SkillSet Request
				SkillsetRequestCreateService.create({}, $scope.skillsetRequest, function(success){
					addNotification('SkillSet request created...');
					$scope.skillsetRequest = {};
					loadSkillSetRequest();
				}, function(error){
					addNotification(error.data.message);				
				});
			}
		}else{
			goHome();
		};
	};


	$scope.deleteSkillsetRequest = function(requestId, index){
		if(user && teamId){	
			$scope.skillsetRequest.teamId = teamId;
			//Delete SkillSet Request
			SkillsetRequestService.remove({ id : requestId}, function(success){
				addNotification('SkillSet Request removed ..');
				$scope.skillsetRequests.splice(index, 1);
			}, function(error){
				addNotification(error.data.message);
			});
		}else{
			goHome();
		};
	};

	$scope.editSkillSet = function(skillsetRequest){
		if(user && teamId){	
			$scope.skillsetRequest = skillsetRequest;
			$scope.skillsetStausEnabled = true;
		}else{
			goHome();
		};
	};

	$scope.saveSkillSet = function(){
		if(user && teamId){	
			$scope.skillsetRequest.teamId = teamId;
			SkillsetRequestService.update({ id : $scope.skillsetRequest.id}, $scope.skillsetRequest, function(success){
				addNotification('SkillSet updated with '+ $scope.skillsetRequest.status +' status');
				$scope.skillsetStausEnabled = false;
				$scope.skillsetRequest = {};
				loadSkillSetRequest();
			}, function(error){
				addNotification(error.data.message);
			});
		}else{
			goHome();
		};
	};


	function validateSkillset(skillsetRequest, skillsetRequests){
		var valid = true;
		if(skillsetRequests && APP_CONSTANTS.SKILLSET_REQUEST_COUNT  <= skillsetRequests.length){
			valid = false;
			addNotification('Maximum Skillset request should be 5');
		}

		if(skillsetRequest){
			if(!skillsetRequest.skillsetRequired){
				valid = false;
				addNotification('Skillset required is missing');
			}

			if(!skillsetRequest.location){
				valid = false;
				addNotification('Skillset required location is missing');
			}

			if(!skillsetRequest.ideaSummary){
				valid = false;
				addNotification('Idea summary is missing');
			}

		}else{
			addNotification('Skillset Request is missing');
			valid = false;
		}
		return valid;
	}

	function loadSkillSetRequest(){
		SkillsetRequestQueryService.query({ type : 'team', id : $scope.teamId},function(response){
			$scope.skillsetRequests = response;
		},function(error){
			addNotification(error.data.message);
		});
	};

	function loadLocation(){
		LocationService.query({},function(response){
			$scope.locations = response;
		},function(error){
			addNotification(error.data.message);
		});
	};

});