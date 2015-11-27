'use strict';

/**
 * @ngdoc function
 * @name completeConceptStrength.controller:settingsCtrl
 * @description Controller of the settings tab
 * # settingsCtrl
 */
angular.module('homepageModule')
  .controller('settingsCtrl', function ($scope, $location, userService, athleteService, ModalService) {

  	$scope.cellCarriers = ["N/A", "AT&T", "Metro PCS", "Nextel", "Sprint", "T Mobile", "Verizon"];

  	$scope.$on('usingSettingsTab', function(event, userUsed) {

  		var user = userUsed.user;
  		var connection = userUsed.userConnectionStatus;

  		if(user == undefined) {
	  		user = userUsed;
	  		connection = null;
  		}

  		$scope.originalUser = user;

  		// Make a copy of the logged in user so we can independently edit variables
		$scope.resetSettings(user, connection);

  		// Load athlete profile
  		if(user.userType == 'Athlete') {
  			$scope.loadAthleteProfile(user.id);
  			$scope.counterOfOneRepMax = 0;
  		}

	});

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

  	$scope.resolveHref = function(name) {
  		var path = '' + $location.path();

  		console.log("Name: " + name);

  		var collapseAppender;
  		var anchorAppender;
  		if(path.indexOf('/settings' >= 0)) {
  			anchorAppender = "s";
  			collapseAppender = "cs"; 
  		} else if(path.indexOf('/athletes') >= 0) {
  			anchorAppender = "a";
  			collapseAppender = "ca"; 
  		} else if(path.indexOf('/connections') >= 0) {
  			anchorAppender = "c";
  			collapseAppender = "cc"; 
  		}

  		var collapse = document.getElementById(collapseAppender + name);
  		var anchor   = document.getElementById(anchorAppender + name);
  		var hrefName = name.replace(" ", "_");
  		hrefName = $scope.currentTab + hrefName;

  		if(collapse != null) {
	  		collapse.id = hrefName;
	  		anchor.href = "#" + hrefName;
  		}
  	}

  	$scope.resetSettings = function(userUsed, connection) {
  		$scope.settingsUser = {};
  		$scope.settingsConnection = connection;
  		angular.copy(userUsed, $scope.settingsUser);
  	}

  	$scope.loadAthleteProfile = function(athleteId) {

		var promise = athleteService.get(athleteId);
		promise.then(function(res) {
			if(res != null) {
				// Log success
				console.log("Loaded athlete profile");
				console.log(res);

				$scope.athleteProfile = res;
			} else {
				// Log error
				console.log("Error loading Athlete Profile");
				$scope.error = "Error loading Athlete Profile";	
			}
		
		}, function(error) {
			// Log error
			console.log("Error loading Athlete Profile");
			console.log("Response: " + error);
			$scope.error = "Error loading Athlete Profile";
		})  			

  	}

  	$scope.resetAthleteProfile = function() {
  		$scope.loadAthleteProfile($scope.user.id);
  	}

  	$scope.addOneRepMaxRow = function() {
		$scope.athleteProfile.oneRepMaxCharts.push({
			internalId: ++$scope.counterOfOneRepMax, 
			liftName: null, 
			mostRecentOneRepMax: {value: 0, date: null},
			oneRepMaxes: []
		});
  	}

  	$scope.deleteOneRepMaxRow = function(index) {
		$scope.athleteProfile.oneRepMaxCharts.splice(index, 1);
	}

	$scope.updateAthleteProfile = function(athleteId, athleteProfile) {

		if(athleteProfile == undefined || athleteProfile == null) {
			console.log("Received null AthleteProfile");
			return;
		}

		// Loop the one rep maximums to check if any changes were made
		angular.forEach(athleteProfile.oneRepMaxCharts, function(oneRepMaxChart) {

			if(oneRepMaxChart.mostRecentOneRepMax != undefined) {

				var maxExists = false;
				if(oneRepMaxChart.oneRepMaxes != null) {
					angular.forEach(oneRepMaxChart.oneRepMaxes, function(chart) {

						if(angular.equals(oneRepMaxChart.mostRecentOneRepMax, chart)) {
							maxExists = true;
							return;
						}
					});
				}

				// Add the MostRecentOneRepMax to the list of OneRepMaxes
				if(maxExists == false) {
					oneRepMaxChart.mostRecentOneRepMax.id = null;
					oneRepMaxChart.mostRecentOneRepMax.date = moment().format("MM-DD-YYYY");
					oneRepMaxChart.oneRepMaxes.push(oneRepMaxChart.mostRecentOneRepMax);
					console.log("Adding new OneRepMax");
					console.log(oneRepMaxChart.mostRecentOneRepMax);
				}
			} else {
				console.log("MostRecentOneRepMax is undefined");
				console.log(oneRepMaxChart);
			}

		});

		var promise = athleteService.update(athleteId, athleteProfile);
		promise.then(function(res) {
			if(res != null && res == 'true') {
				// Log success
				console.log("Updated athlete profile");

				$scope.showSettingsModal();
			} else {
				// Log error
				console.log("Error updating Athlete Profile");
				$scope.error = "Error updating Athlete Profile";	
			}
		
		}, function(error) {
			// Log error
			console.log("Error updating Athlete Profile");
			console.log("Response: " + error);
			$scope.error = "Error updating Athlete Profile";
		})  

	}

  	$scope.showPasswordModal = function() {

        ModalService.showModal({
            templateUrl: 'partials/passwordModal.html',
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

  	$scope.submitPassword = function(user) {

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

			authUser.password = user.newPassword;
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
		$('#passwordModal').modal('hide');
		$scope.settingsUser.oldPassword = '';
		$scope.settingsUser.newPassword = '';
		$scope.settingsUser.repeatPassword = '';
    };
	
	$scope.showSettingsModal = function() {

        ModalService.showModal({
            templateUrl: 'partials/settingsModal.html',
            controller: "homepageCtrl"
        }).then(function(modal) {
            
			// Display correct message
			$scope.modalHeader = "Update Successful";
            
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
