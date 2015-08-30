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
	
	// Web service to find all existing connections for a user
	userConnectionService.findExisting = function(userId) {
		var defer = $q.defer();
		
		$http.get(endPoint + 'userConnection/existingConnectionsByUser/' + userId)
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

	// Web service to find all pending connections for a user
	userConnectionService.findPending = function(userId) {
		var defer = $q.defer();
		
		$http.get(endPoint + 'userConnection/pendingConnectionsByUser/' + userId)
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
