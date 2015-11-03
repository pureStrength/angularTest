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

  	});

    $scope.prescribeWorkout = function(athlete) {
      // Initialize custom set creation object
      $scope.initializeCustomPrescription();
      console.log(athlete.firstName+" is getting a prescription on "+$scope.currentDate);
      $scope.newPrescribe = true;
    }

    $scope.cancelPrescribing = function() {
      $scope.$emit('cancelCalendar');
      $scope.today();
    }

    $scope.saveNewPrescribe = function(prescription) {
      var promise;

      prescription.dateAssigned = $scope.currentDate;

      var edit = false;
      var textString = '';

      if(prescription.id != undefined && prescription.id != null) {
        edit = true;
      }  

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

      if(edit == true) {
        promise = workoutService.editPrescriptionEvent(prescription);
        textString = 'Edit';
      } else {
        promise = workoutService.prescribeWorkout($scope.connectedAthlete.id, $scope.user.id, prescription);
        textString = 'Creation';
      }

      promise.then(function(res) {
        if(res != null) {
          // Log success
          console.log("Prescribe "+textString+" Prescription");
          console.log(res);

          $scope.showCreationModal("Prescribe "+textString+" Successful", true);
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

    $scope.cancelNewPrescribe = function() {
      $scope.newPrescribe = false;
      $scope.today();   
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
        $scope.initializeCustomSet();
        $scope.initializeCustomPrescription();

        // Refresh the tables
            $scope.loadWorkouts();
            $scope.cancelCreate();
      } 
    };

    $scope.initializeCustomPrescription = function() {
      $scope.customPrescription = {};
      $scope.counterOfPSet = 0;
      $scope.customPrescription.mainLiftSets = [{internalId: $scope.counterOfPSet,
      mainLifts: [{internalId: $scope.counterOfSet, assignedRepetitions: null, assignedPercentOfOneRepMax: null}]}];
    }

});
