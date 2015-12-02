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
  	$scope.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

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

  		// Find the earliest dates
  		var earliestORMDate = new Date();
  		for(var i = 0; i < $scope.athleteProfile.oneRepMaxCharts.length; i++) {
  			var ormChart = $scope.athleteProfile.oneRepMaxCharts[i];
  			var dateCheck = ormChart.oneRepMaxes[ormChart.oneRepMaxes.length - 1].date;
  			if(dateCheck.getTime() < earliestORMDate.getTime()) {
  				earliestORMDate = dateCheck;
  			}
  		}
  		var earliestEventDate = new Date();
  		for(var i = 0; i < $scope.athleteProfile.trackEventCharts.length; i++) {
  			var eventChart = $scope.athleteProfile.trackEventCharts[i];
  			var dateCheck = eventChart.trackEvents[eventChart.trackEvents.length - 1].date;
  			if(dateCheck.getTime() < earliestEventDate.getTime()) {
  				earliestEventDate = dateCheck;
  			}
  		}

  		// Construct the x-axis labels
  		$scope.createLabels($scope.labels, earliestORMDate);
  		$scope.createLabels($scope.labels2, earliestEventDate);

  		var thisYear = $scope.date.getYear();
  		var thisMonth = $scope.date.getMonth();

  		for(var i = 0; i < $scope.athleteProfile.oneRepMaxCharts.length; i++) {
  			var chart = $scope.athleteProfile.oneRepMaxCharts[i];

  			$scope.series.push(chart.liftName);
  			$scope.data[i] = [];

  			var lastUpdated = -1;
  			for(var j = chart.oneRepMaxes.length-1; j >= 0; j--) {
  				var oneRepMax = chart.oneRepMaxes[j];
  				oneRepMax.date = new Date(oneRepMax.date);

  				var dateIndex = $scope.getDateIndex($scope.labels, oneRepMax.date);
  				$scope.data[i][dateIndex] = oneRepMax.value;

  				if(lastUpdated < (dateIndex - 1)) {

  					var relevantData;
  					if(lastUpdated >= 0) {
  						relevantData = $scope.data[i][lastUpdated];
  					} else {
  						relevantData = oneRepMax.value;
  					}

  					for(var x = 0; x < dateIndex; x++) {
  						$scope.data[i][x] = relevantData;
  					}
  				}

  				lastUpdated = dateIndex;
  			}
  		}

  		for(var i = 0; i < $scope.athleteProfile.trackEventCharts.length; i++) {
  			var chart = $scope.athleteProfile.trackEventCharts[i];

  			$scope.series2.push(chart.eventName);

  			$scope.data2[i] = [];

  			var lastUpdated = -1;
  			for(var j = chart.trackEvents.length-1; j >= 0; j--) {
  				var trackEvent = chart.trackEvents[j];
  				trackEvent.date = new Date(trackEvent.date);

  				var dateIndex = $scope.getDateIndex($scope.labels2, trackEvent.date);
  				var trackTime = (trackEvent.trackTime.hours*3600+trackEvent.trackTime.minutes*60+trackEvent.trackTime.seconds);
  				$scope.data2[i][dateIndex] = trackTime;

  				if(lastUpdated < (dateIndex - 1)) {

  					var relevantData;
  					if(lastUpdated >= 0) {
  						relevantData = $scope.data2[i][lastUpdated];
  					} else {
  						relevantData = trackTime;
  					}

  					for(var x = 0; x < dateIndex; x++) {
  						$scope.data2[i][x] = relevantData;
  					}
  				}

  				lastUpdated = dateIndex;
  			}
  		}
  	}

  	$scope.getDateIndex = function(labelArray, date) {

  		var thisYear = $scope.date.getYear();
  		var thisMonth = $scope.date.getMonth();

  		var dateIndex = 0;
		if(date.getYear() != thisYear) {
			dateIndex = ((thisYear - date.getYear()) * -12) + 1;
		} 

		dateIndex = dateIndex + labelArray.length - (thisMonth - date.getMonth());
		return dateIndex;
  	}

  	$scope.createLabels = function(labelArray, earliestDate) {

  		var thisYear = $scope.date.getYear();
  		var thisMonth = $scope.date.getMonth();
  		var earliestYear = earliestDate.getYear();
  		var earliestMonth = earliestDate.getMonth();

  		var yearCounter = 0;
  		var monthCounter = earliestMonth;

  		// Push earlier years
	  	while(earliestYear + yearCounter < thisYear) {

			while(monthCounter <= 11) {
				labelArray.push($scope.months[monthCounter++]);
			}

  			monthCounter = 0;
  			yearCounter++;
	  	}

  		// Push this year
	  	while(monthCounter < thisMonth) {
			labelArray.push($scope.months[monthCounter++]);
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
