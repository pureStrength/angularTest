'use strict';

/**
 * @ngdoc function
 * @name completeConceptStrength.controller:registerCtrl
 * @description Controller of the registration
 * # registerCtrl
 */
angular.module('registerModule', ['userService', 'angularModalService'])
  .controller('registerCtrl', function ($scope, userService, ModalService) {
	  
	$scope.registerLoad = function() {
		$scope.user = {};
		$scope.setUserType('Athlete');
	}

	$scope.setUserType = function(userType) {
		$scope.user.userType = userType;
	}

  	$scope.register = function(user, userType) {
		
		// Check parameters
		if(!user) {
			console.log("Undefined User");
			$scope.error = "Please fill out the required fields";
			return;
		}
		if(!user.firstName || !user.firstName.length || 
		   !user.lastName  || !user.lastName.length  || 
		   !user.email     || !user.email.length)    {
			console.log("Missing firstName field");
			console.log(user);
			$scope.error = "Please fill out the required fields";
			return;	
		}

		// Password requirements
		if(!user.password || !user.password.length) {
			console.log("Password does not meet requirements");
			$scope.error = "Password does not meet requirements";
			return;	
		}
		
		// User type radio button
		if(!user.userType || !user.userType.length) {
			console.log("Missing userType");
			$scope.error = "Please select a user type";
			return;
		}

		var promise = userService.register(user);
		promise.then(function(res) {
			if(res == "true") {
				// Log success
				console.log("Registration successful");
				$scope.error = "";

				// Display the success modal
				$scope.showModal();
			} else {
				// Log error
				console.log("Error registering user");
				$scope.error = "Error registering user";	
			}
		
		}, function(error) {
			// Log error
			console.log("Error registering user");
			console.log("Response: " + error);
			$scope.error = "Error registering user";
		})
  	}
	
	$scope.showModal = function() {

        ModalService.showModal({
            templateUrl: 'modal.html',
            controller: "registerCtrl"
        }).then(function(modal) {
            
			// Display correct message
			if(requireVerification == true) {
				$scope.modalHeader = "Registration almost complete!";
				$scope.modalBody = "Please check your email for instructions " +
					"to complete your registration";
			} else {
				$scope.modalHeader = "Registration complete!";
				$scope.modalBody = "You may now login to your account";
			}
            
            modal.element.append($("#successModal"));
            $("#successModal").modal({
			    backdrop: 'static',
			    keyboard: false 
			});
        });
    };

	$scope.closeModal = function() {
        // Continue to the login page
		location.href = "login";
    };
});
  