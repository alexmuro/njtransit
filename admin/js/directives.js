'use strict';

/* Directives */


angular.module('myApp.directives', [])
  .directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive('checkUser', ['$rootScope', '$location', 'userSrv', function ($root, $location, userSrv) {
	return {
		link: function (scope, elem, attrs, ctrl) {
			$root.$on('$routeChangeStart', function(event, currRoute, prevRoute){
				if (!prevRoute.access.isFree && !userSrv.isLogged) {
					// reload the login route
				}
				/*
				* IMPORTANT:
				* It's not difficult to fool the previous control,
				* so it's really IMPORTANT to repeat the control also in the backend,
				* before sending back from the server reserved information.
				*/
			});
		}
	}
}]);
