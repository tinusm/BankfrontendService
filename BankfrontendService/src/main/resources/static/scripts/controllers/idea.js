'use strict';

angular.module('TechathonApp').controller('IdeaController', function($scope,  $rootScope, $q,  $location, $http, $upload, APP_CONSTANTS, APP_DATA, BLUEMIX_CONSTANTS,
		IdeaCreateService, IdeaService, IdeaHistoryQueryService, ThemeService, FileDeleteService, IdeaSubmitService,IdeaReCallService, serviceurl){
	var user = $rootScope.user;
	$scope.idea = {};
	$scope.idea.documents = [];
	$scope.histories = [];
	$scope.themes = [];
	$scope.environments = [];
	$scope.leadAction = false;	
	$scope.regOpen = false;
	$scope.documentUploadOpen = false;	
	$scope.isWatsonCollapsed = true;
	$scope.bluemix = BLUEMIX_CONSTANTS;	

	$scope.ideaDocPath = serviceurl +'file/';
	$scope.uploadProgress = 0;

	// Display Control
	$scope.formDissabled = false;
	$scope.buttonDissabled = false;
	$scope.showSave = false;
	$scope.showSubmit = false;
	$scope.showDelete = false;
	$scope.showReCall = false;
	$scope.processing = false;
	$scope.themeDissable = false;
	$scope.docUploadShow = false;
	$scope.uploadDissable = false;
	$scope.demoOptionDissable = false;
	$scope.industries = APP_DATA.industries;
	$scope.industries_b = APP_DATA.industries_b;

	$scope.reworkDisplayFilter = function(evaluation){
		return (evaluation.role == APP_CONSTANTS.USER_ROLE_REVIEWER 				
				|| evaluation.role == APP_CONSTANTS.USER_ROLE_PMO);
	};

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
		if(user){
			try{
				/*//Relaxed for API Hackathon
				if($rootScope.viewType == APP_CONSTANTS.TEAM_ROLE_LEAD){
					$scope.leadAction = true;
				}else{
					$scope.leadAction = false;
				}
				 */
				$scope.leadAction = true;
				// Get the Themes
				ThemeService.query({},function(success){
					$scope.themes = success;	
					// Get the Idea Information				
					if($rootScope.ideaId){
						// Open the exisisting Idea
						IdeaService.get({id: $rootScope.ideaId},function(success){
							$scope.idea = success;
							// Control the Screen
							controlDisplay();
							populateSubTheme();
							// Get Idea History
							getIdeaHistory();
						},function(error){
							addNotification(error.data.message);
						});

					}else{
						// Control the Screen
						console.log('No Idea Id...' + $rootScope.team.sector + $rootScope.team.account);
						controlDisplay();						
						if(	$rootScope.team ){
							$scope.idea.theme = $rootScope.team.sector;
							$scope.themeSelected($scope.idea.theme);
							//$scope.idea.subTheme = $rootScope.team.account;
							$scope.idea.subTheme = $scope.idea.theme;
						}
					}

				},function(error){
					addNotification(error.data.message);
				});
			}catch(exception){
				addNotification(exception);
			};
		}else{
			goHome();
		};
	};



	$scope.themeSelected = function(theme){
		if($scope.idea.theme){
			populateSubTheme();
			$scope.idea.subTheme = $scope.idea.theme;
		};		
	};

	$scope.resetIdea = function(){
		if(user){
			$scope.idea = {};
		}else{
			goHome();
		};
	};

	$scope.saveIdea = function(){
		$scope.processing = true;
		console.log('Idea Subtheme' +  $scope.idea.subTheme);
		if(user && $scope.idea){			
			if($scope.idea.id){		
				//Update Idea
				IdeaService.update($scope.idea, function(success){
					$scope.idea = success;									
					// Control the Screen
					controlDisplay();					
					addNotification($scope.idea.title +' Idea info updated.');	
					// Get Update Idea History
					getIdeaHistory();
				}, function(error){
					addNotification(error.data.message);
				});	
			}else{
				if(validateSave()){
					//Create Idea
					$scope.buttonDissabled = true;
					IdeaCreateService.create({teamId : $rootScope.teamId},$scope.idea, function(success){					
						$scope.idea = success;
						// Control the Screen
						controlDisplay();
						// Get Update Idea History
						getIdeaHistory();
						addNotification($scope.idea.title + ' Idea created.');
						$scope.buttonDissabled = false;
					}, function(error){
						addNotification(error.data.message);
						$scope.buttonDissabled = false;
					});
				};
			}		
		}else{
			goHome();
		};
		$scope.processing = false;
	};

	$scope.cancelIdea = function(){
		if(user){
			$location.url('/ideaview');
		}else{
			goHome();
		};
	};

	$scope.deleteIdea = function(){
		$scope.processing = true;
		if(user && $scope.idea && $scope.idea.id){
			//Deleting Idea Files
			FileDeleteService.remove({type : 'idea', id : $scope.idea.id}, function(success){
				addNotification('Idea document removed.');				
			}, function(error){
				addNotification(error.data.message);
			});	
			// Delete Idea
			IdeaService.remove({id : $scope.idea.id}, function(success){
				addNotification( $scope.idea.title +' Idea deleted.');
				$location.url('/ideaview');
			}, function(error){
				addNotification(error.data.message);
			});				

		}else{
			goHome();
		};
		$scope.processing = false;
	};

	$scope.deleteIdeaFile = function(docId, fileName, index){
		$scope.processing = true;
		if(user && docId ){
			//File Delete
			FileDeleteService.remove({type : 'doc', id : docId}, function(success){
				addNotification('Idea document removed.');	
				$scope.idea.documents.splice(index, 1);

				// Update the Save Message
				$scope.idea.updateMessage = fileName +" document removed. !";

				// Save the Idea
				$scope.saveIdea();
			}, function(error){
				addNotification(error.data.message);
			});			
		}else{
			goHome();
		};
		$scope.processing = false;
	};


	$scope.submitIdea = function(){
		console.log('root submitIdea....');
		$scope.processing = true;
		if(user && $scope.idea ){
			if($scope.idea.id){
				submit();
			}else{
				IdeaCreateService.create({teamId : $rootScope.teamId},$scope.idea, function(success){	
					// Control the Screen
					controlDisplay();
					$scope.idea = success;
					console.log('Idea created successfully :' +$scope.idea.id);
					if($scope.idea.id){
						submit();
					}					
				}, function(error){
					addNotification(error.data.message);
					$scope.buttonDissabled = false;
				});
			}
		}else{
			goHome();
		};
		$scope.processing = false;
	};

	function submit(){
		if(validateSubmit()){
			$scope.idea.teamId = $rootScope.teamId;	
			console.log('submitIdea....for ' + $scope.idea.teamId );
			// Save Before Submit
			$scope.buttonDissabled = true;
			IdeaService.update($scope.idea, function(success){
				console.log('submitIdea....Saved ' + $scope.idea.id );
				$scope.idea = success;
				addNotification($scope.idea.title +' Idea updated.');
				IdeaSubmitService.update({id : $scope.idea.id },$scope.idea, function(success){
					addNotification($scope.idea.title  +' Idea submitted.');
					$location.url('/ideaview');
				}, function(error){
					addNotification(error.data.message);
					$scope.buttonDissabled = false;
				});
			}, function(error){
				// Control the Screen
				controlDisplay();
				addNotification(error.data.message);
				$scope.buttonDissabled = false;
			});	
		};
	}

	$scope.reCallIdea = function(){
		$scope.processing = true;
		if(user && $scope.idea && $scope.idea.id){
			if($scope.idea.status && ( $scope.idea.status == APP_CONSTANTS.IDEA_STATUS_SUBMITTED 
					|| $scope.idea.status == APP_CONSTANTS.IDEA_STATUS_READY_FOR_REVIEW ) ){
				IdeaReCallService.update({id : $scope.idea.id }, {} , function(success){
					addNotification($scope.idea.title  +' Idea Recalled.');
					$location.url('/ideaview');
				}, function(error){
					addNotification(error.data.message);
				});
			}else{
				addNotification('Re Call is not valid for '+ $scope.idea.status+' Idea status.');
			};
		}else{
			goHome();
		};
		$scope.processing = false;
	};


	$scope.onFileSelect = function($files) {

		if($scope.idea.documents && $scope.idea.documents.length >= APP_CONSTANTS.IDEA_DOCUMENT_MAX_COUNT){
			addNotification("Document attachement should be only "+APP_CONSTANTS.IDEA_DOCUMENT_MAX_COUNT+" numbers with each Max 5MB size.");
		}else{
			$scope.processing = true;
			//$files: an array of files selected, each file has name, size, and type.
			for (var i = 0; i < $files.length; i++) {
				var file = $files[i];	 
				if(file && file.name && file.size && file.type){
					console.log('File name '+ file.name + 'File type '+ file.type);
					if( !('application/zip' == file.type || 'application/x-zip-compressed'  == file.type || 'multipart/x-zip' == file.type || 'application/x-zip' == file.type ) ){
						addNotification('Please upload only ZIP (application/zip, application/x-zip-compressed, multipart/x-zip) format files, Your file type is '+ file.type);
					}else if(file.size > 5242880){
						// 10 MB = 10485760, 5 MB = 5242880
						addNotification('Your file size is more than 5 MB !');
					}else{
						$scope.buttonDissabled = true;
						$scope.upload = $upload.upload({
							url: serviceurl+'file/upload', //upload.php script, node.js route, or servlet url
							method: 'POST',
							//headers: {'header-key': 'header-value'},
							//withCredentials: true,
							data: { teamId :  $rootScope.teamId, ideaId: $scope.idea.id, type : 'ABSTRACT'},
							file: file, // or list of files ($files) for html5 only
						}).progress(function(evt) {
							$scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total);
							//console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
						}).success(function(data, status, headers, config) {
							// file is uploaded successfully
							$scope.uploadProgress = 0;
							addNotification(file.name +' Document uploaded to the server.');	
							$scope.idea.documents.push(data);
							// Update the Save Message
							$scope.idea.updateMessage = file.name +" document uploaded by "+user.name;
							// Save the Idea
							$scope.saveIdea();
							$scope.buttonDissabled = false;
						}).error(function(error){
							addNotification(error.message);
							$scope.buttonDissabled = false;
						});
					}
				}else{
					addNotification('Problem in your file upload. Please, upload valid file format.');
				}
				//.error(...)
				//.then(success, error, progress); 
				// access or attach event listeners to the underlying XMLHttpRequest.
				//.xhr(function(xhr){xhr.upload.addEventListener(...)})
			}
			/* alternative way of uploading, send the file binary with the file's content-type.
	       Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed. 
	       It could also be used to monitor the progress of a normal http post/put request with large data*/
			// $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.

			$scope.processing = false;
		}
	};


	function getIdeaHistory(){
		if($scope.idea.id){
			IdeaHistoryQueryService.query({id : $scope.idea.id }, function(success){
				if(success){
					$scope.histories = success;
				};				
			},  function(error){
				addNotification(error.data.message);
			});
		};


	};


	function controlDisplay(){
		if($scope.idea.id == null){
			$scope.formDissabled = false;
			$scope.showSave = true;
			$scope.showSubmit = true;
			$scope.showDelete = false;
			$scope.showReCall = false;
			$scope.themeDissable = false;
			$scope.docUploadShow = false;
			$scope.uploadDissable = false;
			$scope.demoOptionDissable = false;
		}else if(APP_CONSTANTS.IDEA_STATUS_DRAFT == $scope.idea.status){
			$scope.formDissabled = false;			
			if( $rootScope.control.addIdea){
				$scope.showSave = true;
				$scope.showSubmit = true;
				$scope.showDelete = true;
			}			
			$scope.showReCall = false;
			$scope.themeDissable = false;
			$scope.docUploadShow = false;
			$scope.uploadDissable = false;
			$scope.demoOptionDissable = false;
		}else if(APP_CONSTANTS.IDEA_STATUS_SUBMITTED == $scope.idea.status){
			$scope.formDissabled = true;
			$scope.showSave = false;
			$scope.showSubmit = false;
			$scope.showDelete = false;
			$scope.showReCall = true;
			$scope.themeDissable = true;
			$scope.docUploadShow = false;
			$scope.uploadDissable = true;
			$scope.demoOptionDissable = false;
		}else if(APP_CONSTANTS.IDEA_STATUS_REWORK == $scope.idea.status){
			$scope.formDissabled = false;
			$scope.showSave = true;
			$scope.showSubmit = true;
			$scope.showDelete = false;
			$scope.showReCall = false;
			$scope.themeDissable = true;
			$scope.docUploadShow = false;
			$scope.uploadDissable = false;
			$scope.demoOptionDissable = false;
		}else if(APP_CONSTANTS.IDEA_STATUS_READY_FOR_REVIEW == $scope.idea.status){
			$scope.formDissabled = true;
			$scope.showSave = false;
			$scope.showSubmit = false;
			$scope.showDelete = false;
			$scope.showReCall = true;
			$scope.themeDissable = true;
			$scope.docUploadShow = false;
			$scope.uploadDissable = true;
			$scope.demoOptionDissable = false;
		}else if(APP_CONSTANTS.IDEA_STATUS_P2_DRAFT == $scope.idea.status){
			$scope.formDissabled = false;			
			if( $rootScope.control.p2SubmitIdea){				
				$scope.showSubmit = true;				
			}	
			$scope.showSave = true;
			$scope.showDelete = false;
			$scope.showReCall = false;
			$scope.themeDissable = true;
			$scope.docUploadShow = true;
			$scope.uploadDissable = false;
			$scope.demoOptionDissable = true;
		}else if(APP_CONSTANTS.IDEA_STATUS_P2_SUBMITTED == $scope.idea.status){
			$scope.formDissabled = true;
			$scope.showSave = false;
			$scope.showSubmit = false;
			$scope.showDelete = false;
			$scope.showReCall = false;
			$scope.themeDissable = true;
			$scope.docUploadShow = true;
			$scope.uploadDissable = true;
			$scope.demoOptionDissable = false;
		}else{
			$scope.formDissabled = true;
			$scope.showSave = false;
			$scope.showSubmit = false;
			$scope.showDelete = false;
			$scope.showReCall = false;
			$scope.themeDissable = true;
			$scope.docUploadShow = true;
			$scope.uploadDissable = true;
			$scope.demoOptionDissable = false;
		}			
	};

	function populateSubTheme(){
		if($scope.themes && $scope.idea.theme){							
			for (var i = 0; i < $scope.themes.length; i++) {
				if( $scope.themes[i] && $scope.themes[i].id == $scope.idea.theme){					
					$scope.environments = $scope.themes[i].subThemes;
				}
			}
		}
	};

	function validateSave(){
		var valid = true;
		if($scope.idea){			
			if(!$scope.idea.title){
				addNotification("Idea title is missing !");
				valid = false;
			}

			if(!$scope.idea.theme){
				
				addNotification("Theme is missing !");
				valid = false;
			}
			
			/*if(!$scope.idea.subTheme){
				addNotification("Api Idea Account is missing !");
				valid = false;
			}	*/

			if(!$scope.idea.applyIndustries || $scope.idea.applyIndustries.length <= 0 ){
				addNotification("Applicable Industry selection missing !");
				valid = false;
			}
			
			if(!$scope.idea.industry ){
				addNotification("Industry selection missing !");
				valid = false;
			}

			if(!$scope.idea.summary){
				addNotification("Idea/ candidate is missing/not in proper range!");
				valid = false;
			}

		}else{
			addNotification("Idea information is missing");
			valid = false;
		}
		return valid;
	};

	function validateSubmit(){
		var valid = true;
		if(validateSave()){	
			if(!$scope.idea.env.runTimes ||  $scope.idea.env.runTimes.length <= 0){
				valid = false;
				addNotification('Please select Bluemix Runtime.');
			}

			if(!$scope.idea.id){
				addNotification("Idea id is missing !");
				valid = false;
			}


			/*
			if(!$scope.idea.implementationInfo){
				addNotification("Idea Implementation information is missing !");
				valid = false;
			}	
			 */	

			if( $scope.idea.status == APP_CONSTANTS.IDEA_STATUS_P2_DRAFT){
				if(!$scope.idea.demoStatus || !$scope.idea.demoStatus == null ){
					addNotification('Please select the development status.');
				}
				
				if( !$scope.idea.documents ||  $scope.idea.documents.length <= 0 ){
					valid = false;
					addNotification('Please attach the updated mandatory documents.');
				}else if( $scope.idea.documents.length > APP_CONSTANTS.IDEA_DOCUMENT_MAX_COUNT ){
					valid = false;
					addNotification('Please check attachements. It should be max of '+  APP_CONSTANTS.IDEA_DOCUMENT_MAX_COUNT +' numbers with 5MB max size.');
				}	
			}

		}else{
			valid = false;
		}
		return valid;
	};

});