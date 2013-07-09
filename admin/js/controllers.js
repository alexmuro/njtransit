'use strict';

/* Controllers */


angular.module('myApp.controllers', [])
.controller('HomeCtrl', ['$scope', '$http','MarketArea',
  	function($scope, $http, MarketArea) {
  		$scope.activeMarket = MarketArea.getMarketArea();
  		
  }])
  .controller('ModelRunCtrl', ['$scope', '$http','MarketArea',
  	function($scope, $http, MarketArea) {
  		$scope.activeMarket = MarketArea.getMarketArea();
      
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
        transitModel.date=datestring;
        transitModel.start_hour = $scope.AMstart.getHours();
        transitModel.end_hour = $scope.AMend.getHours();
        transitModel.name = $scope.runName;
        transitModel.run();
      }

  }])
  .controller('ModelDataCtrl', ['$scope', '$http','MarketArea',
  	function($scope, $http, MarketArea) {
  		$scope.activeMarket = MarketArea.getMarketArea();
  		
  }])
  .controller('ModelOTPCtrl', ['$scope', '$http','MarketArea',
  	function($scope, $http, MarketArea) {
  		$scope.activeMarket = MarketArea.getMarketArea();
  		
  }])
  .controller('ModelOverviewCtrl', ['$scope', '$http','MarketArea',
  	function($scope, $http, MarketArea) {
  		$scope.activeMarket = MarketArea.getMarketArea();
  		
  }])
  .controller('ModelRoutesCtrl', ['$scope', '$http','MarketArea',
  	function($scope, $http, MarketArea) {
  		$scope.activeMarket = MarketArea.getMarketArea();
  		
  }])
  .controller('ModelStopsCtrl', ['$scope', '$http','MarketArea',
  	function($scope, $http, MarketArea) {
  		$scope.activeMarket = MarketArea.getMarketArea();
  		
  }])
  .controller('NavCtrl', ['$scope', '$http','MarketArea',
  	function($scope, $http, MarketArea) {
  		$scope.activeMarket = MarketArea.getMarketArea();
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

      $scope.getModelRuns =function(){
        return  $http({url:'/data/get/getModelRuns.php',data:{zone_id:$scope.activeMarket.id},method:"POST"}).then(function(data){
            return(data);
        })
      }
    
      $scope.getModelRuns().then(function(data){
        $scope.modelRuns = data.data;
        $scope.activeModel = $scope.modelRuns[0]; 
      })

  		$scope.isActiveMarket = function(id){
        	return id == $scope.activeMarket.id ? 'active' : '';
      	}

      $scope.isActiveModel = function(id){
          return id == $scope.activeModel.id ? 'active' : '';
        }  

      $scope.setModel = function(input){
        $scope.activeModel = input;
      }

      $scope.setMarket = function(input){
    		$scope.activeMarket = input;
    		MarketArea.setMarketArea($scope.activeMarket);
        $scope.getModelRuns().then(function(data){
           $scope.modelRuns = data.data;
           $scope.activeModel = $scope.modelRuns[0];
        })
      }
  }]);



 
