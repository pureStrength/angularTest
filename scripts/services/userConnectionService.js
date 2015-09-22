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
	var userConnectionEndPoint = endPoint + 'userConnection';
	
	// Web service to find all existing connections for a user
	userConnectionService.findExisting = function(userId) {
		var defer = $q.defer();
		
		$http.get(userConnectionEndPoint + '/existingConnectionsByUser/' + userId)
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
		
		$http.get(userConnectionEndPoint + '/pendingConnectionsByUser/' + userId)
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

	userConnectionService.searchByUser = function(userId, searchText) {
		var defer = $q.defer();
		
		$http.get(userConnectionEndPoint + '/searchByUser/' + userId, {
			params: {
				"search_text": searchText
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

	userConnectionService.ConnectionAcceptRequest = function(initiatorId, receiverId) {
		var defer = $q.defer();
		
		$http.get(userConnectionEndPoint + '/acceptConnection' + 
			'?initiator_id=' + initiatorId +
			"&receiver_id=" + receiverId)
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


	userConnectionService.ConnectionDenyRequest = function(initiatorId, receiverId) {
		var defer = $q.defer();
		
		$http.get(userConnectionEndPoint + '/denyConnection' + 
			'?initiator_id=' + initiatorId +
			"&receiver_id=" + receiverId)
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

	userConnectionService.ConnectionSendRequest = function(initiatorId, receiverId) {
		var defer = $q.defer();
		
		$http.get(userConnectionEndPoint + '/requestConnection' + 
			'?initiator_id=' + initiatorId +
			"&receiver_id=" + receiverId)
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

	userConnectionService.ConnectionRemoveRequest = function(initiatorId, receiverId) {
		var defer = $q.defer();
		
		$http.get(userConnectionEndPoint + '/disconnectUsers' + 
			'?initiator_id=' + initiatorId +
			"&receiver_id=" + receiverId)
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
