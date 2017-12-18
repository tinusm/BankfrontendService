'use strict';


angular.module('TechathonApp').factory('UserAcceptService', function($resource, serviceurl) {
	return $resource(serviceurl+'user/accept', {}, {		
		'update' : {
			method : 'PUT'
		}
	});
});


angular.module('TechathonApp').factory('UserSearchService', function($resource, serviceurl) {
	return $resource(serviceurl+'user/search/:filter', {
		filter : '@filter'
	}, {		
		'query' : {
			method : 'GET',
			isArray : true
		}
	});
});




angular.module('TechathonApp').factory('TeamRequestProcessService', function($resource, serviceurl) {
	return $resource(serviceurl+'teamrequest/:action/:id', {
		action : '@action',
		id : '@id'
	}, {
		'get' : {
			method : 'GET'
		},
		'query' : {
			method : 'GET',
			isArray : true
		}
	});
});

angular.module('TechathonApp').factory('LocationService', function($resource, serviceurl) {
	return $resource(serviceurl+'location', {}, {		
		'query' : {
			method : 'GET',
			isArray : true
		}
	});
});
