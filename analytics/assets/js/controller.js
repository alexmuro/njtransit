
var ngBus = angular.module('busAnalytics', ['uiSlider'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.
		when('/route/:routeID', {templateUrl: 'route.html', controller: 'routeController'}).
		otherwise({redirectTo: '/'});
	}]);
function pageController($scope,$http){

	$scope.runID = 226;
	$scope.routes=[];

	busAnalyst.init($scope.runID);
	busAnalyst.init_routes();
	$scope.currentPage = 'routes';
	$scope.currentRoute = '';
	$scope.setpage = function(page){
		if(page !== $scope.currentPage ){
			if(page == 'routes'){
				busAnalyst.init_routes();
				$scope.currentPage = page;
			}else if(page === 'geo'){
				busAnalyst.init_geography(page.substring)

				$scope.currentPage = page;
			}
			else{
				console.log('hi',page.substr(page.length-3));
				busAnalyst.init_route(page.substr(page.length-3))
				$scope.currentPage = page;
			}
			
		}
	}
	$scope.getModelOverview =function(){
        return  $http({url:'/data/get/getModelOverview.php?run_id='+$scope.runID}).then(function(data){
            return(data);
        });
    };
    
    $scope.getModelOverview().then(function(data){
		console.log(data.data.overview);
		$scope.routes = data.data.overview[0].routes.replace('[','').replace(']','').split(",");
		console.log(data.data.overview[0]);
		console.log($scope.routes);
		$scope.the_routes = [];
		$scope.routes.forEach(function(d){
			var route ={};
			console.log(d.replace(/"/g, ""))
			route.name = d.replace(/"/g, "");
			$scope.the_routes.push(route);
		})
    });
}
function routeController(){

}

