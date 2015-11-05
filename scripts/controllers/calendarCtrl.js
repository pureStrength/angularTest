'use strict';

/**
 * @ngdoc function
 * @name completeConceptStrength.controller:calendarCtrl
 * @description Controller of the athlete's tab
 * # athletesCtrl
 */
angular.module('homepageModule')
  .controller('calendarCtrl', function ($scope, userService, userConnectionService, workoutService, ModalService) {

  	$scope.$on('initializeEvents', function(event, athleteId) { 
      $scope.initializeEvents(athleteId);
    });

    $scope.initializeEvents = function(athleteId) { 

      if(athleteId === undefined) {
        athleteId = store.get('user').id;
      }

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
            res[i].title = 'Workout';
            res[i].startTime = res[i].dateAssigned;
            res[i].endTime = res[i].startTime;
            res[i].allDay = true;
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

    $scope.prescribeWorkout = function(athlete) {
      // Initialize custom set creation object
      $scope.initializeCustomPrescription();
      console.log(athlete.firstName+" is getting a prescription on "+$scope.currentDate);
      $scope.newPrescribe = true;
      $scope.$broadcast('usingWorkoutsTab');
    }

    $scope.cancelPrescribing = function() {
      $scope.$broadcast('cancelCalendar');
      $scope.today();
    }

    $scope.saveNewPrescribe = function(prescription) {
      var promise;
      var edit = false;

      var validInput = true;
      
      if(prescription.mainLiftSets.length == 0) {
        $scope.showCreationModal("You must add atleast one set", false);
        validInput = false;
        return;
      }

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

      promise = workoutService.prescribeWorkout($scope.connectedAthlete.id, $scope.user.id, $scope.currentDate.getTime(), prescription);
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

    }

    $scope.cancelNewPrescribe = function() {
      $scope.newPrescribe = false;
      $scope.initializeEvents($scope.connectedAthlete.id);
      $scope.today();   
    }

    $scope.postResults = function() {
      $scope.postingResults = true;
    }

    $scope.changeMode = function (mode) {
      $scope.mode = mode;
    };

    $scope.today = function () {
        $scope.currentDate = new Date();
    };

    $scope.onEventSelected = function (event) {
      $scope.event = event;
      console.log("Clicked Event");
    };

    $scope.isToday = function () {
      var today = new Date(),
          currentCalendarDate = new Date($scope.currentDate);

      today.setHours(0, 0, 0, 0);
      currentCalendarDate.setHours(0, 0, 0, 0);
      return today.getTime() === currentCalendarDate.getTime();
    };

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
