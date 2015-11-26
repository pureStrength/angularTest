'use strict';

/**
 * @ngdoc function
 * @name completeConceptStrength.controller:homepageCtrl
 * @description Controller of the homepage
 * # homepageCtrl
 */
angular.module('homepageModule', ['userService', 'userConnectionService', 'workoutService', 'athleteService', 'ui.rCalendar', 'ui-rangeSlider', 'ngFileUpload', 'angularModalService'])
  .controller('homepageCtrl', function ($scope, $location, userService) {

  	$scope.tabs = ['/athletes', '/connections', 'settings', 'prescriptions', 'workouts'];

  	$scope.defaultTimeout = 750;

  	$('.nav a').on('click', function() {
	    $('.navbar-toggle').click() //bootstrap 3.x by Richard
	});

	$scope.isActive = function(route) {
		var path = '' + $location.path();

		if(path == '' || path == '/') {
			var url = $location.absUrl();
			if(url.indexOf('athleteHomepage') >= 0) {
				path = '/prescriptions';
			} else {
				path = '/athletes';
			}
		} else if($scope.tabs.indexOf(path) >= 0) {
			// continue
		} else {
			var url = '' + $location.absUrl();

			for(var i = 0; i < $scope.tabs.length; i++) {
				if(url.indexOf($scope.tabs[i]) > 0) {
					path = $scope.tabs[i];
					break;
				}
			}
		}

        return route == path;
    }
	
	$scope.loadHomepage = function() {
		if($scope.reloadStoredUser() == false) {
			return;
		}

		// Load the data for the selected tab
		$scope.loadTab($location.path());

		// Get the notifications for the user
		$scope.notifications = 0;
		
		// Initialize the calendar event sources
		$scope.eventSources = [];
	}

	$scope.reloadStoredUser = function() {
		// Reload the user to update information
		var user = store.get('user');
		
		if(user == null) {
			console.log("No user logged in");
			$scope.logout();
			return false;
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

		return true;
	}

	$scope.loadTab = function(path) {

		// Load the athlete's tab after a short pause
		if(path == '/prescriptions') {
			setTimeout($scope.clickedPrescriptionsTab, $scope.defaultTimeout);
		} else if(path == '/connections') {
			setTimeout($scope.clickedConnectionsTab, $scope.defaultTimeout);
		} else if(path == '/settings') {
			setTimeout($scope.clickedSettingsTab, $scope.defaultTimeout);
		} else if(path == '/athletes') {
			setTimeout($scope.clickedAthletesTab, $scope.defaultTimeout);
		} else if(path == '/workouts' || path == '/lifts' ||
				  path == '/sets'     || path == '/prescriptions') {
			setTimeout($scope.clickedWorkoutsTab, $scope.defaultTimeout);
		} else {
			setTimeout($scope.clickedPrescriptionsTab, $scope.defaultTimeout);
			setTimeout($scope.clickedAthletesTab, $scope.defaultTimeout);
		}
	}

	$scope.clickedAthletesTab = function() {
		$scope.$broadcast('usingAthletesTab');
	}

	$scope.clickedConnectionsTab = function() {
		$scope.$broadcast('usingConnectionsTab');
	}

	$scope.clickedPrescriptionsTab = function() {
		var user = $scope.user;

		if(user === undefined) {
			user = store.get('user');
		}

		$scope.$broadcast('initializeEvents', user.id);
	}

	$scope.clickedWorkoutsTab = function() {
		$scope.$broadcast('usingWorkoutsTab');
	}

	$scope.clickedSettingsTab = function() {
		$scope.$broadcast('usingSettingsTab', $scope.user);
	}

	$scope.viewProfile = function(connection) {

		
	}

	$scope.logout = function() {
		console.log("Logging out");
		
		// Detach all locally stored objects
		store.clear();
		
		// Go back to the login page
		location.href = "login";
	}
	
  });
