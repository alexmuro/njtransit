'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MyCtrl1', [function() {
  }])
  .controller('MyCtrl2', [function() {
  }])
  .controller('LoginCtrl', ['$scope', '$http',
  	function($scope, $http) {
  
  }])
  .controller('NavCtrl', ['$scope', '$http',
  	function($scope, $http) {
  		$scope.activeMarket = 2;
  		$scope.marketAreas = [
  			{
  				name: 'Newark',
  				id: 0
  			},
  			{
  				name: 'Paterson',
  				id: 1
  			},
  			{
  				name: 'Atlantic City',
  				id: 2
  			},
  			{
  				name: 'Greater Philadelphia',
  				id: 3
  			},
  			{
  				name: 'Princeton',
  				id: 4
  			},

  		];
  		
  		$scope.isActiveMarket = function(id){
        	return id == $scope.activeMarket ? 'active' : '';
      	}

      	$scope.setMarket = function(id){
      		$scope.activeMarket = id;
      	}
  }]);