'use strict';

/**
 * @ngdoc function
 * @name completeConceptStrength.controller:userCtrl
 * @description
 * # userCtrl
 * Controller of the completeConceptStrength
 */
angular.module('indexModule', ['userService'])
  .controller('indexCtrl', function ($scope, userService) {
	  
	$scope.registerLoad = function() {
		$scope.userType = "ATHLETE";	
		$scope.showModal = false;
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
			console.log("Password does not meet requirements)");
			$scope.error = "Password does not meet requirements";
			return;	
		}
		
		// User type radio button
		if(!userType || !userType.length) {
			console.log("Missing userType");
			$scope.error = "Please select a user type";
			return;
		}
		
		// Set the user type
		user.userType = userType;

		var promise = userService.register(user);
		promise.then(function(res) {
			if(res == "true") {
				// Log success
				console.log("Registration successful");
				$scope.error = "";
				
				// Popup modal to display status to the user
				if(requireVerification == true) {
					$scope.modalHeader = "Registration almost complete!";
					$scope.modalBody = "Please check your email for instructions " +
						"to complete your registration";
				} else {
					$scope.modalHeader = "Registration complete!";
					$scope.modalBody = "You may now login to your account";
				}

				$scope.showModal = true;
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

    $scope.login = function(user) {
		
		// Check parameters
		if(!user) {
			console.log("Undefined User");
			$scope.error = "Please enter email and password";
			return;
		}
		if(!user.email || !user.email.length) {
			console.log("Undefined email");
			$scope.error = "Please enter a valid email";
			return;	
		}
		if(!user.password || !user.password.length) {
			console.log("Undefined password");
			$scope.error = "Please enter your password";
			return;	
		}

		// Make web request
		var promise = userService.authenticate(user);
		promise.then(function(res) {
			console.log("Login successful");
			$scope.error = "";

			// Store the user
			store.set('user', res);
			
			// Continue to user homepage
			if(res.userType == "ATHLETE") {
				location.href = "homepage_athlete.html"	
			} else if(res.userType == "COACH") {
				location.href = "homepage_trainer.html"
			}

		}, function(error) {
			// Log error
			console.log("Error logging in user");
			console.log("Response: " + error);
			$scope.error = "Username or password is incorrect";
		})
    }

	$scope.closeModal = function(){
        // Continue to the login page
		location.href = "login.html";
    };
});
  