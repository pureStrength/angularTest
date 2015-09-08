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

		if($scope.user == null) {
			console.log("No user logged in");
			return;
		}

		var promise = userConnectionService.searchByUser($scope.user.id, searchText);
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

	$scope.showUserSearchResults = function() {

		if($scope.searchText.length != 0) {

			// Perform a search
			if($scope.searchText != $scope.lastSearch) {
				$scope.searchConnections($scope.searchText);
				$scope.lastSearch = $scope.searchText;
			}

			return true;
		} else {
			$scope.userSearchResults = null;
			return false;
		}

	}

	// Perform the connection action when the selection button is clicked
	$scope.connectionAction = function(connection, actionType) {
		console.log("Connection Action: " + actionType);
		console.log("Connection user id: " + connection.user.id);

		// Get the status from the connection and actionType
		var status;
		if(actionType == "positive") {
			status = connection.userConnectionStatus.positiveAction;
		} else if(actionType == "negative") {
			status = connection.userConnectionStatus.negativeAction;
		} else {
			console.log("Recieved non-valid actionType: " + actionType);
			return;
		}
		console.log("Connection status: " + status);

		// Navigate to the user's profile if that was the selection
		if(status == "View Profile") {
			// Navigate to the user's profile
			console.log("Navigating to the user's profile");
			return;
		} 

		// Make the appropriate request depending on which status was selected
		var promise;
		if(status == "Accept Request") {
			promise = userConnectionService.ConnectionAcceptRequest($scope.user.id, connection.user.id);
		}

		// Perform the promised service request
		promise.then(function(res) {
			if(res != null) {

				if(res == "true") {
					console.log("Successfully performed connection action");
				} else {
					console.log("Unsuccessfully performed connection action");
				}
				
				// TODO: User modal to make user aware that the request was sent
			} else {
				// Log error
				console.log("Error performing connection action");	
			}
		
		}, function(error) {
			// Log error
			console.log("Error performing connection action");
			console.log("Response: " + error);
		})
	}

	$scope.loadAllConnections = function() {
		$scope.loadPendingConnections();
		$scope.loadExistingConnections();
	}

	$scope.loadPendingConnections = function()  {
		
		if($scope.user == null) {
			console.log("No user logged in");
			return;
		}
		
		var promise = userConnectionService.findPending($scope.user.id);
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
		
		if($scope.user == null) {
			console.log("No user logged in");
			return;
		}
		
		var promise = userConnectionService.findExisting($scope.user.id);
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