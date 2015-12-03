'use strict';

/**
 * @ngdoc function
 * @name completeConceptStrength.controller:athletesCtrl
 * @description Controller of the athlete's tab
 * # athletesCtrl
 */
angular.module('homepageModule')
  .controller('athletesCtrl', function ($scope, userService, userConnectionService, workoutService, ModalService) {

  	$scope.viewingProfile = false;

	$scope.$on('usingAthletesTab', function(event, args) {
		$scope.loadAthletes();
		$scope.viewingProfile = false;
	});

	$scope.$on('cancelCalendar', function() { 
		console.log("IN HERE2");
		$scope.prescribing = false;
	});

	$scope.viewProfile = function(connection) {
		$scope.$broadcast('usingSettingsTab', connection.user);
		
		$scope.viewingProfile = true;

		console.log("Connection user name: " + connection.user.firstName);
		console.log("Navigating to the user's profile");
	} 

	$scope.cancelViewing = function() {
		$scope.viewingProfile = false;
	} 

	$scope.viewPrescription = function(connection) {

		$scope.prescribing = true;
		$scope.connectedAthlete = connection.user;
		$scope.$broadcast('initializeEvents', $scope.connectedAthlete.id);
	}

	$scope.selectFile = function(file) {
 		var reader = new FileReader();

		reader.onload = function(e) {
		  	var rawData = reader.result;
		  	var fileAttachment = {fileBytes: rawData.substring(78, rawData.length)};

		  	$scope.showAthletesModal("Importing...", true);

		  	var promise = workoutService.importPrescriptions($scope.user.id, fileAttachment);
			promise.then(function(res) {
				if(res != null) {
					// Log success
					console.log("Uploaded prescriptions");
					console.log(res);
					
					$scope.showAthletesModal("Prescriptions Uploaded", false);
				} else {
					// Log error
					console.log("Error uploading prescriptions");	
					$scope.showAthletesModal("Error Uploading Prescriptions", false);
				}
			
			}, function(error) {
				// Log error
				console.log("Error uploading prescriptions");
				console.log("Response: " + error);
				$scope.showAthletesModal("Error Uploading Prescriptions", false);
			})
		}

		if(file != undefined && file != null) {
			reader.readAsDataURL(file);
		}
	}

	$scope.showAthletesModal = function(actionTaken, inProgress) {

        ModalService.showModal({
            templateUrl: 'modal.html',
            controller: "homepageCtrl"
        }).then(function(modal) {
            
			// Display correct message
			$scope.modalHeader = actionTaken;
			$scope.inProgress = inProgress;
            
            modal.element.append($("#athletesModal"));
            $("#athletesModal").modal({
			    backdrop: 'static',
			    keyboard: false 
			});
        });
    }

	$scope.closeAthletesModal = function() {

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
