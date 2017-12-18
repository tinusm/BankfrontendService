var app = angular.module('TechathonApp', [                                                
                                          "ngResource", 
                                          "ui.bootstrap", "ngIdle",
                                          "ngSanitize",
                                          "ngRoute", "ngTable", "ngTableExport", "ngAnimate", "growlNotifications",
                                          "angularFileUpload", "googlechart", "checklist-model"
                                          ]);
app.constant('serviceurl','http://localhost:8080/techathonapi1/');
//app.constant('serviceurl','https://inmbzp5166.in.dst.ibm.com:8443/techathonapi1/');

app.config(function($routeProvider, $locationProvider) {
	//$routeProvider.when('/home',          {templateUrl: "views/home.html?id=20150715"});  
	$routeProvider.when('/home',          {templateUrl: "views/signin.html?id=20150715"});  
	$routeProvider.when('/login',          {templateUrl: "views/signin.html?id=20150715"});  
	$routeProvider.when('/registrationstepone',          {templateUrl: "views/registrationstepone.html?id=20150715"});
	$routeProvider.when('/registrationsteptwo',          {templateUrl: "views/registrationsteptwo.html?id=20150715"});
	$routeProvider.when('/team',          {templateUrl: "views/team.html?id=20150715"});
	$routeProvider.when('/idea',          {templateUrl: "views/idea.html?id=20150715"});
	$routeProvider.when('/ideaview',          {templateUrl: "views/ideaview.html?id=20150715"});

	$routeProvider.when('/skillsetrequest',          {templateUrl: "views/skillsetrequest.html?id=20150715"});
	$routeProvider.when('/skillsetquery',          {templateUrl: "views/skillsetquery.html?id=20150715"});
	$routeProvider.when('/supportrequest',          {templateUrl: "views/supportrequest.html?id=20150715"});
	$routeProvider.when('/inbox/:role',          {templateUrl: "views/inbox.html?id=20150715"});
	$routeProvider.when('/role',          {templateUrl: "views/role.html?id=20150715"});
	$routeProvider.when('/report',          {templateUrl: "views/report.html?id=20150715"});
	$routeProvider.when('/manage',          {templateUrl: "views/manage.html?id=20150715"});
	$routeProvider.when('/evaluation',          {templateUrl: "views/evaluation.html?id=20150715"});
	$routeProvider.when('/schedule',          {templateUrl: "views/schedule.html?id=20150715"});
	$routeProvider.when('/eventregistration',          {templateUrl: "views/eventregistration.html?id=20150715"});	
	$routeProvider.otherwise({ redirectTo: '/home'});
});


app.constant('AUTH_EVENTS', {
	loginSuccess: 'auth-login-success',
	loginFailed: 'auth-login-failed',
	logoutSuccess: 'auth-logout-success',
	sessionTimeout: 'auth-session-timeout',
	notAuthenticated: 'auth-not-authenticated',
	notAuthorized: 'auth-not-authorized'
});


app.constant('APP_CONSTANTS', {

	NAV_HOME : "/home",
	NAV_REG1 :"/registrationstepone",
	NAV_REG2 :"/registrationsteptwo",
	NAV_TEAM :"/team",
	NAV_IDEA :"/idea",
	NAV_SKILL_REQUEST :"/skillsetrequest",
	NAV_SUPPORT_REQUEST :"/supportrequest",
	NAV_INBOX :"/inbox",
	NAV_EVALUATION :"/evaluation",
	NAV_SKILL_QUERY :"/skillsetquery",
	NAV_USSAGE :"/ussage",
	NAV_EVENT_REGISTRATION : "/eventregistration",

	TEAM_ROLE_LEAD : "Lead",
	TEAM_ROLE_MEMBER : "Member",

	USER_ROLE_MEMBER : "Member",
	USER_ROLE_ADMIN : "Admin",
	USER_ROLE_PMO : "PMO",
	USER_ROLE_LEAD_SPOC : "SPOC",
	USER_ROLE_LEAD_JURY : "Lead Jury",
	USER_ROLE_REVIEWER : "Reviewer",
	USER_ROLE_SYSTEM : "System",
	USER_ROLE_REG_ADMIN : "Registration Admin",
	USER_ROLE_ADVISORY : "Advisory",

	TEAMREQUEST_STATUS_ACCEPTANCE_REQUESTED : "Requested",
	TEAMREQUEST_STATUS_ACCEPTANCE_PENDING : "Acceptance Pending",
	TEAMREQUEST_STATUS_ACCEPTED : "Accepted",
	TEAMREQUEST_STATUS_DECLINE : "DECLINE",

	IDEA_STATUS_DRAFT : "Draft",	
	IDEA_STATUS_SUBMITTED :"Submitted",
	IDEA_STATUS_READY_FOR_REVIEW : "Ready for Review",
	IDEA_STATUS_UNDER_REVIEW : "Under Review",
	IDEA_STATUS_REWORK : "Re-Work",
	IDEA_STATUS_REVIEW_COMPLETED : "Review Completed",
	IDEA_STATUS_SELECTED : "Selected",
	IDEA_STATUS_REJECTED : "Rejected",
	IDEA_STATUS_NOT_PREFERED : "Not Prefered",
	IDEA_STATUS_INCOMPLETE : "Incomplete",
	IDEA_STATUS_ARCHIVED : "Archived",
	IDEA_STATUS_P2_DRAFT : "P2 Draft",	
	IDEA_STATUS_P2_SUBMITTED :"P2 Submitted",
	IDEA_STATUS_P2_INCOMPLETE : "P2 Incomplete",
	IDEA_STATUS_P2_READY_FOR_REVIEW : "P2 Ready for Review",
	IDEA_STATUS_P2_UNDER_REVIEW : "P2 Under Review",
	IDEA_STATUS_P2_REVIEW_COMPLETED :"P2 Review Completed",
	IDEA_STATUS_P2_SELECTED :"P2 Selected",
	IDEA_STATUS_P2_REJECTED :"P2 Rejected",

	IDEA_ACTION_DELIGATE : 'Deligate',
	IDEA_ACTION_CONFORM : 'Conform',

	TASK_TYPE_VALIDATION : "Validation",
	TASK_TYPE_ASSIGNMENT : "Assignment",
	TASK_TYPE_ASSESSMENT : "Assessment",
	TASK_TYPE_PRE_FINAL : "Pre-Final",
	TASK_TYPE_P2_VALIDATION : "P2 Validation",
	TASK_TYPE_P2_ASSIGNMENT : "P2 Assignment",
	TASK_TYPE_P2_ASSESSMENT : "P2 Assessment",

	TASK_STATUS_ALL : "All",
	TASK_STATUS_OPENED : "Opened",
	TASK_STATUS_INPROGRESS : "In-Progress",
	TASK_STATUS_CLOSED : "Closed",
	TASK_STATUS_REWORK : "Re-Work",

	EVALUATION_STATUS_APPROVE : "Approve",
	EVALUATION_STATUS_INCOMPLETE : "Incomplete",
	EVALUATION_STATUS_REWORK : "Re-Work",

	SKILLSET_REQUEST_COUNT : 5,
	SKILLSET_STATUS_POST : "Open",
	SKILLSET_STATUS_RECEIVED_DROP : "Closed",
	SKILLSET_STATUS_DONOT_NEED_DROP : "Cancelled",

	TEAM_MEMBER_MAX_COUNT : 5,
	IDEA_MAX_COUNT : 10, 
	IDEA_DOCUMENT_MAX_COUNT : 2,
	EVALUATOR_COUNT : 2
});

app.constant('APP_DATA', {
	expertTypes : ['Both','Business','Technical'],
	industries : ['Cross-Industry','Communication: Energy & Utilities','Communication: Media & Entertainment',
	              'Communication: Telcommunication','Distribution: Consumer & Packaged Goods','Distribution: Pharma & LifeSciences',
	              'Distribution: Retail','Distribution: Travel & Transportation','Financial Services: Banking','Financial Services: Financial Market',
	              'Financial Services: Insurance','Industrial: Aerospace & Defense','Industrial: Automotive','Industrial: Chemicals & Petroleum',
	              'Industrial: Electronics','Industrial: Industrial Products','Public: Government & Education','Public: Healthcare'],
	           
	industries_b : ['Cross-Industry','Communication: Energy & Utilities','Communication: Media & Entertainment',
	          	              'Communication: Telcommunication','Distribution: Consumer & Packaged Goods','Distribution: Pharma & LifeSciences',
	          	              'Distribution: Retail','Distribution: Travel & Transportation','Financial Services: Banking','Financial Services: Financial Market',
	          	              'Financial Services: Insurance','Industrial: Aerospace & Defense','Industrial: Automotive','Industrial: Chemicals & Petroleum',
	          	              'Industrial: Electronics','Industrial: Industrial Products','Public: Government & Education','Public: Healthcare', 'IGA'],
	              
  typeOfApis : ['Private/ Internal','Protected/ Open to Partner','Public/ Open to all'],
  devEnvs : ['Client provided','IBM Bluemix'],
  realizationApis : ['REST(JSON/XML)','SOAP(XML)','RMI', 'Stored Procedure','WebSocket','Javascripts', 'ASP.NET Web', 'PHP', 'Others'],
  critera :{
	  businessOptions : [{value : 1, name : '1-API can reduce TCO'}, 
	                     {value : 3, name : '3-API can introduce new revenue stream'}, 
	                     {value : 5, name : '5-API can create new business model'}],
      operationOptions :  [{value : 1, name : '1-API can increase Operational efficiency / Speed to market'}, 
                          {value : 3, name : '3-API can improve Customer Experience'}, 
                          {value : 5, name : '5-API can enable both of above'}],
	  itOptions :  [{value : 1, name : '1-Feasibility is low and cost of entry is high'}, 
	                {value : 3, name : '3-Feasibility is high but cost of entry is high'}, 
	                {value : 5, name : '5-Feasibility is high and cost of entry is low '}]
		  }
});

app.constant('BLUEMIX_CONSTANTS', {
	runtimes : ['Liberty for Java','SDK for Node.js', 'Runtime for Swift','ASP.NET Core','XPages','Custom buildpack'],
	watson : ['Conversation','Discovery','Language Translator','Personality Insights','Speech to Text','Text to Speech','Visual Recognition','Tone Analyser','Others'],
	mobile : ['App ID','Mobile Analytics','Mobile Application Content Manager','Push Notifications','Mobile Foundation','Others'],
	devOps : ['Availability Monitoring', 'Auto Scaling','Continuous Delivery','Delivery Pipeline','Globalization Pipeline','IBM Alert Notification','Monitoring and Analytics','Track & Plan','Others'],
	webApplication : ['Blockchain','Business Rules','Message Hub','Session Cache','Websphere Application Server','Workload Scheduler','Others'],
	integration : ['API Connect','Product Insights','Secure Gateway','Others'], 
	dataManagement : ['Cloudant No SQL DB','Apache Spark','BigInsights for Apache Hadoop','Compose for Postgre SQL','Compose for rabbitMQ','Compose for Redis','Compose for RethinkDB','dashDB for Analytics','Compose for MongoDB','Data Connect','IBM DB2 on Cloud','IBM Graph','Others'], 
	security : ['App ID','Application Security on Cloud','Single Sign on','Key Protect','Others'], 
	internetOfThings : ['Internet of Things Platform','Context Mapping','Driver Behavior','loT for Electronics','loT for Insurance','Others']

});

app.constant('USER_ROLES', {
	all: '*',
	admin: 'admin',
	teamMember: 'teamMember',
	reviewer: 'reviewer',
	juryLead: 'juryLead',
	spoc: 'spoc'
});

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

app.directive('ngReallyClick', [function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			element.bind('click', function() {
				var message = attrs.ngReallyMessage;
				if (message && confirm(message)) {
					scope.$apply(attrs.ngReallyClick);
				}
			});
		}
	};
}]);

app.run(function($rootScope, $templateCache) {
	$rootScope.$on('$routeChangeStart', function(event, next, current) {
		if (typeof(current) !== 'undefined'){
			$templateCache.remove(current.templateUrl);
		}
	});
});

app.config(['$httpProvider', function($httpProvider) {
	//initialize get if not there
	if (!$httpProvider.defaults.headers.get) {
		$httpProvider.defaults.headers.get = {};    
	}
	//disable IE ajax request caching
	$httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
}]);

/*
app.config(['$httpProvider', function($httpProvider) {
	$httpProvider.interceptors.push('noCacheInterceptor');
}]).factory('noCacheInterceptor', function () {
	return {
		request: function (config) {
			console.log(config.method);
			console.log(config.url);
			if(config.method=='GET'){
				var separator = config.url.indexOf('?') === -1 ? '?' : '&';
				config.url = config.url+separator+'noCache=' + new Date().getTime();
			}
			console.log(config.method);
			console.log(config.url);
			return config;
		}
	};
});
 */
app.directive('submitButton', function() {
	return {
		restrict: 'A',
		scope: {
			loadingText: "@",
			enableButton: "="
		},
		link: function ($scope, ele) {
			var defaultSaveText = ele.html();

			ele.bind('click', function(){
				ele.attr('disabled','disabled');
				ele.html($scope.loadingText);
			});

			$scope.$watch('enableButton', function() {
				ele.removeAttr('disabled');
				ele.html(defaultSaveText);
			});
		}
	};
});
/*
app.config(function($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
   // $httpProvider.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"};
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    delete $httpProvider.defaults.headers.common['Access-Control-Request-Headers'];
    delete $httpProvider.defaults.headers.common['Access-Control-Allow-Headers'];
});
/*

angular.module('TechathonApp').config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.timeout = 5000;
}]);
 */

/* Implementation for Duplicate Request
 * 
 angular.module('TechathonApp').config(function($provide) {
    $provide.decorator('$http', function($delegate, $q) {
        return uniqueRequestsAwareHttpService($delegate, $q);
    });
});


function uniqueRequestsAwareHttpService($http, $q) {

    var DUPLICATED_REQUEST_STATUS_CODE = 499; // I just made it up - nothing special
    var EMPTY_BODY = '';
    var EMPTY_HEADERS = {};

  // previous stuff here

    function buildRejectedRequestPromise(requestConfig) {
        var dfd = $q.defer();
        // build response for duplicated request
        var response = {data: EMPTY_BODY, headers: EMPTY_HEADERS, status: DUPLICATED_REQUEST_STATUS_CODE, config: requestConfig};
        console.info('Such request is already in progres, rejecting this one with', response);
        // reject promise with response above
        dfd.reject(response);
        return dfd.promise;
    }

    var modifiedHttpService = function(requestConfig) {
        if(checkForDuplicates(requestConfig) && checkIfDuplicated(requestConfig)) {
          // return rejected promise with response consistent with those from $http calls
            return buildRejectedRequestPromise(requestConfig);
        }
        return $http(requestConfig);
    };

    return modifiedHttpService;
}; 

 */





