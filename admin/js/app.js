'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters',
                         'myApp.services',
                         'myApp.directives',
                         'myApp.controllers',
                         'ui.bootstrap' ],
                         function($httpProvider)
{
  // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  $httpProvider.defaults.headers.common['Accept'] = 'application/json';
  //console.log($httpProvider.defaults.headers);

  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data)
  {
    /**
     * The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj
     * @return {String}
     */ 
    var param = function(obj)
    {
      var query = '';
      var name, value, fullSubName, subName, subValue, innerObj, i;
      
      for(name in obj)
      {
        value = obj[name];
        
        if(value instanceof Array)
        {
          for(i=0; i<value.length; ++i)
          {
            subValue = value[i];
            fullSubName = name + '[' + i + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        }
        else if(value instanceof Object)
        {
          for(subName in value)
          {
            subValue = value[subName];
            fullSubName = name + '[' + subName + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        }
        else if(value !== undefined && value !== null)
        {
          query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
      }
      
      return query.length ? query.substr(0, query.length - 1) : query;
    };
    
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
})
.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/', {templateUrl: 'partials/home.html', controller: 'HomeCtrl',access: {isFree: true}})
    .when('/mi/run', {templateUrl: 'partials/model_input/model_run.html', controller: 'ModelRunCtrl',access: {isFree: true}})
    .when('/mi/data', {templateUrl: 'partials/model_input/data_settings.html', controller: 'ModelDataCtrl',access: {isFree: true}})
    .when('/mi/otp', {templateUrl: 'partials/model_input/otp_settings.html', controller: 'ModelOTPCtrl',access: {isFree: true}})
    .when('/mo/overview', {templateUrl: 'partials/model_output/overview.html', controller: 'ModelOverviewCtrl',access: {isFree: true}})
    .when('/mo/routes', {templateUrl: 'partials/model_output/routes.html', controller: 'ModelRoutesCtrl',access: {isFree: true}})
    .when('/mo/stops', {templateUrl: 'partials/model_output/stops.html', controller: 'ModelStopsCtrl',access: {isFree: true}})
    .otherwise({redirectTo: '/'});
  }])
 .config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.timeout = 10000;
}]);;
