'use strict';

/**
 * @ngdoc function
 * @name completeConceptStrength.controller:settingsCtrl
 * @description Controller of the settings tab
 * # settingsCtrl
 */
angular.module('homepageModule')
  .controller('settingsCtrl', function ($scope, userService, athleteService, ModalService) {

  	$scope.$on('usingSettingsTab', function(event, args) {

  		// Make a copy of the logged in user so we can independently edit variables
		$scope.resetSettings();

  		// Load athlete profile
  		if($scope.user.userType == 'Athlete') {
  			$scope.loadAthleteProfile($scope.user.id);
  			$scope.counterOfOneRepMax = 0;
  		}

  		// Initialize the ORM calendar
  		$scope.ormCalendar = {opened: true};
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

  	$scope.setUnitType = function(unitType) {
  		$scope.settingsUser.preferenceUnitType = unitType;
  	}

  	$scope.initializeUnitType = function(unitType) {

  		var imperial = document.getElementById("unitTypeImperial");
  		var metric = document.getElementById("unitTypeMetric");

  		if(unitType == 'Imperial') {
  			metric.className = metric.className.replace('active', '');
			imperial.className = imperial.className + " active";
			
		} else {
			imperial.className = imperial.className.replace('active', '');
			metric.className = metric.className + " active";
		}

  	}

  	$scope.resetSettings = function() {
  		$scope.settingsUser = {};
  		angular.copy($scope.user, $scope.settingsUser);

  		// Initialize the unit type and radio button
  		$scope.initializeUnitType($scope.settingsUser.preferenceUnitType);
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

	$scope.openORMCalendar = function($event, index) {
		$scope.ormCalendar.opened = true;
		console.log("opening calendar");
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
