'use strict';

/**
 * @ngdoc function
 * @name completeConceptStrength.controller:calendarCtrl
 * @description Controller of the athlete's tab
 * # athletesCtrl
 */
angular.module('homepageModule')
  .controller('calendarCtrl', function ($scope, userService, userConnectionService, ModalService) {


  		$scope.initializeEvents = function() {

  			// The events array
  			$scope.eventSource = [];

  			// Add an event to the array
  			var today = new Date();
			$scope.eventSource.push({
				title: 'Workout',
				startTime: today,
				endTime: today,
				allDay: true
			})

  		}

  });