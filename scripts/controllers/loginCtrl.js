'use strict';

/**
 * @ngdoc function
 * @name completeConceptStrength.controller:loginCtrl
 * @description Controller of the login
 * # loginCtrl
 */
angular.module('loginModule', ['userService'])
  .controller('loginCtrl', function ($scope, userService) {

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
				location.href = "athleteHomepage"	
			} else if(res.userType == "COACH") {
				location.href = "trainerHomepage"
			}

		}, function(error) {
			// Log error
			console.log("Error logging in user");
			console.log("Response: " + error);
			$scope.error = "Username or password is incorrect";
		})
    }
	
});
  