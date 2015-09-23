'use strict';

/**
 * @ngdoc function
 * @name completeConceptStrength.controller:homepageCtrl
 * @description Controller of the homepage
 * # homepageCtrl
 */
angular.module('homepageModule', ['userService', 'userConnectionService', 'workoutService', 'angularModalService'])
  .controller('homepageCtrl', function ($scope, userService, userConnectionService, workoutService, ModalService) {


	$scope.loadHomepage = function() {
		// Initial null set
		$scope.searchText = "";
		$scope.lastSearch = "";
		$scope.counterOfSet = 0;
		$scope.set = [{id: $scope.counterOfSet, assignedRepetitions: null, assignedPercentOfOneRepMax: null}];
	
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
			// Navigate to the user's profile
			console.log("Navigating to the user's profile");
			return;
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
    };

	$scope.closeConnectionModal = function() {
        // Refresh the tables
        $scope.loadAllConnections();
        $scope.lastSearch = "";
        $scope.searchConnections($scope.searchText);
    };

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

	$scope.createWorkout = function(type) {
		$scope.creating = true;
		$scope.creatingLift = false;
		$scope.creatingSet = false;
		$scope.creatingPrescription = false;

		if(type == 'lift'){
			$scope.creatingLift = true;
		}

		if(type == 'set'){
			$scope.creatingSet = true;
		}

		if(type == 'prescription'){
			$scope.creatingPrescription = true;
		}
	}

	$scope.cancelCreate = function() {
		$scope.creating = false;
		$scope.creatingLift = false;
		$scope.creatingSet = false;
		$scope.creatingPrescription = false;
	}

	$scope.createLift = function(lift) {
		
	}

	$scope.createSet = function(set) {

		$.each(set, function(){
			this.id = null;
		});

		var promise = workoutService.createSet($scope.user.id, set);
		promise.then(function(res) {
			if(res != null) {
				// Log success
				console.log("Created Set");
				
				console.log(res);
			} else {
				// Log error
				console.log("Error Creating Set");	
			}
		
		}, function(error) {
			// Log error
			console.log("Error Creating Set");
			console.log("Response: " + error);
		})
		
	}

	$scope.createPrescription = function() {
		
	}

	$scope.addSetRow = function() {
		$scope.set.push({id: ++$scope.counterOfSet, repetitions: null, oneRepMax: null});
	}

	$scope.deleteRow = function(reps) {
		var index = $scope.set.indexOf(reps);
		$scope.set.splice(index, 1);
	}

	$scope.loadWorkouts = function() {
		$scope.loadLifts();
		$scope.loadSets();
		$scope.loadPrescriptions();
	}

	$scope.loadLifts = function()  {
		
		if($scope.user == null) {
			console.log("No user logged in");
			return;
		}
		
		var promise = workoutService.getLifts($scope.user.id);
		promise.then(function(res) {
			if(res != null) {
				// Log success
				console.log("Recieved lifts");
				
				console.log(res);
				
				// Set existing connections
				$scope.lifts = res;
			} else {
				// Log error
				console.log("Error recieving lifts");	
			}
		
		}, function(error) {
			// Log error
			console.log("Error recieving lifts");
			console.log("Response: " + error);
		})
	}

	$scope.loadSets = function()  {
		
		if($scope.user == null) {
			console.log("No user logged in");
			return;
		}
		
		var promise = workoutService.getSets($scope.user.id);
		promise.then(function(res) {
			if(res != null) {
				// Log success
				console.log("Recieved sets");
				
				console.log(res);
				
				// Set existing connections
				$scope.sets = res;
			} else {
				// Log error
				console.log("Error recieving sets");	
			}
		
		}, function(error) {
			// Log error
			console.log("Error recieving sets");
			console.log("Response: " + error);
		})
	}

	$scope.loadPrescriptions = function()  {
		
		if($scope.user == null) {
			console.log("No user logged in");
			return;
		}
		
		var promise = workoutService.getPrescriptions($scope.user.id);
		promise.then(function(res) {
			if(res != null) {
				// Log success
				console.log("Recieved prescriptions");
				
				console.log(res);
				
				// Set existing connections
				$scope.prescriptions = res;
			} else {
				// Log error
				console.log("Error recieving prescriptions");	
			}
		
		}, function(error) {
			// Log error
			console.log("Error recieving prescriptions");
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