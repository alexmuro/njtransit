'use strict';

/* Controllers */
angular.module('myApp.controllers', [])
.controller('HomeCtrl', ['$scope', '$http','MarketArea',
  	function($scope, $http, MarketArea) {
  		$scope.activeMarket = MarketArea.getMarketArea();
  		
}])

.controller('HeaderCtrl', ['ActiveModelService','UserService','$scope','$rootScope','$http','$timeout','MarketArea',
    function(ActiveModelService,UserService,$scope,$rootScope, $http, $timeout, MarketArea) {
        $scope.active_run =ActiveModelService.getStatus();
        $scope.user = UserService.getSession();
        
        $rootScope.$on("sessionUpdated", function (event) {
          
          $scope.user = UserService.getSession();
          if($scope.user.status !== 'connected'){
            window.location = '/';
          } 

        });

        $scope.logout = function () {
            $scope.loggedin = false;
            //UserService.fblogout();
            //make a call to a php page that will erase the session data
            $http.post("/data/session/logout.php").success(function(){
                UserService.updateSession();
            });
            
        };

        if($scope.active_run){

            $scope.trips_complete= ActiveModelService.getProgress(Math.rand);
            $scope.total_trips = ActiveModelService.getTotalTrips();
        
        }else{

            $scope.trips_complete = 0;
            $scope.total_trips = 0;
      
        }
        $rootScope.$on("ActiveModelUpdate", function (event) {
            $scope.active_run =ActiveModelService.getStatus();
            $scope.trips_complete = ActiveModelService.getProgress();
            $scope.total_trips = ActiveModelService.getTotalTrips();

        });

        $rootScope.$on("ActiveModelComplete", function (event) {
          
          $scope.message = "Model Run Completed";
          $scope.active_run = false;
        });
    }
])

.controller('ModelRunCtrl', ['ActiveModelService','UserService','$scope','$rootScope','$http','$timeout','MarketArea',
  	function(ActiveModelService,UserService,$scope,$rootScope, $http, $timeout, MarketArea) {
      $scope.user = UserService.getSession();
        
      $rootScope.$on("sessionUpdated", function (event) {
          
          $scope.user = UserService.getSession();
      });
  		
      $scope.activeMarket = MarketArea.getMarketArea();
      $scope.dow = 0;
      $scope.season = 0;
      $scope.time = 0;
      $scope.walk_distance = 1;
      $scope.walk_speed = 3;
      $scope.model_type = "CTPP2000" 
      $scope.model_time = 'pm';
      $scope.model_season= '7/22/2013';
      //AM Peak Hours
      $scope.AMstart = new Date();
      $scope.AMstart.setHours(7);
      $scope.AMstart.setMinutes(0);
      $scope.AMend = new Date();
      $scope.AMend.setHours(9);
      $scope.AMend.setMinutes(0);
      $scope.hstep = 1;
      $scope.mstep = 15;
      $scope.message = "";
      $scope.active_run =ActiveModelService.getStatus();
      if($scope.active_run){

        $scope.trips_complete= ActiveModelService.getProgress();
        $scope.total_trips = ActiveModelService.getTotalTrips();
        

      }else{

        $scope.trips_complete = 0;
        $scope.total_trips = 0;
      
      }

      $rootScope.$on("marketUpdated", function (event) {
        $scope.activeMarket = MarketArea.getMarketArea();
        $scope.activeModel = MarketArea.getModel();
      });

      $rootScope.$on("ActiveModelUpdate", function (event) {
        $scope.trips_complete = ActiveModelService.getProgress();
      });

      $rootScope.$on("ActiveModelComplete", function (event) {
        $scope.message = "Model Run Completed";
        $scope.active_run = false;
      });
    
      $scope.today = function() {
        $scope.dt = new Date();
      };

      $scope.today();
      $scope.disabled = function(date, mode) {date
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
      };

      $scope.output = "";
      $scope.runModel = function(){
        if(!$scope.active_run){
        $scope.active_run=true;
        $scope.message = "Calculating trip table and metadata.";
        //console.log($scope.user.id)
        $http({url:'/otp/setupModel.php',params:{name:$scope.runName,zone:$scope.activeMarket.id,season:$scope.model_season,dow:$scope.dow,time:$scope.model_time,type:$scope.model_type,walk_distance:$scope.walk_distance,walk_speed:$scope.walk_speed,user_id:$scope.user.id},method:"GET"})
          .success(function(data) {
            console.log(data);
            $scope.message = data.status;
            $scope.active_run = true;
            $scope.trips_complete = 0;
            $scope.total_trips = data.numTrips;
            ActiveModelService.setActive(data.run_id,data.numTrips);

          }).error(function(e) {
            console.log(e);
          });   
        }
        else{
          $scope.message = 'Model already in progress.'
        }
      }

  }])

  .controller('ModelDataCtrl', ['$scope', '$http','MarketArea',
  	function($scope, $http, MarketArea) {
  		$scope.activeMarket = MarketArea.getMarketArea();
      $scope.CTPP="2000";
      $scope.LEHD="2011";
      $scope.SF1="2010";
      $scope.ACS5="2011";

  		
  }])

  .controller('ModelOTPCtrl', ['$scope', '$http','MarketArea',
  	function($scope, $http, MarketArea) {
  		$scope.activeMarket = MarketArea.getMarketArea();
  		
  }])
  .controller('ModelOverviewCtrl', ['$rootScope','$scope', '$http','MarketArea',
  	function($rootScope,$scope, $http, MarketArea) {
  		$scope.activeMarket = MarketArea.getMarketArea();
      $scope.activeModel = MarketArea.getModel();
      
      $scope.getModelOverview =function(){
        return  $http({url:'/data/get/getModelOutput.php',data:{run_id:$scope.activeModel.id},method:"POST"}).then(function(data){
            return(data);
        })
      }
  		
      $scope.writePage = function(){
        if($scope.modelData.routes){
          $scope.totalRoutes = $scope.modelData.routes.length;
          $scope.totalTrips = $scope.modelData.trips.length;
          if( $scope.modelData.boarding.length > $scope.modelData.alighting.length ){
            $scope.activeStops = $scope.modelData.boarding.length;
          }else{
             $scope.activeStops = $scope.modelData.alighting.length;
          }

          var boardingTotal = 0;
          $scope.modelData.boarding.forEach(function(stop){boardingTotal += stop.count*1;})
          $scope.boardingTotal = boardingTotal;

          var alightingTotal = 0;
          $scope.modelData.alighting.forEach(function(stop){alightingTotal += stop.count*1;});
          $scope.alightingTotal = alightingTotal;

          var tripsTotal = 0;
          $scope.modelData.trips.forEach(function(stop){tripsTotal += stop.count*1;});
          $scope.tripsTotal = tripsTotal;
        }
      }

      $scope.getModelOverview().then(function(data){
        $scope.modelData = data.data;
        $scope.overview = data.data.overview[0];
        $scope.writePage();
      });

      $rootScope.$on("modelUpdated", function (event) {
        $scope.activeMarket = MarketArea.getMarketArea();
        $scope.activeModel = MarketArea.getModel();

        $scope.getModelOverview().then(function(data){
          $scope.modelData = data.data;
          $scope.overview = data.data.overview[0];
          $scope.writePage();
        });
      })

  }])


  .controller('ModelRoutesCtrl', ['$rootScope','$scope', '$http','MarketArea',
  	function($rootScope,$scope, $http, MarketArea) {
  		$scope.activeMarket = MarketArea.getMarketArea();
      $scope.activeMarket = MarketArea.getMarketArea();
      $scope.activeModel = MarketArea.getModel();
      $scope.activeRoute='';
      $scope.activeTrip='';
      $scope.overview = true;
      $scope.showroutes = false;
      $scope.showtrips = false;
      $scope.tripData ={};
      $scope.getModelOverview =function(){
        if(!$scope.activeModel){
          return [];
        }else{
          return  $http({url:'/data/get/getModelOutput.php',data:{run_id:$scope.activeModel.id},method:"POST"}).then(function(data){
              return(data);
          })
        }
      }
      $scope.getModelOverview().then(function(data){
        $scope.modelData = data.data;
      });

      $rootScope.$on("modelUpdated", function (event) {
          $scope.activeMarket = MarketArea.getMarketArea();
          $scope.activeModel = MarketArea.getModel();
          $scope.getModelOverview().then(function(data){
            $scope.modelData = data.data;
        });
      });

      


      $scope.isActiveTrip = function(tripid){
        return tripid == $scope.activeTrip ? 'active' : '';
      }

      $scope.setActiveTrip = function(tripid){
        $scope.activeTrip = tripid;
        if($scope.activeTrip == '')
        {
         $scope.overview = false;
         $scope.showroutes = true;
         $scope.showtrips = false;
        }else{
         $scope.overview = false;
         $scope.showroutes = false;
         $scope.showtrips = true;
         $scope.getTrip(tripid).then(function(data){
            $scope.tripData = data.data;
         });
        }
      }
      
      $scope.getTrip =function(tripid){
        
        return  $http({url:'/data/get/getGTFSModelTrip.php',data:{run_id:$scope.activeModel.id,trip_id:tripid},method:"POST"}).then(function(data){
            return(data);
        })
      }

      $scope.isActiveRoute = function(routeid){
        return routeid == $scope.activeRoute ? 'active' : '';
      }

      $scope.setActiveRoute = function(routeid){
        $scope.activeRoute = routeid;
        $scope.activeTrip = '';
        if($scope.activeRoute == '')
        {
         $scope.overview = true;
         $scope.showroutes = false;
         $scope.showtrips = false;
        }else{
         $scope.overview = false;
         $scope.showroutes = true;
         $scope.showtrips = false;
        }
      }
      

  		
  }])
  .controller('ModelStopsCtrl', ['$rootScope','$scope', '$http','MarketArea',
  	function($rootScope,$scope, $http, MarketArea) {
      $scope.activeMarket = MarketArea.getMarketArea();
      $scope.activeModel = MarketArea.getModel();
      $scope.direction='boarding';
      $scope.boarding = true;
      $scope.alighting = false;
      $scope.getModelOverview =function(){
        return  $http({url:'/data/get/getModelOutput.php',data:{run_id:$scope.activeModel.id},method:"POST"}).then(function(data){
            return(data);
        })
      }
      $scope.getModelOverview().then(function(data){
        $scope.modelData = data.data;
      });
  		
      $rootScope.$on("modelUpdated", function (event) {
        $scope.activeMarket = MarketArea.getMarketArea();
        $scope.activeModel = MarketArea.getModel();
        $scope.getModelOverview().then(function(data){
          $scope.modelData = data.data;
        });
      });

      $scope.bORa = function(routeid){
        return routeid == $scope.direction ? 'active' : '';
      }
      $scope.setDirection = function(routeid){
        $scope.direction = routeid;
        if($scope.direction == 'boarding')
        {
         $scope.boarding = true;
         $scope.alighting = false;
        }else{
         $scope.boarding = false;
         $scope.alighting = true;
        }
      }
  }])
  .controller('NavCtrl', ['$scope','$rootScope','UserService', '$http','MarketArea',
  	function($scope,$rootScope,UserService,$http, MarketArea) {
      $scope.user = UserService.getSession();
        
      $rootScope.$on("sessionUpdated", function (event) {
          
          $scope.user = UserService.getSession();
          $scope.getModelRuns().then(function(data){
          $scope.modelRuns = data.data;
          $scope.activeModel = $scope.modelRuns[0]; 
      })

      });
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
        return  $http({url:'/data/get/getModelRuns.php',data:{zone_id:$scope.activeMarket.id,user_id:$scope.user.id},method:"POST"}).then(function(data){
            return(data);
        })
      }
    
      
  		$scope.isActiveMarket = function(id){
        	return id == $scope.activeMarket.id ? 'active' : '';
      	}

      $scope.isActiveModel = function(id){
          return id == $scope.activeModel.id ? 'active' : '';
        }  

      $scope.setModel = function(input){
        $scope.activeModel = input;
        MarketArea.setModel($scope.activeModel);
      }

      $scope.setMarket = function(input){
    		$scope.activeMarket = input;
    		MarketArea.setMarketArea($scope.activeMarket);
        $scope.getModelRuns().then(function(data){
           $scope.modelRuns = data.data;
           $scope.activeModel = $scope.modelRuns[0];
           MarketArea.setModel($scope.activeModel);
        })
      }
  }])
.controller('UsersCtrl', ['$scope', '$http',
    function($scope, $http) {
    $scope.users = []; 
    $http.post("/data/get/users.php").success(function(data){
        $scope.users = data;
    });
    $scope.edit = function(id){
      window.location = "/admin/#/user/edit/"+id;
    }

    $scope.delete =function(id,email){
       var r = window.confirm("Do you really want to delete "+id+" "+email);
       if(r== true){
        //console.log("baleeted");
        $http({url:'/data/update/user.php',data:{del:'1',user:id},method:"POST"}).success(function(data){
          if(data.status){
            $scope.message = "User Updated";
            $http.post("/data/get/users.php").success(function(data){
                $scope.users = data;
            });
          }
        });
       }
    }
    $scope.view_access = function(level){
      if(level*1 == 3){
        return "Admin"
      }else if(level*1 == 2){
        return "User"
      }else if(level*1 == 1){
        return "View Only"
      }
    }

      
}])
.controller('EditUserCtrl', ['UserService','$scope', '$http','$rootScope','$routeParams',
    function(UserService,$scope, $http,$rootScope,$routeParams) {
    $scope.user = {}; 
    $scope.message = "";
    $scope.current_user= {};
    $scope.current_user.id = -1;
    $scope.accesslevels = [{"value":'1',"text":"View"},{"value":'2',"text":"User"},{"value":'3',"text":"Admin"}];

    
    $http({url:'/data/get/users.php',data:{user_id:$routeParams.userid},method:"POST"}).success(function(data){
        $scope.user = data[0];
    });
     $scope.current_user = UserService.getSession();    
     $rootScope.$on("sessionUpdated", function (event) {
          $scope.current_user = UserService.getSession();
      });

    $scope.UpdateUser = function(){
      $http({url:'/data/update/user.php',data:{user:$scope.user},method:"POST"}).success(function(data){
          //console.log(data);
          if(data.status){
            $scope.message = "User Updated";
          }
      });
    } 
      
      
}])
.controller('NewUserCtrl', ['$scope', '$http',
    function($scope, $http) {
      $scope.message = "";
      $scope.CreateUser = function(){
      
        $http({url:'/data/create/user.php',data:{user:$scope.user},method:"POST"}).success(function(data){
          //console.log(data);
          if(!data.status){
            $scope.message = data.message;
          }  else {
            window.location ="/admin/#/users"
          }
        });
    }
      
}])



 
