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
        $scope.success = res;
      })
  	}

    $scope.authenticate = function(user) {

      var promise = userService.authenticate(user);
      promise.then(function(res)
      {
        $scope.user = res;
        $scope.code = 200;
      }, function(status) {
          $scope.user = {};
          $scope.code = status;
      })
    }

  });