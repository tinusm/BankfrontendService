'use strict';

angular.module('TechathonApp').controller('InboxController', function($scope,  $rootScope, $location, $filter, ngTableParams, APP_CONSTANTS, APP_DATA,
		EvaluatorService, EvaluatorCreateService, EvaluatorSearchService, EvaluatorRoleThemeDeleteService, SubThemeService,
		EvaluationTaskByRoleService, EvaluationTaskByRoleNUserService ){
	var user = $rootScope.user;
	var role = $rootScope.role;
	$scope.status = APP_CONSTANTS.TASK_STATUS_OPENED;
	$scope.evaluationTasks = [];
	$scope.hasAdminRole = false;

	$scope.evaluator = {};
	$scope.evaluators = [];
	$scope.subThemes = [];
	$scope.roles = [];
	$scope.workListEnable = false;
	$scope.roleManagementEnable = false;
	$scope.ideaManagementEnable = false;
	$scope.ideaReportEnable = false;
	$scope.rework = false;


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
			$rootScope.source =  { page : 'inbox', action : undefined , searchStatus : undefined };
			// Load Inbox
			loadInbox();	
		}else{
			goHome();
		};
	};

	$scope.changeStatus = function(status){
		if(user && role && status){
			$scope.status = status;
			// Load Inbox
			loadInbox();	
			addNotification('View status changed to ' + $scope.status);
		}else{
			goHome();
		};

	};

	$scope.launchTask = function(evaluationTask){
		if(user && role && evaluationTask){	
			// Setting task for next page
			$rootScope.evaluationTask = evaluationTask;
			$location.url('/evaluation');			
		}else{
			goHome();
		};

	};

	$scope.addRole = function(){
		if(user && role ){
			if($scope.evaluator){
				if(validateEvaluator($scope.evaluator)){
					EvaluatorCreateService.create({}, $scope.evaluator, function(success){					
						addNotification('Evaluator created for the role '+ $scope.evaluator.role);
						searchEvaluator();
					}, function(error){
						addNotification(error.data.message);
					});					
				}
			}
		}else{
			goHome();
		};
	};

	$scope.deleteRole = function(evaluator){
		if(user){
			if(evaluator && evaluator.id){
				if(evaluator.role && ( evaluator.role == APP_CONSTANTS.USER_ROLE_ADMIN  || evaluator.role == APP_CONSTANTS.USER_ROLE_REG_ADMIN) ){
					evaluator.subTheme ="null";
				}

				EvaluatorRoleThemeDeleteService.remove({id: evaluator.userId, role : evaluator.role, subTheme :  evaluator.subTheme},  function(success){
					addNotification(evaluator.name +" user's "+ evaluator.role +' role removed for Theme '+ evaluator.subTheme);
					searchEvaluator();
				},  function(error){
					addNotification(error.data.message);
				});
			}			
		}else{
			goHome();
		};		
	};

	$scope.searchRole = function(){
		if(user && role ){
			if($scope.evaluator){
				searchEvaluator();
			}
		}else{
			goHome();
		};
	};



	$scope.inboxTableParams = new ngTableParams({
		page: 1,            // show first page
		count: 10,          // count per page
		sorting: {
			createdDate : 'asc'     // initial sorting
		}
	}, {
		total: $scope.evaluationTasks.length, // length of data
		getData: function($defer, params) {
			// use build-in angular filter
			var orderedData = params.sorting() ?
					$filter('orderBy')($scope.evaluationTasks, params.orderBy()) :
						$scope.evaluationTasks;
					params.total($scope.evaluationTasks.length);
					$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		}
	});


	$scope.evalTableParams = new ngTableParams({
		page: 1,            // show first page
		count: 10,          // count per page
		sorting: {
			name : 'asc'     // initial sorting
		}
	}, {
		total: $scope.evaluators.length, // length of data
		getData: function($defer, params) {
			// use build-in angular filter
			var orderedData = params.sorting() ?
					$filter('orderBy')($scope.evaluators, params.orderBy()) :
						$scope.evaluators;
					params.total($scope.evaluators.length);
					$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		}
	});


	function loadInbox(){
		if(APP_CONSTANTS.USER_ROLE_ADMIN == role){	
			/*
			$scope.roles = [ APP_CONSTANTS.USER_ROLE_ADMIN, APP_CONSTANTS.USER_ROLE_PMO, APP_CONSTANTS.USER_ROLE_LEAD_JURY, 
			                 APP_CONSTANTS.USER_ROLE_REVIEWER, APP_CONSTANTS.USER_ROLE_REG_ADMIN];
			*/
			$scope.roles = [ APP_CONSTANTS.USER_ROLE_ADMIN, APP_CONSTANTS.USER_ROLE_LEAD_JURY, APP_CONSTANTS.USER_ROLE_REVIEWER ];
			
			loadTheme();
			$scope.workListEnable = false;
			$scope.roleManagementEnable  = true;
			$scope.ideaManagementEnable = true;
			$scope.ideaReportEnable = true;
		}else {
			if(APP_CONSTANTS.USER_ROLE_PMO == role){
				$scope.workListEnable = true;
				$scope.ideaReportEnable = true;
				$scope.ideaManagementEnable = true;
			}else if(APP_CONSTANTS.USER_ROLE_LEAD_JURY == role){
				$scope.roles = [ APP_CONSTANTS.USER_ROLE_REVIEWER ];				
				$scope.roleManagementEnable  = true;
				$scope.workListEnable = true;
				$scope.ideaManagementEnable = true;
				$scope.ideaReportEnable = true;
			}else if(APP_CONSTANTS.USER_ROLE_REVIEWER == role){
				$scope.rework = true;
			}

			EvaluationTaskByRoleNUserService.query({role : role, userId : user.id, status : $scope.status },function(success){
				// Apply Pagination on Results
				$scope.evaluationTasks = success;
				$scope.inboxTableParams.reload();
			},function(error){
				addNotification(error.data.message);
			});

		}	
	};
	/*
	function paginateInbox(success){
		if(success){
			$scope.evaluationTasks = success;
			$scope.totalItems = $scope.evaluationTasks.length;
			$scope.currentPage = 1;
			$scope.numPerPage = 10;

			$scope.paginate = function(value) {
				var begin, end, index;
				begin = ($scope.currentPage - 1) * $scope.numPerPage;
				end = begin + $scope.numPerPage;
				index = $scope.evaluationTasks.indexOf(value);
				return (begin <= index && index < end);
			};
		}
	};
	 */

	function hasAdminRole(user){
		console.log("Checking Admin Role !");
		if(user && user.roles){
			if(APP_CONSTANTS.USER_ROLE_ADMIN in user.roles){
				$scope.hasAdminRole = true;
				console.log("Admin Role Present");
			}
		}

	};

	function loadTheme(){
		SubThemeService.query({},function(success){
			$scope.subThemes = success;	
		},function(error){
			addNotification(error.data.message);
		});

	};

	function searchEvaluator(){
		if($scope.evaluator){
			EvaluatorSearchService.query({}, $scope.evaluator, function(success){
				$scope.evaluators = success;
				$scope.evalTableParams.reload();
			},function(error){
				addNotification(error.data.message);
			});
		}
	};

	function validateEvaluator(evaluator){
		var valid = true;
		if(!evaluator.email){
			valid = false;
			addNotification('User Email is missing');
		}

		if(!evaluator.role){
			valid = false;
			addNotification('User role is missing');
		}

		if(evaluator.role && ( evaluator.role ==  APP_CONSTANTS.USER_ROLE_LEAD_JURY ||  evaluator.role == APP_CONSTANTS.USER_ROLE_REVIEWER ) && !evaluator.subTheme ){
			valid = false;
			addNotification('Theme is missing for the role '+ evaluator.role);
		}
		return valid;
	};

});