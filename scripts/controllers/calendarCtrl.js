'use strict';

/**
 * @ngdoc function
 * @name completeConceptStrength.controller:calendarCtrl
 * @description Controller of the athlete's tab
 * # athletesCtrl
 */
angular.module('homepageModule')
  .controller('calendarCtrl', function ($scope, userService, userConnectionService, athleteService, workoutService, ModalService) {

    $scope.$on('initializeEvents', function(event, athleteId) { 
      $scope.initializeEvents(athleteId);
    });

    $scope.newPrescribe = false;
    $scope.viewPrescription = false;

    $scope.initializeEvents = function(athleteId) { 

  	  // The events array
  		$scope.eventSource = [];

      var promise = workoutService.getPrescriptionsByAthlete(athleteId);
      promise.then(function(res) {
        if(res != null) {
          // Log success
          console.log("Recieved prescriptions by athlete");
          console.log(res);
          
          // Convert prescriptions into events
          for(var i = 0; i < res.length; i++) {
            if(res[i].removed == true) {
              continue;
            }
            res[i].title = res[i].prescriptionName || 'Workout';
            res[i].startTime = res[i].dateAssigned;
            res[i].endTime = res[i].dateAssigned;
            res[i].highlight = res[i].wasPerformed;

            var dateAssigned = new Date(res[i].dateAssigned);

            if(dateAssigned.getHours() == 0) {
              res[i].allDay = true;
            } else {
              res[i].allDay = false;
            }
          }

          // Update the event source
          $scope.eventSource = res;

        } else {
          // Log error
          console.log("Error recieving prescriptions by athlete"); 
        }
      
        }, function(error) {
          // Log error
          console.log("Error recieving prescriptions by athlete");
          console.log("Response: " + error);
      })

  	}

    $scope.loadPrescriptions = function() {

      var user = $scope.user;

      if(user === undefined) {
        user = store.get('user');
      }

      $scope.initializeEvents(user.id);
    }

    $scope.prescribeWorkout = function() {
      // Initialize custom set creation object
      $scope.initializeCustomPrescription();
      $scope.newPrescribe = true;
      $scope.$broadcast('usingWorkoutsTab', [$scope.customPrescription, $scope.connectedAthlete]);
    }

    $scope.editWorkout = function() {
      $scope.eventToPrescription($scope.event);
      $scope.newPrescribe = true;
      $scope.$broadcast('usingWorkoutsTab', [$scope.customPrescription, $scope.connectedAthlete]);
    }

    $scope.eventToPrescription = function(event) {
      $scope.customPrescription = event;
      $scope.customPrescription.mainLiftSets = event.recordedSets;
      $scope.customPrescription.name = event.prescriptionName;
    }

    $scope.cancelPrescribing = function() {
      $scope.$emit('cancelCalendar');
      $scope.today();
      $scope.changeMode('month');
    }

    $scope.$on('saveNewPrescribe', function(event, prescription) {
      $scope.saveNewPrescribe(prescription);
    });

    $scope.saveNewPrescribe = function(prescription) {
      var promise;
      var edit = false;

      var validInput = true;

      console.log("creating prescription: " + JSON.stringify(prescription, null, 4));

      $.each(prescription.mainLiftSets, function() {

        if(this.mainLiftDefinition == undefined || this.mainLiftDefinition == null) {
          $scope.showCreationModal("You must select a lift", false);
          validInput = false;
          return;
        }
   

        if(this.mainLifts == undefined || this.mainLifts.length == 0) {
          $scope.showCreationModal("You must add atleast one table row", false);
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

      if(prescription.id == undefined || prescription.id == null) {

        var dateTime = $scope.currentDate.getTime();
        var prescriptionDate = new Date(dateTime);
        prescriptionDate.setHours(12);
        prescriptionDate.setMinutes(30);

        promise = workoutService.prescribeWorkout($scope.connectedAthlete.id, $scope.user.id, prescriptionDate.getTime(), prescription);
        promise.then(function(res) {
          if(res != null) {
            // Log success
            console.log("Prescription Successful");
            console.log(res);

            $scope.showCreationModal("Prescription Creation Successful", true);
          } else {
            // Log error
            console.log("Error creating Prescription"); 
          }
        
        }, function(error) {
          // Log error
          console.log("Error creating Prescription");
          console.log("Response: " + error);
        })

      } else {

        prescription.recordedSets = prescription.mainLiftSets;

        promise = workoutService.editPrescriptionEvent(prescription);
        promise.then(function(res) {
          if(res != null) {
            // Log success
            console.log("Prescription edit Successful");
            console.log(res);

            $scope.showCreationModal("Edit Successful", true);
          } else {
            // Log error
            console.log("Error editing Prescription"); 
          }
        
        }, function(error) {
          // Log error
          console.log("Error editing Prescription");
          console.log("Response: " + error);
        })

      }

    }

    $scope.deletePrescribe = function(prescription) {

      if(prescription == undefined || prescription == null || prescription.id == undefined || prescription.id == null) {
        console.log("No prescription to delete");
        return;
      }

      var promise = workoutService.removePrescriptionEvent(prescription);
      promise.then(function(res) {
          if(res != null) {
            // Log success
            console.log("Prescription delete Successful");
            console.log(res);

            $scope.showCreationModal("Delete Successful", true);
          } else {
            // Log error
            console.log("Error deleting Prescription"); 
          }
        
        }, function(error) {
          // Log error
          console.log("Error deleting Prescription");
          console.log("Response: " + error);
        })

    }

    $scope.cancelNewPrescribe = function() {
      $scope.newPrescribe = false;
      $scope.initializeEvents($scope.connectedAthlete.id);
      $scope.today();   
    }

    $scope.$on('cancelPostResults', function() {
      $scope.postingResults = false;
    });

    $scope.postResults = function() {
      if($scope.event != undefined && $scope.event != null) {
        $scope.postingResults = true;
        $scope.$broadcast('postResults');
      }
    }

    $scope.$on('cancelViewResults', function() {
      $scope.viewPrescription = false;
      $scope.newPrescribe = false;
    });

    $scope.viewResults = function() {
      if($scope.event != undefined && $scope.event != null) {
        $scope.viewPrescription = true;
        $scope.$broadcast('viewResults');
      }
    }

    $scope.updateORM = function(set) {
      if(set == null || set.mainLiftDefinition == undefined) {
        return;
      }

      var id;
      if($scope.connectedAthlete == undefined) {
        id = $scope.user.id;
      } else {
        id = $scope.connectedAthlete.id;
      }

      var promise = athleteService.updateORM(id, set.mainLiftDefinition.name, set.ORM);   
      promise.then(function(res) {
        if(res != null) {
          // Log success
          console.log("ORM Update complete");
          console.log(res);

          $scope.showCreationModal("Updated One Rep Max", false);
          $scope.$broadcast('getAthleteProfile');
        } else {
          // Log error
          console.log("Error updating ORM");  
        }
      
      }, function(error) {
        // Log error
        console.log("Error updating ORM");
        console.log("Response: " + error);
      })
    }

    $scope.changeMode = function(mode) {
      $scope.mode = mode;
    };

    $scope.today = function() {
      $scope.currentDate = new Date();
    };

    $scope.onEventSelected = function(event) {
      $scope.event = event;
    };

    $scope.onTimeSelected = function(selectedTime) {
      
      if($scope.eventSource == undefined || $scope.eventSource == null) {
        return false;
      }

      var result = false;
      angular.forEach($scope.eventSource, function(event, index) {
        if($scope.datesEqual(new Date(event.startTime), selectedTime)) {
          $scope.event = event;
          result = true;
          return;
        }
      });

      if(result == false) {
        $scope.event = null;
      }

      return result;
    };

    $scope.isToday = function() {
      return $scope.datesEqual(new Date(), new Date($scope.currentDate));
    };

    $scope.datesEqual = function(date1, date2) {

      if(date1 == undefined || date2 == undefined || date1 == null || date2 == null) {
        return false;
      }

      date1.setHours(0, 0, 0, 0);
      date2.setHours(0, 0, 0, 0);
      return date1.getTime() === date2.getTime();
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
        $scope.initializeCustomPrescription();

        // Refresh the tables
        $scope.cancelNewPrescribe();
      } 
    };

    $scope.initializeCustomPrescription = function() {
      $scope.customPrescription = {};
      $scope.counterOfPSet = 0;
      $scope.customPrescription.mainLiftSets = [{internalId: $scope.counterOfPSet,
      mainLifts: [{internalId: $scope.counterOfSet, assignedRepetitions: null, assignedPercentOfOneRepMax: null}]}];
    }

});
