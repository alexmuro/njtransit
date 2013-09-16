'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
.factory('UserService', [function($rootScope) {
	var sdo = {
		isLogged: false,
		username: ''
	};
	return sdo;
}]).value('version', '0.1')
.factory('MarketArea', ['$rootScope',
    function($rootScope) {
        var activeMarket = {name: 'Atlantic City',id: 2};
        var activeModel = {id:'137',name:'8/8/13 - Atlantic City (Standard)'}

        return {
            getMarketArea: function() {
                return activeMarket;
            },
            setMarketArea: function(newData) {
                activeMarket = newData;
                $rootScope.$broadcast('marketUpdated');
                
            },
            getModel: function() {
                return activeModel;
            },
            setModel: function(newData) {
                activeModel = newData; 
                $rootScope.$broadcast('modelUpdated');
            }
        }
    }
])
.factory('ActiveModelService', ['$rootScope','$http','$timeout',
    function($rootScope,$http,$timeout) {
        var active_run = false;
        var modelID = -1;
        var trips_complete = 0;
        var totalTrips = 0;

        var checkStatus = function(run_id){
            $http({url:'/data/get/modelRunStatus.php',params:{model_run_id:run_id},method:"GET"})
            .success(function(data) {
                //console.log(data);
                if(data.finished == "1"){
                  active_run = false;
                  $rootScope.$broadcast('ActiveModelComplete');
                }
                else{
                  trips_complete = data.numTrips;
                  $rootScope.$broadcast('ActiveModelUpdate');
                  $timeout(checkStatus(run_id),4000);//recursive on a 4 second time out
                }
            })
            .error(function(e) {
                console.log(e);
            });
        }
        return {
            setActive:function(model_id,total_trips){
               active_run = true;
               modelID = model_id;
               totalTrips = total_trips;
               checkStatus(model_id); 
            },
            getStatus:function(){
                return active_run;
            },
            getProgress:function(){
                return trips_complete;
            },
            getTotalTrips:function(){
                return totalTrips;
            },
        }
    }
])   