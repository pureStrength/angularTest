'use strict';

/**
 * @ngdoc function
 * @name completeConceptStrength.controller:prescriptionsCtrl
 * @description Controller of the prescriptions tab
 * # prescriptionsCtrl
 */
angular.module('homepageModule')
  .controller('prescriptionsCtrl', function ($scope, workoutService) {

	$scope.cancelPostResults = function() {
		$scope.postingResults = false;
		console.log("Cancel posting results");
	}

	$scope.postEvent = function(event) {

	}
	
  });