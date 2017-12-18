'use strict';

angular.module('TechathonApp').factory('IdeaReportCountByUserRole', function($resource, serviceurl) {
	return $resource(serviceurl+'ideareport/count/user/:userId/role/:role', {
		user :'@userId',
		role : '@role'		
	}, {		
		'query' : {
			method : 'GET',
			isArray : true
		}
	});
});

angular.module('TechathonApp').factory('IdeaReportCountByUserLocation', function($resource, serviceurl) {
	return $resource(serviceurl+'ideareport/count/user/:userId/location/:role', {
		user :'@userId',
		location : '@role'		
	}, {		
		'query' : {
			method : 'GET',
			isArray : true
		}
	});
});

angular.module('TechathonApp').factory('PublishPreFinalResultService', function($resource, serviceurl) {
	return $resource(serviceurl+'idea/releaseprefinalresult/:status', { status : '@status'}, {
		'create' : {
			method : 'POST'
		}
	});
});