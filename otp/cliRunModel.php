<?php
 include '../config/db.php';
 $model_id= $argv[1];
 
 $test = new db();
 $inscon = $test->connect();
 $sql = "select * from model_trip_table where run_id = ".$model_id;
 $rs=mysql_query($sql) or die($sql." ".mysql_error());
 while($row = mysql_fetch_assoc($rs)){
 	planTrip($row['from_tract'],$row['to_tract'],$row['from_lat'],$row['from_lon'],$row['to_lat'],$row['to_lon'],$model_id);
 }
 $sql ="INSERT into model_stops (run_id,stop_code,boarding,alighting,routes) (
    select 
        run_id,on_stop_code as stop_code, count(1) as boarding,b.alighting,GROUP_CONCAT(distinct route) as routes
    from
        model_legs as a
    join
    (select 
        off_stop_code as stop_code, count(1) as alighting
    from
        model_legs
    where
        mode = 'BUS' and run_id = $model_id
    group by 
        run_id,off_stop_code ) as b on b.stop_code = a.on_stop_code
    where
        mode = 'BUS' and a.run_id = $model_id
    group by 
        run_id,on_stop_code
)";
 mysql_query($sql) or die($sql." ".mysql_error());


 $sql = "Update model_runs set finished = 1 where id = ".$model_id;
 mysql_query($sql) or die($sql." ".mysql_error());


	function  planTrip ($from_tract,$to_tract,$from_lat,$from_lon,$to_lat,$to_lon,$model_id){

		$otp_url = "http://localhost:8080/opentripplanner-api-webapp/ws/plan?";
		$otp_url .= "fromPlace=$from_lat,$from_lon";
		$otp_url .= "&toPlace=$to_lat,$to_lon";
		$otp_url .= "&mode=TRANSIT,WALK";
	  	$otp_url .= "&min=QUICK";
	  	$otp_url .= "&maxWalkDistance=1000";
	  	$otp_url .= "&walkSpeed=1.341";
	  	$otp_url .= "&time=".rand(6,9).':'.rand(0,59).'am';
	  	$otp_url .= "&date=7/23/2013";
	  	$otp_url .= "&arriveBy=false";
	  	$otp_url .= "&itinID=1";
	  	$otp_url .= "&wheelchair=false";
	  	$otp_url .= "&preferredRoutes=";
	  	$otp_url .= "&unpreferredRoutes=";
	  	
	  	echo $otp_url.'<br>';
	  // 	//echo 'Running trip at: time:'.rand($this->start_hour,$this->end_hour).':'.rand(0,59).'am<br><br>';

	  processTrip(json_decode(curl_download($otp_url),true),$model_id);
	}

	function curl_download($Url){ 
	    // is cURL installed yet?
	    if (!function_exists('curl_init')){
	        die('Sorry cURL is not installed!');
	    }
	 
	  	// OK cool - then let's create a new cURL resource handle
	  	
	   	$ch = curl_init();
	   	$headers = array('Accept: application/json');
	   	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers); 
		//curl_setopt($ch, CURLOPT_HEADER, 1); 
	   	curl_setopt($ch, CURLOPT_URL, $Url);
	   	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	   	$output = curl_exec($ch);

	    return $output;
	}

	function processTrip($data,$model_id){
		print_r($data);
		if(count($data['plan']['itineraries']) > 0){
			//this.trips.push(data.plan.itineraries[getRandomInt(0,data.plan.itineraries.length-1)]);
			$trip = $data['plan']['itineraries'][rand(0,count($data['plan']['itineraries'])-1)];
			//print_r($trip);
			//echo "Start Time: ".date('Y-m-d H:i:s',$trip['startTime']/1000).",".$trip['startTime']."<br>";
			$insert_data = "(".$model_id.",'".date('Y-m-d H:i:s',$trip['startTime']/1000)."','".$trip['endTime']."',".$trip['duration'].",".$trip['transitTime'].",".$trip['waitingTime'].",".$trip['walkTime'].",".$trip['walkDistance'].")";
 			$sql = "INSERT into model_trips (run_id,start_time,end_time,duration,transit_time,waiting_time,walking_time,walk_distance) VALUES $insert_data";
			mysql_query($sql) or die(mysql_error());
			$insert_trip_id =  mysql_insert_id();
 			$leg_data = '';
			foreach ($trip['legs'] as $index => $leg) {

				if($leg['mode'] == 'BUS'){
					//echo "Route:" .$leg['route']." ".$leg['tripId']."<br>";
					$leg_data .= "(".$model_id.",$insert_trip_id,'".$leg['mode']."',".$leg['duration'].",'".$leg['distance']."','".$leg['route']."','".$leg['routeId']."','".$leg['tripId']."','".$leg['from']['stopCode']."','".$leg['from']['stopId']['id']."','".$leg['to']['stopCode']."','".$leg['to']['stopId']['id']."'),";
			 	
			 	}
			 	else if($leg['mode'] == 'WALK'){

			 		//echo "WALK<br>";
			 		$leg_data .= "(".$model_id.",$insert_trip_id,'".$leg['mode']."',".$leg['duration'].",'".$leg['distance']."','','','','','','',''),";
			 	}
				
			}
			$leg_data = substr($leg_data, 0,-1);
			$sql = "INSERT into model_legs (run_id,trip_id, mode,duration,distance,route,route_id,gtfs_trip_id,on_stop_code,on_stop_id,off_stop_code,off_stop_id) VALUES $leg_data";
			mysql_query($sql) or die($sql.'<br>'.mysql_error());
		}
	}
