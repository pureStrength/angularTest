'use strict';

/**
 * @ngdoc function
 * @name completeConceptStrength.controller:workoutCtrl
 * @description Controller of the workouts tab
 * # workoutsCtrl
 */
angular.module('homepageModule')
  .controller('workoutsCtrl', function ($scope, userService, userConnectionService, workoutService, athleteService, ModalService) {

  	$scope.abdominalFocuses = ["None", "Strength", "Stability"];
  	$scope.expandMainSets = true;
  	$scope.expandAccessory = true;
  	$scope.expandFocus = true;

	$scope.loadWorkoutsTab = function() {
		// Initialize custom set creation object
		$scope.initializeCustomSet();
		$scope.initializeCustomPrescription();
		$scope.loadWorkouts();
	}

	$scope.createNewPrescription = function() {
		$scope.loadWorkoutsTab();
	}

	$scope.$on('usingWorkoutsTab', function(event, args) {
		$scope.loadWorkouts();
		if(args[0] != undefined && args[0] != null) {
			$scope.customPrescription = args[0];
			$scope.getAthleteProfile(args[1].id);
		}
	});

  	$scope.$on('initializeCustomPrescription', function(event, args) {
  		$scope.initializeCustomPrescription();
  		$scope.loadWorkouts();
  	});

  	$scope.$on('getAthleteProfile', function() {
  		$scope.getAthleteProfile($scope.connectedAthlete.id);
  	});

  	$scope.getAthleteProfile = function(athleteId) {
		// Set the ORM values
		var promise = athleteService.get(athleteId);
	    promise.then(function(res) {
	        if(res != null) {
				// Log success
				console.log("Selected athlete profile");
				console.log(res);

				$scope.athleteProfile = res;
				// Update all ORM
				angular.forEach($scope.customPrescription.mainLiftSets, function(set, index) {
					$scope.matchORM(set);
				});
	        } else {
	          // Log error
	          console.log("Error getting athlete profile"); 
	        }
	      
	      }, function(error) {
	        // Log error
	        console.log("Error getting athlete profile");
	        console.log("Response: " + error);
	    })
	}

	$scope.matchORM = function(set, index) {

		if(set != null && set.mainLiftDefinition != null && $scope.athleteProfile != undefined) {
			angular.forEach($scope.athleteProfile.oneRepMaxCharts, function(ORM, index) {

				if(set.mainLiftDefinition.name == ORM.liftName) {
					set.ORM = ORM.mostRecentOneRepMax.value;

					angular.forEach(set.mainLifts, function(reps, index) {
						$scope.predictValues(reps, set.ORM);
					});
						
				}

			});

		} else if(set == null) {
			$scope.setSelected(null, index);
		}

		$scope.$applyAsync();
	}

	$scope.predictValues = function(reps, ORM) {
		$scope.predictWeight(reps, ORM);
		$scope.predictedORM(reps);
	}

	$scope.predictWeight = function(reps, ORM) {
		reps.predictedWeight = Math.round((reps.assignedPercentOfOneRepMax / 100) * ORM); 
	}

	$scope.predictedORM = function(reps) {
  		reps.predictedORM = Math.round((reps.predictedWeight)/(1.013-(0.0267123*(reps.assignedRepetitions))));
  	}

  	$scope.expandPresets = function(presetType) {
  		if(presetType == 'lifts') {
  			if($scope.expandLifts == undefined) {
	  			$scope.expandLifts = true;
	  		} else {
	  			$scope.expandLifts = !$scope.expandLifts;
	  		}
  		} else if(presetType == 'sets') {
  			if($scope.expandSets == undefined) {
	  			$scope.expandSets = true;
	  		} else {
	  			$scope.expandSets = !$scope.expandSets;
	  		}
  		} else if(presetType == 'prescriptions') {
  			if($scope.expandPrescriptions == undefined) {
	  			$scope.expandPrescriptions = true;
	  		} else {
	  			$scope.expandPrescriptions = !$scope.expandPrescriptions;
	  		}
  		}
  	}

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

		$scope.customLift = {};
		$scope.initializeCustomSet();
		$scope.initializeCustomPrescription();
	}

	$scope.createLift = function(lift) {

		var promise;

		var edit = false;
		var textString = '';

		if(lift == undefined || lift.name == undefined) {
			return;
		}

		if(lift.id != undefined && lift.id != null) {
			edit = true;
		} 

		if(edit == true) {
			promise = workoutService.editLift(lift);
			textString = 'Edit';
		} else {
			promise = workoutService.createLift($scope.user.id, lift);
			textString = 'Creation';
		}

		promise.then(function(res) {
			if(res != null) {
				// Log success
				console.log(textString+" Lift");
				console.log(res);

				$scope.showWorkoutsModal(textString+" Successful", true);
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

		var promise;

		var edit = false;
		var textString = '';

		if(set.id != undefined && set.id != null) {
			edit = true;
		}  

		var validInput = true;

		if(set.mainLiftDefinition == undefined || set.mainLiftDefinition == null) {
			$scope.showWorkoutsModal("You must select a lift", false);
			validInput = false;
			return;
		}

		if(set.name == undefined || set.name == null) {
			$scope.showWorkoutsModal("You must give a set name", false);
			validInput = false;
			return;
		}  

		if(set.mainLifts == undefined || set.mainLifts.length == 0) {
			$scope.showWorkoutsModal("You must add atleast one table row", false);
			validInput = false;
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

		if(edit == true) {
			promise = workoutService.editSet(set);
			textString = 'Edit';
		} else {
			promise = workoutService.createSet($scope.user.id, set);
			textString = 'Creation';
		}

		promise.then(function(res) {
			if(res != null) {
				// Log success
				console.log(textString+" Set");
				console.log(res);

				$scope.showWorkoutsModal(textString+" Successful", true);
			} else {
				// Log error
				console.log("Error "+textString+" Set");	
			}
		
		}, function(error) {
			// Log error
			console.log("Error "+textString+" Set");
			console.log("Response: " + error);
		})
		
	}

	$scope.sendPrescription = function(prescription) {
		$scope.$emit('saveNewPrescribe', prescription);
	}

	$scope.createPrescription = function(prescription) {

		var promise;

		var edit = false;
		var textString = '';

		if(prescription.id != undefined && prescription.id != null) {
			edit = true;
		}  

		var validInput = true;
		
		if(prescription.name == null) {
			$scope.showWorkoutsModal("You must give a prescription name", false);
			validInput = false;
			return;
		}  

		if(prescription.mainLiftSets.length == 0) {
			$scope.showWorkoutsModal("You must add atleast one set", false);
			validInput = false;
			return;
		}

		$.each(prescription.mainLiftSets, function() {

			if(this.mainLiftDefinition == undefined || this.mainLiftDefinition == null) {
				$scope.showWorkoutsModal("You must select a lift", false);
				validInput = false;
				return;
			}
 

			if(this.mainLifts == undefined || this.mainLifts.length == 0) {
				$scope.showWorkoutsModal("You must add atleast one table row", false);
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

		$.each(prescription.accessoryLifts, function() {

			if(this.mainLiftDefinition == undefined || this.mainLiftDefinition == null) {
				$scope.showWorkoutsModal("You must select a lift", false);
				validInput = false;
				return;
			}

			if(this.assignedSets == null ||
			   this.assignedRepetitions == null) {
				validInput = false;
				return;
			}
		});

		if(validInput == false) {
			return;
		}

		if(edit == true) {
			promise = workoutService.editPrescription(prescription);
			textString = 'Edit';
		} else {
			promise = workoutService.createPrescription($scope.user.id, prescription);
			textString = 'Creation';
		}

		promise.then(function(res) {
			if(res != null) {
				// Log success
				console.log(textString+" Prescription");
				console.log(res);

				$scope.showWorkoutsModal(textString+" Successful", true);
			} else {
				// Log error
				console.log("Error "+textString+" Prescription");	
			}
		
		}, function(error) {
			// Log error
			console.log("Error "+textString+" Prescription");
			console.log("Response: " + error);
		})
		
	}

	$scope.addSetRow = function() {
		$scope.customSet.mainLifts.push({internalId: ++$scope.counterOfSet, assignedRepetitions: null, assignedPercentOfOneRepMax: null});
	}

	$scope.deleteSetRow = function(index) {
		$scope.customSet.mainLifts.splice(index, 1);
	}

	$scope.addRow = function(index) {
		$scope.customPrescription.mainLiftSets[index].mainLifts.push(
			{internalId: ++$scope.counterOfSet, assignedRepetitions: null, assignedPercentOfOneRepMax: null});
	}

	$scope.deleteRow = function(parentIndex, index) {
		$scope.customPrescription.mainLiftSets[parentIndex].mainLifts.splice(index, 1);
	}

	$scope.addPSetRow = function() {
		
		$scope.customPrescription.mainLiftSets.push({internalId: ++$scope.counterOfPSet, 
			mainLifts: [{internalId: ++$scope.counterOfSet, assignedRepetitions: null, assignedPercentOfOneRepMax: null}]});
	}

	$scope.deletePRow = function(index) {
		$scope.customPrescription.mainLiftSets.splice(index, 1);
	}

	$scope.addAccessoryRow = function() {

		if($scope.customPrescription.accessoryLifts == undefined) {
			$scope.customPrescription.accessoryLifts = [];
		}

		$scope.customPrescription.accessoryLifts.push({internalId: ++$scope.counterOfASet, 
			assignedSets: null, 
			category: null,
			assignedRepetitions: null});
	}

	$scope.deleteAccessoryRow = function(index) {
		$scope.customPrescription.accessoryLifts.splice(index, 1);
	}

	$scope.setSelected = function(pSet, index) {
		if(pSet == undefined || pSet == null) {
			pSet = {};
			pSet.counterOfSet = 0;
			pSet.mainLifts = [{internalId: $scope.counterOfSet, assignedRepetitions: null, assignedPercentOfOneRepMax: null}];
		}

		if($scope.customPrescription.mainLiftSets == undefined || $scope.customPrescription.mainLiftSets == null) {
			$scope.customPrescription.mainLiftSets = [];
		}

		$scope.customPrescription.mainLiftSets[index] = pSet;

		$scope.matchORM(pSet, index);
	}

	$scope.prescriptionSelected = function(cPres) {
        if(cPres == null) {
        	$scope.initializeCustomSet();
          	$scope.initializeCustomPrescription();
        } else {
          	$scope.customPrescription = cPres;
        }
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

	$scope.deleteLift = function(lift)  {

		var promise = workoutService.removeLift(lift);
		promise.then(function(res) {
			if(res != null) {
				// Log success
				console.log("Deleted Lift");
				console.log(res);

				$scope.showWorkoutsModal("Delete Successful", true);
			} else {
				// Log error
				console.log("Error Deleting Lift");	
			}
		
		}, function(error) {
			// Log error
			console.log("Error Deleting Lift");
			console.log("Response: " + error);
		})
	}

	$scope.editSet = function(set)  {

		$scope.createWorkout('set');
		$scope.customSet = set;
		
	}

	$scope.deleteSet = function(set)  {

		var promise = workoutService.removeSet(set);
		promise.then(function(res) {
			if(res != null) {
				// Log success
				console.log("Deleted Set");
				console.log(res);

				$scope.showWorkoutsModal("Delete Successful", true);
			} else {
				// Log error
				console.log("Error Deleting Set");	
			}
		
		}, function(error) {
			// Log error
			console.log("Error Deleting Set");
			console.log("Response: " + error);
		})
		
	}

	$scope.editPrescription = function(prescription)  {

		$scope.createWorkout('prescription');
		$scope.customPrescription = prescription;
		
	}

	$scope.deletePrescription = function(prescription)  {
		var promise = workoutService.removePrescription(prescription);
		promise.then(function(res) {
			if(res != null) {
				// Log success
				console.log("Deleted Prescription");
				console.log(res);

				$scope.showWorkoutsModal("Delete Successful", true);
			} else {
				// Log error
				console.log("Error Deleting Prescription");	
			}
		
		}, function(error) {
			// Log error
			console.log("Error Deleting Prescription");
			console.log("Response: " + error);
		})
	}

	$scope.showWorkoutsModal = function(header, success) {

        ModalService.showModal({
            templateUrl: 'workoutsModal.html',
            controller: "homepageCtrl"
        }).then(function(modal) {
            
			// Display correct message
			$scope.modalHeader = header;
			$scope.success = success;
            
            modal.element.append($("#workoutsModal"));
            $("#workoutsModal").modal({
			    backdrop: 'static',
			    keyboard: false 
			});
        });
    };

	$scope.closeWorkoutsModal = function(wasSuccessful) {
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
		$scope.customSet.mainLifts = [{internalId: $scope.counterOfSet, assignedRepetitions: null, assignedPercentOfOneRepMax: null}];
    }

    $scope.initializeCustomPrescription = function() {
    	$scope.customPrescription = {};
		$scope.counterOfPSet = 0;
		$scope.counterOfASet = 0;
		$scope.customPrescription.mainLiftSets = [{internalId: $scope.counterOfPSet,
			mainLifts: [{internalId: $scope.counterOfSet, assignedRepetitions: null, assignedPercentOfOneRepMax: null}]}
		];
		$scope.customPrescription.accessoryLifts = [{internalId: $scope.counterOfASet, 
			assignedSets: null, 
			category: null,
			assignedRepetitions: null}
		];

		$scope.customPrescription.abdominalFocus = "None";
    }
	
  });
