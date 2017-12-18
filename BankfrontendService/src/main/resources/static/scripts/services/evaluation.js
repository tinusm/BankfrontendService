'use strict';

angular.module('TechathonApp').factory('IdeaEvaluationService', function($resource, serviceurl) {
	// action should be validate or final
	return $resource(serviceurl+'idea/:action/:evaluationTaskId', {action:'@action', evaluationTaskId : '@evaluationTaskId'}, {
		'create' : {
			method : 'POST'
		}
	});
});


angular.module('TechathonApp').factory('IdeaEvaluationDeligateService', function($resource, serviceurl) {
	return $resource(serviceurl+'idea/deligate/:evaluationId/user/:userId/role/:role', { 
		evaluationId : '@evaluationId', 
		userId :'@userId', 
		role : '@role'}, 
		{
			'update' : {
				method : 'PUT'
			}
		});
});


angular.module('TechathonApp').factory('IdeaEvaluationReAssignServiceAlt', function($resource, serviceurl) {
	return $resource(serviceurl+'idea/reassign/:evaluationId/user/:userId/role/:role', { 
		evaluationId : '@evaluationId', 
		userId :'@userId', 
		role : '@role'}, 
		{
			'update' : {
				method : 'PUT'
			}
		});
});

angular.module('TechathonApp').factory('IdeaEvaluationReAssignService', function($resource, serviceurl) {
	return $resource(serviceurl+'idea/:ideaId/reassign/from/:fromUserId/to/:toUserID', { 
		ideaId : '@ideaId', 
		fromUserId :'@fromUserId', 
		toUserID : '@toUserID'}, 
		{
			'update' : {
				method : 'PUT'
			}
		});
});



angular.module('TechathonApp').factory('IdeaChangeEvaluationStatus', function($resource, serviceurl) {
	return $resource(serviceurl+'idea/evaluation/:evaluationId/status/:status', {evaluationId : '@evaluationId', status :'@status'}, {
		'update' : {
			method : 'PUT'
		}
	});
});


angular.module('TechathonApp').factory('IdeaReviewerWithAssignmentService', function($resource, serviceurl) {
	return $resource(serviceurl+'evaluator/reviewer/subTheme/:subTheme', {
		theme : '@theme'
	}, {		
		'query' : {
			method : 'GET',
			isArray : true
		}
	});
});

angular.module('TechathonApp').factory('IdeaSelectedRejectedService', function($resource, serviceurl) {
	return $resource(serviceurl+'idea/processselectedrejected/user/:userId', {userId : '@userId'}, {
		'create' : {
			method : 'POST'
		}
	});
});




