'use strict';
angular.module('TechathonApp').controller('IdeaManagementController', function($scope,  $rootScope, $location, $http, $upload, $modal, $log, $filter, ngTableParams, APP_CONSTANTS,
		IdeaUserRoleStatusService, IdeaService, IdeaReportCountByUserRole,  serviceurl){
	var user = $rootScope.user;
	var role = $rootScope.role;	
	
	$scope.ideaStatus = undefined;
	$scope.ideas = [];
	$scope.reportPath =  undefined;
	$scope.reportP1TBDMPath =  undefined;
	$scope.uploadProgress = 0;
	$scope.ideaReports = [];	

	$scope.ideaAction = false;
	$scope.ideaDocumentAction = false;
	$scope.draftEnable = false;
	$scope.submittedEnable = false;
	$scope.readyForReviewEnable = false;
	$scope.underReviewEnable = false;
	$scope.reworkEnable = false;
	$scope.reviewCompletedEnable = false;
	$scope.selectedEnable = false;
	$scope.rejectedEnable = false;
	$scope.reviewer1IdEnable = false;
	$scope.reviewer2IdEnable = false;
	$scope.reviewer1Enable = false;
	$scope.reviewer2Enable = false;
	$scope.scoreEnable = false;

	$scope.p2draftEnable = false;
	$scope.p2submittedEnable = false;
	$scope.p2readyForReviewEnable = false;
	$scope.p2underReviewEnable = false;
	$scope.p2reviewCompletedEnable = false;
	$scope.p2reviewer1IdEnable = false;
	$scope.p2reviewer2IdEnable = false;
	$scope.p2reviewer1Enable = false;
	$scope.p2reviewer2Enable = false;
	$scope.finalScoreEnable = false;

	$scope.idealink = serviceurl +'idea/';
	$scope.ideatasklink = serviceurl +'evaluationtask/idea/';

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



	$scope.items = ['item1', 'item2', 'item3'];

	$scope.open = function (size) {

		var modalInstance = $modal.open({
			templateUrl: 'myModalContent.html',
			controller: ModalInstanceCtrl,
			size: size,
			resolve: {
				items: function () {
					return $scope.items;
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};

	var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

		$scope.items = items;
		$scope.selected = {
				item: $scope.items[0]
		};

		$scope.ok = function () {
			$modalInstance.close($scope.selected.item);
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	};


	$scope.reportTableParams = new ngTableParams({
		page: 1,            // show first page
		count: 10,          // count per page
		sorting: {
			ideaName : 'asc'     // initial sorting
		}
	}, {
		total: $scope.ideas.length, // length of data
		getData: function($defer, params) {
			// use build-in angular filter
			var orderedData = params.sorting() ?
					$filter('orderBy')($scope.ideas, params.orderBy()) :
						$scope.ideas;
					params.total($scope.ideas.length);
					$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		}
	});


	$scope.init = function(){
		if(user && role){		
			controlDisplay(role);
			//$scope.reportPath =  serviceurl +'ideareport/user/'+user.id +'/role/'+role+'/type/0';			
			//$scope.reportP1TBDMPath = serviceurl +'ideareport/user/'+user.id +'/role/'+role+'/type/2';	
			// For API
			$scope.reportPath =  serviceurl +'ideareport/user/'+user.id +'/role/'+role+'/type/10';			
			$scope.reportP1TBDMPath = serviceurl +'ideareport/user/'+user.id +'/role/'+role+'/type/12';	
			
			if($rootScope.source && $rootScope.source.searchStatus){
				// Get the Previous Status and Get query
				$scope.changeStatus($rootScope.source.searchStatus);
			}else{
				$rootScope.source =  { page : 'manage', action : undefined , searchStatus : undefined };	
			}
		}else{
			goHome();
		}
	};



	$scope.changeStatus = function(status){
		if(user && status){
			$scope.ideaStatus = status;
			controlDisplay(role);	
			$scope.ideas = [];
			addNotification('Requesting Status Changed to ' + $scope.ideaStatus);
			$rootScope.source.searchStatus = status;
			IdeaUserRoleStatusService.query({userId : user.id, role : role, status : $scope.ideaStatus },function(success){
				if(success){
					$scope.ideas = success;									
				}
				$scope.reportTableParams.reload();	
				addNotification('Processed Status Changed to ' + $scope.ideaStatus);
			},function(error){
				addNotification(error.data.message);
			});
			
		}
	};

	$scope.searchIdea = function(){
		//console.log('Searching Idea ' + $scope.serachIdea);
		if(user){
			if($scope.serachIdea){
				$scope.ideas = [];
				IdeaService.get({ id:$scope.serachIdea },function(success){
					if(success && success.status){
						$scope.ideaStatus = success.status;
						$scope.ideas.push(success);						
					};
					$scope.reportTableParams.reload();
				},function(error){
					addNotification(error.data.message);
				});
			}
		}else{
			goHome();
		};
	};


	$scope.launchIdea = function(idea){
		if(user && role && idea && idea.id){	
			// Setting task for next page
			$rootScope.ideaId = idea.id;
			$location.url('/evaluation');			
		}else{
			goHome();
		};
	};

	$scope.onFileSelect = function($files) {
		//$files: an array of files selected, each file has name, size, and type.
		for (var i = 0; i < $files.length; i++) {
			var file = $files[i];	 
			if(file && file.name && file.size && file.type){
				console.log('File name '+ file.name + 'File type '+ file.type);
				/*
				if( !('application/zip' == file.type || 'application/x-zip-compressed'  == file.type) ){
					addNotification('Please upload only ZIP format files, Your file type is '+ file.type);
				}else if(file.size > 10485760){
					addNotification('Your file size is more than 10 MB !');
				}else{

				 */
				$scope.upload = $upload.upload({
					url: serviceurl+'idea/processselectedrejected/upload', //upload.php script, node.js route, or servlet url
					method: 'POST',
					//headers: {'header-key': 'header-value'},
					//withCredentials: true,
					data: { userId :  $rootScope.user.id },
					file: file, // or list of files ($files) for html5 only
				}).progress(function(evt) {
					$scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total);
					//console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
				}).success(function(data, status, headers, config) {
					// file is uploaded successfully
					$scope.uploadProgress = 0;
					addNotification(file.name +' Document uploaded to the server.');	
				}).error(function(error){
					addNotification(error.message);
				});
				//}
			}else{
				addNotification('Problem in your file upload. Please, upload valid file format.');
			}
			//.error(...)
			//.then(success, error, progress); 
			// access or attach event listeners to the underlying XMLHttpRequest.
			//.xhr(function(xhr){xhr.upload.addEventListener(...)})
		}

	};


	function controlDisplay( role){
		if(role){
			if(APP_CONSTANTS.USER_ROLE_PMO == role ){
				$scope.ideaAction = true;
				$scope.ideaDocumentAction = false;
				$scope.draftEnable = false;
				$scope.submittedEnable = true;
				$scope.readyForReviewEnable = true;
				$scope.underReviewEnable = false;
				$scope.reworkEnable = false;
				$scope.reviewCompletedEnable = false;
				$scope.selectedEnable = false;
				$scope.rejectedEnable = false;
				$scope.scoreEnable = false;

			}else if(APP_CONSTANTS.USER_ROLE_LEAD_JURY == role){
				$scope.ideaAction = true;
				$scope.ideaDocumentAction = true;
				$scope.draftEnable = false;
				$scope.submittedEnable = true;
				$scope.readyForReviewEnable = true;
				$scope.underReviewEnable = true;
				$scope.reworkEnable = true;
				$scope.reviewCompletedEnable = true;
				$scope.selectedEnable = false;
				$scope.rejectedEnable = false;

				if(APP_CONSTANTS.IDEA_STATUS_UNDER_REVIEW == $scope.ideaStatus 
						|| APP_CONSTANTS.IDEA_STATUS_REWORK == $scope.ideaStatus || APP_CONSTANTS.IDEA_STATUS_REVIEW_COMPLETED == $scope.ideaStatus 
						|| APP_CONSTANTS.IDEA_STATUS_SELECTED == $scope.ideaStatus || APP_CONSTANTS.IDEA_STATUS_REJECTED == $scope.ideaStatus ){
					$scope.reviewer1Enable = true;
					$scope.reviewer2Enable = true;
					$scope.scoreEnable = true;
					$scope.p2reviewer1Enable = false;
					$scope.p2reviewer2Enable = false;
					$scope.finalScoreEnable = false;	
				}else if (APP_CONSTANTS.IDEA_STATUS_P2_UNDER_REVIEW == $scope.ideaStatus 
						|| APP_CONSTANTS.IDEA_STATUS_P2_REVIEW_COMPLETED == $scope.ideaStatus){
					
					$scope.reviewer1Enable = false;
					$scope.reviewer2Enable = false;
					$scope.scoreEnable = false;					
					$scope.p2reviewer1Enable = true;
					$scope.p2reviewer2Enable = true;
					$scope.finalScoreEnable = true;					
				}				

			}else if(APP_CONSTANTS.USER_ROLE_ADMIN == role){
				$scope.ideaAction = true;
				$scope.ideaDocumentAction = true;
				$scope.draftEnable = false;
				$scope.submittedEnable = false;
				$scope.readyForReviewEnable = false;
				$scope.underReviewEnable = false;
				$scope.reworkEnable = false;
				$scope.reviewCompletedEnable = false;
				$scope.selectedEnable = false;
				$scope.rejectedEnable = false;
				$scope.scoreEnable = false;

			};
		};

	};


});