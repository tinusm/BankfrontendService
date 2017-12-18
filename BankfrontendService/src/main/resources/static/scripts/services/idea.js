'use strict';


angular.module('TechathonApp').factory('IdeaCreateService', function($resource, serviceurl) {
	return $resource(serviceurl+'team/:teamId/idea/create', {teamId : '@teamId'}, {
		'create' : {
			method : 'POST'
		}
	});
});

angular.module('TechathonApp').factory('IdeaService', function($resource, serviceurl) {
	return $resource(serviceurl+'idea/:id', {
		id : '@id'
	}, {
		'get' : {
			method : 'GET'
		},
		'create' : {
			method : 'POST'
		},
		'query' : {
			method : 'GET',
			isArray : true
		},
		'update' : {
			method : 'PUT'
		},
		'remove' : {
			method : 'DELETE'
		}
	});
});

angular.module('TechathonApp').factory('IdeaUpdateAtEvaluationService', function($resource, serviceurl) {
	return $resource(serviceurl+'idea/:id/updateatevaluation', {
		id : '@id'
	}, {
		
		'update' : {
			method : 'PUT'
		}
	});
});

angular.module('TechathonApp').factory('IdeaHistoryQueryService', function($resource, serviceurl) {
	return $resource(serviceurl+'idea/:id/history', {
		id : '@id'
	}, {		
		'query' : {
			method : 'GET',
			isArray : true
		}
	});
});

angular.module('TechathonApp').factory('IdeaUserRoleStatusService', function($resource, serviceurl) {
	return $resource(serviceurl+'idea/user/:userId/role/:role/status/:status', {
		userId : '@userId',
		role : '@role',
		status : '@status'
	}, {		
		'query' : {
			method : 'GET',
			isArray : true
		}
	});
});

angular.module('TechathonApp').factory('ThemeService', function($resource, serviceurl) {
	return $resource(serviceurl+'theme/:id', {
		id : '@id'
	}, {
		'get' : {
			method : 'GET'
		},
		'create' : {
			method : 'POST'
		},
		'query' : {
			method : 'GET',
			isArray : true
		},
		'update' : {
			method : 'PUT'
		},
		'remove' : {
			method : 'DELETE'
		}
	});
});

angular.module('TechathonApp').factory('SubThemeService', function($resource, serviceurl) {
	return $resource(serviceurl+'subtheme/:id', {
		id : '@id'
	}, {
		'get' : {
			method : 'GET'
		},
		'create' : {
			method : 'POST'
		},
		'query' : {
			method : 'GET',
			isArray : true
		},
		'update' : {
			method : 'PUT'
		},
		'remove' : {
			method : 'DELETE'
		}
	});
});

angular.module('TechathonApp').factory('FileDeleteService', function($resource, serviceurl) {
	return $resource(serviceurl+'file/:type/:id', {type : '@type', id : '@id'}, {
		'remove' : {
			method : 'DELETE'
		}
	});
});

angular.module('TechathonApp').factory('IdeaSubmitService', function($resource, serviceurl) {
	return $resource(serviceurl+'idea/:id/submit', {id : '@id'}, {
		'update' : {
			method : 'PUT'
		}
	});
});

angular.module('TechathonApp').factory('IdeaReCallService', function($resource, serviceurl) {
	return $resource(serviceurl+'idea/:id/recall', {id : '@id'}, {
		'update' : {
			method : 'PUT'
		}
	});
});

/*

angular.module('TechathonApp').factory('IdeaValidateService', function($resource, serviceurl) {
	return $resource(serviceurl+'idea/validate/:taskId', {taskId : '@taskId'}, {
		'create' : {
			method : 'POST'
		}
	});
});


angular.module('TechathonApp').factory('IdeaPreFinalService', function($resource, serviceurl) {
	return $resource(serviceurl+'idea/prefinal/:taskId', {taskId : '@taskId'}, {
		'create' : {
			method : 'POST'
		}
	});
});
*/
angular.module('TechathonApp').factory('IdeaAssignReviewerService', function($resource, serviceurl) {
	return $resource(serviceurl+'idea/{ideaId}/assignreviewer', {ideaId : '@ideaId'}, {
		'create' : {
			method : 'POST'
		}
	});
});

angular.module('TechathonApp').factory('IdeaEvaluationService', function($resource, serviceurl) {
	return $resource(serviceurl+'idea/{ideaId}/evaluation', {ideaId : '@ideaId'}, {
		'create' : {
			method : 'POST'
		}
	});
});










angular.module('TechathonApp').factory('FileUploadService', function($http, serviceurl) {	
	this.uplaodFile = function (file) {
		var uploadUrl = serviceurl+'user/login';
		console.log('Trying to send file to '+uploadUrl);
		var fd = new FormData();
		fd.append('file', file);
		return $http.post(uploadUrl, fd, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		}).then(function (res) {
			return res;
		});
	};
});

angular.module('TechathonApp').service('fileUpload', ['$http', function ($http) {
	this.uploadFileToUrl = function(file, uploadUrl){
		var fd = new FormData();
		fd.append('file', file);
		$http.post(uploadUrl, fd, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		})
		.success(function(){
		})
		.error(function(){
		});
	};
}]);