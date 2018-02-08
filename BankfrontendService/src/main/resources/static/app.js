var app = angular.module("bankApp", ['ngRoute', 'chart.js', 'ngResource', 'chart.js', 'ngTable', 'ui.grid', 'ui.grid.pagination']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.

    when('/accountSummary', {
    	templateUrl: 'templates/account.html',
        controller: 'AcctCtrl'
    }).

    when('/fundTransfer', {
        templateUrl: 'templates/fundTransfer.html',
        controller: 'FundTransCtrl'
    }).

    when('/login', {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    }).
    
    when('/profile', {
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl'
    }).
    when('/confirmTransfer', {
        templateUrl: 'templates/confirmTransfer.html',
        controller: 'ConfirmFundTransCtrl'
    }).
    otherwise({
        redirectTo: '/login'
    });

}]);

app.service('StudentService',['$http', function ($http) {
	 
    function getStudents(pageNumber,size) {
        pageNumber = pageNumber > 0?pageNumber - 1:0;
        return $http({
          method: 'GET',
            url: 'http://localhost:8001/inputrepo?page='+pageNumber+'&size='+size
        });
    }
    return {
        getStudents: getStudents
    };
}]);

app.factory('AuthService', function ($resource) {
	
	
   
  // return $resource('http://hulloginservice.mybluemix.net/user/:action', {
 // return
	// $resource('http://bankauthenticationservice.mybluemix.net/authenticate?username=:username
	// & password=:password', {
	// return $resource('http://localhost:8002/authenticate?username=:username &
	// password=:password', {
	return $resource('http://localhost:8002/authenticate/:username/:password', {
	
        username: '@username',
        password: '@password'
    }, {
        'process': {
            method: 'POST'
        }

    });
});




app.controller('StudentCtrl', function($scope, $http, ngTableParams, $q, $filter){
	
	$scope.tableParams1 = new ngTableParams({
        page: 1,
        count: 10
    }, {
        getData: function($defer, params) {
        	var page=params.page() - 1;
            $http.get('http://localhost:8001/inputrepo?page='+page+'&size='+params.count())
                .success(function(data, status) {
                	
                   params.total(data.page.totalElements);
                   data._embedded.inputrepo = params.sorting() ? $filter('orderBy')(data._embedded.inputrepo, params.orderBy()) : data._embedded.inputrepo;
                   data._embedded.inputrepo = params.filter() ? $filter('filter')(data._embedded.inputrepo, params.filter()) : data._embedded.inputrepo;
	  // $scope.data = $scope.data.slice((params.page() - 1) * params.count(),
		// params.page() * params.count());
	            // $defer.resolve($scope.data);
                   $defer.resolve(data._embedded.inputrepo);
                   
                });
        }
    });


});

/*
 * app.controller('StudentCtrl1', ['$scope','StudentService', function ($scope,
 * StudentService) { var paginationOptions = { pageNumber: 1, pageSize: 5, sort:
 * null };
 * 
 * StudentService.getStudents( paginationOptions.pageNumber,
 * paginationOptions.pageSize).success(function(data){ $scope.gridOptions.data =
 * data._embedded.inputrepo; $scope.gridOptions.totalItems =
 * data.page.totalElements; });
 * 
 * $scope.gridOptions = { paginationPageSizes: [5, 10, 20], paginationPageSize:
 * paginationOptions.pageSize, enableColumnMenus:false, useExternalPagination:
 * true, columnDefs: [ { name: 'source_type' }, { name: 'source' }, { name:
 * 'sku' }, { name: 'skuName' }, { name: 'location' }, { name: 'location_type' }, {
 * name: 'location_layer' }, { name: 'skuLocation' } ], onRegisterApi:
 * function(gridApi) { $scope.gridApi = gridApi;
 * gridApi.pagination.on.paginationChanged( $scope, function (newPage, pageSize) {
 * paginationOptions.pageNumber = newPage; paginationOptions.pageSize =
 * pageSize; StudentService.getStudents(newPage,pageSize)
 * .success(function(data){ $scope.gridOptions.data = data._embedded.inputrepo;
 * $scope.gridOptions.totalItems = data.page.totalElements; }); }); } }; }]);
 */



app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);


app.controller('LoginCtrl', function ($scope, $http, $rootScope, AuthService, $location) {
	$rootScope.accountSummaryEnable = false;
    $rootScope.fundTransferEnable = false;
    $rootScope.profileEnable = false;
    
    $http.get("http://localhost:8001/inputrepo").then(
    		function(res){
    			 $rootScope.input=res.data._embedded.inputrepo;
    		}, function(){
    			
    		});
   

    function manageMenu() {
    	 var test2 = localStorage.getItem("accountId");
         alert(test2);
         
    	
        if ($rootScope.user == 'tinu') {
            $rootScope.fundTransferEnable = true;
            $rootScope.profileEnable = true;
        } else {
        	 $rootScope.fundTransferEnable = false;
             $rootScope.profileEnable = false;
        }
    }
    
   
    
    $rootScope.logout = function() {
    	
		console.log('Successfully Logged out');
		
		$rootScope.user = {};
		$rootScope.role = {};
		$rootScope.$broadcast('auth-logout-success');
		$rootScope.authenticated = false;
		$location.url('/login');
	};
	

    $scope.login = function () {

        $scope.user = {
            email: $scope.user.email,
            password: $scope.user.password
        };
        $scope.loginmessage = 'Sign-In Progress....';

        AuthService.process({
        	
        	username: $scope.user.email,
            password: $scope.user.password
        }, $scope.user, function (response) {
        	
            if (response) {
                console.log('Got Authentication Response');
                $rootScope.$broadcast('auth-login-success');
                $rootScope.authenticated = true;
                $rootScope.user = response.username;
                var localstore =response.accountId;
                localStorage.setItem("accountId", localstore);
               
              // $rootScope.role = response.role;
                manageMenu();
                $location.url('/accountSummary');
            } else {
                $scope.logfailed1 = true
                $rootScope.$broadcast('Login Failed');
            }
        }, function (error) {
        	$scope.logfailed1 = true;
            $scope.error = error.data.message;
            $rootScope.$broadcast('Login Failed');
        });
        $scope.loginmessage = undefined;
    };

});

app.controller('TestCtrl', function($scope, ngTableParams){
	$scope.uploadFile = function(){
		
	}
});


app.controller('AcctCtrl', function($scope, $http, $rootScope,){
	function manageMenu4() {
	   	   
        $rootScope.fundTransferEnable = true;
        $rootScope.accountSummaryEnable = false;
        $rootScope.profileEnable = true;
   
}
	manageMenu4();
	var accountId = localStorage.getItem("accountId");
	$http.get("http://localhost:8005/accountsummary/all/"+accountId)
    .then(function(response){
    	var data = response.data;
    	$scope.accountnumber = data.accountnumber;
    	$scope.customername= data.customername;
    	$scope.balance= data.balance;
    	$scope.branch= data.branch;
    	console.log("Tinu" +data.accountnumber);
    	console.log("Tinu q "+$scope.accountnumber);
    	
    }, function(reason){
    	
    });
});

app.controller('ProfileCtrl', function($scope, $http, $rootScope,){
	 function manageMenu2() {
	   	   
	           $rootScope.fundTransferEnable = true;
	           $rootScope.accountSummaryEnable = true;
	           $rootScope.profileEnable = false;
	      
	   }
	    
	 manageMenu2();
	var accountId = localStorage.getItem("accountId");
	$http.get("http://localhost:8006/profile/all/"+accountId)
    .then(function(response){
    	var data = response.data;
    	$scope.accountid = data.accountid;
    	$scope.emailid= data.emailid;
    	$scope.address= data.address;
    	$scope.phonenumber= data.phonenumber;
    	console.log("Tinu" +data.accountid);
    	console.log("Tinu q "+$scope.accountid);
    	
    }, function(reason){
    	
    });
	
	  $scope.updateProfile = function () {
		  
		  function sucessupdate() 
		    {
		   	   alert("Profile Updated Sucesufully !!!");
	        }
		  console.log("Trying to update profile");
		  var accountid =$scope.accountid;
		  var emailid =$scope.emailid;
		  var address =$scope.address;
		  var phonenumber =$scope.phonenumber;
		  console.log(accountid,emailid,address,phonenumber);
		  $http.put('http://localhost:8006/profile/updateprofile/'+accountid+"/"+emailid+"/"+address+"/"+phonenumber);
		 console.log("Profile Update"); 
		 sucessupdate(); 
		      };
});

app.controller('FundTransCtrl', function($scope, $http, $rootScope,$location){
	function manageMenu3() {
	   	   
        $rootScope.fundTransferEnable = false;
        $rootScope.accountSummaryEnable = true;
        $rootScope.profileEnable = true;
   
}
	manageMenu3();
	
	$scope.change = function () {
       
		console.log("Inside Fund Transfer");
		 var s= document.getElementById("accountnumber");
	     var k=0;
	     var accountnumber="";
		 var accountId = localStorage.getItem("accountId");
			$http.get("http://localhost:8007/fundtransfer/all/"+accountId)
		    .then(function(response){
		    	//var data = response.data;
		    	//$scope.accountnumber= data.accountnumber;
		    	//console.log("Tinu" +data.accountnumber);
		    	//console.log("Tinu q "+$scope.accountnumber);
		    	
		    	
		    	
		    	if (response.data instanceof Array) {
		    	    // data is an array
		    		for (var i in response.data) {
			    		//console.log('response.data[i] '+response.data[i]);
			    		if(k<1){
			    			accountnumber=response.data[i].accountnumber;
			    			k++;
			    		}
			    		
			    	    $('<option />', {value: response.data[i].accountnumber, text: response.data[i].accountnumber}).appendTo(s);
			    	    
			    	}
		    	} else {
		    	    // it is not an array
		    		if(k<1){
		    			accountnumber=response.data.accountnumber;
		    			k++;
		    		}
		    		
		    	    $('<option />', {value: response.data.accountnumber, text: response.data.accountnumber}).appendTo(s);
		    		
		    	}
		    	
		    });
	};
		

	//Start
	

	
	     $scope.confirmfund = function () {
	    	 
	    	
		 console.log("Confirm Transfering fund");

		
		  var accountid = localStorage.getItem("accountId");
		  console.log("Account ID"+accountid);
		  
		  var accountnumber = $scope.accountnumber;
		  localStorage.setItem("accountnumber", accountnumber);
		  console.log("Account number"+accountnumber);
		  
		  var amount =$scope.amount;
		  localStorage.setItem("amount", amount);
		  console.log("Ammount"+amount);
		 
		  var thirdaccountnumber =$scope.thirdaccountnumber;
		  localStorage.setItem("thirdaccountnumber", thirdaccountnumber);
		  console.log(" Third Account number"+thirdaccountnumber);
		  
		// var url = 'templates/confirmTransfer.html';
		// var url = "templates/confirmTransfer.html?var1="+accnum+ "&var2=" + amount+ "&var3=" + thirdaccountnumber;;
		// var myWindow = window.open(url, "", "width=800,height=600");
		  
		  
		  $location.url("/confirmTransfer");
		     
		 },function(reason){
	        	
	        };

	
	
	
	//end
	
	
	
	
	

		        
});






app.controller('ConfirmFundTransCtrl', function ($scope, $http) {
   

	$scope.accnumber= localStorage.getItem("accountnumber");
	$scope.amount= localStorage.getItem("amount");
	$scope.thirdaccountnumber= localStorage.getItem("thirdaccountnumber");
    
	//Start	
	$scope.fund = function () {
			  
			 console.log("Transfering fund");

			  function sucessupdate() 
			    {
			   	   alert("Fund Transfered Sucesufully !!!");
		      }
			  console.log("Trying to transfer fund");
			  var accountId = localStorage.getItem("accountId");
			  console.log("Account ID"+accountId);
			  var amount =$scope.amount;
			  console.log("Ammount"+amount);
			 // var accountnumber =$scope.accountnumber;
			 // console.log("Account number"+accountnumber);
			  var thirdaccountnumber =$scope.thirdaccountnumber;
			  console.log(" Third Account number"+thirdaccountnumber);
			  $http.get(' http://localhost:8007/fundtransfer/all/'+accountId+"/"+amount+"/"+thirdaccountnumber);
			 console.log("Fund Transfered"); 
			 sucessupdate(); 
			 
			     
			 },function(reason){
		        	
		        };
//End
	
    	
    });







app.factory('InputParam', ['$resource', function($resource) {
	return $resource('http://localhost:8001/inputrepo/:id', null,
	    {
	        'update': { method:'PUT' }
	    });
	}]);

app.factory('IpmModel', ['$resource', function($resource) {
	return $resource('http://localhost:8001/ipmModel/:id', null,
	    {
	        'update': { method:'PUT' }
	    });
	}]);

app.controller('UploadCtrl', function ($scope, $resource, $rootScope, $q, AuthService, $location, $http, $filter, ngTableParams, InputParam, IpmModel) {
   
	$scope.editSave = function(row){
		row.ipmModel.service_level = row.service_level;
		row.or_value = row.ipmModel.or_delivery;
		console.log("log1 = "+JSON.stringify(row));
		// var found = arr.filter(function(item) { return item.name === ; });
		delete row["$$hashKey"];
		$http.put('http://localhost:8001/inputrepo/'+row.skuLocation, JSON.stringify(row)
		    ).then(function(response){
			console.log("log2 = "+JSON.stringify(row.ipmModel));
			$http.put('http://localhost:8001/ipmModel/'+row.skuLocation, JSON.stringify(row.ipmModel)).then(function(response){
				$http.get('http://localhost:8001/inputrepo')
                .then(function(res) {
               	 $rootScope.input=res.data._embedded.inputrepo;
                }, function(reason){
                	
                });
			}, function(reason){
				
			});
		}, function(reason){
			
		});
	
	};
	
	 $scope.filterAgentStatus = function($column) {
			var def = $q.defer(),
				arr = [],
				filterAgentStatus = [];
			if($rootScope.input && $rootScope.input!=null){
				angular.forEach($rootScope.input, function(item) {
	       		 var attrb=Object.keys($column.filter)[0];
	       		// console.log("test "+attrb+" "+JSON.stringify(item[attrb]));
	       			
	       if (jQuery.inArray(item[attrb], arr) === -1) {
	       	
	           arr.push(item[attrb]);
				filterAgentStatus.push({
					'id': item[attrb],
					'title': item[attrb]
				});
			}
		});
				def.resolve(filterAgentStatus);
			}else{
				if ($rootScope.role != 'Planner') {
	                url = 'http://localhost:8001/inputrepo';
	            } else {
	                url = 'http://localhost:8001/inputrepo';// /user/' +
															// $rootScope.user;
	            }
				 $http.get(url)
	             .then(function(res) {
	            	 $rootScope.input=res.data._embedded.inputrepo;
	            	 
	            	 angular.forEach(res.data, function(item) {
	            		// console.log('Kannan '+JSON.stringify(item));
	            		 var attrb=Object.keys($column.filter)[0];
	            		// console.log("test "+attrb+"
						// "+JSON.stringify(item[attrb]));
	            			
	            if (jQuery.inArray(item[attrb], arr) === -1) {
	            	
	                arr.push(item[attrb]);
					filterAgentStatus.push({
						'id': item[attrb],
						'title': item[attrb]
					});
				}
			});
			def.resolve(filterAgentStatus);
			}, function(reason){
				def.reject();
			});
			}
			return def;
		};
		
		
		$scope.tableParams4 = new ngTableParams({
	        page: 1,
	        count: 10,
	    }, {
	        getData: function ($defer, params) {
	            var page = params.page()-1;
	            var size = params.count();
	            
	        // var url = 'http://localhost:8001/inputrepo';
	            
	            
	            
	            $http.get('http://localhost:8001/inputrepo?page='+page+'&size='+size)
	            .then(function(response, status) {
	            	var data = response.data;
	                	 $rootScope.input=data._embedded.inputrepo;
	                    params.total(data.page.totalElements);
	                    $scope.data = params.sorting() ? $filter('orderBy')($rootScope.input, params.orderBy()) : $rootScope.input;
						$scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
					// $scope.data = $scope.data.slice((params.page() - 1) *
					// params.count(), params.page() * params.count());
	                    $defer.resolve($scope.data);
	                }, function(reason) {
	                    $defer.reject();
	                }
	            );
	            
	        }
	    });
	
	
    $scope.uploadFile = function(){
        var file = $scope.myFile;
        console.log('file is ' );
        console.dir(file);
        var uploadUrl = "http://localhost:8005/uploadFile/"+$rootScope.user;
        
        var fd = new FormData();
        fd.append('uploadfile', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
        	$scope.success1=true;
        	$scope.failed1=false;
        	$window.setTimeout(function() { // hide alert message
        		$scope.success1 = false;

        	}, 5000);
        })
        .error(function(){
        	$scope.success1=false;
        	$scope.failed1=true;
        	$window.setTimeout(function() { 
        		alert("test");// hide alert message
        		$scope.failed1 = false;
        		$(".alert").alert('close');
        	}, 200);
        });
    };
    
});

app.controller('DashCtrl', function ($scope, $rootScope, $q, AuthService, $location, $http, $filter, ngTableParams) {
    var url = undefined;
    
    
    $scope.enabled1 = {average_weekly_demand:false, sdfe_per:false, sdfe:false, lot_sizes:false, 
    		or_delivery:false, cycle_time:false, avg_replen_lead_time:false, sd_variability:false, 
    		c_factor_sales:false, k_factor_sales:false, cycle_service_level:false, bias:false, 
    		bias_norminv:false, adjusted_sdfe:false, final_unbiased_sdfe:false, 
    		model_safety_stock:false, model_safety_stock_weeks:false, 
    		model_safety_stock_days:false, 
    		minstock_aftcapping_weeks:false, maxstock_weeks:false, minstock_aftcapping_cs:false, 
    		maxstock_cs:false, currentss_weeks:false, currentss_value:false, proposed_ipmss_value:false, 
    		min_norms_weeks:false, max_norms_weeks:false, min_norms_final:false, max_norms_final:false, 
    		minstock_value:false, maxstock_value:false, avg_cycle_stock:false, source_type:false, 
    		source:true, sku:false, skuName:true, location:true, location_type:false, location_layer:false, 
    		skuLocation:true, category:true, service_level:true, sku_classification:false, production_time:false, 
    		qa_time:false, transit_time:false, planning_period:false, frozen_period:false, avg_lead_time:false, 
    		or_value:true, other_lead_time:false, 
    		lead_time_variability:false, current_ssweeks:false, price:true, username:false};
    
	$http.get("http://localhost:8001/dashboard1/")
    .then(function(response){
    	var data = response.data;
    	$scope.max_stock = data.max_stock;
    	$scope.min_stock= data.min_stock;
    	$scope.avg_stock= data.avg_stock;
    	$scope.safety_stock = data.safety_stock;
    	$scope.service_target = data.service_target;
    	$scope.lead_time = data.lead_time;
    }, function(reason){
    	
    });
	
    $scope.check = function(){
    	// var skulocation = $('#skulocationid').find(":selected").text();
    	var skulocation = $scope.skucodelocationItem;
    	$http.get("http://localhost:8001/dashboard1/"+skulocation)
        .then(function(response){
        	var data = response.data;
        	$scope.max_stock1 = data.max_stock;
        	$scope.min_stock1= data.min_stock;
        	$scope.avg_stock1= data.avg_stock;
        	$scope.safety_stock1 = data.safety_stock;
        	$scope.service_target1 = data.service_target;
        	$scope.lead_time1 = data.lead_time;
        }, function(reason){
        	
        });
    };
    
    $scope.exportData = function () {
        var blob = new Blob(['<table>'+document.getElementById('exportable').innerHTML+'</table>'], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "Report.xlsx");
    };
    
    $scope.check1 = function(){
    	// var skulocation = $('#skulocationid').find(":selected").text();
    	var skulocation = $scope.skucodelocationCode;
    	
    	$http.get("http://localhost:8001/pastsales/"+skulocation)
        .then(function(response){
        	var data = response.data;
        	$scope.pastsales1= [data[0].week35_2016,
        		data[0].week36_2016,
        		data[0].week37_2016,
        		data[0].week38_2016,
        		data[0].week39_2016,
        		data[0].week40_2016,
        		data[0].week41_2016,
        		data[0].week42_2016,
        		data[0].week43_2016,
        		data[0].week44_2016,
        		data[0].week45_2016,
        		data[0].week46_2016,
        		data[0].week47_2016,
        		data[0].week48_2016,
        		data[0].week49_2016,
        		data[0].week50_2016,
        		data[0].week51_2016,
        		data[0].week52_2016,
        		data[0].week01_2017,
        		data[0].week02_2017,
        		data[0].week03_2017,
        		data[0].week04_2017,
        		data[0].week05_2017,
        		data[0].week06_2017,
        		data[0].week07_2017,
        		data[0].week08_2017,
        		data[0].week09_2017,
        		data[0].week10_2017,
        		data[0].week11_2017,
        		data[0].week12_2017,
        		data[0].week13_2017,
        		data[0].week14_2017,
        		data[0].week15_2017,
        		data[0].week16_2017,
        		data[0].week17_2017,
        		data[0].week18_2017];
        }, function(reason){
        	
        });
    	
    	 $http.get("http://localhost:8001/pastforecast/"+skulocation)
    	    .then(function(response){
    	    	var data = response.data;
    	    	$scope.pastforecast1= [data[0].week35_2016,
    	    		data[0].week36_2016,
    	    		data[0].week37_2016,
    	    		data[0].week38_2016,
    	    		data[0].week39_2016,
    	    		data[0].week40_2016,
    	    		data[0].week41_2016,
    	    		data[0].week42_2016,
    	    		data[0].week43_2016,
    	    		data[0].week44_2016,
    	    		data[0].week45_2016,
    	    		data[0].week46_2016,
    	    		data[0].week47_2016,
    	    		data[0].week48_2016,
    	    		data[0].week49_2016,
    	    		data[0].week50_2016,
    	    		data[0].week51_2016,
    	    		data[0].week52_2016,
    	    		data[0].week01_2017,
    	    		data[0].week02_2017,
    	    		data[0].week03_2017,
    	    		data[0].week04_2017,
    	    		data[0].week05_2017,
    	    		data[0].week06_2017,
    	    		data[0].week07_2017,
    	    		data[0].week08_2017,
    	    		data[0].week09_2017,
    	    		data[0].week10_2017,
    	    		data[0].week11_2017,
    	    		data[0].week12_2017,
    	    		data[0].week13_2017,
    	    		data[0].week14_2017,
    	    		data[0].week15_2017,
    	    		data[0].week16_2017,
    	    		data[0].week17_2017,
    	    		data[0].week18_2017];
    	    	var options = {
    	    	        type: 'line',
    	    	        scales: {
    	    	              xAxes: [{
    	    	                  stacked: true
    	    	              }],
    	    	              yAxes: [{
    	    	                  stacked: true
    	    	              }]
    	    	          },
    	    	          legend: {
    	    	              display: true,
    	    	              labels: {
    	    	                  fontColor: 'rgb(255, 99, 132)'
    	    	              }
    	    	          },
    	    	          title: {
    	    	              display: true,
    	    	              text: 'Forecast vs Sales'
    	    	          },

    	    	        data: {
    	    	            labels: ["Week35_2016", "Week36_2016", "Week37_2016", "Week38_2016",
    	    	                "Week39_2016", "Week40_2016", "Week41_2016", "Week42_2016", "Week43_2016", "Week44_2016",
    	    	                "Week45_2016", "Week46_2016", "Week47_2016", "Week48_2016", "Week49_2016", "Week50_2016",
    	    	                "Week51_2016", "Week52_2016", "Week01_2017", "Week02_2017", "Week03_2017", "Week04_2017",
    	    	                "Week05_2017", "Week06_2017", "Week07_2017", "Week08_2017", "Week09_2017", "Week10_2017",
    	    	                "Week11_2017", "Week12_2017", "Week13_2017", "Week14_2017", "Week15_2017", "Week16_2017",
    	    	                "Week17_2017", "Week18_2017"
    	    	            ],
    	    	            datasets: [{
    	    	                    label: 'Past Forecast',
    	    	                    data: $scope.pastforecast1,
    	    	                    borderWidth: 1,
    	    	                    borderColor: "#f4d142",
    	    	                    fill: false
    	    	                },
    	    	                {
    	    	                    label: 'Past Sales',
    	    	                    data: $scope.pastsales1,
    	    	                    borderWidth: 1,
    	    	                    borderColor: "#ef405a",
    	    	                    yAxisID: 0,
    	    	                    fill: false
    	    	                }
    	    	            ]
    	    	        },
    	    	        options: {
        	    	        scales: {
        	    	              xAxes: [{
        	    	                  stacked: false,
        	    	                  ticks: {
        	    	                      fontColor: "#b5b3af"
        	    	                  }
        	    	              }],
        	    	              yAxes: [{
        	    	                  stacked: false,
        	    	                  ticks: {
        	    	                      fontColor: "#b5b3af"
        	    	                  }
        	    	              }]
        	    	          },
        	    	          legend: {
        	    	              display: true,
        	    	              labels: {
        	    	                  fontColor: 'rgb(255, 99, 132)'
        	    	              }
        	    	          },
        	    	          labels: {
        	    	              fontColor: "#b5b3af"
        	    	           },
        	    	          title: {
        	    	              display: true,
        	    	              text: 'Forecast vs Sales'
        	    	          }
      	    	        }
    	    	    }
    	    	
    	    	// console.log('Option data
				// '+JSON.stringify(options.data.datasets[1].data));

    	    	    var ctx = document.getElementById('chart3').getContext('2d');
    	    	    new Chart(ctx, options);
    	    }, function(reason){
    	    	
    	    });
    };
    
    $http.get("http://localhost:8001/skuLocation")
    .then(function(response){
    	var s= document.getElementById("skulocationid");
    	var s1= document.getElementById("skulocationcode");
    	var k=0;
    	var skulocation="";
    	for (var i in response.data) {
    		// console.log('response.data[i] '+response.data[i]);
    		if(k<1){
    			skulocation=response.data[i];
    			k++;
    		}
    		
    	    $('<option />', {value: response.data[i], text: response.data[i]}).appendTo(s);
    	    $('<option />', {value: response.data[i], text: response.data[i]}).appendTo(s1);
    	}
    	$http.get("http://localhost:8001/dashboard1/"+skulocation)
        .then(function(response){
        	var data = response.data;
        	$scope.max_stock1 = data.max_stock;
        	$scope.min_stock1= data.min_stock;
        	$scope.avg_stock1= data.avg_stock;
        	$scope.safety_stock1 = data.safety_stock;
        	$scope.service_target1 = data.service_target;
        	$scope.lead_time1 = data.lead_time;
        }, function(reason){
        	
        });
    	
    	
    	$http.get("http://localhost:8001/pastsales/"+skulocation)
        .then(function(response){
        	var data = response.data;
        	$scope.pastsales1=[data[0].week35_2016,
        		data[0].week36_2016,
        		data[0].week37_2016,
        		data[0].week38_2016,
        		data[0].week39_2016,
        		data[0].week40_2016,
        		data[0].week41_2016,
        		data[0].week42_2016,
        		data[0].week43_2016,
        		data[0].week44_2016,
        		data[0].week45_2016,
        		data[0].week46_2016,
        		data[0].week47_2016,
        		data[0].week48_2016,
        		data[0].week49_2016,
        		data[0].week50_2016,
        		data[0].week51_2016,
        		data[0].week52_2016,
        		data[0].week01_2017,
        		data[0].week02_2017,
        		data[0].week03_2017,
        		data[0].week04_2017,
        		data[0].week05_2017,
        		data[0].week06_2017,
        		data[0].week07_2017,
        		data[0].week08_2017,
        		data[0].week09_2017,
        		data[0].week10_2017,
        		data[0].week11_2017,
        		data[0].week12_2017,
        		data[0].week13_2017,
        		data[0].week14_2017,
        		data[0].week15_2017,
        		data[0].week16_2017,
        		data[0].week17_2017,
        		data[0].week18_2017];
        	$http.get("http://localhost:8001/pastforecast/"+skulocation)
    	    .then(function(response){
    	    	var data = response.data;
    	    	$scope.pastforecast1= [data[0].week35_2016,
    	    		data[0].week36_2016,
    	    		data[0].week37_2016,
    	    		data[0].week38_2016,
    	    		data[0].week39_2016,
    	    		data[0].week40_2016,
    	    		data[0].week41_2016,
    	    		data[0].week42_2016,
    	    		data[0].week43_2016,
    	    		data[0].week44_2016,
    	    		data[0].week45_2016,
    	    		data[0].week46_2016,
    	    		data[0].week47_2016,
    	    		data[0].week48_2016,
    	    		data[0].week49_2016,
    	    		data[0].week50_2016,
    	    		data[0].week51_2016,
    	    		data[0].week52_2016,
    	    		data[0].week01_2017,
    	    		data[0].week02_2017,
    	    		data[0].week03_2017,
    	    		data[0].week04_2017,
    	    		data[0].week05_2017,
    	    		data[0].week06_2017,
    	    		data[0].week07_2017,
    	    		data[0].week08_2017,
    	    		data[0].week09_2017,
    	    		data[0].week10_2017,
    	    		data[0].week11_2017,
    	    		data[0].week12_2017,
    	    		data[0].week13_2017,
    	    		data[0].week14_2017,
    	    		data[0].week15_2017,
    	    		data[0].week16_2017,
    	    		data[0].week17_2017,
    	    		data[0].week18_2017];
    	    	
       	    	var options = {
    	    	        type: 'line',
    	    	        scales: {
    	    	              xAxes: [{
    	    	                  stacked: true
    	    	              }],
    	    	              yAxes: [{
    	    	                  stacked: true
    	    	              }]
    	    	          },
    	    	          legend: {
    	    	              display: true,
    	    	              labels: {
    	    	                  fontColor: 'rgb(255, 99, 132)'
    	    	              }
    	    	          },
    	    	          title: {
    	    	              display: true,
    	    	              text: 'Forecast vs Sales'
    	    	          },

    	    	        data: {
    	    	            labels: ["Week35_2016", "Week36_2016", "Week37_2016", "Week38_2016",
    	    	                "Week39_2016", "Week40_2016", "Week41_2016", "Week42_2016", "Week43_2016", "Week44_2016",
    	    	                "Week45_2016", "Week46_2016", "Week47_2016", "Week48_2016", "Week49_2016", "Week50_2016",
    	    	                "Week51_2016", "Week52_2016", "Week01_2017", "Week02_2017", "Week03_2017", "Week04_2017",
    	    	                "Week05_2017", "Week06_2017", "Week07_2017", "Week08_2017", "Week09_2017", "Week10_2017",
    	    	                "Week11_2017", "Week12_2017", "Week13_2017", "Week14_2017", "Week15_2017", "Week16_2017",
    	    	                "Week17_2017", "Week18_2017"
    	    	            ],
    	    	            datasets: [{
    	    	                    label: 'Past Forecast',
    	    	                    data: $scope.pastforecast1,
    	    	                    borderWidth: 1,
    	    	                    borderColor: "#f4d142",
    	    	                    fill: false
    	    	                },
    	    	                {
    	    	                    label: 'Past Sales',
    	    	                    data: $scope.pastsales1,
    	    	                    borderWidth: 1,
    	    	                    borderColor: "#ef405a",
    	    	                    yAxisID: 0,
    	    	                    fill: false
    	    	                }
    	    	            ]
    	    	        },
    	    	        options: {
        	    	        scales: {
        	    	              xAxes: [{
        	    	                  stacked: false,
        	    	                  ticks: {
        	    	                      fontColor: "#b5b3af"
        	    	                  }
        	    	              }],
        	    	              yAxes: [{
        	    	                  stacked: false,
        	    	                  ticks: {
        	    	                      fontColor: "#b5b3af"
        	    	                  }
        	    	              }]
        	    	          },
        	    	          legend: {
        	    	              display: true,
        	    	              labels: {
        	    	                  fontColor: 'rgb(255, 99, 132)'
        	    	              }
        	    	          },
        	    	          labels: {
        	    	              fontColor: "#b5b3af"
        	    	           },
        	    	          title: {
        	    	              display: true,
        	    	              text: 'Forecast vs Sales'
        	    	          }
      	    	        }
    	    	    }
    	    	
    	    	// console.log('Option data
				// '+JSON.stringify(options.data.datasets[1].data));

    	    	    var ctx = document.getElementById('chart3').getContext('2d');
    	    	    new Chart(ctx, options);
    	    }, function(reason){
    	    	
    	    });
        }, function(reason){
        	
        });
    	
    	 
    }, function(reason){
    	
    });
    
   
    if ($rootScope.role != 'Planner') {
        url = 'http://localhost:8001/inputrepo';
    } else {
        url = 'http://localhost:8001/inputrepo';// /user/' + $rootScope.user;
    }
	var httpPromise = $http.get(url);
    $scope.filterAgentStatus = function($column) {
		var def = $q.defer(),
			arr = [],
			filterAgentStatus = [];
		if($rootScope.input && $rootScope.input!=null){
			angular.forEach($rootScope.input, function(item) {
       		 var attrb=Object.keys($column.filter)[0];
       		// console.log("test "+attrb+" "+JSON.stringify(item[attrb]));
       			
       if (jQuery.inArray(item[attrb], arr) === -1) {
       	
           arr.push(item[attrb]);
			filterAgentStatus.push({
				'id': item[attrb],
				'title': item[attrb]
			});
		}
	});
			def.resolve(filterAgentStatus);
		}else{
			httpPromise
             .then(function(res) {
            	 $rootScope.input=res.data;
            	 
            	 angular.forEach(res.data, function(item) {
            		 // console.log('Kannan '+JSON.stringify(item));
            		 var attrb=Object.keys($column.filter)[0];
            	// console.log("test "+attrb+" "+JSON.stringify(item[attrb]));
            			
            if (jQuery.inArray(item[attrb], arr) === -1) {
            	
                arr.push(item[attrb]);
				filterAgentStatus.push({
					'id': item[attrb],
					'title': item[attrb]
				});
			}
		});
		def.resolve(filterAgentStatus);
		}, function(reason){
			def.reject();
		});
		}
		return def;
	};
	
	$scope.tableParams1 = new ngTableParams({
        page: 1,
        count: 10,
    }, {
        getData: function ($defer, params) {
            var page = params.page()-1;
            var size = params.count();
            
        // var url = 'http://localhost:8001/inputrepo';
            
            
            
            $http.get('http://localhost:8001/inputrepo?page='+page+'&size='+size)
            .then(function(response, status) {
            	var data = response.data;
                	 $rootScope.input=data._embedded.inputrepo;
                    params.total(data.page.totalElements);
                    $scope.data = params.sorting() ? $filter('orderBy')($rootScope.input, params.orderBy()) : $rootScope.input;
					$scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
				// $scope.data = $scope.data.slice((params.page() - 1) *
				// params.count(), params.page() * params.count());
                    $defer.resolve($scope.data);
                }, function(reason) {
                    $defer.reject();
                }
            );
            
        }
    });
	 
	$scope.tableParams2 = new ngTableParams({
        page: 1,
        count: 10,
    }, {
        getData: function ($defer, params) {
            var page = params.page()-1;
            var size = params.count();
            
            $http.get('http://localhost:8001/inputrepo?page='+page+'&size='+size)
            .then(function(response, status) {
            	var data = response.data;
                	 $rootScope.input=data._embedded.inputrepo;
                    params.total(data.page.totalElements);
                    $scope.data = params.sorting() ? $filter('orderBy')($rootScope.input, params.orderBy()) : $rootScope.input;
					$scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
				// $scope.data = $scope.data.slice((params.page() - 1) *
				// params.count(), params.page() * params.count());
                    $defer.resolve($scope.data);
                }, function(reason) {
                    $defer.reject();
                }
            );
            
        }
    });
	    
	
	$scope.tableParams = new ngTableParams({
        page: 1,
        count: 10,
    }, {
        getData: function ($defer, params) {
            var page = params.page()-1;
            var size = params.count();
            
            $http.get('http://localhost:8001/inputrepo?page='+page+'&size='+size)
            .then(function(response, status) {
            	var data = response.data;
                	 $rootScope.input=data._embedded.inputrepo;
                    params.total(data.page.totalElements);
                    $scope.data = params.sorting() ? $filter('orderBy')($rootScope.input, params.orderBy()) : $rootScope.input;
					$scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
				// $scope.data = $scope.data.slice((params.page() - 1) *
				// params.count(), params.page() * params.count());
                    $defer.resolve($scope.data);
                }, function(reason) {
                    $defer.reject();
                }
            );
            
        }
    });    

});