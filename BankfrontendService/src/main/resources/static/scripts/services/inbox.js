angular.module('TechathonApp').factory('EvaluatorService', function($resource, serviceurl) {
	return $resource(serviceurl+'evaluator/:id', {
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


angular.module('TechathonApp').factory('EvaluatorCreateService', function($resource, serviceurl) {
	return $resource(serviceurl+'evaluator/create', {}, {
		'create' : {
			method : 'POST'
		}
	});
});

angular.module('TechathonApp').factory('EvaluatorRoleDeleteService', function($resource, serviceurl) {
	return $resource(serviceurl+'evaluator/:id/role/:role', { id:'@id', role :'@role'}, {
		'remove' : {
			method : 'DELETE'
		}
	});
});

angular.module('TechathonApp').factory('EvaluatorRoleThemeDeleteService', function($resource, serviceurl) {
	return $resource(serviceurl+'evaluator/:id/role/:role/subTheme/:subTheme', { id:'@id', role :'@role', subTheme : '@subTheme'}, {
		'remove' : {
			method : 'DELETE'
		}
	});
});


angular.module('TechathonApp').factory('EvaluatorSearchService', function($resource, serviceurl) {
	return $resource(serviceurl+'evaluator/search', {}, {		
		'query' : {
			method : 'POST',
			isArray : true
		}
	});
});

angular.module('TechathonApp').factory('EvaluationTaskService', function($resource, serviceurl) {
	return $resource(serviceurl+'evaluationtask/:id', {
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



angular.module('TechathonApp').factory('ThemeByEvaluatorRoleService', function($resource, serviceurl) {
	return $resource(serviceurl+'evaluator/:id/role/:role/subthemes', {
		id : '@id',
		role : '@role'
	}, {		
		'query' : {
			method : 'GET',
			isArray : true
		}
	});
});


angular.module('TechathonApp').factory('EvaluationTaskByRoleService', function($resource, serviceurl) {
	return $resource(serviceurl+'evaluationtask/role/:role/status/:status', {
		role : '@role',
		status :'@status'
	}, {		
		'query' : {
			method : 'GET',
			isArray : true
		}
	});
});

angular.module('TechathonApp').factory('EvaluationTaskByRoleNUserService', function($resource, serviceurl) {
	return $resource(serviceurl+'evaluationtask/role/:role/user/:userId/status/:status', {
		role : '@role',
		userId : '@userId',
		status :'@status'
	}, {		
		'query' : {
			method : 'GET',
			isArray : true
		}
	});
});

angular.module('TechathonApp').factory('EvaluationTaskByTypeNIdea', function($resource, serviceurl) {
	return $resource(serviceurl+'evaluationtask/type/:type/idea/:ideaId', {
		type : '@type', 
		idea :'@ideaId'
	},{		
		'query' : {
			method : 'GET',
			isArray : true
		}
	});
});