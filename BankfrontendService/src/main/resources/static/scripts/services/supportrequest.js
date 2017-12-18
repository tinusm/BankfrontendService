'use strict';

angular.module('TechathonApp').factory('SupportRequestService', function($resource, serviceurl) {
	return $resource(serviceurl+'supportrequest/:id', {
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

angular.module('TechathonApp').factory('SupportRequestCreateService', function($resource, serviceurl) {
	return $resource(serviceurl+'supportrequest/create', {}, {
		'create' : {
			method : 'POST'
		}
	});
});

angular.module('TechathonApp').factory('SupportRequestQueryService', function($resource, serviceurl) {
	return $resource(serviceurl+'supportrequest/:type/:id', {
		type : '@type',
		id : '@id'
	}, {		
		'query' : {
			method : 'GET',
			isArray : true
		}
	});
});