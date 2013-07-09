'use strict';

/* Controllers */


angular.module('myApp.controllers', [])
.controller('HomeCtrl', ['$scope', '$http','MarketArea',
  	function($scope, $http, MarketArea) {
  		$scope.activeMarket = MarketArea.getData();
  		
  }])
  .controller('ModelRunCtrl', ['$scope', '$http','MarketArea',
  	function($scope, $http, MarketArea) {
  		$scope.activeMarket = MarketArea.getData();
      
      //AM Peak Hours
      $scope.AMstart = new Date();
      $scope.AMstart.setHours(7);
      $scope.AMstart.setMinutes(0);
      $scope.AMend = new Date();
      $scope.AMend.setHours(9);
      $scope.AMend.setMinutes(0)
      $scope.hstep = 1;
      $scope.mstep = 15;
    
      $scope.today = function() {
        $scope.dt = new Date();
      };
      $scope.today();
      // Disable weekend selection
      $scope.disabled = function(date, mode) {date
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
      };

      $scope.output = "";
      $scope.runModel = function(){
        var datestring = $scope.dt.getMonth()+"/"+$scope.dt.getDate()+"/"+$scope.dt.getYear();
        $scope.output ="Running model "+$scope.runName
        //$http({url:'/otp/ctppModel.php',params:{zone:$scope.activeMarket.id,name:$scope.runName,run_date:datestring,start_hour:$scope.AMstart.getHours(),end_hour:$scope.AMend.getHours()},method:"GET"})
        transitModel.zone=$scope.activeMarket.id;
        transitModel.run();
      }
      
  }])
  .controller('ModelDataCtrl', ['$scope', '$http','MarketArea',
  	function($scope, $http, MarketArea) {
  		$scope.activeMarket = MarketArea.getData();
  		
  }])
  .controller('ModelOTPCtrl', ['$scope', '$http','MarketArea',
  	function($scope, $http, MarketArea) {
  		$scope.activeMarket = MarketArea.getData();
  		
  }])
  .controller('ModelOverviewCtrl', ['$scope', '$http','MarketArea',
  	function($scope, $http, MarketArea) {
  		$scope.activeMarket = MarketArea.getData();
  		
  }])
  .controller('ModelRoutesCtrl', ['$scope', '$http','MarketArea',
  	function($scope, $http, MarketArea) {
  		$scope.activeMarket = MarketArea.getData();
  		
  }])
  .controller('ModelStopsCtrl', ['$scope', '$http','MarketArea',
  	function($scope, $http, MarketArea) {
  		$scope.activeMarket = MarketArea.getData();
  		
  }])
  .controller('NavCtrl', ['$scope', '$http','MarketArea',
  	function($scope, $http, MarketArea) {
  		$scope.activeMarket = MarketArea.getData();
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
  			}

  		];
  		
  		$scope.isActiveMarket = function(id){
        	return id == $scope.activeMarket.id ? 'active' : '';
      	}

      $scope.setMarket = function(input){
      		$scope.activeMarket = input;
      		MarketArea.setData($scope.activeMarket);
      	}
  }]);



 
