'use strict';

/**
 * @ngdoc function
 * @name completeConceptStrength.controller:calendarCtrl
 * @description Controller of the athlete's tab
 * # athletesCtrl
 */
angular.module('homepageModule')
  .controller('calendarCtrl', function ($scope, userService, userConnectionService, workoutService, ModalService) {

    
  		$scope.initializeEvents = function() {

  			// The events array
  			$scope.eventSource = [];

  			// Add an event to the array
  			var today = new Date();
			 $scope.eventSource.push({
				title: 'Workout',
				startTime: today,
				endTime: today,
				allDay: true
			})

  		}

      $scope.prescribeWorkout = function(athlete)
      {
        // Initialize custom set creation object
        $scope.initializeCustomSet();
        $scope.initializeCustomPrescription();
        console.log(athlete.firstName+" is getting a prescription on "+$scope.currentDate);
        $scope.newPrescribe = true;
      }

      $scope.cancelPrescribing = function(){
        $scope.$emit('cancelCalendar');
        $scope.today();
      }

      $scope.saveNewPrescribe = function(){

      }

      $scope.cancelNewPrescribe = function(){
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

      $scope.initializeCustomSet = function() {
        $scope.customSet = {};
      $scope.counterOfSet = 0;
      $scope.customSet.mainLifts = [{internalId: $scope.counterOfSet, assignedRepetitions: null, assignedPercentOfOneRepMax: null}];
      }

      $scope.initializeCustomPrescription = function() {
        $scope.customPrescription = {};
        $scope.counterOfPSet = 0;
        $scope.customPrescription.mainLiftSets = [{internalId: $scope.counterOfPSet,
        mainLifts: [{internalId: $scope.counterOfSet, assignedRepetitions: null, assignedPercentOfOneRepMax: null}]}];
      }


      $scope.prescriptionSelected = function(cPres) {
        if(cPres == null) {
          $scope.initializeCustomPrescription();
        }

        else{
          $scope.customPrescription = cPres;
        }



      }

     

  });