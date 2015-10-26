'use strict';

/**
 * @ngdoc function
 * @name completeConceptStrength.controller:athletesCtrl
 * @description Controller of the athlete's tab
 * # athletesCtrl
 */
angular.module('homepageModule')
  .controller('athletesCtrl', function ($scope, userService, userConnectionService, ModalService) {

	$scope.$on('usingAthletesTab', function(event, args) {
		$scope.loadAthletes();
	});

	
	$scope.viewProfile = function(connection){
		console.log("Connection user name: " + connection.user.firstName);
		console.log("Navigating to the user's profile");
	} 

	$scope.viewPrescription = function(connection){

		$scope.prescribing = true;

		$scope.connectedAthlete = connection.user;
	}


	$scope.$on('cancelCalendar', function(){ $scope.prescribing = false;});



	// Perform the connection action when the selection button is clicked
	$scope.athleteAction = function(connection, action) {
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

	$scope.showAthletesModal = function(actionTaken) {

        ModalService.showModal({
            templateUrl: 'modal.html',
            controller: "homepageCtrl"
        }).then(function(modal) {
            
			// Display correct message
			$scope.modalHeader = actionTaken;
            
            modal.element.append($("#athletesModal"));
            $("#athletesModal").modal({
			    backdrop: 'static',
			    keyboard: false 
			});
        });
    }

	$scope.closeAthletesModal = function() {
        // Refresh the tables
        $scope.loadAllConnections();
        $scope.lastSearch = "";
        $scope.searchConnections($scope.searchText);
    }

	$scope.loadAthletes = function()  {
		
		if($scope.user == null) {
			console.log("No user logged in");
			return;
		}
		
		var promise = userConnectionService.findAthletes($scope.user.id);
		promise.then(function(res) {
			if(res != null) {
				// Log success
				console.log("Recieved Athlete Connections");
				
				console.log(res);
				
				// Set existing connections
				$scope.existingConnections = res;
			} else {
				// Log error
				console.log("Error recieving athlete connections");	
			}
		
		}, function(error) {
			// Log error
			console.log("Error recieving athlete connections");
			console.log("Response: " + error);
		})
	}
	
  });
