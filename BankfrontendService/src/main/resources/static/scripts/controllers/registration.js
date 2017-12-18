'use strict';

angular.module('TechathonApp').controller('RegistrationController', function($scope,  $rootScope, $location,$http,  APP_CONSTANTS, APP_DATA,
		UserAcceptService, UserSearchService, TeamRequestProcessService, 
		TeamCreateService, TeamService,TeamByUserService, LocationService, ThemeService, SkillsetRequestCreateService ) {
	var user = $rootScope.user;		
	$scope.locations = [];
	$scope.themes = [];
	$scope.subThemes = []; 
	$scope.teamRequests = {};
	$scope.teamRequestEnable = false;
	$scope.teamCreationEnable = false;
	$scope.teamCreationDissableMessage = false;
	$scope.selectedLocation = {};
	$scope.selectedTeamName = undefined;
	$scope.errors = [];
	$scope.team ={};
	$scope.skillsetEnabled = false;
	$scope.skillsetRequest = {};
	
	$scope.createTeamEnable = false;
	$scope.waitForRequest= false;

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
		if(user){
			$rootScope.teamEnable = false;
			$rootScope.skillsetEnable = false;
			$rootScope.ideaEnable = false;
			
			if($rootScope.invitationCount){
				$scope.createTeamEnable = true;
				$scope.waitForRequest= false;
			}else{
				$scope.createTeamEnable = true;
				$scope.waitForRequest= true;
			}
			
			console.log('Registration Launched');
		}else{
			goHome();
		}

	};	

	$scope.navigateStep2 = function(){
		if(user){			
			//Update User Accept
			UserAcceptService.update(user, function(success){
				addNotification(user.name + ' User Registration Accepted !');
				$location.url('/registrationsteptwo');
			}, function(error){
				addNotification(error.data.message);
			});				
		}else{
			goHome();
		}
	};

	$scope.initStep2 = function(){
		if(user){	
			$rootScope.teamEnable = false;
			$rootScope.skillsetEnable = false;
			$rootScope.ideaEnable = false;
			
			loadThemes();
			LocationService.query({},function(response){
				$scope.locations = response;
			},function(error){
				addNotification(error.data.message);
			});

			processRegistration(user);
		}else{
			goHome();
		}
	};

	$scope.goReg1 = function(){
		if(user){
			$location.url('/registrationstepone');
		}else{
			goHome();
		};
	};

	$scope.goBack = function(){
		goHome();
	};

	$scope.waitTeamRequest = function(){
		addNotification('Thanks '+user.name + ' for joining !. Please wait for team joining invitation(s).');
		goHome();
	};

	$scope.getMembers = function(val) {
		return UserSearchService.query({filter : val}).$promise.then(
				function(response){
					var members = [];
					angular.forEach(response, function(item){
						members.push(item.id+'-'+item.name + "-" + item.email);
					});
					return members;
				});
	};

	$scope.acceptTeamJoining = function(teamRequest){
		if(user){
			console.log('Called acceptTeamJoining...');
			if(teamRequest){				
				TeamRequestProcessService.get({action : 'accept', id : teamRequest.id},{}, function(success){	
					if(success){					
						if(success.id){
							addNotification(success.name + " team joining request accepted !");
							$rootScope.teamId = success.id;
							$location.url('/team');
						}else{
							console.log('Failed to get team information');
						}
					}
				}, function(error){
					addNotification(error.data.message);
				});

			}else{
				console.log('Team Joining information is Missing !');
			}
		}else{
			goHome();
		}		
	};


	$scope.declineTeamJoining = function(teamRequest, index){
		if(user){
			console.log('Called acceptTeamJoining...');
			if(teamRequest){				
				TeamRequestProcessService.get({action : 'decline', id : teamRequest.id},{}, function(success){	
					addNotification(teamRequest.team.name +' team joining request declined !');
					if($scope.teamRequests){
						$scope.teamRequests.splice(index, 1);
						if($scope.teamRequests.length){
							console.log("More Requests are there..");
						}else{
							$scope.teamRequestEnable = false;
							$scope.teamCreationEnable = true;
						}
					}

				}, function(error){
					addNotification(error.data.message);
				});

			}else{
				console.log('Team Joining information is Missing !');
			}
		}else{
			goHome();
		}		
	};

	
	function loadThemes(){
		// Get the Themes
		ThemeService.query({},function(success){
			$scope.themes = success;	
		},function(error){
			addNotification(error.data.message);
		});
	}
	
	$scope.themeSelected = function(theme){
		for (var i = 0; i < $scope.themes.length; i++) {
			if( $scope.themes[i] && $scope.themes[i].id == $scope.team.sector){					
				$scope.subThemes = $scope.themes[i].subThemes;
			}
		}	
	};


	$scope.createTeam = function(){
		if(user){
			console.log('Called Team Creation...');
			$scope.team.creator = { id : user.id, email : user.email};
			$scope.team.members = [];

			if(validateTeam() && validateSkillset($scope.skillsetRequest)){
				var member1Valid = true;
				var member2Valid = true;
				var bothMemberValid = true;

				if($scope.member1){
					var info = convertUser($scope.member1);
					if(info && info.id){
						$scope.team.members[0] = { user : info };
						if(info.id == $rootScope.user.id){
							member1Valid = false;
						};
					}
				};
				if($scope.member2){
					var info = convertUser($scope.member2);
					if(info && info.id){
						$scope.team.members[1] = { user : info };
						if(info.id == $rootScope.user.id){
							member2Valid = false;
						};
					}
				};

				if($scope.team.members.length == 2){
					bothMemberValid = validateBoth($scope.team.members[0].user,$scope.team.members[1].user);
				};


				if( member1Valid && member2Valid && bothMemberValid){
					TeamCreateService.create({}, $scope.team, function(success){
						if(success && success.id){
							$rootScope.teamId = success.id;
							addNotification(success.name + " Team created !" );
							if($scope.skillsetEnabled && $scope.skillsetRequest){
								$scope.skillsetRequest.teamId = $rootScope.teamId;
								var createdBy = {};
								createdBy.id = user.id;
								createdBy.name = user.name;
								createdBy.email = user.email;
								$scope.skillsetRequest.createdBy = createdBy;
								//Create SkillSet Request
								SkillsetRequestCreateService.create({}, $scope.skillsetRequest, function(success){
									addNotification($scope.skillsetRequest.skillsetRequired +' SkillSet request created for the team');
								}, function(error){
									addNotification(error.data.message);
								});
							}
							$location.url('/team');
						};
					}, function(error){
						addNotification(error.data.message);
					});

				}else{
					addNotification('Member Validation failed !');
				}
			}
		}else{
			goHome();
		}		
	};


	function validateSkillset(skillsetRequest){
		var valid = true;		
		if($scope.skillsetEnabled){
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

		}
		return valid;
	}

	function validateTeam(){
		var valid = true;
		if(!$scope.team){
			addNotification('Team Information is missing');
			valid = false;
		}else{
			if(!$scope.team.name){
				addNotification('Team Name is missing');
				valid = false;
			}
			if(!$scope.team.location){
				addNotification('Team location is missing');
				valid = false;
			}
		}
		return valid;
	};


	function getUserTeam(user){
		if(user && user.id){
			TeamByUserService.get({id : user.id}, function(success){
				if(success){					
					if(success.id){
						addNotification(success.name + " Team assigned for you !");
						$rootScope.team = success;
						$location.url('/team');
					}else{
						console.log('Processing Registration Process');
					}
				}
			}, function(error){
				addNotification(error.data.message);
			});
		}
	};

	function processRegistration(user){
		// To get teamRequests
		TeamRequestProcessService.query({action : 'user', id : user.id},{}, function(success){
			$scope.teamRequests = success;

			if($scope.teamRequests && $scope.teamRequests.length){
				$scope.teamRequestEnable = true; 
			}else{	
				$scope.teamCreationEnable = true;
			}			
			
			if( $rootScope.control.teamCreation){
				$scope.teamCreationDissableMessage = false;
			}else{
				$scope.teamCreationEnable = false;
				$scope.teamCreationDissableMessage = true;
			}

		}, function(error){
			addNotification(error.data.message);
		});
	};

	function convertUser(userStr){
		var user = {};
		if(userStr){
			var userInfo = userStr.split('-');
			if(userInfo && userInfo.length == 3){
				//console.log('Split Result '+ userInfo[0] + userInfo[1] +userInfo[2]);
				user = {
						id : userInfo[0],
						name : userInfo[1],
						email : userInfo[2]
				};
			}else{
				addNotification('Failed to get information from ' + userStr);
			}
		}
		return user;
	};


	function validateBoth(member1, member2){
		var valid = true;
		if(member1  && member1.id && member2 && member2.id){
			if(member1.id == member2.id){
				valid = false;
				addNotification('You have selected same member('+ member1.name+') for team request');
			}				
		}
		addNotification('Both Member Validation '+valid+' !');
		return valid;	
	};

});