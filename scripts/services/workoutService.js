'use strict';

/**
 * @ngdoc service
 * @name completeConceptStrength.workoutService
 * @description Service for the user path
 * # workoutService
 */
angular.module('workoutService', [])
  .service('workoutService', function ($http, $q) {

	var workoutService = this;
	var liftEndPoint = endPoint + 'mainLiftDefinition';
	var setEndPoint = endPoint + 'mainLiftSet';
	var prescriptionEndPoint = endPoint + 'prescriptionDefinition';

	workoutService.createLift = function(userId, lift) {
		var defer = $q.defer();
		
		$http.post(liftEndPoint + '/custom/' + userId, lift)
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

	workoutService.createSet = function(userId, set) {
		var defer = $q.defer();
		
		$http.post(setEndPoint + '/custom/' + userId, set)
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

	workoutService.createPrescription = function(userId, prescription) {
		var defer = $q.defer();
		
		$http.post(prescriptionEndPoint + '/custom/' + userId, prescription)
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

	workoutService.getLifts = function(userId) {
		var defer = $q.defer();
		
		$http.get(liftEndPoint + '/custom/' + userId)
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

	workoutService.getSets = function(userId) {
		var defer = $q.defer();
		
		$http.get(setEndPoint + '/custom/' + userId)
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

	workoutService.getPrescriptions = function(userId) {
		var defer = $q.defer();
		
		$http.get(prescriptionEndPoint + '/custom/' + userId)
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

	workoutService.editLift = function(lift) {

		var defer = $q.defer();
		
		$http.post(liftEndPoint + '/' + lift.id, lift)
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

	workoutService.removeLift = function(lift) {
		var defer = $q.defer();
		
		$http.delete(liftEndPoint + '/' + lift.id)
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

	workoutService.editSet = function(set) {
		var defer = $q.defer();
		
		$http.post(setEndPoint + '/' + set.id, set)
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

	workoutService.removeSet = function(set) {
		var defer = $q.defer();
		
		$http.delete(setEndPoint + '/' + set.id)
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

	workoutService.editPrescription = function(prescription) {
		var defer = $q.defer();
		
		$http.post(prescriptionEndPoint + '/' + prescription.id, prescription)
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

	workoutService.removePrescription = function(prescription) {
		var defer = $q.defer();
		
		$http.delete(prescriptionEndPoint + '/' + prescription.id)
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
	
	return workoutService;

});