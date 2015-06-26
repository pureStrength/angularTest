'use strict';

/**
 * @ngdoc function
 * @name completeConceptStrength.controller:homepageCtrl
 * @description
 * # homepageCtrl
 * Controller of the homepage
 */
angular.module('homepageModule', ['userService'])
  .controller('homepageCtrl', function ($scope, userService) {

	$scope.loadHomepage = function() {
		// Reload the user to update information
		var user = store.get('user');
		
		if(user == null) {
			console.log("No user logged in");
			return;
		}
		
		var promise = userService.get(user.id);
		promise.then(function(res) {
			if(res != null) {
				// Log success
				console.log("Updated stored user");
				store.set('user', res);

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
	
	$scope.logout = function() {
		console.log("Logging out");
		
		// Detach all locally stored objects
		store.clear();
		
		// Go back to the login page
		location.href = "login.html";
	}
	
  });