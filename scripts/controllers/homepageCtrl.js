'use strict';

/**
 * @ngdoc function
 * @name completeConceptStrength.controller:homepageCtrl
 * @description Controller of the homepage
 * # homepageCtrl
 */
angular.module('homepageModule', ['userService', 'userConnectionService'])
  .controller('homepageCtrl', function ($scope, userService, userConnectionService) {

	$scope.loadHomepage = function() {
		// Initial null set
		$scope.searchText = "";
		$scope.lastSearch = "";

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

	$scope.searchConnections = function(searchText) {
		console.log("In search connections");

		// Get the logged in user
		var user = store.get('user');
		
		if(user == null) {
			console.log("No user logged in");
			return;
		}

		var promise = userConnectionService.searchByUser(user.id, searchText);
		promise.then(function(res) {
			if(res != null) {
				// Log success
				console.log("Recieved user search results");
				
				console.log(res);
				
				// Set pending connections
				$scope.userSearchResults = res;
			} else {
				// Log error
				console.log("Error recieving user search results");	
			}
		
		}, function(error) {
			// Log error
			console.log("Error recieving user search results");
			console.log("Response: " + error);
		})

	}

	$scope.hideUserSearchResults = function() {

		if($scope.searchText.length != 0) {

			// Perform a search
			if($scope.searchText != $scope.lastSearch) {
				$scope.searchConnections($scope.searchText);
				$scope.lastSearch = $scope.searchText;
			}

			return false;
		} else {
			$scope.userSearchResults = null;
			return true;
		}

	}

	$scope.positiveActionConnection = function() {
		console.log("Positive Action Connection");
		//Dummy
		
	}

	$scope.negativeActionConnection = function() {
		console.log("Negative Action Connection");
		//Dummy
		
	}

	$scope.loadAllConnections = function() {
		$scope.loadPendingConnections();
		$scope.loadExistingConnections();
	}

	$scope.loadPendingConnections = function()  {
		
		// Get the logged in user
		var user = store.get('user');
		
		if(user == null) {
			console.log("No user logged in");
			return;
		}
		
		var promise = userConnectionService.findPending(user.id);
		promise.then(function(res) {
			if(res != null) {
				// Log success
				console.log("Recieved Pending Connections");
				
				console.log(res);
				
				// Set pending connections
				$scope.pendingConnections = res;
			} else {
				// Log error
				console.log("Error recieving pending connections");	
			}
		
		}, function(error) {
			// Log error
			console.log("Error recieving pending connections");
			console.log("Response: " + error);
		})
	}
	
	$scope.loadExistingConnections = function()  {
		
		// Get the logged in user
		var user = store.get('user');
		
		if(user == null) {
			console.log("No user logged in");
			return;
		}
		
		var promise = userConnectionService.findExisting(user.id);
		promise.then(function(res) {
			if(res != null) {
				// Log success
				console.log("Recieved Existing Connections");
				
				console.log(res);
				
				// Set existing connections
				$scope.existingConnections = res;
			} else {
				// Log error
				console.log("Error recieving existing connections");	
			}
		
		}, function(error) {
			// Log error
			console.log("Error recieving existing connections");
			console.log("Response: " + error);
		})
	}

	$scope.logout = function() {
		console.log("Logging out");
		
		// Detach all locally stored objects
		store.clear();
		
		// Go back to the login page
		location.href = "login.html";
	}
	
  });