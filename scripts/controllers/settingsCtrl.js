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
  	$scope.date = new Date();
  	$scope.tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  	$scope.months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];


    ///////////////////////////////////////////////////GRAPH SCRIPT HERE///////////////////////////////////////////////////
    var ormCnt = 1;
    var eventCnt = 1;

   	$scope.labels = [];
	$scope.series = [];
	$scope.data = [];

	$scope.labels2 = [];
	$scope.series2 = [];
	$scope.data2 = [];

	$scope.onClick = function (points, evt) {
	    //console.log(points, evt);
	    var activePoints = Chart.getPointsAtEvent(evt);
	    for(var i = 0; i < activePoints.length; i++) {
	    	console.log("Active point: " + activePoints[i]);
	    }
	};

	Chart.defaults.Line.datasetFill = false;
	Chart.defaults.Line.bezierCurve = false;

    ///////////////////////////////////////////////////GRAPH SCRIPT END///////////////////////////////////////////////////

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

  	$scope.expandChart = function(chart) {
  		if(chart.expanded == undefined) {
  			chart.expanded = true;
  		} else {
  			chart.expanded = !chart.expanded;
  		}
  	}

  	$scope.expandedORM = false;
  	$scope.expandORM = function() {
  		if($scope.expandedORM == undefined) {
  			$scope.expandedORM = true;
  		} else {
  			$scope.expandedORM = !$scope.expandedORM;
  		}
  	}

  	$scope.expandedEvent = false;
  	$scope.expandEvent = function() {
  		if($scope.expandedEvent == undefined) {
  			$scope.expandedEvent = true;
  		} else {
  			$scope.expandedEvent = !$scope.expandedEvent;
  		}
  	}

  	$scope.expandGraphORM = true;
  	$scope.expandGraphEvents = true;
  	$scope.expandGraph = function(graphName) {

  		if(graphName == 'ORM') {
  			$scope.expandGraphORM = !$scope.expandGraphORM;
  		} else if(graphName == 'AthleticEvents') {
  			$scope.expandGraphEvents = !$scope.expandGraphEvents;
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
				$scope.formatProfileDates();
				$scope.loadChart();
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

  	$scope.formatProfileDates = function() {
  		for(var i = 0; i < $scope.athleteProfile.oneRepMaxCharts.length; i++) {
  			var chart = $scope.athleteProfile.oneRepMaxCharts[i];
  			for(var j = 0; j < chart.oneRepMaxes.length; j++) {
  				var oneRepMax = chart.oneRepMaxes[j];
  				oneRepMax.date = new Date(oneRepMax.date);
  			}
  		}

  		for(var i = 0; i < $scope.athleteProfile.trackEventCharts.length; i++) {
  			var chart = $scope.athleteProfile.trackEventCharts[i];
  			for(var j = 0; j < chart.trackEvents.length; j++) {
  				var trackEvent = chart.trackEvents[j];
  				trackEvent.date = new Date(trackEvent.date);
  			}
  		}
  	}

  	$scope.loadChart = function() {
  		for(var i = 0; i < $scope.athleteProfile.oneRepMaxCharts.length; i++) {
  			var chart = $scope.athleteProfile.oneRepMaxCharts[i];

  			$scope.series.push(chart.liftName);

  			$scope.data[i] = [];

  			for(var j = chart.oneRepMaxes.length-1; j >= 0; j--) {
  				var oneRepMax = chart.oneRepMaxes[j];
  				oneRepMax.date = new Date(oneRepMax.date);

  				if(i == 0) {
  					$scope.labels.push($scope.months[oneRepMax.date.getMonth()]);
  				}

  				$scope.data[i].push(oneRepMax.value);
  			}
  		}


  		for(var i = 0; i < $scope.athleteProfile.trackEventCharts.length; i++) {
  			var chart = $scope.athleteProfile.trackEventCharts[i];

  			$scope.series2.push(chart.eventName);

  			$scope.data2[i] = [];

  			for(var j = chart.trackEvents.length-1; j >= 0; j--) {
  				var trackEvent = chart.trackEvents[j];
  				trackEvent.date = new Date(trackEvent.date);

  				if(i == 0) {
  					$scope.labels2.push($scope.months[trackEvent.date.getMonth()]);
  				}

  				$scope.data2[i].push(trackEvent.trackTime.hours*60*60+trackEvent.trackTime.minutes*60+trackEvent.trackTime.seconds);
  			}
  		}
  	}

  	$scope.resetAthleteProfile = function() {
  		$scope.loadAthleteProfile($scope.user.id);
  	}

  	$scope.addOneRepMaxRow = function(index) {
		$scope.athleteProfile.oneRepMaxCharts[index].oneRepMaxes.push({
			internalId: ++$scope.counterOfOneRepMax, 
			date: $scope.date,
			value: 0
		});
  	}

  	$scope.deleteOneRepMaxRow = function(parentIndex, index) {
		$scope.athleteProfile.oneRepMaxCharts[parentIndex].oneRepMaxes.splice(index, 1);
	}

  	$scope.addOneRepMaxChart = function(liftName) {

  		if(liftName != null && liftName.length > 0) {

			$scope.athleteProfile.oneRepMaxCharts.push({
				liftName: liftName, 
				oneRepMaxes: [{value: 0, date: $scope.date}]
			});

			$scope.newLift = "";
		}
  	}

	$scope.deleteOneRepMaxChart = function(index) {
		$scope.athleteProfile.oneRepMaxCharts.splice(index, 1);
	}

	$scope.addTrackEventRow = function(index) {
		$scope.athleteProfile.trackEventCharts[index].trackEvents.push({
			internalId: ++$scope.counterOfOneRepMax, 
			date: $scope.date,
			trackTime: {hours: 0, minutes: 0, seconds: 0}
		});
  	}

  	$scope.deleteTrackEventRow = function(parentIndex, index) {
		$scope.athleteProfile.trackEventCharts[parentIndex].trackEvents.splice(index, 1);
	}

  	$scope.addTrackEventChart = function(eventName) {

  		if(eventName != null && eventName.length > 0) {

			$scope.athleteProfile.trackEventCharts.push({
				eventName: eventName, 
				trackEvents: [{
					date: $scope.date,
					trackTime: {hours: 0, minutes: 0, seconds: 0}
				}]
			});

			$scope.newEvent = "";
		}
  	}

	$scope.deleteTrackEventChart = function(index) {
		$scope.athleteProfile.trackEventCharts.splice(index, 1);
	}

	$scope.updateAthleteProfile = function(athleteId, athleteProfile) {

		if(athleteProfile == undefined || athleteProfile == null) {
			console.log("Received null AthleteProfile");
			return;
		}

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
