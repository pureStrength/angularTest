'use strict';

/**
 * @ngdoc function
 * @name completeConceptStrength.controller:userCtrl
 * @description
 * # userCtrl
 * Controller of the completeConceptStrength
 */
angular.module('completeConceptStrength.userCtrl', [])
  .controller('userCtrl', function ($scope, userService) {

  	$scope.register = function(user) {

  	  var promise = userService.register(user);
      promise.then(function(res)
      {
		if(res == "true") {
			console.log("Registration successful");
			$scope.error = "";
			location.href = "login.html";
		} else {
			console.log("Error registering user");
			$scope.error = "Error registering user";	
		}
        
      }, function(error) {
		  	console.log("Error registering user");
			console.log("Response: " + error);
			$scope.error = "Error registering user";
	  })
  	}

    $scope.authenticate = function(user) {

      var promise = userService.authenticate(user);
      promise.then(function(res)
      {
			console.log("Login successful");
        	$scope.error = "";
			
			if(res.userType == "ATHLETE") {
				location.href = "homepage_athlete.html"	
			} else if(res.userType == "COACH") {
				location.href = "homepage_trainer.html"
			}
      }, function(error) {
            console.log("Error logging in user");
			console.log("Response: " + error);
			$scope.error = "Username or password is incorrect";
      })
    }
	
	$scope.logout = function() {
		console.log("Logging out");
		location.href = "login.html";
	}

  });