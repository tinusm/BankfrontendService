'use strict';

angular.module('TechathonApp').controller('TeamController', function($scope, $rootScope, $location, $http, APP_CONSTANTS, ThemeService, 
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
	$scope.teamMembers = [];
	$scope.teamIdeas = [];
	$scope.teamHistories = [];
	$scope.isCollapsed  = true;

	// For Team Action
	$scope.showEditTeamName = false;
	$scope.showEditTeamLocation = false;
	$scope.showAddTeamMember = true;
	$scope.showCreateRequest = false;
	$scope.changeTeamMemberEnable = false;
	$scope.addIdeaEnable = false;
	$scope.buttonDissabled = false;
	$scope.attendanceEnable = false;
	$scope.ideaPreferenceEnable = false;

	$scope.locations = [];
	$scope.newTeamName = undefined;
	$scope.newTeamlocation = undefined;
	$scope.prefferedIdea = undefined;

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

	$scope.init = function(){
		if(user && teamId){	
			$rootScope.teamEnable = true;
			$rootScope.skillsetEnable = true;
			$rootScope.ideaEnable = true;

			if(teamId){
				var today = new Date();
				console.log( 'changeTeamMember:' + $rootScope.control.changeTeamMember + ' addIdea :' + $rootScope.control.addIdea);
				if( $rootScope.control.changeTeamMember){
					$scope.changeTeamMemberEnable = true;
				}

				if( $rootScope.control.addIdea){
					$scope.addIdeaEnable = true;
				}

				TeamService.get({id : teamId }, function(success){
					//Assign the Team
					$scope.team = success;
					
					$scope.userTeamRole = getUserTeamRole($scope.team.members, user.id);
					console.log("Role "+$scope.userTeamRole);
					if(APP_CONSTANTS.TEAM_ROLE_LEAD === $scope.userTeamRole){
						$scope.teamAdmin = true; 
					};
					// Get the team Members
					TeamMembersAllService.query({id: $scope.team.id }, function(success){
						console.log('Success Team Members');
						if(success){
							$scope.teamMembers = success;
						}
					}, function(error){
						addNotification(error.data.message);
					});

					//getIdea Information
					getTeamIdeas(teamId);

					//Get Themes
					loadThemes();

					populateSubTheme();

					//Get Locations
					loadLocation();

					//Refresh Histories
					getHistories(teamId);

					//Assign for Team Edit
					prepareTeamEdit();

				}, function(error){
					addNotification(error.data.message);
				});
			}


		}else{
			goHome();
		};

	};

	$scope.refresh = function(){
		$scope.init();
	};

	$scope.themeSelected = function(theme){
		for (var i = 0; i < $scope.themes.length; i++) {
			if( $scope.themes[i] && $scope.themes[i].id == $scope.team.sector){					
				$scope.subThemes = $scope.themes[i].subThemes;
			}
		}	
	};


	$scope.updateTeam = function(){
		if(user && teamId ){
			if( $scope.newTeamName &&  $scope.newTeamlocation){
				var newTeam = $scope.team;
				newTeam.name = $scope.newTeamName;
				newTeam.location =  $scope.newTeamlocation;
				TeamService.update({id : teamId }, newTeam , function(success){
					addNotification('Team updated successfully !');
					//Assign for Team Edit
					$scope.newTeamName = $scope.newTeamName.toUpperCase();
					$scope.team.name = $scope.newTeamName;
					$scope.team.location = $scope.newTeamlocation;
					$scope.isCollapsed = true;
				}, function(error){					
					addNotification(error.data.message);
				});	
			}else{
				addNotification('Team update information missing !');
			};
		}else{
			goHome();
		};
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


	$scope.requestTeamMember = function(newTeamRequest){
		if(user && $scope.team && newTeamRequest){
			if( checkNewMemberRequest($scope.teamMembers, newTeamRequest)){
				var teamRequest = {
						team :{ id : $scope.team.id},
						requestTo: { email : newTeamRequest },
						requestFrom: { id : user.id},
						status : APP_CONSTANTS.TEAMREQUEST_STATUS_ACCEPTANCE_PENDING
				};

				$scope.buttonDissabled = true;
				TeamRequestCreateService.create({}, teamRequest, function(success){
					addNotification (' Invitation sent to '+ newTeamRequest);
					// Refresh Team Member
					refreshTeamMember($scope.team, user);
					//Refresh Histories
					getHistories(teamId);
					$scope.buttonDissabled = false;
				}, function(error){
					addNotification(error.data.message);
					$scope.buttonDissabled = false;
				});
			}else{

				addNotification(newTeamRequest + ' member request is not valid one !');
			}
			$scope.newTeamRequest = undefined;
		}else{
			goHome();
		};
	};

	$scope.removeTeamMember = function(member){
		if(user && $scope.team && member){	
			if(APP_CONSTANTS.TEAM_ROLE_LEAD !== member.role){
				if( 'Accepted' !== member.status){
					$scope.buttonDissabled = true;
					TeamRequestService.remove({id : member.requestId}, function(success){
						addNotification(member.user.name +' team member request removed !');
						// Refresh Team Member
						refreshTeamMember($scope.team, user);

						//Refresh Histories
						getHistories(teamId);
						$scope.buttonDissabled = false;
					}, function(error){
						addNotification(error.data.message);
						$scope.buttonDissabled = false;
					});					

				}else{	
					$scope.buttonDissabled = true;
					TeamMemberRemoveService.remove({ id : $scope.team.id, memberId : member.id }, function(success){
						addNotification(member.user.name + ' team member removed !');
						// Refresh Team Member
						refreshTeamMember($scope.team, user);

						//Refresh Histories
						getHistories(teamId);
						$scope.buttonDissabled = false;
					}, function(error){
						addNotification(error.data.message);
						$scope.buttonDissabled = false;
					});
				}
			}else{
				console.log('Cannot remove member with Role LEAD !');
			}
		}else{
			goHome();
		};
	};

	$scope.saveTeamName = function(){
		if(user && $scope.team && $scope.team.name && $scope.newTeamName){
			if($scope.team.name == $scope.newTeamName){
				addNotification('You have selected same team name');
			};

			if($scope.newTeamName.length > 100){
				addNotification( $scope.team.name + ' team name size should not be greater than 100');
			};

			$scope.team.name = $scope.newTeamName;

			TeamService.update({id : $scope.team.id }, $scope.team ,function(success){
				addNotification('Team name changed !');
			},function(error){
				addNotification(error.data.message);
			});


		}else{
			goHome();
		};
	};

	$scope.dropSelf = function(member){
		if(user && $scope.team && member){	
			if(APP_CONSTANTS.TEAM_ROLE_LEAD !== member.role){	
				$scope.buttonDissabled = true;
				TeamMemberSelfRemoveService.remove({ id : $scope.team.id, memberId : member.id }, function(success){
					addNotification('I am  dropped from the team !');
					$location.url(APP_CONSTANTS.NAV_REG2);
					$scope.buttonDissabled = false;
				}, function(error){
					addNotification(error.data.message);
					$scope.buttonDissabled = false;
				});
			}else{
				console.log('Cannot remove member with LEAD role !');
			}
		}else{
			goHome();
		};
	};

	$scope.dropTeam = function(){
		if(user && $scope.team){
			TeamService.remove({id : $scope.team.id}, function(success){
				addNotification('Team dropped from the event !');
				goHome();
			}, function(error){
				addNotification(error.data.message);
			});			
		}else{
			goHome();
		};
	};

	$scope.changeMemberRole = function(userId){
		if(user && $scope.team && userId){
			TeamMemberLeadService.update({id : $scope.team.id, userId : userId }, function(success){
				addNotification('Member role changed !');
				// Refresh Team Member	
				TeamMembersAllService.query({id: $scope.team.id }, function(success){
					if(success){
						$scope.teamMembers = success;
						// Check who is Lead and Change the Current user State
						$scope.userTeamRole = getUserTeamRole($scope.teamMembers, user.id);
						console.log('User Role '+ $scope.userTeamRole);
						if(APP_CONSTANTS.TEAM_ROLE_LEAD === $scope.userTeamRole){
							$scope.teamAdmin = true; 
						}else{
							$scope.teamAdmin = false; 
						}


					}
				}, function(error){
					addNotification(error.data.message);
				});

				//Refresh Histories
				getHistories(teamId);

			}, function(error){
				addNotification(error.data.message);
			});

		}else{
			goHome();
		};



	};

	$scope.acceptTeamJoining = function(teamRequestId){
		if(user){
			console.log('Called acceptTeamJoining...');
			if(teamRequestId){				
				TeamRequestProcessService.get({action : 'accept', id : teamRequestId.id},{}, function(success){	
					if(success){					
						if(success.id){
							console.log(success.name + 'Team assigned for you !');
							// Refresh Team Member
							refreshTeamMember($scope.team, user);
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

	$scope.createIdea = function(){
		if(user){
			if($scope.teamIdeas && $scope.teamIdeas.length >= APP_CONSTANTS.IDEA_MAX_COUNT){
				addNotification('You have crossed the Idea limit of '+APP_CONSTANTS.IDEA_MAX_COUNT+'.');
			}else{
				if($scope.teamAdmin){
					$rootScope.viewType = APP_CONSTANTS.TEAM_ROLE_LEAD;
				}else{
					$rootScope.viewType = APP_CONSTANTS.TEAM_ROLE_MEMBER;
				}
				$rootScope.team = $scope.team;
				$rootScope.ideaId = undefined;
				$location.url('/idea');
			};			

		}else{
			goHome();
		}	
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

	$scope.updateEventAttendance = function(){
		if(user ){			
			if($scope.team && $scope.teamIdeas && $scope.team.prefferedIdea){
				//$scope.team.prefferedIdea =  $scope.prefferedIdea;
				TeamService.update({id : $scope.team.id }, $scope.team ,function(success){
					$scope.init();
					addNotification('Team idea prefference & attendance information updated !');
				},function(error){
					addNotification(error.data.message);
				});
			};
		}
		else{
			goHome();
		}
	};




	$scope.createSkillSetRequest = function(){
		if(user ){
			if($scope.skillsetRequest){
				$scope.skillsetRequest.teamId = $rootScope.teamId;
				//Create SkillSet Request
				SkillsetRequestCreateService.create({}, $scope.skillsetRequest, function(success){
					addNotification('SkillSet Request Created...');
				}, function(error){
					addNotification(error.data.message);
				});
			}
		}
		else{
			goHome();
		}
	};


	function loadThemes(){
		// Get the Themes
		ThemeService.query({},function(success){
			$scope.themes = success;
			populateSubTheme();
		},function(error){
			addNotification(error.data.message);
		});
	}

	function populateSubTheme(){
		if($scope.themes && $scope.team.sector){							
			for (var i = 0; i < $scope.themes.length; i++) {
				if( $scope.themes[i] && $scope.themes[i].id == $scope.team.sector){					
					$scope.subThemes = $scope.themes[i].subThemes;
				}
			}
		}
	};



	function convertUser(userStr){
		var user = {};
		if(userStr){
			var userInfo = userStr.split('-');
			if(userInfo){
				//console.log('Split Result '+ userInfo[0] + userInfo[1] +userInfo[2]);
				user = {
						id : userInfo[0],
						name : userInfo[1],
						email : userInfo[2]
				};
			}
		}
		return user;
	};

	function checkNewMemberRequest(members, email){
		var newMember = true;
		if(members && email){
			console.log('Current member length '+ members.length );
			if( members.length >= APP_CONSTANTS.TEAM_MEMBER_MAX_COUNT){
				addNotification('You have already '+ APP_CONSTANTS.TEAM_MEMBER_MAX_COUNT +' members for your team !');
				newMember = false;
			}

			for (var i = 0; i < members.length; i++) {
				if(members[i].user && members[i].user.email &&  members[i].user.email == email){
					newMember = false;
				};
			};
		};
		return newMember;
	};

	function getUserTeamRole(members, userId){
		if(members != null && userId){
			for (var i = 0; i < members.length; i++) {
				if(members[i].user && members[i].user.id && members[i].role ){
					console.log('Checking for '+  members[i].user.name + members[i].role);
					if(members[i].user.id == userId)
						return members[i].role;
				};			
			};
		};
		return APP_CONSTANTS.TEAM_ROLE_MEMBER;
	};

	function refreshTeamMember(team){
		TeamMembersAllService.query({id: team.id }, function(success){
			if(success){
				$scope.teamMembers = success;
			}
		}, function(error){
			console.log('Failed in getting  Team Members');
		});
	};

	function refreshTeam(teamId, user){
		if(teamId && user){
			TeamService.get({id : teamId }, function(success){
				$scope.team = success;
				$scope.userTeamRole = getUserTeamRole($scope.team.members, user.id);
				if(APP_CONSTANTS.TEAM_ROLE_LEAD === $scope.userTeamRole){
					$scope.teamAdmin = true; 
				};				
			}, function(error){
				console.log('Failed in getting team Information');
			});
		}
	};

	function getTeamIdeas(teamId){
		if(teamId){
			TeamIdeaService.query({id: teamId }, function(success){
				if(success){
					$scope.teamIdeas = success;
					console.log('Get Team Ideas');
					checkIdeaSelected();
				}
			}, function(error){
				addNotification(error.data.message);
			});
		}

	};

	/*
	function getHistories(teamId){
		if(teamId != null){
			TeamHistoryByTeamService.query({id: teamId},function(success){
				$scope.teamHistories = success;
			},function(error){
				addNotification(error.data.message);
			});
		}
	};

	function getHistories(teamId){
		if(teamId != null){
			$scope.tableParams = new ngTableParams({
				page: 1,            // show first page
				count: 10,           // count per page
			}, {
				getData: function($defer, params) {
					TeamHistoryByTeamService.query({id: teamId},function(success){
						$scope.teamHistories = success;
						params.total(success.length);
						$defer.resolve(success.slice((params.page() - 1) * params.count(), params.page() * params.count()));
					},function(error){
						addNotification(error.data.message);
					});

				}
			});	
		}
	};
	 */

	function getHistories(teamId){
		if(teamId != null){
			TeamHistoryByTeamService.query({id: teamId},function(success){
				$scope.teamHistories = success;

				$scope.totalItems = $scope.teamHistories.length;
				$scope.currentPage = 1;
				$scope.numPerPage = 5;

				$scope.paginate = function(value) {
					var begin, end, index;
					begin = ($scope.currentPage - 1) * $scope.numPerPage;
					end = begin + $scope.numPerPage;
					index = $scope.teamHistories.indexOf(value);
					return (begin <= index && index < end);
				};

			},function(error){
				addNotification(error.data.message);
			});
		}
	};

	function loadLocation(){
		LocationService.query({},function(response){
			$scope.locations = response;
		},function(error){
			addNotification(error.data.message);
		});
	};

	function prepareTeamEdit(){
		$scope.newTeamName = $scope.team.name;
		$scope.newTeamlocation = $scope.team.location;
	};

	function checkIdeaSelected(){
		$scope.attendanceEnable = false;	
		$scope.ideaPreferenceEnable = false;
		if($scope.teamAdmin && $scope.teamIdeas != null && $scope.teamIdeas.length > 0){
			for (var i = 0; i < $scope.teamIdeas.length; i++) {
				//console.log( " Idea Status "+$scope.teamIdeas[i].status);
				if($scope.teamIdeas[i].status && ( $scope.teamIdeas[i].status ==  APP_CONSTANTS.IDEA_STATUS_SELECTED 
						|| $scope.teamIdeas[i].status ==  APP_CONSTANTS.IDEA_STATUS_P2_DRAFT)){
					$scope.attendanceEnable = true;
					//console.log( " Idea Status set True"+$scope.teamIdeas[i].status);
				};			
			};
		};

		if($scope.attendanceEnable && !$scope.team.prefferedIdea){
			$scope.ideaPreferenceEnable = true;
		}

	}



});