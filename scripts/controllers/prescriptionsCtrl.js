'use strict';

/**
 * @ngdoc function
 * @name completeConceptStrength.controller:prescriptionsCtrl
 * @description Controller of the prescriptions tab
 * # prescriptionsCtrl
 */
angular.module('homepageModule')
  .controller('prescriptionsCtrl', function ($scope, workoutService, athleteService, ModalService) {
  	
  	$scope.viewPrescription = false;

	$scope.cancelPostResults = function() {
		$scope.postingResults = false;
		$scope.$emit('cancelPostResults');
	}

	$scope.cancelViewResults = function() {
		$scope.viewPrescription = false;
		$scope.$emit('cancelViewResults');
	}

	$scope.postEvent = function(selectedPrescription) {

		var promise = workoutService.postResults(selectedPrescription);
	    promise.then(function(res) {
	        if(res != null) {
	          // Log success
	          console.log("Posted results");
	          console.log(res);

	          $scope.showPrescriptionModal("Posted Results", true);
	        } else {
	          // Log error
	          console.log("Error posting results"); 
	          $scope.showPrescriptionModal("Error Posting Results", false);
	        }
	      
	      }, function(error) {
	        // Log error
	        console.log("Error posting results");
	        console.log("Response: " + error);
	        $scope.showPrescriptionModal("Error Posting Results", false);
	    })

	}

	$scope.$on('postResults', function() {
		$scope.postingResults = true;

		// Get the updated info for the prescription
		var promise = workoutService.fillAssignedWeight($scope.event.id);
	    promise.then(function(res) {
	        if(res != null) {
	          // Log success
	          console.log("Returned assigned weight");
	          console.log(res);

	          $scope.selectedPrescription = res;
	          $scope.updateORM();
	        } else {
	          // Log error
	          console.log("Error assigning weight"); 
	        }
	      
	      }, function(error) {
	        // Log error
	        console.log("Error assigning weight");
	        console.log("Response: " + error);
	    })
	});

	$scope.$on('viewResults', function() {
		$scope.viewPrescription = true;

		// Get the updated info for the prescription
		var promise = workoutService.showAthletePrescription($scope.event.id);
	    promise.then(function(res) {
	        if(res != null) {
	          // Log success
	          console.log("Returned assigned weight");
	          console.log(res);

	          $scope.selectedPrescription = res;
	          $scope.updateORM();
	        } else {
	          // Log error
	          console.log("Error assigning weight"); 
	        }
	      
	      }, function(error) {
	        // Log error
	        console.log("Error assigning weight");
	        console.log("Response: " + error);
	    })
	});	

	$scope.updateORM = function() {
		// Set the ORM values
		var promise = athleteService.get($scope.user.id);
	    promise.then(function(res) {
	        if(res != null) {
	          // Log success
	          console.log("Selected athlete profile");
	          console.log(res);

	          $scope.athleteProfile = res;
	          $scope.matchORM();
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

	$scope.matchORM = function() {

		angular.forEach($scope.selectedPrescription.recordedSets, function(set, index) {

			angular.forEach($scope.athleteProfile.oneRepMaxCharts, function(ORM, index) {

				if(set.mainLiftDefinition.name == ORM.liftName) {
					set.ORM = ORM.mostRecentOneRepMax.value;
					return;
				}

			});

		});

	}

    $scope.showPrescriptionModal = function(header, success) {

		ModalService.showModal({
		  templateUrl: 'prescriptionModal.html',
		  controller: "homepageCtrl"
		}).then(function(modal) {
		    
		  // Display correct message
		  $scope.pModalHeader = header;
		  $scope.pSuccess = success;

		  console.log($scope.pModalHeader);
		        
		  modal.element.append($("#prescriptionModal"));
		      $("#prescriptionModal").modal({
		      backdrop: 'static',
		      keyboard: false 
		    });
		});
    };

    $scope.closePrescriptionModal = function(wasSuccessful) {
		if(wasSuccessful) {
			$scope.cancelPostResults();
		} 
    };
	
  });
