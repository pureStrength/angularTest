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

    $scope.saveNewPrescribe = function() {

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

    $scope.initializeCustomPrescription = function() {
      $scope.customPrescription = {};
      $scope.counterOfPSet = 0;
      $scope.customPrescription.mainLiftSets = [{internalId: $scope.counterOfPSet,
      mainLifts: [{internalId: $scope.counterOfSet, assignedRepetitions: null, assignedPercentOfOneRepMax: null}]}];
    }

});
