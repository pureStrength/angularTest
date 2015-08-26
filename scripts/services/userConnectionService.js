'use strict';

/**
 * @ngdoc service
 * @name completeConceptStrength.userConnectionService
 * @description Service for the user path
 * # userConnectionService
 */
angular.module('userConnectionService', [])
  .service('userConnectionService', function ($http, $q) {

	var userConnectionService = this;
	
	userConnectionService.findExisting = function(userId) {
		var defer = $q.defer();
		
		$http.get(endPoint + 'userConnection/byUser/' + userId)
		.success(function(res, status) {
			if(status == 200) {
				defer.resolve(res);
			} else {
				defer.reject(status);
			}
		}).error(function(err, status) {
			defer.reject(status);
		})
		
		return defer.promise;
	}
	
	return userConnectionService;

});
