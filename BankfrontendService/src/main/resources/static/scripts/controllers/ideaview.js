'use strict';

angular.module('TechathonApp').controller('IdeaViewController', function($scope, $rootScope, $location, $http, APP_CONSTANTS, ThemeService, 
		TeamService, TeamHistoryByTeamService,
		TeamMembersAllService, TeamMemberRemoveService, TeamMemberSelfRemoveService, TeamRequestCreateService, TeamRequestService, 
		TeamMemberLeadService, UserSearchService, TeamIdeaService, TeamIdeaPriorityService, LocationService ) {	
	var user = $rootScope.user;
	var teamId = $rootScope.teamId;
	$scope.team = {};
	$scope.themes = [];
	$scope.subThemes = [];
	$scope.userTeamRole = {};
	$scope.teamAdmin = false;	
	$scope.teamIdeas = [];	
	
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
		$rootScope.user = {};
		addNotification('Your session expired !');
		$location.url(APP_CONSTANTS.NAV_HOME);
	};

	$rootScope.selectedMentore = function(person){
		console.log('Selected Mentor' + person);
	}
	
	$scope.init = function(){
		if(user && teamId){	
			$rootScope.teamEnable = true;
			$rootScope.skillsetEnable = true;
			$rootScope.ideaEnable = true;			
			if(teamId){
				//getIdea Information
				getTeamIdeas(teamId);
			}
		}else{
			goHome();
		};

	};


	$scope.lanchIdea = function(ideaId){
		if(user && ideaId){
			if($scope.teamAdmin){
				$rootScope.viewType = APP_CONSTANTS.TEAM_ROLE_LEAD;
			}else{
				$rootScope.viewType = APP_CONSTANTS.TEAM_ROLE_MEMBER;
			}
			$rootScope.ideaId = ideaId;
			$location.url('/idea');
		}else{
			goHome();
		}
	};


	$scope.updateIdeaPriority = function(){
		if(user ){
			if($scope.team && $scope.team.ideas){			
				TeamIdeaPriorityService.update({id : $scope.team.id, userId : userId }, function(success){
					console.log('Idea update Successfully !');
				}, function(error){
					console.log('Idea update Failed !');
				});
			};
		}
		else{
			goHome();
		}
	};

	

	function getTeamIdeas(teamId){
		if(teamId){
			TeamIdeaService.query({id: teamId }, function(success){
				if(success){
					$scope.teamIdeas = success;
					console.log('Get Team Ideas');
				}
			}, function(error){
				addNotification(error.data.message);
			});
		}

	};


});