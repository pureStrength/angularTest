'use strict';

/**
 * @ngdoc function
 * @name completeConceptStrength.controller:prescriptionsCtrl
 * @description Controller of the prescriptions tab
 * # prescriptionsCtrl
 */
angular.module('homepageModule', ['workoutService'])
  .controller('prescriptionsCtrl', function ($scope, workoutService) {


	$scope.loadPrescriptionsTab = function() {
		// Initialize the calendar type
		$scope.calendarView = "Grid View";
	}

	$scope.swapView = function() {

		if($scope.calendarView == "Grid View") {
			$scope.calendarView = "List View";
		} else {
			$scope.calendarView = "Grid View";
		}

	}
	
  });