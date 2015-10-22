'use strict';

/**
 * @ngdoc function
 * @name completeConceptStrength.controller:settingsCtrl
 * @description Controller of the settings tab
 * # settingsCtrl
 */
angular.module('homepageModule')
  .controller('settingsCtrl', function ($scope, userService, ModalService) {

  	$scope.loadSettingsTab = function() {
  		$scope.settingsUser = store.get('user');
  		console.log("Copied user settings");
  	}

  	$scope.update = function(user) {
		
		// Check parameters
		if(!user) {
			console.log("Undefined User");
			$scope.error = "Please fill out the required fields";
			return;
		}

		if(!user.firstName || !user.firstName.length || 
		   !user.lastName  || !user.lastName.length  || 
		   !user.email     || !user.email.length)    {
			console.log("Missing field");
			console.log(user);
			$scope.error = "Please fill out the required fields";
			return;	
		}

		var promise = userService.update(user);
		promise.then(function(res) {
			if(res == "true") {
				// Log success
				console.log("Update successful");
				$scope.error = "";

				// Display the success modal
				$scope.user = user;
				store.set('user', user);
				$scope.showSettingsModal();
			} else {
				// Log error
				console.log("Error updating user");
				$scope.error = "Error updating user";	
			}
		
		}, function(error) {
			// Log error
			console.log("Error updating user");
			console.log("Response: " + error);
			$scope.error = "Error updating user";
		})
  	}

  	$scope.showPasswordModal = function() {

        ModalService.showModal({
            templateUrl: 'passwordModal.html',
            controller: "homepageCtrl"
        }).then(function(modal) {
            
			// Display correct message
			$scope.modalHeader = "Update password";
            modal.element.append($("#passwordModal"));
            $("#passwordModal").modal({
			    backdrop: 'static',
			    keyboard: false 
			});
        });
  	}

  	$scope.submitPasswordModal = function(user) {

  		if(!user.newPassword || !user.newPassword.length ||
  		   !user.oldPassword || !user.oldPassword.length ||
  		   !user.repeatPassword || !user.repeatPassword.length) {
  			$scope.passwordError = "All fields are required";
  			return;
  		}

  		if(user.newPassword != user.repeatPassword) {
  			$scope.passwordError = "The passwords do not match";
  			return;
  		}

		// Check if the old password is correct
		var authUser = $scope.user;
		authUser.password = user.oldPassword;
		var promise = userService.authenticate(authUser);
		promise.then(function(res) {
			console.log("Auth successful");
			$scope.passwordError = "";

			var promise = userService.update(authUser);
			promise.then(function(res) {
				console.log("Update successful");
				$scope.passwordError = "";

				store.set('user', user);
				$scope.user = authUser;

				$scope.closePasswordModal();
				$scope.showSettingsModal();
			}, function(error) {
				// Log error
				$scope.passwordError = "Error updating password";
			})

		}, function(error) {
			// Log error
			$scope.passwordError = "Old password is incorrect";
		})
  	}

  	$scope.closePasswordModal = function() {
		// Nothing to do
    };
	
	$scope.showSettingsModal = function() {

        ModalService.showModal({
            templateUrl: 'settingsModal.html',
            controller: "homepageCtrl"
        }).then(function(modal) {
            
			// Display correct message
			$scope.modalHeader = "Update successful";
            
            modal.element.append($("#settingsModal"));
            $("#settingsModal").modal({
			    backdrop: 'static',
			    keyboard: false 
			});
        });
    };

	$scope.closeSettingsModal = function() {
		// Nothing to do
    };
	
  });
