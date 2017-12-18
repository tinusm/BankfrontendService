'use strict';

angular.module('TechathonApp').factory('ScheduleService', function($resource, serviceurl) {
	return $resource(serviceurl+'schedule/:id', {
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

angular.module('TechathonApp').factory('ScheduleAllService', function($resource, serviceurl) {
	return $resource(serviceurl+'schedules', {}, {		
		'query' : {
			method : 'GET',
			isArray : true
		}
	});
});

angular.module('TechathonApp').factory('SchedulesCreateService', function($resource, serviceurl) {
	return $resource(serviceurl+'schedules/create', {}, {
		'create' : {
			method : 'POST'
		}
	});
});

angular.module('TechathonApp').factory('ScheduleControlService', function($resource, serviceurl) {
	return $resource(serviceurl+'schedule/control', {}, {		
		'query' : {
			method : 'GET'
		}
	});
});