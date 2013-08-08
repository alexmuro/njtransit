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
]);
