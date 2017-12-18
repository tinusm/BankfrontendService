'use strict';

angular.module('TechathonApp').controller('RoleController', function($scope,  $rootScope, $location, $filter, ngTableParams, APP_CONSTANTS, APP_DATA,
		EvaluatorService, EvaluatorCreateService, EvaluatorSearchService, EvaluatorRoleThemeDeleteService, SubThemeService, ThemeByEvaluatorRoleService ){
	var user = $rootScope.user;
	var role = $rootScope.role;
	$scope.expertTypes = APP_DATA.expertTypes;
	$scope.evaluationTasks = [];
	$scope.evaluator = {};
	$scope.evaluators = [];
	$scope.subThemes = [];
	$scope.roles = [];



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
			// Load Inbox
			console.log('expertTypes' + $scope.expertTypes);
			loadRole();	
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
				if(APP_CONSTANTS.USER_ROLE_ADMIN == role || APP_CONSTANTS.USER_LEAD_SPOC == role){
					searchEvaluator();
				}else{
					if( $scope.evaluator.role && $scope.evaluator.subTheme){
						searchEvaluator();
					}else{						
						addNotification('Please select the filter ( role,theme)');
					}
				}
			}
		}else{
			goHome();
		};
	};

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



	function loadRole(){
		if(APP_CONSTANTS.USER_ROLE_ADMIN == role){	
			
			$scope.roles = [ APP_CONSTANTS.USER_ROLE_ADMIN, APP_CONSTANTS.USER_ROLE_PMO, APP_CONSTANTS.USER_ROLE_LEAD_JURY, 
			                 APP_CONSTANTS.USER_ROLE_REVIEWER, APP_CONSTANTS.USER_ROLE_LEAD_SPOC, APP_CONSTANTS.USER_ROLE_ADVISORY];
			 
			//$scope.roles = [ APP_CONSTANTS.USER_ROLE_ADMIN, APP_CONSTANTS.USER_ROLE_LEAD_JURY, APP_CONSTANTS.USER_ROLE_REVIEWER ];

			loadTheme();

		}else if(APP_CONSTANTS.USER_ROLE_LEAD_JURY == role){
			$scope.roles = [APP_CONSTANTS.USER_ROLE_LEAD_JURY, APP_CONSTANTS.USER_ROLE_REVIEWER];	
			loadEvaluatorTheme(user.id, role)
		}
	};

	function loadTheme(){
		SubThemeService.query({},function(success){
			$scope.subThemes = success;	
		},function(error){
			addNotification(error.data.message);
		});

	};


	function loadEvaluatorTheme(id, role){
		ThemeByEvaluatorRoleService.query({ id : id, role : role },function(success){
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