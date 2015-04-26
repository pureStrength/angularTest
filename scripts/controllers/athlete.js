'use strict';

/**
 * @ngdoc function
 * @name completeConceptStrength.controller:AthleteCtrl
 * @description
 * # AthleteCtrl
 * Controller of the completeConceptStrength
 */
angular.module('completeConceptStrength.athleteCtrl', [])
  .controller('athleteCtrl', function ($scope, athleteService) {

  	$scope.register = function(athlete) {

  		var promise = athleteService.register(athlete);
      promise.then(function(res)
      {
        $scope.athlete = res.athlete;
      })
  	}

    $scope.authenticate = function(athlete) {

      var promise = athleteService.authenticate(athlete);
      promise.then(function(res)
      {
        $scope.user = res;
        $scope.code = 200;
      }, function(status) {
          $scope.user = {};
          $scope.code = status;
      })
    }

  });