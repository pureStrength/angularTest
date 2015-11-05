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

	$scope.$on('cancelCalendar', function() { 
		console.log("IN HERE2");
		$scope.prescribing = false;
	});

	
	$scope.viewProfile = function(connection) {
		console.log("Connection user name: " + connection.user.firstName);
		console.log("Navigating to the user's profile");
	} 

	$scope.viewPrescription = function(connection) {

		$scope.prescribing = true;
		$scope.connectedAthlete = connection.user;
		$scope.$broadcast('initializeEvents', $scope.connectedAthlete.id);
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
