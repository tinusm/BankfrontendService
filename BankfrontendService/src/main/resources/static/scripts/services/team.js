'use strict';


angular.module('TechathonApp').factory('TeamService', function($resource, serviceurl) {
	return $resource(serviceurl+'team/:id', {
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

angular.module('TechathonApp').factory('TeamCreateService', function($resource, serviceurl) {
	return $resource(serviceurl+'team/create', {}, {
		'create' : {
			method : 'POST'
		}
	});
});

angular.module('TechathonApp').factory('TeamByUserService', function($resource, serviceurl) {
	return $resource(serviceurl+'team/byuser/:id', {
		id : '@id'
	}, {
		'get' : {
			method : 'GET'
		}
	});
});



angular.module('TechathonApp').factory('TeamMembersAllService', function($resource, serviceurl) {
	return $resource(serviceurl+'team/:id/membersall', {
		id : '@id'
	}, {		
		'query' : {
			method : 'GET',
			isArray : true
		}
	});
});

angular.module('TechathonApp').factory('TeamMemberRemoveService', function($resource, serviceurl) {
	return $resource(serviceurl+'team/:id/member/:memberId', {
		id :'@id',
		memberId : '@memberId'
	}, {
		'remove' : {
			method : 'DELETE'
		}
	});
});

angular.module('TechathonApp').factory('TeamMemberSelfRemoveService', function($resource, serviceurl) {
	return $resource(serviceurl+'team/:id/selfmember/:memberId', {
		id :'@id',
		memberId : '@memberId'
	}, {
		'remove' : {
			method : 'DELETE'
		}
	});
});

angular.module('TechathonApp').factory('TeamMemberLeadService', function($resource, serviceurl) {
	return $resource(serviceurl+'team/:id/user/:userId/makelead', {
		id :'@id',
		userId : '@userId'
	}, {
		'update' : {
			method : 'PUT'
		}
	});
});

angular.module('TechathonApp').factory('TeamRequestCreateService', function($resource, serviceurl) {
	return $resource(serviceurl+'teamrequest/create', {}, {
		'create' : {
			method : 'POST'
		}
	});
});

angular.module('TechathonApp').factory('TeamRequestService', function($resource, serviceurl) {
	return $resource(serviceurl+'teamrequest/:id', {
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

angular.module('TechathonApp').factory('TeamIdeaService', function($resource, serviceurl) {
	return $resource(serviceurl+'team/:id/ideas', {
		id : '@id'
	}, {		
		'query' : {
			method : 'GET',
			isArray : true
		}
	});
});

angular.module('TechathonApp').factory('TeamIdeaPriorityService', function($resource, serviceurl) {
	return $resource(serviceurl+'idea/updatepriorites', {}, {
		'update' : {
			method : 'PUT'
		}
	});
});


angular.module('TechathonApp').factory('TeamHistoryCreateService', function($resource, serviceurl) {
	return $resource(serviceurl+'team/history/create', {}, {
		'create' : {
			method : 'POST'
		}
	});
});

angular.module('TechathonApp').factory('TeamHistoryService', function($resource, serviceurl) {
	return $resource(serviceurl+'team/history/:id', {
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

angular.module('TechathonApp').factory('TeamHistoryByTeamService', function($resource, serviceurl) {
	return $resource(serviceurl+'team/:id/histories', {
		id : '@id'
	}, {		
		'query' : {
			method : 'GET',
			isArray : true
		}
	});
});


angular.module('TechathonApp').factory('TeamByRegistrationUserService', function($resource, serviceurl) {
	return $resource(serviceurl+'team/byregistrationuser/:id', {
		id : '@id'
	}, {		
		'query' : {
			method : 'GET',
			isArray : false
		}
	});
});

angular.module('TechathonApp').factory('TeamAttendanceService', function($resource, serviceurl) {
	return $resource(serviceurl+'team/attendence/by/:by/location/:location', {
		by : '@by',
		location : '@location'
	}, {		
		'update' : {
			method : 'PUT'
		}
	});
});


angular.module('TechathonApp').factory('UserAttendanceService', function($resource, serviceurl) {
	return $resource(serviceurl+'attendance/by/:by/location/:location', {
		by : '@by',
		location : '@location'
	}, {		
		'update' : {
			method : 'PUT'
		}
	});
});
