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
	var userEndPoint = endPoint + 'user';
	
	userService.register = function(user) {
		var defer = $q.defer();
		
		$http.post(userEndPoint + '/register?require_verification=' + requireVerification, user)
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
		
		$http.get(userEndPoint + '/authenticate', {
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

	userService.update = function(user) {
		var defer = $q.defer();
		
		$http.post(userEndPoint + '/' + user.id, user)
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
	
	userService.get = function(userId) {
		var defer = $q.defer();
		
		$http.get(userEndPoint + '/' + userId)
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
