'use strict';

/**
 * @ngdoc function
 * @name completeConceptStrength.controller:connectionsCtrl
 * @description Controller of the connections tab
 * # connectionsCtrl
 */
angular.module('homepageModule')
  .controller('connectionsCtrl', function ($scope, userService, userConnectionService, ModalService) {


	$scope.loadConnectionsTab = function() {
		// Initial connection search fields
		$scope.searchText = "";
		$scope.lastSearch = "";
	}

	$scope.$on('usingConnectionsTab', function(event, args) {
		$scope.loadAllConnections();
	});

	$scope.cancelViewing = function() {
		$scope.viewingProfile = false;
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

	$scope.showUserSearchResults = function(searchText) {

		if(searchText.length > 0) {

			// Perform a search
			if(searchText != $scope.lastSearch) {
				$scope.searchConnections(searchText);
				$scope.lastSearch = searchText;
			}

			return true;
		} else {
			$scope.userSearchResults = null;
			$scope.lastSearch = '';
			return false;
		}

	}

	// Perform the connection action when the selection button is clicked
	$scope.connectionAction = function(connection, action) {
		console.log("Connection Action: " + action);
		console.log("Connection user id: " + connection.user.id);

		// Navigate to the user's profile if that was the selection
		if(action == "View Profile") {

			$scope.$broadcast('usingSettingsTab', connection);

			// Navigate to the user's profile
			$scope.viewingProfile = true;

			console.log("Connection user name: " + connection.user.firstName);
			console.log("Navigating to the user's profile");
		} 

		// Make the appropriate request depending on which action was selected
		var promise;
		var actionTaken;
		if(action == "Accept Request") {
			promise = userConnectionService.ConnectionAcceptRequest($scope.user.id, connection.user.id);
			actionTaken = "Request Accepted";
		} else if(action == "Deny Request") {
			promise = userConnectionService.ConnectionDenyRequest($scope.user.id, connection.user.id);
			actionTaken = "Request Denied";
		} else if(action == "Cancel Request") {
			promise = userConnectionService.ConnectionDenyRequest($scope.user.id, connection.user.id);
			actionTaken = "Request Cancelled";
		} else if(action == "Send Request") {
			promise = userConnectionService.ConnectionSendRequest($scope.user.id, connection.user.id);
			actionTaken = "Request Sent";
		} else if(action == "Remove Connection") {
			promise = userConnectionService.ConnectionRemoveRequest($scope.user.id, connection.user.id);
			actionTaken = "Connection Removed";
		} else {
			console.log("Action undefined: " + action);
			return;
		}

		// Perform the promised service request
		promise.then(function(res) {
			if(res != null) {

				if(res == "true") {
					console.log("Successfully performed connection action");
				} else {
					console.log("Unsuccessfully performed connection action");
				}
				
				// Display the success modal
				$scope.showConnectionModal(actionTaken);
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

	$scope.showConnectionModal = function(actionTaken) {

        ModalService.showModal({
            templateUrl: 'modal.html',
            controller: "homepageCtrl"
        }).then(function(modal) {
            
			// Display correct message
			$scope.modalHeader = actionTaken;
            
            modal.element.append($("#successConnectionModal"));
            $("#successConnectionModal").modal({
			    backdrop: 'static',
			    keyboard: false 
			});
        });
    }

	$scope.closeConnectionModal = function() {
        // Refresh the tables
        $scope.loadAllConnections();
        $scope.lastSearch = "";
        $scope.searchConnections($scope.searchText);
    }

	$scope.loadAllConnections = function() {
		$scope.loadPendingConnections();
		$scope.loadExistingConnections();
	}

	$scope.loadPendingConnections = function()  {

		console.log("Loading Pending Connections");
		
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
	
  });