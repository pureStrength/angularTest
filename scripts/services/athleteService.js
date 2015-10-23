'use strict';

/**
 * @ngdoc service
 * @name completeConceptStrength.athleteService
 * @description Service for the user path
 * # athleteService
 */
angular.module('athleteService', [])
  .service('athleteService', function ($http, $q) {

	var athleteService = this;
	var athleteEndPoint = endPoint + 'athlete';
	
	athleteService.update = function(athleteId, athleteProfile) {
		var defer = $q.defer();
		
		$http.post(athleteEndPoint + '/athleteProfile/' + athleteId, athleteProfile)
		.success(function(res, status) {
			if(status == 200) {
				defer.resolve(res);
			} else {
				defer.reject(status);
			}
		}).error(function(err, status) {
			defer.reject(err);
		})
		
		return defer.promise;
	}

	athleteService.get = function(athleteId) {
		var defer = $q.defer();
		
		$http.get(athleteEndPoint + '/athleteProfile/' + athleteId)
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
	
	return athleteService;

});
