'use strict';

/**
 * @ngdoc function
 * @name completeConceptStrength.controller:homepageCtrl
 * @description Controller of the homepage
 * # homepageCtrl
 */
angular.module('homepageModule', ['userService', 'userConnectionService', 'workoutService', 'athleteService', 'ui.rCalendar', 'ui-rangeSlider', 'angularModalService'])
  .controller('homepageCtrl', function ($scope, userService) {

  	$('.nav a').on('click', function(){
	    $('.btn-navbar').click(); //bootstrap 2.x
	    $('.navbar-toggle').click() //bootstrap 3.x by Richard
	});
	
	$scope.loadHomepage = function() {
		// Reload the user to update information
		var user = store.get('user');
		
		if(user == null) {
			console.log("No user logged in");
			$scope.logout();
			return;
		}
		
		var promise = userService.get(user.id);
		promise.then(function(res) {
			if(res != null) {
				// Log success
				console.log("Updated stored user");
				console.log(res);
				store.set('user', res);
				$scope.user = res;

				// Set the username
				$scope.username = res.firstName + ' ' + res.lastName;
			} else {
				// Log error
				console.log("Error getting logged in user");	
			}
		
		}, function(error) {
			// Log error
			console.log("Error getting logged in user");
			console.log("Response: " + error);
		})

		// Get the notifications for the user
		$scope.notifications = 0;

		// Load the athlete's tab after a short pause
		if(user.userType == 'Coach') {
			setTimeout($scope.clickedAthletesTab, 750);
		}
		
		$scope.eventSources = [];
	}

	$scope.viewProfile = function(connection) {

		
	}

	$scope.clickedAthletesTab = function() {
		$scope.$broadcast('usingAthletesTab');
	}

	$scope.clickedConnectionsTab = function() {
		$scope.$broadcast('usingConnectionsTab');
	}

	$scope.clickedWorkoutsTab = function() {
		$scope.$broadcast('usingWorkoutsTab');
	}

	$scope.clickedSettingsTab = function() {
		$scope.$broadcast('usingSettingsTab');
	}

	$scope.logout = function() {
		console.log("Logging out");
		
		// Detach all locally stored objects
		store.clear();
		
		// Go back to the login page
		location.href = "login";
	}
	
  });