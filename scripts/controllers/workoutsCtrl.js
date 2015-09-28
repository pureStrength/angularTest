'use strict';

/**
 * @ngdoc function
 * @name completeConceptStrength.controller:workoutCtrl
 * @description Controller of the workouts tab
 * # workoutsCtrl
 */
angular.module('homepageModule')
  .controller('workoutsCtrl', function ($scope, workoutService, ModalService) {


	$scope.loadWorkoutsTab = function() {
		// Initialize custom set creation object
		$scope.initializeCustomSet();
	}

	$scope.$on('usingWorkoutsTab', function(event, args) {
		$scope.loadWorkouts();
	});

	$scope.createWorkout = function(type) {
		$scope.creating = true;
		$scope.creatingLift = false;
		$scope.creatingSet = false;
		$scope.creatingPrescription = false;

		if(type == 'lift') {
			$scope.creatingLift = true;
		}

		if(type == 'set') {
			$scope.creatingSet = true;
		}

		if(type == 'prescription') {
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

		var promise = workoutService.createLift($scope.user.id, set);
		promise.then(function(res) {
			if(res != null) {
				// Log success
				console.log("Created Lift");
				console.log(res);

				$scope.showCreationModal("Creation Successful", true);
			} else {
				// Log error
				console.log("Error Creating Lift");	
			}
		
		}, function(error) {
			// Log error
			console.log("Error Creating Lift");
			console.log("Response: " + error);
		})
	}

	$scope.createSet = function(set) {

		var validInput = true;

		if(set.mainLiftDefinition == undefined) {
			$scope.showCreationModal("You must select a lift", false);
			return;
		}

		if(set.mainLifts.length == 0) {
			$scope.showCreationModal("You must add atleast one table row", false);
			return;
		}

		$.each(set.mainLifts, function() {

			if(this.assignedRepetitions == null ||
			   this.assignedPercentOfOneRepMax == null) {
				validInput = false;
				return;
			}
		});

		if(validInput == false) {
			return;
		}

		$.each(set.mainLifts, function() {
			delete this.id;
		});

		var promise = workoutService.createSet($scope.user.id, set);
		promise.then(function(res) {
			if(res != null) {
				// Log success
				console.log("Created Set");
				console.log(res);

				$scope.showCreationModal("Creation Successful", true);
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
		$scope.customSet.mainLifts.push({id: ++$scope.counterOfSet, assignedRepetitions: null, assignedPercentOfOneRepMax: null});
	}

	$scope.deleteRow = function(reps) {
		var index = $scope.customSet.mainLifts.indexOf(reps);
		$scope.customSet.mainLifts.splice(index, 1);
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

	$scope.showCreationModal = function(header, success) {

        ModalService.showModal({
            templateUrl: 'creationModal.html',
            controller: "homepageCtrl"
        }).then(function(modal) {
            
			// Display correct message
			$scope.modalHeader = header;
			$scope.success = success;
            
            modal.element.append($("#creationModal"));
            $("#creationModal").modal({
			    backdrop: 'static',
			    keyboard: false 
			});
        });
    };

	$scope.closeCreationModal = function(wasSuccessful) {
		if(wasSuccessful) {
			// Reinitialize custom objects
			$scope.initializeCustomSet();

			// Refresh the tables
        	$scope.loadWorkouts();
        	$scope.cancelCreate();
		} 
    };

    $scope.initializeCustomSet = function() {
    	$scope.customSet = {};
		$scope.counterOfSet = 0;
		$scope.customSet.mainLifts = [{id: $scope.counterOfSet, assignedRepetitions: null, assignedPercentOfOneRepMax: null}];
    }
	
  });