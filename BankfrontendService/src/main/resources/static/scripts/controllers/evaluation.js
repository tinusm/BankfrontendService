'use strict';

angular.module('TechathonApp').controller('EvaluationController', function($scope,  $rootScope, $location, APP_CONSTANTS, APP_DATA, BLUEMIX_CONSTANTS,
		IdeaService, IdeaUpdateAtEvaluationService, ThemeService, TeamMembersAllService, IdeaEvaluationService, IdeaReviewerWithAssignmentService, 
		EvaluationTaskByTypeNIdea, IdeaEvaluationDeligateService, IdeaEvaluationReAssignService,  
		IdeaSelectedRejectedService, serviceurl ){
	var user = $rootScope.user;
	var role = $rootScope.role;

	var evaluationTask = $rootScope.evaluationTask;
	$scope.idea = {};
	$scope.themes = [];
	$scope.ideaTechnology = undefined;
	$scope.bluemix = BLUEMIX_CONSTANTS;
	$scope.teamMembers = [];
	$scope.pmoEvaluation = {};
	$scope.leadJuryEvaluation = {};

	$scope.ratings = [5,4,3,2,1];
	$scope.reviewerEvaluation = {};
	$scope.reviewers = [];
	$scope.reviewer1 = {};
	$scope.reviewer2 = {};

	$scope.businessOptions = APP_DATA.critera.businessOptions;
	$scope.operationOptions = APP_DATA.critera.operationOptions;
	$scope.itOptions = APP_DATA.critera.itOptions;

	$scope.verificationComments = undefined;

	$scope.showAccountSpoc = false;
	$scope.showAccountReviewer = false;	
	$scope.p2Enable = false;
	$scope.themeEditEnable = false;
	$scope.validationEnable = false;
	$scope.assignmentEnable = false;
	$scope.assessmentEnable = false;
	$scope.finalEnable = false;

	$scope.deleteEnable = false;
	$scope.deligateEnable = false;
	$scope.deligateTasks =[];

	$scope.format = 'yyyy/MM/dd';
	$scope.ideaDocPath = serviceurl +'file/';
	$scope.idealink = serviceurl +'idea/';

	$scope.finalRoleDisplayFilter = function(evaluation){
		return (evaluation.role == APP_CONSTANTS.USER_ROLE_REVIEWER 
				|| evaluation.role == APP_CONSTANTS.USER_ROLE_LEAD_JURY 
				|| evaluation.role == APP_CONSTANTS.USER_ROLE_SYSTEM);
	};

	$scope.industries = ['Cross-Industry','Communication: Energy & Utilities','Communication: Media & Entertainment',
	                     'Communication: Telcommunication','Distribution: Consumer & Packaged Goods','Distribution: Pharma & LifeSciences',
	                     'Distribution: Retail','Distribution: Travel & Transportation','Financial Services: Banking','Financial Services: Financial Market',
	                     'Financial Services: Insurance','Industrial: Aerospace & Defense','Industrial: Automotive','Industrial: Chemicals & Petroleum',
	                     'Industrial: Electronics','Industrial: Industrial Products','Public: Government & Education','Public: Healthcare'];
	
	$scope.industries_b = ['Cross-Industry','Communication: Energy & Utilities','Communication: Media & Entertainment', 'IGA',
	                     'Communication: Telcommunication','Distribution: Consumer & Packaged Goods','Distribution: Pharma & LifeSciences',
	                     'Distribution: Retail','Distribution: Travel & Transportation','Financial Services: Banking','Financial Services: Financial Market',
	                     'Financial Services: Insurance','Industrial: Aerospace & Defense','Industrial: Automotive','Industrial: Chemicals & Petroleum',
	                     'Industrial: Electronics','Industrial: Industrial Products','Public: Government & Education','Public: Healthcare'];


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
			if(evaluationTask && evaluationTask.ideaId){
				loadIdea(evaluationTask.ideaId);
			}else if(role == APP_CONSTANTS.USER_ROLE_PMO || role == APP_CONSTANTS.USER_ROLE_LEAD_JURY  || role == APP_CONSTANTS.USER_ROLE_ADMIN){				
				loadIdea($rootScope.ideaId);
			}else{
				addNotification('Evaluation view type is not defined');
			}
		}else{
			goHome();
		};
	};

	$scope.themeSelected = function(theme){
		if($scope.idea.theme){
			populateEnvironment();
			$scope.idea.subTheme = undefined;
		};		
	};

	$scope.updateIdea = function(){
		if(user && $scope.idea && $scope.idea.id){	
			if(APP_CONSTANTS.USER_ROLE_PMO == role ){
				$scope.idea.updateMessage = 'PMO modified your Idea';	
			}else if(APP_CONSTANTS.USER_ROLE_REVIEWER == role ){
				$scope.idea.updateMessage = 'Reviewer updated your Idea';	
			}else{
				$scope.idea.updateMessage = 'Leady Jury modified your Idea';	
			}
			//Update Idea
			IdeaUpdateAtEvaluationService.update($scope.idea, function(success){
				$scope.idea = success;			
				if($scope.ideaTechnology && $scope.ideaTechnology == $scope.idea.subTheme){					
					addNotification($scope.idea.title +' Idea info updated.');	
				}else{
					addNotification('Idea technology has changed from ' +$scope.ideaTechnology + ' to ' + $scope.idea.subTheme + ', so assigned to Technology Lead Jury.');	
					$scope.goBack();									
				}
			}, function(error){
				addNotification(error.data.message);
			});
		}else{
			goHome();
		};
		$scope.processing = false;
	};


	$scope.deleteIdea = function(idea){
		$scope.processing = true;
		if(user && idea && idea.id){
			// Delete Idea
			IdeaService.remove({id : idea.id}, function(success){
				addNotification( idea.title +' Idea deleted.');
				$scope.goBack();
			}, function(error){
				addNotification(error.data.message);
			});				

		}else{
			goHome();
		};
		$scope.processing = false;
	};

	$scope.goBack = function(){
		$rootScope.evaluationTask = {};
		$rootScope.ideaId = undefined;
		
		if($rootScope.source && $rootScope.source.page && $rootScope.source.page == 'manage'){
			$location.url('/manage');
		}else{
			$location.url('/inbox/'+role);
		}
		
	};

	$scope.processPMOAction = function(evaluationStatus){
		if(user && role && evaluationTask && evaluationTask.ideaId && $scope.pmoEvaluation && evaluationStatus){
			// Pass the PMO Action
			$scope.pmoEvaluation.owner = user.id;
			$scope.pmoEvaluation.name = user.name;
			$scope.pmoEvaluation.email = user.email;
			$scope.pmoEvaluation.status = evaluationStatus;
		
		if(evaluationStatus=='Approve'){
			IdeaEvaluationService.create({action : 'validate', evaluationTaskId : evaluationTask.id}, $scope.pmoEvaluation , function(success){
				addNotification('Validation ' + evaluationStatus +' processed.');
				$scope.goBack();
			}, function(error){
				addNotification(error.data.message);
			});
			
		}else{
			IdeaEvaluationService.create({action : 'prefinal', evaluationTaskId : evaluationTask.id}, $scope.pmoEvaluation , function(success){
				addNotification('Validation ' + evaluationStatus +' processed.');
				$scope.goBack();
			}, function(error){
				addNotification(error.data.message);
			});
		}

		}
		else{
			goHome();
		};
	};

	$scope.makePreFinal = function(){
		if(user && role && evaluationTask && evaluationTask.ideaId ){
			$scope.leadJuryEvaluation.owner = user.id;
			$scope.leadJuryEvaluation.name = user.name;
			$scope.leadJuryEvaluation.email = user.email;
			IdeaEvaluationService.create({action : 'prefinal', evaluationTaskId : evaluationTask.id}, $scope.leadJuryEvaluation , function(success){
				addNotification('Idea moved to Review Completed !');
				$scope.goBack();
			}, function(error){
				addNotification(error.data.message);
			});

		}else{
			goHome();
		};
	};


	$scope.assignReviewer = function(){
		if(user && role && evaluationTask  && evaluationTask.ideaId){
			if(validateReviewer()){
				var assignments = {};

				assignments.evaluation = {};	
				assignments.evaluation.taskId = evaluationTask.id;
				assignments.evaluation.owner = user.id;
				assignments.evaluation.name = user.name;
				assignments.evaluation.email = user.email;
				assignments.evaluation.comments = $scope.leadJuryEvaluation.comments;

				assignments.evaluators = [];
				assignments.evaluators.push($scope.reviewer1);
				// Relaxed for Mandatory One Reviewer
				if($scope.reviewer2 && $scope.reviewer2.id){
					assignments.evaluators.push($scope.reviewer2);
				}


				IdeaEvaluationService.create({action : 'assignreviewer', evaluationTaskId : evaluationTask.id}, assignments , function(success){
					addNotification('Reviewer assigned to the Idea.');
					$scope.goBack();
				}, function(error){
					addNotification(error.data.message);
				});
			}			
		}else{
			goHome();
		};

	};


	$scope.processReviewerEvaluation = function(){
		if(user && role && evaluationTask  &&  evaluationTask.id && evaluationTask.ideaId && $scope.reviewerEvaluation){
			if(validateReviewerEvaluation()){
				$scope.reviewerEvaluation.owner = user.id;
				$scope.reviewerEvaluation.name = user.name;
				$scope.reviewerEvaluation.email = user.email;
				$scope.reviewerEvaluation.status = APP_CONSTANTS.TASK_STATUS_CLOSED;
				IdeaEvaluationService.create(
						{action : 'processreview',
							evaluationTaskId : evaluationTask.id}, 
							$scope.reviewerEvaluation , 
							function(success){
								addNotification('Reviewer evaluation processed !');
								$scope.goBack();
							}, function(error){
								addNotification(error.data.message);
							});
			};

		}else{
			goHome();
		};
	};

	$scope.processReviewerReworkEvaluation = function(){
		if(user && role && evaluationTask  &&  evaluationTask.id && evaluationTask.ideaId && $scope.reviewerEvaluation){
			if(validateReviewerEvaluation()){
				$scope.reviewerEvaluation.owner = user.id;
				$scope.reviewerEvaluation.name = user.name;
				$scope.reviewerEvaluation.email = user.email;
				$scope.reviewerEvaluation.status = APP_CONSTANTS.TASK_STATUS_REWORK;
				IdeaEvaluationService.create(
						{action : 'processreview',
							evaluationTaskId : evaluationTask.id}, 
							$scope.reviewerEvaluation , 
							function(success){
								addNotification('Reviewer evaluation rework processed !');
								$scope.goBack();
							}, function(error){
								addNotification(error.data.message);
							});
			};

		}else{
			goHome();
		};
	};


	$scope.deligate = function(deligateTask, deligateReviewer){
		if(user){
			if( deligateTask != null && deligateReviewer && deligateReviewer.userId){
				IdeaEvaluationDeligateService.update({ 
					evaluationId : deligateTask.id ,
					userId : deligateReviewer.userId , 
					role : APP_CONSTANTS.USER_ROLE_REVIEWER 
				}, function(success){

					EvaluationTaskByTypeNIdea.query({type : APP_CONSTANTS.TASK_TYPE_ASSESSMENT, ideaId : $scope.idea.id},function(success){
						$scope.deligateTasks = success;
					}, function(error){
						addNotification(error.data.message);
					});

					loadReviewerInfo($scope.idea.subTheme);

					addNotification('Task deligated to '+ deligateReviewer.name);
				}, function(error){
					addNotification(error.data.message);
				});

			}
		}else{
			goHome();
		};

	};
	/*
	$scope.reAssign = function(deligateTask, deligateReviewer){
		if(user){
			if( deligateTask != null && deligateReviewer && deligateReviewer.userId){
				IdeaEvaluationReAssignServiceAlt.update({ 
					evaluationId : deligateTask.id ,
					userId : deligateReviewer.userId , 
					role : APP_CONSTANTS.USER_ROLE_REVIEWER 
				}, function(success){
					$scope.init();
					addNotification('Evaluation Task Reassigned to '+ deligateReviewer.name);
				}, function(error){
					addNotification(error.data.message);
				});

			}
		}else{
			goHome();
		};
	};
	 */
	$scope.reAssign = function(deligateTask, deligateReviewer){
		if(user){
			if( deligateTask != null && deligateReviewer && deligateReviewer.userId){
				IdeaEvaluationReAssignService.update({ 
					ideaId : $rootScope.ideaId,
					fromUserId : deligateTask.assignedTo.id,
					toUserID : deligateReviewer.userId 
				}, function(success){
					$scope.init();
					addNotification('Evaluation Task Reassigned to '+ deligateReviewer.name);
				}, function(error){
					addNotification(error.data.message);
				});

			}
		}else{
			goHome();
		};
	};

	$scope.processSelectedRejected = function(status){
		if(user && role &&  $rootScope.ideaId && status){
			var idea = { id : $rootScope.ideaId, status : status, comments : $scope.verificationComments };

			$scope.leadJuryEvaluation.owner = user.id;
			$scope.leadJuryEvaluation.name = user.name;
			$scope.leadJuryEvaluation.email = user.email;
			IdeaSelectedRejectedService.create({userId : user.id}, idea , function(success){
				addNotification('Idea '+ status +' for the event.');
				$scope.goBack();
			}, function(error){
				addNotification(error.data.message);
			});

		}else{
			goHome();
		};
	};


	$scope.open = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.opened = true;
	};


	function loadIdea(ideaId){
		if(ideaId){
			ThemeService.query({},function(success){
				$scope.themes = success;

				// Get the Idea information			
				IdeaService.get({id: ideaId},function(success){
					$scope.idea = success;
					if($scope.idea){
						// Alter the Display based on Role and Idea Status
						var ideaStatus = $scope.idea.status;
						var ideaSubTheme =  $scope.idea.subTheme;
						$scope.ideaTechnology = $scope.idea.subTheme;
						controlDisplay(role, ideaStatus);
						populateEnvironment();

						// Get the team Members
						TeamMembersAllService.query({id: $scope.idea.teamId }, function(success){
							if(success){
								$scope.teamMembers = success;
							}
						}, function(error){
							addNotification(error.data.message);
						});

						if(APP_CONSTANTS.USER_ROLE_PMO == role){
							$scope.themeEditEnable = true;
							// Load the PMO Evaluation
							loadPMOEvaluation($scope.idea.evaluations);

						}else if(APP_CONSTANTS.USER_ROLE_LEAD_JURY == role){
							// Load the Reviewer for Selection, If role is Lead JURY						
							if(APP_CONSTANTS.IDEA_STATUS_READY_FOR_REVIEW == ideaStatus || APP_CONSTANTS.IDEA_STATUS_P2_READY_FOR_REVIEW == ideaStatus){	
								$scope.themeEditEnable = true;
								loadReviewerInfo(ideaSubTheme);
							}else if(APP_CONSTANTS.IDEA_STATUS_UNDER_REVIEW == ideaStatus 
									|| APP_CONSTANTS.IDEA_STATUS_REWORK == ideaStatus || APP_CONSTANTS.IDEA_STATUS_REVIEW_COMPLETED == ideaStatus 
									|| APP_CONSTANTS.IDEA_STATUS_SELECTED == ideaStatus || APP_CONSTANTS.IDEA_STATUS_REJECTED == ideaStatus ){


								// Load the Reviewer Information with Old Status					
								EvaluationTaskByTypeNIdea.query({type : APP_CONSTANTS.TASK_TYPE_ASSESSMENT, ideaId : $scope.idea.id},function(success){
									$scope.deligateTasks = success;
								}, function(error){
									addNotification(error.data.message);
								});

								loadReviewerInfo(ideaSubTheme);
							}else if(APP_CONSTANTS.IDEA_STATUS_P2_UNDER_REVIEW == ideaStatus  || APP_CONSTANTS.IDEA_STATUS_P2_REVIEW_COMPLETED == ideaStatus){


								EvaluationTaskByTypeNIdea.query({type : APP_CONSTANTS.TASK_TYPE_P2_ASSESSMENT, ideaId : $scope.idea.id},function(success){
									$scope.deligateTasks = success;
								}, function(error){
									addNotification(error.data.message);
								});								
								loadReviewerInfo(ideaSubTheme);
							}
						}else if(APP_CONSTANTS.USER_ROLE_REVIEWER == role){
							//load Pre defined evaluation
							if(APP_CONSTANTS.IDEA_STATUS_UNDER_REVIEW == ideaStatus){
								loadReviewerEvaluation($scope.idea.evaluations, user.id);
							}else if(APP_CONSTANTS.IDEA_STATUS_P2_UNDER_REVIEW == ideaStatus){
								loadReviewerEvaluation($scope.idea.p2evaluations, user.id);
							}
						};
					}else{
						addNotification('Idea information is missing from the response');
					};
				},function(error){
					addNotification(error.data.message);
				});

			},function(error){
				addNotification(error.data.message);
			});
		};

	};

	function controlDisplay(role, ideaStatus){
		if(role && ideaStatus){
			if(APP_CONSTANTS.USER_ROLE_PMO == role){
				if(APP_CONSTANTS.IDEA_STATUS_SUBMITTED == ideaStatus || APP_CONSTANTS.IDEA_STATUS_P2_SUBMITTED == ideaStatus){
					if($rootScope.evaluationTask){
						$scope.validationEnable = true;
					}
				}
			}else if(APP_CONSTANTS.USER_ROLE_LEAD_JURY == role){
				if(APP_CONSTANTS.IDEA_STATUS_READY_FOR_REVIEW == ideaStatus){
					if($rootScope.evaluationTask){
						$scope.assignmentEnable = true;
					}					
				}else if(APP_CONSTANTS.IDEA_STATUS_UNDER_REVIEW == ideaStatus ){
					$scope.finalEnable = true;
					$scope.deligateEnable = true;
				}else if(APP_CONSTANTS.IDEA_STATUS_REVIEW_COMPLETED == ideaStatus){
					$scope.finalEnable = true;
					$scope.deligateEnable = true;
				}else if(APP_CONSTANTS.IDEA_STATUS_REWORK == ideaStatus){
					$scope.finalEnable = true;
					$scope.deligateEnable = true;
				}else if(APP_CONSTANTS.IDEA_STATUS_SELECTED == ideaStatus){
					$scope.finalEnable = true;
					$scope.deligateEnable = true;
				}else if(APP_CONSTANTS.IDEA_STATUS_REJECTED == ideaStatus){
					$scope.finalEnable = true;
					$scope.deligateEnable = true;
				}else if(APP_CONSTANTS.IDEA_STATUS_P2_UNDER_REVIEW == ideaStatus){
					$scope.p2Enable = true;
					$scope.finalEnable = true;
					$scope.deligateEnable = true;
				}else if(APP_CONSTANTS.IDEA_STATUS_P2_READY_FOR_REVIEW == ideaStatus){
					$scope.p2Enable = true;
					if($rootScope.evaluationTask){
						$scope.assignmentEnable = true;
					}					
				}else if(APP_CONSTANTS.IDEA_STATUS_P2_UNDER_REVIEW == ideaStatus){
					$scope.p2Enable = true;
					$scope.finalEnable = true;
					$scope.deligateEnable = true;
				}else if(APP_CONSTANTS.IDEA_STATUS_P2_REVIEW_COMPLETED == ideaStatus){
					$scope.p2Enable = true;
					$scope.finalEnable = true;
					$scope.deligateEnable = true;
				}
				$scope.deleteEnable = false;
			}else if(APP_CONSTANTS.USER_ROLE_REVIEWER == role){
				if(APP_CONSTANTS.IDEA_STATUS_UNDER_REVIEW == ideaStatus){
					$scope.p2Enable = false;
					$scope.assessmentEnable = true;
				}else if(APP_CONSTANTS.IDEA_STATUS_P2_UNDER_REVIEW == ideaStatus){
					$scope.p2Enable = true;
					$scope.assessmentEnable = true;
				}

			}else if(APP_CONSTANTS.USER_ROLE_ADVISORY == role){
					$scope.p2Enable = true;
					$scope.assessmentEnable = true;
			}else if(APP_CONSTANTS.USER_ROLE_ADMIN == role){
				if(APP_CONSTANTS.IDEA_STATUS_UNDER_REVIEW == ideaStatus ){
					$scope.deligateEnable = true;
				}else if(APP_CONSTANTS.IDEA_STATUS_REVIEW_COMPLETED == ideaStatus ){
					$scope.deligateEnable = true;
				}else if(APP_CONSTANTS.IDEA_STATUS_P2_UNDER_REVIEW == ideaStatus){
					$scope.p2Enable = true;
					$scope.deligateEnable = true;
				}else if(APP_CONSTANTS.IDEA_STATUS_P2_REVIEW_COMPLETED == ideaStatus){
					$scope.p2Enable = true;
					$scope.deligateEnable = true;
				}
				$scope.deleteEnable = true;
			}
		};		
	};

	function validatePMOApprove(){
		var valid = true;
		/*
		if(!$scope.pmoEvaluation.comments){
			valid = false;
			addNotification('Comments missing !');
		}
		 */
		return valid;
	}

	function validateReviewer(){
		var valid = true;
		if(!$scope.reviewer1 || !$scope.reviewer1.id){
			valid = false;
			addNotification('Reviewer 1 is missing !');
		}
		/*
		if(!$scope.reviewer2 || !$scope.reviewer2.id){
			valid = false;
			addNotification('Reviewer 2 is missing !');
		}
		 */

		if($scope.reviewer2 && $scope.reviewer1.id == $scope.reviewer2.id ){
			valid = false;
			addNotification('You have selected same reviewer, Please select different reviewers !');
		}
		return valid;
	};



	function validateReviewerEvaluation(){
		var valid = true;
		var evaluation = $scope.reviewerEvaluation;

		if(!evaluation){
			valid = false;
			addNotification('Provide Evaluate the idea !');
		}
		/*
		if( evaluation.clientImpact == 0  &&  evaluation.businessImpact == 0 && evaluation.noveltyInnovation == 0 && evaluation.programability == 0 
				&& evaluation.feasibility == 0 && evaluation.clarity == 0 && evaluation.completeness == 0 && evaluation.strategicAlignment == 0 ){
			valid = false;
			addNotification('All Evaluation should not be 0 !');
		}


		if(!$scope.reviewerEvaluation.comments){
			valid = false;
			addNotification('Provide the review comments !');
		}
		 */
		return valid;
	}

	function populateEnvironment(){
		if($scope.themes && $scope.idea.theme){							
			for (var i = 0; i < $scope.themes.length; i++) {
				if( $scope.themes[i] && $scope.themes[i].id == $scope.idea.theme){					
					$scope.environments = $scope.themes[i].subThemes;
				}
			}
		}
	};


	function loadReviewerInfo(subTheme){
		if(subTheme ){
			IdeaReviewerWithAssignmentService.query({subTheme : subTheme},function(success){
				$scope.reviewers = success;
			}, function(error){
				addNotification(error.data.message);
			});
		};		
	};

	function loadReviewerEvaluation(evaluations, userId){
		if(evaluations && userId){
			for (var i = 0; i < evaluations.length; i++) {
				var evaluation = evaluations[i];
				if(evaluation &&  APP_CONSTANTS.USER_ROLE_REVIEWER == evaluation.role && userId == evaluation.owner){
					$scope.reviewerEvaluation = evaluation;
				};
			}
		};
	};

	function loadPMOEvaluation(evaluations){
		if(evaluations){
			for (var i = 0; i < evaluations.length; i++) {
				var evaluation = evaluations[i];
				if(evaluation &&  APP_CONSTANTS.USER_ROLE_PMO == evaluation.role ){
					$scope.pmoEvaluation = evaluation;
				};
			}
		};
	};


});