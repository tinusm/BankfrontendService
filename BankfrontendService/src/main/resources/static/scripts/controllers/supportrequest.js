angular.module('TechathonApp').controller('SupportRequestController', function($scope,  $rootScope, $location, $http, 
		SupportRequestCreateService, SupportRequestService, SupportRequestQueryService,  LocationService ) {	
	var user = $rootScope.user;
	var teamId = $rootScope.teamId;
	$scope.supportRequest = {};
	$scope.supportRequests = [];
	$scope.locations = [];


	$scope.notifications = {};	
	$scope.invalidNotification = false;
	var index = 0;	
	function addNotification(notification){
		var i;
		if(!notification){
			$scope.invalidNotification = true;
			return;
		}

		i = index++;
		$scope.invalidNotification = false;
		$scope.notifications[i] = notification;
	};


	$scope.init = function(){	
		console.log('Launched Skillset Management');
		if(user && teamId){	
			if(teamId){
				loadLocation();
				loadSupportRequest();
			}

		}else{
			console.log('Redirect to Home Page');
			$location.url('/home');
		};

	};

	$scope.createSupportRequest = function(){
		if(user && teamId){	
			 $scope.supportRequest.teamId = teamId;
			//Create SkillSet Request
			SupportRequestCreateService.create({}, $scope.supportRequest, function(success){
				addNotification('SkillSet request created...');
				loadSupportRequest();
			}, function(error){
				addNotification(error.data.message);				
			});
		}else{
			console.log('Redirect to Home Page');
			$location.url('/home');
		};
	};
	

	$scope.deleteSupportRequest = function(requestId, index){
		if(user && teamId){	
			 $scope.supportRequest.teamId = teamId;
			//Create SkillSet Request
			 SupportRequestService.remove({ id : requestId}, function(success){
				addNotification('SkillSet Request removed ..');
				$scope.supportRequests.splice(index, 1);
			}, function(error){
				addNotification(error.data.message);
			});
		}else{
			console.log('Redirect to Home Page');
			$location.url('/home');
		};
	};
	
	$scope.goBack = function(){
		$location.url('/team');
	};


	function loadSupportRequest(){
		SupportRequestQueryService.query({ type : 'team', id : $scope.teamId},function(response){
			$scope.supportRequests = response;
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