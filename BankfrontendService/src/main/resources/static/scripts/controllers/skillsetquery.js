'use strict';

angular.module('TechathonApp').controller('SkillSetQueryController', function($scope,  $rootScope, $location, $http, $filter, ngTableParams, APP_CONSTANTS, 
		SkillsetRequestSearchService, LocationService ) {

	$scope.skillsetRequest = {};
	$scope.locations = [];
	$scope.skillsetRequests = [];
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
	
	
	$scope.tableParams = new ngTableParams({
		page: 1,            // show first page
		count: 10,          // count per page
		sorting: {
			skillsetRequired : 'asc'     // initial sorting
		}
	}, {
		total: $scope.skillsetRequests.length, // length of data
		getData: function($defer, params) {
			// use build-in angular filter
			var orderedData = params.sorting() ?
					$filter('orderBy')($scope.skillsetRequests, params.orderBy()) :
						$scope.skillsetRequests;
					params.total($scope.skillsetRequests.length);
					$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		}
	});


	$scope.init = function(){	
		loadLocation();
	};


	$scope.searchSkillSetRequest = function(){
		SkillsetRequestSearchService.query({}, $scope.skillsetRequest, function(response){
			if(response){
				$scope.skillsetRequests = response;
				//paginate($scope.skillsetRequests);
				$scope.tableParams.reload();
			}else{
				addNotification('No results for your query');
			}
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