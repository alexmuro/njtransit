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

    return {
        getData: function() {
            console.log(activeMarket);
            return activeMarket;
        },
        setData: function(newData) {
            activeMarket = newData;
            console.log(activeMarket);
        }
    }
}]);
