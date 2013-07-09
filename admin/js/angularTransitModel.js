var transitModel = {
        id:1,
        zone:1,
        start_hour:7,
        start_min:0,
        end_hour:9,
        end_min:59,
        date:'6/3/2013',
        trips:[],
        totalTrips:0,
        run:function()
        {
          $http({
              url:'/data/create/model_run.php',
              data:{zone_id:transitModel.zone},
              method: 'POST'
              })
          .success(function(data) {
             console.log('Model Run:',data)
             transitModel.id = data;  
          })
          .error(function() { console.log("error") });

          $http({
              url:'/data/get/getZone.php',
              data:{geo_type:'ct',current_zone:transitModel.zone},
              dataType:'json',
              method: 'POST'
              })
          .success(function(data) {
             transitModel.getGeoData(data);
             console.log(data);
             $scope.output += "\r\n "+data.length+" tracts returned."
          })
          .error(function() { console.log("error") });
        },
        getGeoData:function(data)
        {
          
          data.forEach(function(ct,index)
          {
            if(index >= 0){
              transitModel.getTractTrips(ct.substring(9,11),ct.substring(11,14),ct.substring(14,20));
              console.log(ct.substring(9,11),ct.substring(11,14),ct.substring(14,20));
            }
          });
          //$scope.output += "Total trips:"

        },
        getTractTrips:function(state,county,tract)
        {

          console.log(state,county,tract);
          $http({url:'/data/get/getTractTrips.php',
              method:'POST',
              data:{state:state,county:county,tract:tract},        
          })
          .success(function(data)
          {
            var totalTrips = 0;
            var prev = $scope.output;
            data.forEach(function(tract){
              if(tract.bus_total*1 > 0){
                transitModel.makeTrips(tract);
                transitModel.totalTrips += tract.bus_total*1;
                //console.log(tract.bus_total*1);
              }
            })
            //$scope.output = prev+" "+transitModel.totalTrips+".";
          })
          .error(function(e){
            console.log(e);
          });
        },
        makeTrips:function (tract)
        {
          $scope.output += tract.tract+'->'+tract.qpowtract+':'+tract.bus_total;
          transitModel.getStops(tract.state,tract.county,tract.tract).then(function(data){
            var begin_stops = data.data;
            transitModel.getStops(tract.qpowst,tract.qpowco,tract.qpowtract).then(function(data){
                var end_stops = data.data;
                if(begin_stops.length > 0 && end_stops.length > 0 && tract.bus_total*1 >0){
                  for(i=0;i<tract.bus_total*1;i++){
                    var begin_stop =  Math.floor(Math.random() * (begin_stops.length ));
                    var end_stop =  Math.floor(Math.random() * (end_stops.length ));
                    $scope.output += begin_stops[begin_stop].lat+','+begin_stops[begin_stop].lon+'->'+end_stops[end_stop].lat+','+end_stops[end_stop].lon;+"    ";
                    transitModel.planTrip(begin_stops[begin_stop].lat,begin_stops[begin_stop].lon,end_stops[end_stop].lat,end_stops[end_stop].lon);
                    console.log('plan trrip just called');
                  }
                } 
            })
          })
          //console.log('num_trips:',tract.bus_total)
          //console.log('orig_stops:',begin_stops.length);
          //console.log('dest_stops:',end_stops.length);
          
        },
        getStops:function (state,county,tract)
        {
          
          //console.log(state.substring(1),county,tract)
          return $http({url:'/data/get/getTractStops.php',
              method:'POST',
              data:{state:state.substring(1),county:county,tract:tract},
              
            }).then(function(data){
              return data;
            });
        },
        planTrip:function (from_lat,from_lon,to_lat,to_lon)
        {
          console.log('plan trip',from_lat,from_lon);
          var trip = {};
          $http.jsonp(
            'http://localhost:8080/opentripplanner-api-webapp/ws/plan?',
              {
              params:{
                fromPlace:from_lat+','+from_lon,
                toPlace:to_lat+','+to_lon,
                mode:'TRANSIT,WALK',
                min:'QUICK',
                maxWalkDistance:'840',
                walkSpeed:'1.341',
                time:getRandomInt(transitModel.start_hour,transitModel.end_hour)+':'+getRandomInt(0,59)+'am',
                date: transitModel.date,
                arriveBy:'false',
                itinID:1,
                wheelchair:'false',
                preferredRoutes:'',
                unpreferredRoutes:''
                }
              }
            )
            .success(function(data) {
              console.log('otp data',data);
              //transitModel.processTrip(data);
            })
            .error(function(data, status, headers, config) {
              //console.log(e.responseText);
              console.log('error');
              console.log(config);
              console.log(headers);
              console.log(status);
              console.log(data);

            }
          );
          
        }
      }//end transtiModel
   function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}