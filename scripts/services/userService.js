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
		
		// Hash the user
		var hashedUser = {};
		angular.copy(user, hashedUser);
		hashedUser = userService.hashUser(hashedUser);

		$http.post(userEndPoint + '/register?require_verification=' + requireVerification, hashedUser)
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

		// Hash the user
		var hashedUser = {};
		angular.copy(user, hashedUser);
		hashedUser = userService.hashUser(hashedUser);
		
		$http.get(userEndPoint + '/authenticate', {
			params: {
				"email": hashedUser.email, 
				"password": hashedUser.password
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

		// Hash the user
		var hashedUser = {};
		angular.copy(user, hashedUser);
		hashedUser = userService.hashUser(hashedUser);
		
		$http.post(userEndPoint + '/' + hashedUser.id, hashedUser)
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

	userService.hashUser = function(user) {

		if(user == undefined || user == null) {
			console.log("user is null");
		} else if(user.password != undefined) {
			user.password = userService.hash(user.password);
		} else {
			console.log("user password is null");
		}

		return user;
	}

	userService.hash = function(string) {
		return CryptoJS.SHA256(string);
	}
	
	return userService;

});
