'use strict';

/**
 * @ngdoc service
 * @name completeConceptStrength.userService
 * @description Service for the user path
 * # userService
 */
angular.module('userService', [])
  .service('userService', function ($http, $q) {

	var userService = this;
	
	userService.register = function(user) {
		var defer = $q.defer();
		
		$http.post(endPoint + 'user/register?require_verification=' + requireVerification, user)
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

	userService.authenticate = function(user) {
		var defer = $q.defer();
		
		$http.get(endPoint + 'user/authenticate', {
			params: {
				"email": user.email, 
				"password": user.password
			}
		}).success(function(res, status) {
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
	
	userService.get = function(userId) {
		var defer = $q.defer();
		
		$http.get(endPoint + 'user/' + userId)
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
	
	return userService;

});
