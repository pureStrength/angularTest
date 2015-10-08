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
		$scope.initializeCustomPrescription();
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

		var promise;

		var edit = false;
		var textString = '';

		$.each($scope.lifts, function(){

			console.log(this.id);

			if(this.id == lift.id){
				console.log(lift.id);
				edit = true;
			}

		}); 

		/*for(var item in $scope.lifts){
			
		} */

		if(edit == true){
			promise = workoutService.editLift(lift);
			textString = 'Edit';
		}

		else{
			promise = workoutService.createLift($scope.user.id, lift);
			textString = 'Creation';
		}

		promise.then(function(res) {
			if(res != null) {
				// Log success
				console.log(textString+" Lift");
				console.log(res);

				$scope.showCreationModal(textString+" Successful", true);
			} else {
				// Log error
				console.log("Error "+textString+" Lift");	
			}
		
		}, function(error) {
			// Log error
			console.log("Error "+textString+" Lift");
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

	$scope.createPrescription = function(prescription) {

		
		var validInput = true;

		
		if(prescription.name == null) {
			$scope.showCreationModal("You must give a prescription name", false);
			return;
		}  

		if(prescription.mainLiftSets.length == 0) {
			$scope.showCreationModal("You must add atleast one set", false);
			return;
		}

		$.each(prescription.mainLiftSets, function() {

			if(this.mainLiftDefinition == null) {
				$scope.showCreationModal("You must select a main lift", false);
				validInput = false;
				return;
			}

			if(this.mainLifts.length == 0) {
				$scope.showCreationModal("You must add atleast one rep in set", false);
				validInput = false;
				return;
			}

			$.each(this.mainLifts, function() {

				if(this.assignedRepetitions == null ||
				   this.assignedPercentOfOneRepMax == null) {
					validInput = false;
					return;
				}
			});
		});

		if(validInput == false) {
			return;
		}

		$.each(prescription.mainLiftSets, function() {
			delete this.id;
		}); 

	

		var promise = workoutService.createPrescription($scope.user.id, prescription);
		promise.then(function(res) {
			if(res != null) {
				// Log success
				console.log("Created Prescription");
				console.log(res);

				$scope.showCreationModal("Creation Successful", true);
			} else {
				// Log error
				console.log("Error Creating Prescription");	
			}
		
		}, function(error) {
			// Log error
			console.log("Error Creating Prescription");
			console.log("Response: " + error);
		})
		
	}

	$scope.addSetRow = function() {
		$scope.customSet.mainLifts.push({id: ++$scope.counterOfSet, assignedRepetitions: null, assignedPercentOfOneRepMax: null});
	}

	$scope.deleteSetRow = function(index) {
		$scope.customSet.mainLifts.splice(index, 1);
	}

	$scope.addRow = function(index) {
		$scope.customPrescription.mainLiftSets[index].mainLifts.push(
			{id: ++$scope.counterOfSet, assignedRepetitions: null, assignedPercentOfOneRepMax: null});
	}

	$scope.deleteRow = function(parentIndex, index) {
		$scope.customPrescription.mainLiftSets[parentIndex].mainLifts.splice(index, 1);
	}

	$scope.addPSetRow = function() {
		
		$scope.customPrescription.mainLiftSets.push({id: ++$scope.counterOfPSet, 
			mainLifts: [{id: ++$scope.counterOfSet, assignedRepetitions: null, assignedPercentOfOneRepMax: null}]});
	}

	$scope.deletePRow = function(index) {
		$scope.customPrescription.mainLiftSets.splice(index, 1);
	}

	$scope.setSelected = function(pSet, index) {
		if(pSet == null){
			pSet = {};
			pSet.counterOfSet = 0;
			pSet.mainLifts = [{id: $scope.counterOfSet, assignedRepetitions: null, assignedPercentOfOneRepMax: null}];
		}

		$scope.customPrescription.mainLiftSets[index] = pSet;
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

	$scope.editLift = function(lift)  {

		$scope.createWorkout('lift');
		$scope.customLift = lift;
		
	}

	$scope.deleteLift = function()  {
		
	}

	$scope.editSet = function()  {
		
	}

	$scope.deleteSet = function()  {
		
	}

	$scope.editPrescription = function()  {
		
	}

	$scope.deletePrescription = function()  {
		
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
			$scope.initializeCustomPrescription();

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

    $scope.initializeCustomPrescription = function() {
    	$scope.customPrescription = {};
		$scope.counterOfPSet = 0;
		$scope.customPrescription.mainLiftSets = [{id: $scope.counterOfPSet,
			mainLifts: [{id: $scope.counterOfSet, assignedRepetitions: null, assignedPercentOfOneRepMax: null}]}];
    }
	
  });