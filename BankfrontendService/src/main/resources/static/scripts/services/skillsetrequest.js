'use strict';

angular.module('TechathonApp').factory('SkillsetRequestService', function($resource, serviceurl) {
	return $resource(serviceurl+'skillsetrequest/:id', {
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

angular.module('TechathonApp').factory('SkillsetRequestCreateService', function($resource, serviceurl) {
	return $resource(serviceurl+'skillsetrequest/create', {}, {
		'create' : {
			method : 'POST'
		}
	});
});

angular.module('TechathonApp').factory('SkillsetRequestQueryService', function($resource, serviceurl) {
	return $resource(serviceurl+'skillsetrequest/:type/:id', {
		type : '@type',
		id : '@id'
	}, {		
		'query' : {
			method : 'GET',
			isArray : true
		}
	});
});

angular.module('TechathonApp').factory('SkillsetRequestSearchService', function($resource, serviceurl) {
	return $resource(serviceurl+'skillsetrequestquery', {}, {		
		'query' : {
			method : 'POST',
			isArray : true
		}
	});
});