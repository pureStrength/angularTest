'use strict';

/**
 * @ngdoc service
 * @name completeConceptStrength.athlete
 * @description
 * # athlete
 * Service in the completeConceptStrength.
 */
angular.module('completeConceptStrength.athleteService', [])
  .service('athleteService', function ($http, $q) {

  var endPoint = "http://localhost:8080/completeConceptStrength/rest/api";
  var athleteService = this;

  athleteService.register = function(athlete) {
  	var defer = $q.defer();

    var object = {athlete : ""};
    object.athlete = athlete;

  	$http.post(endPoint + '/athlete/register', object)
  	.success(function(res, status) {
  		if(status == 200) {
        defer.resolve(res);
      } else {
        defer.reject(status);
      }
  	})
  	.error(function(err, status) {
  		defer.reject(err);
  	})

  	return defer.promise;
  }

  athleteService.authenticate = function(athlete) {
    var defer = $q.defer();

    $http.get(endPoint + '/athlete/authenticate', {
      params: {
        "email": athlete.email, 
        "password": athlete.password
      }
    })
    .success(function(res, status) {
      if(status == 200) {
        defer.resolve(res);
      } else {
        defer.reject(status);
      }
    })
    .error(function(err, status) {
      defer.reject(status);
    })

    return defer.promise;
  }

  return athleteService;

});
