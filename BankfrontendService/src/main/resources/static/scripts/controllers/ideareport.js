'use strict';

angular.module('TechathonApp').controller('IdeaReportController', function($scope,  $rootScope, $location, $http, $upload, $filter, ngTableParams, APP_CONSTANTS,
		IdeaReportCountByUserRole, PublishPreFinalResultService, IdeaReportCountByUserLocation, serviceurl){
	var user = $rootScope.user;
	var role = $rootScope.role;
	$scope.ideaReports =[];
	$scope.publishEnable = false;
	$scope.chartObject = {};
	$scope.chartThemeIdea = {};
	$scope.chartThemeIdeaStatus = {};
	$scope.chartSubThemeIdea = {};
	$scope.chartSubThemeIdeaStatus = {};
	$scope.reportPath = serviceurl +'ideareport/user/';

	$scope.linq = undefined;

	$scope.notifications = [];	
	$scope.invalidNotification = false;

	$scope.themeReportEnable = false;
	$scope.subThemeReportEnable = false;	
	$scope.subThemeStatusReportEnable = false;

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
		if(user && role){
			console.log('releasePhase1Result :' +  $rootScope.control.releasePhase1Result);
			if(APP_CONSTANTS.USER_ROLE_ADMIN == role &&  $rootScope.control.releasePhase1Result){
				$scope.publishEnable = true;
				$scope.downloadall = true;
			}		
			$scope.ideaCount = 0;
			$scope.reportPath =  serviceurl +'ideareport/user/'+user.id +'/subtheme/';	
			$scope.reportThemePath =  serviceurl +'ideareport/user/'+user.id +'/theme/';	
			$scope.allexcelPath =  serviceurl +'ideareport/user/'+user.id +'/type/'+role;	
			$scope.industryReportPath =  serviceurl +'ideareport/user/'+user.id +'/industry/';
			$scope.locationreportPath =  serviceurl +'ideareport/user/'+user.id +'/location/';

		}else{
			goHome();
		};
	};

	function controlReportView(role){
		if(APP_CONSTANTS.USER_ROLE_ADMIN == role || APP_CONSTANTS.USER_ROLE_LEAD_SPOC == role){
			$scope.themeReportEnable = true;	
			$scope.industryReportEnable = true;
			$scope.locationReportEnable = true;
		}else{
			$scope.themeReportEnable = false;			
		}
	}
	
	$scope.refreshLocReport = function (){
		if(user && role){
			controlReportView(role);
			getIdeaLocationReport();
		}else{
			goHome();
		};
	};

	$scope.refreshReport = function (){
		if(user && role){
			
			controlReportView(role);
			getIdeaReport();
		}else{
			goHome();
		};
	};

	$scope.publishSelected = function (){
		if(user && role){
			getIdeaReport();
		}else{
			goHome();
		};
	};

	$scope.publishResult = function(status){
		if(user && role && status){
			PublishPreFinalResultService.create({status : status },{}, function(success){				
				addNotification('Initiated Result Publish for the '+ status +' Status');
			}, function(error){
				addNotification(error.data.message);
			});
		}
	};


	function getIdeaReport(){
		IdeaReportCountByUserRole.query({userId : user.id, role : role },function(success){
			if(success){
				$scope.ideaReports = success;
				$scope.linq = Enumerable.From(success);
				populateThemeIdeaReport();
				populateThemeIdeaStatusReport();
				populateIndustryIdeaReport();//Kannan
				if(APP_CONSTANTS.USER_ROLE_ADMIN == role ){
					
				}else{
					//populateSubThemeIdeaReport();
				}
				
			};
		},function(error){
			addNotification(error.data.message);
		});
	};

	function getIdeaLocationReport(){
		IdeaReportCountByUserLocation.query({userId : user.id, role : role },function(success){
			if(success){
				$scope.ideaReports = success;
				$scope.linq = Enumerable.From(success);
				populateLocationIdeaReport();
				if(APP_CONSTANTS.USER_ROLE_ADMIN == role ){
					
				}else{
					//populateSubThemeIdeaReport();
				}
				
			};
		},function(error){
			addNotification(error.data.message);
		});
	};



	function populateThemeIdeaReport(){
		if($scope.linq){
			$scope.themeReport =
				$scope.linq.GroupBy(function(x){ return x.theme; })
				.Select(function(x){
					return {
						theme : x.Key(),
						count: x.Sum(function(y){ return y.count|0; })
					};
				}).ToArray();
			prepareThemeIdeaChart();
		};
	}
	
	function populateLocationIdeaReport(){
		if($scope.linq){
			$scope.locationReport =
				$scope.linq.GroupBy(function(x){ return x.location; })
				.Select(function(x){
					return {
						location : x.Key(),
						count: x.Sum(function(y){ return y.count|0; })
					};
				}).ToArray();
			prepareLocationIdeaChart();
		};
	}
	
	function prepareLocationIdeaChart(){
		if($scope.locationReport){
			console.log('prepareLocationIdeaChart...........');
			var cols = [
			            {id: "t", label: "Location", type: "string"},
			            {id: "s", label: "Idea Count", type: "number"}
			            ];
			var rows = [];
			for (var i = 0; i < $scope.locationReport.length; i++) {
				if($scope.locationReport[i] && $scope.locationReport[i].location && $scope.locationReport[i].count){
					var name =  $scope.locationReport[i].location;
					var record = {c: [{v: name}, {v: $scope.locationReport[i].count}]};
					rows.push(record);
				}				
			}

			$scope.chartLocationIdea = {
					type : "PieChart",
					displayed: true,
					data :{
						cols : cols,
						rows : rows
					},
					options: {
						title: "Location Idea Count Report",
						pieSliceText: 'label',
						isStacked: "true",
						fill: 20,					  
						allowHtml: true
					}
			}


			$scope.chartLocationIdeaTable = {
					type : "Table",
					displayed: true,
					data :{
						cols : cols,
						rows : rows
					},
					options: {
						title: "Location Idea Count Report",
						isStacked: "true",
						fill: 20,					  
						allowHtml: true
					}
			}

		}else{
			goHome();
		};
	};


	function prepareThemeIdeaChart(){
		if($scope.themeReport){
			console.log('prepareThemeIdeaChart...........');
			var cols = [
			            {id: "t", label: "Theme", type: "string"},
			            {id: "s", label: "Idea Count", type: "number"}
			            ];
			var rows = [];
			$scope.ideaCount = 0;
			for (var i = 0; i < $scope.themeReport.length; i++) {
				if($scope.themeReport[i] && $scope.themeReport[i].theme && $scope.themeReport[i].count){
					var name =  $scope.themeReport[i].theme;
					var record = {c: [{v: name}, {v: $scope.themeReport[i].count}]};
					$scope.ideaCount += $scope.themeReport[i].count;
					rows.push(record);
				}				
			}

			$scope.chartThemeIdea = {
					type : "PieChart",
					displayed: true,
					data :{
						cols : cols,
						rows : rows
					},
					options: {
						title: "Theme Idea Count Report",
						pieSliceText: 'label',
						isStacked: "true",
						fill: 20,					  
						allowHtml: true
					}
			}


			$scope.chartThemeIdeaTable = {
					type : "Table",
					displayed: true,
					data :{
						cols : cols,
						rows : rows
					},
					options: {
						title: "Sector Idea Count Report",
						isStacked: "true",
						fill: 20,					  
						allowHtml: true
					}
			}

		}else{
			goHome();
		};
	};

	function populateThemeIdeaStatusReport(){
		if($scope.linq){
			var keySelector = function (x) { 
				return JSON.stringify({ status : x.status });
			}
			$scope.themeStatusReport = $scope.linq.GroupBy(keySelector)
			.Select(function(x){
				var key =  JSON.parse(x.Key());
				return {
					status : key.status,
					count: x.Sum(function(y){ return y.count|0; })
				};
			}).ToArray();
			prepareThemeIdeaStatusChart();
		}
	}
	
	function populateIndustryIdeaReport(){
		if($scope.linq){
			var keySelector = function (x) { 
				return JSON.stringify({ industry : x.industry });
			}
			$scope.themeIndustryReport = $scope.linq.GroupBy(keySelector)
			.Select(function(x){
				var key =  JSON.parse(x.Key());
				return {
					industry : key.industry,
					count: x.Sum(function(y){ return y.count|0; })
				};
			}).ToArray();
			prepareIndustryIdeaChart();
		}
	}

	function prepareThemeIdeaStatusChart(){
		if($scope.themeStatusReport){
			console.log('prepareThemeIdeaStatusChart...........');
			var cols = [
			            {id: "t", label: "Idea Status", type: "string"},
			            {id: "s", label: "Idea Count", type: "number"}
			            ];
			var rows = [];
			for (var i = 0; i < $scope.themeStatusReport.length; i++) {
				if($scope.themeStatusReport[i] && $scope.themeStatusReport[i].status && $scope.themeStatusReport[i].count){
					var name =  $scope.themeStatusReport[i].status;
					var record = {c: [{v: name}, {v: $scope.themeStatusReport[i].count}]};
					rows.push(record);
				}				
			}

			$scope.chartThemeIdeaStatus = {
					type : "PieChart",
					displayed: true,
					data :{
						cols : cols,
						rows : rows
					},
					options: {
						title: "Sector Idea Status & Count Report",
						pieSliceText: 'label',
						isStacked: "true",
						fill: 20,					  
						allowHtml: true
					}
			}


			$scope.chartThemeIdeaStatusTable = {
					type : "Table",
					displayed: true,
					data :{
						cols : cols,
						rows : rows
					},
					options: {
						title: "Sector Idea Status & Count Report",
						isStacked: "true",
						fill: 20,					  
						allowHtml: true
					}
			}
		}else{
			goHome();
		};
	};

	function prepareIndustryIdeaChart(){
		if($scope.themeIndustryReport){
			console.log('prepareThemeIdeaStatusChart...........');
			var cols = [
			            {id: "t", label: "Idea Industry", type: "string"},
			            {id: "s", label: "Idea Count", type: "number"}
			            ];
			var rows = [];
			for (var i = 0; i < $scope.themeIndustryReport.length; i++) {
				if($scope.themeIndustryReport[i] && $scope.themeIndustryReport[i].industry && $scope.themeIndustryReport[i].count){
					var name =  $scope.themeIndustryReport[i].industry;
					var record = {c: [{v: name}, {v: $scope.themeIndustryReport[i].count}]};
					rows.push(record);
				}				
			}

			$scope.chartIndustryIdea = {
					type : "PieChart",
					displayed: true,
					data :{
						cols : cols,
						rows : rows
					},
					options: {
						title: "Idea Industry & Count Report",
						pieSliceText: 'label',
						isStacked: "true",
						fill: 20,					  
						allowHtml: true
					}
			}


			$scope.chartIndustryIdeaTable = {
					type : "Table",
					displayed: true,
					data :{
						cols : cols,
						rows : rows
					},
					options: {
						title: "Idea Industry & Count Report",
						isStacked: "true",
						fill: 20,					  
						allowHtml: true
					}
			}
		}else{
			goHome();
		};
	};

	$scope.populateSubThemeForThemeIdeaReport = function(selectedTheme){
		console.log('Selected Theme '+ selectedTheme);
		if($scope.linq && selectedTheme){
			var keySelector = function (x) { 
				return JSON.stringify({ subTheme: x.subTheme });
			}
			$scope.subThemeReport = $scope.linq.Where(function (x) { return x.theme == selectedTheme }). GroupBy(keySelector)
			.Select(function(x){
				var key =  JSON.parse(x.Key());
				return {
					theme : selectedTheme ,
					subTheme : key.subTheme,
					count: x.Sum(function(y){ return y.count|0; })
				};
			}).ToArray();
			prepareSubThemeIdeaChart();
		};
	};


	function populateSubThemeIdeaReport(){
		if($scope.linq){
			$scope.subThemeReport =
				$scope.linq.GroupBy(function(x){ return x.subTheme; })
				.Select(function(x){
					return {
						theme : x.theme,
						subTheme : x.Key(),
						count: x.Sum(function(y){ return y.count|0; })
					};
				}).ToArray();
			prepareSubThemeIdeaChart();
		};
	}

	function prepareSubThemeIdeaChart(){
		if($scope.subThemeReport){
			console.log('prepareSubThemeIdeaChart...........');
			var cols = [			           
			            {id: "t", label: "Account", type: "string"},
			            {id: "s", label: "Idea Count", type: "number"},
			            {id: "v", label: "Action", type: "string"}
			            ];
			var rows = [];
			console.log('subThemeReport.length:'+ $scope.subThemeReport.length);
			for (var i = 0; i < $scope.subThemeReport.length; i++) {
				if($scope.subThemeReport[i] && $scope.subThemeReport[i].subTheme && $scope.subThemeReport[i].count){
					var name =  $scope.subThemeReport[i].subTheme;
					var record = {c: [{v: name , }, {v: $scope.subThemeReport[i].count}, {v: '<a ng-click = "populateSubThemeIdeaStatusReport(\''+ name +'\')"> Idea Status Report </a>', }]};
					rows.push(record);
				}				
			}
			/*
			$scope.chartSubThemeIdea.type = 'PieChart';
			$scope.chartSubThemeIdea.options = {
					title: 'Account Idea Count Report', is3D: true, pieHole: 0.4
			};
			$scope.chartSubThemeIdea.data = { cols : cols,  "rows": rows };
			 */
			$scope.chartSubThemeIdea = {
					type : "PieChart",
					displayed: true,
					data :{
						cols : cols,
						rows : rows
					},
					options: {
						title: "Account Idea Count Report",
						isStacked: "true",
						fill: 20,					  
						allowHtml: true
					}
			}


			$scope.chartSubThemeIdeaTable = {
					type : "Table",
					displayed: true,
					data :{
						cols : cols,
						rows : rows
					},
					options: {
						title: "Account Idea Count Report",
						isStacked: "true",
						fill: 20,					  
						allowHtml: true
					}
			}
			$scope.subThemeReportEnable = true;
		}else{
			goHome();
		};
	};

	$scope.populateSubThemeIdeaStatusReport = function(selectedSubTheme){
		console.log('populateSubThemeIdeaStatusReport called with :'+ selectedSubTheme);
		if($scope.linq && selectedSubTheme){
			var keySelector = function (x) { 
				return JSON.stringify({ subTheme: x.subTheme, status : x.status });
			}
			$scope.subThemeStatusReport = $scope.linq.Where(function (x) { return x.subTheme == selectedSubTheme }). GroupBy(keySelector)
			.Select(function(x){
				var key =  JSON.parse(x.Key());
				return {
					subTheme : key.subTheme,
					status : key.status,
					count: x.Sum(function(y){ return y.count|0; })
				};
			}).ToArray();
			prepareSubThemeIdeaStatusChart(selectedSubTheme);
		}
	}

	function prepareSubThemeIdeaStatusChart(selectedSubTheme){
		if($scope.subThemeStatusReport){
			console.log('prepareSubThemeIdeaStatusChart...........');
			var cols = [
			            {id: "t", label: "Idea Status", type: "string"},
			            {id: "s", label: "Idea Count", type: "number"}
			            ];
			var rows = [];
			for (var i = 0; i < $scope.subThemeStatusReport.length; i++) {
				if($scope.subThemeStatusReport[i] && $scope.subThemeStatusReport[i].status && $scope.subThemeStatusReport[i].count){
					var name =  $scope.subThemeStatusReport[i].status;
					var record = {c: [{v: name}, {v: $scope.subThemeStatusReport[i].count}]};
					rows.push(record);
				}				
			}

			$scope.chartSubThemeIdeaStatus = {
					type : "PieChart",
					displayed: true,
					data :{
						cols : cols,
						rows : rows
					},
					options: {
						title: selectedSubTheme + " : Account Idea Status & Count Report",
						isStacked: "true",
						fill: 20,					  
						allowHtml: true
					}
			}


			$scope.chartSubThemeIdeaStatusTable = {
					type : "Table",
					displayed: true,
					data :{
						cols : cols,
						rows : rows
					},
					options: {
						title: selectedSubTheme + " : Account Idea Status & Count Report",
						isStacked: "true",
						fill: 20,					  
						allowHtml: true
					}
			}
			$scope.subThemeStatusReportEnable = true;
		}else{
			goHome();
		};
	};
});