
angular.module('TechathonApp').service('Session', function () {
	this.create = function (sessionId, userId, userRoles) {
		this.id = sessionId;
		this.userId = userId;
		this.userRoles = userRoles;
	};
	this.destroy = function () {
		this.id = null;
		this.userId = null;
		this.userRoles = null;
	};
	return this;
});

/*
angular.module('TechathonApp').factory('AuthService', function ($http, Session, serviceurl) {
	var authService = {};
	var loginUrl = serviceurl+'user/login';
	authService.login = function (credentials) {
		return $http
		.post(loginUrl, credentials)
		.then(function (res) {
			Session.create(res.token, res.id, res.roles);
			return res;
		});
	};

	authService.isAuthenticated = function () {
		return !!Session.userId;
	};

	authService.isAuthorized = function (authorizedRoles) {
		if (!angular.isArray(authorizedRoles)) {
			authorizedRoles = [authorizedRoles];
		}
		return (authService.isAuthenticated() &&
				authorizedRoles.indexOf(Session.userRole) !== -1);
	};

	return authService;
});

 */

angular.module('TechathonApp').factory('AuthService', function($resource, serviceurl) {
	return $resource(serviceurl+'user/:action', {
		action : '@action'
	}, {
		'process' : {
			method : 'POST'
		}

	});
});

angular.module('TechathonApp').factory('SwitchRoleService', function($resource, serviceurl) {
	return $resource(serviceurl+'user/switch', {}, {
		'process' : {
			method : 'POST'
		}

	});
});

angular.module('TechathonApp').controller('LoginController', function($scope, $rootScope, $http, $location, APP_CONSTANTS, AUTH_EVENTS, AuthService, SwitchRoleService) {

	$scope.init = function(){
		$rootScope.user = {};
		$rootScope.control = {};
		$rootScope.role = undefined;
		$rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
		$rootScope.authenticated = false;
		
		$rootScope.teamEnable = false;
		$rootScope.skillsetEnable = false;
		$rootScope.ideaEnable = false;
		$rootScope.inboxEnable = false;
		$rootScope.roleEnable = false;
		$rootScope.scheduleEnable = false;
		$rootScope.reportEnable = false;
		$rootScope.manageEnable = false;
		$rootScope.registrationEnable = false;
	};

	// Hard coded for fast login
	$scope.user = {email : '',password: ''};
	//$scope.user = {email : 'brindasanth@in.ibm.com',password : '123'};

	$rootScope.displayRoles = [];
	$scope.error = undefined;

	$scope.login = function() {
		$scope.user = {
				email: $scope.user.email,
				password: $scope.user.password
		};   
		$scope.loginmessage = 'Sign-In Progress....';

		AuthService.process({action : 'login'}, $scope.user, function(response){
			if(response && response.user && response.user.id){
				console.log('Got Authentication Response');
				$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
				$rootScope.authenticated = true;
				$rootScope.user = response.user;
				$rootScope.control = response.control;
				$rootScope.role = response.defaultRole;
				$rootScope.displayRoles = response.displayRoles;
				$rootScope.teamId = response.teamId;
				$rootScope.invitationCount = response.invitationCount;
				manageMenu();
				$location.url(response.view);
			}
		}, function(error){
			$scope.error = error.data.message;
			$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
		});
		$scope.loginmessage = undefined;
	};
	
	$rootScope.switchHome = function() {
		console.log('switchHome.............');
		$rootScope.dashboardEnable = true;
		$location.url('/home');
	};
	
	$rootScope.goDashboard = function() {
		console.log('goDashboard.............');
		$rootScope.user.defaultRole = $rootScope.role;
		SwitchRoleService.process({}, $rootScope.user, function(response){
			if(response && response.defaultRole && response.view){
				$rootScope.role = response.defaultRole;
				$rootScope.teamId = response.teamId;
				$rootScope.invitationCount = response.invitationCount;
				manageMenu();
				$location.url(response.view);
			}
		}, function(error){
			console.log('Failed to switch User !');
		});
	};

	$rootScope.logout = function() {
		$scope.user = {
				id: $rootScope.user.id,
				token : $rootScope.user.token
		};   

		AuthService.process({action : 'logout'}, $scope.user, function(response){
			if(response){
				console.log('Successfully Logged out');
				$rootScope.user = {};
				$rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
				$rootScope.authenticated = false;
				$location.url('/home');
			}
		}, function(error){
			$scope.error = error.data.message;
			console.log('Failed in log-out');
		});

	};

	$rootScope.switchRole = function(role){
		if(role){
			console.log('Switching to'+ role +'Role');
			if($rootScope.role == role){
				console.log('Already in the Same Role');
			}else{
				$rootScope.user.defaultRole = role;
				console.log('Requesting Switch Service');
				SwitchRoleService.process({}, $rootScope.user, function(response){
					if(response && response.defaultRole && response.view){
						$rootScope.role = response.defaultRole;
						$rootScope.teamId = response.teamId;
						$rootScope.invitationCount = response.invitationCount;
						manageMenu();
						$location.url(response.view);
					}
				}, function(error){
					console.log('Failed to switch User !');
				});
			};
		};
	};
	
	
	
	function manageMenu(){
		if($rootScope.role == APP_CONSTANTS.USER_ROLE_ADMIN){
			$rootScope.teamEnable = false;
			$rootScope.skillsetEnable = false;
			$rootScope.ideaEnable = false;
			$rootScope.inboxEnable = true;
			$rootScope.roleEnable = true;
			$rootScope.scheduleEnable = true;
			$rootScope.reportEnable = true;
			$rootScope.manageEnable = true;
			$rootScope.registrationEnable = false;
		}else if($rootScope.role == APP_CONSTANTS.USER_ROLE_LEAD_JURY){
			$rootScope.teamEnable = false;
			$rootScope.skillsetEnable = false;
			$rootScope.ideaEnable = false;
			$rootScope.inboxEnable = true;
			$rootScope.roleEnable = true;
			$rootScope.scheduleEnable = false;
			$rootScope.reportEnable = true;
			$rootScope.manageEnable = true;
			$rootScope.registrationEnable = false;
		}else if($rootScope.role == APP_CONSTANTS.USER_ROLE_MEMBER){
			$rootScope.teamEnable = true;
			$rootScope.skillsetEnable = true;
			$rootScope.ideaEnable = true;
			$rootScope.inboxEnable = false;
			$rootScope.roleEnable = false;
			$rootScope.scheduleEnable = false;
			$rootScope.reportEnable = false;
			$rootScope.manageEnable = false;
			$rootScope.registrationEnable = false;
		}else if($rootScope.role == APP_CONSTANTS.USER_ROLE_REVIEWER){
			$rootScope.teamEnable = false;
			$rootScope.skillsetEnable = false;
			$rootScope.ideaEnable = false;
			$rootScope.inboxEnable = true;
			$rootScope.roleEnable = false;
			$rootScope.scheduleEnable = false;
			$rootScope.reportEnable = false;
			$rootScope.manageEnable = false;
			$rootScope.registrationEnable = false;
		}else if($rootScope.role == APP_CONSTANTS.USER_ROLE_REG_ADMIN){
			$rootScope.teamEnable = false;
			$rootScope.skillsetEnable = true;
			$rootScope.ideaEnable = false;
			$rootScope.inboxEnable = false;
			$rootScope.roleEnable = false;
			$rootScope.scheduleEnable = false;
			$rootScope.reportEnable = false;
			$rootScope.manageEnable = false;
			$rootScope.registrationEnable = true;
		}else if($rootScope.role == APP_CONSTANTS.USER_ROLE_ADVISORY){
			$rootScope.teamEnable = false;
			$rootScope.skillsetEnable = false;
			$rootScope.ideaEnable = false;
			$rootScope.inboxEnable = true;
			$rootScope.roleEnable = false;
			$rootScope.scheduleEnable = false;
			$rootScope.reportEnable = false;
			$rootScope.manageEnable = false;
			$rootScope.registrationEnable = false;
		}
		else{
			$rootScope.teamEnable = false;
			$rootScope.skillsetEnable = false;
			$rootScope.ideaEnable = false;
			$rootScope.inboxEnable = true;
			$rootScope.roleEnable = false;
			$rootScope.scheduleEnable = false;
			$rootScope.reportEnable = true;
			$rootScope.manageEnable = true;
			$rootScope.registrationEnable = false;
		}
	}

	/*
	$rootScope.switchRole = function(role){
		if(role){
			if($rootScope.role == role){
				console.log('Already in the Same Role');
			}else{
				$rootScope.role = role;
				$location.url('/inbox/'+role);
			}
		};

	};
	 */

});



angular.module('TechathonApp').controller('LogoutController', function($scope, $rootScope, $http, $location, AUTH_EVENTS, AuthService) {
	$scope.user = {};
	$rootScope.logout = function() {
		$scope.user = {
				email: $scope.user.email,
		};   

		AuthService.process({action : 'logout'}, $scope.user, function(response){
			if(response){
				console.log('Successfully Logged out');
				$rootScope.user = {};
				$rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
				$rootScope.authenticated = false;
				$location.url('/home');
			}
		}, function(error){
			console.log('Failed in log-out');
		});

	};

});