'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
.factory('UserService', [function() {
	var sdo = {
		isLogged: false,
		username: ''
	};
	return sdo;
}]).value('version', '0.1')
.factory('MarketArea', [function() {
    var activeMarket = {name: 'Atlantic City',id: 2};
    var activeModel = {id:'31',name:'null'}

    return {
        getMarketArea: function() {
            return activeMarket;
        },
        setMarketArea: function(newData) {
            activeMarket = newData;
            
        },
        getModel: function() {
            return activeModel;
        },
        setModel: function(newData) {
            activeModel = newData;  
        }
    }
}]);
