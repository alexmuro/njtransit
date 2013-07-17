<?php
	include '../config/db.php';
	class transitModel
	{
		public $id= 1,
    	 $market_area =1,
    	 $name = 'Untitiled Model',
    	 $start_hour=7,
    	 $start_min =0,
    	 $end_hour=9,
    	 $end_min=59,
    	 $date='6/3/2013',
    	 $trips=array(),
    	 $totalTrips=0,
     	 $message='',
     	 $geo_type='ct',
     	 $zones = array(),
     	 $output = array();

     	function __construct($in_name="Untitiled Mode",$in_zone=1,$in_date='6/3/2013') {
       			$this->name = $in_name;
       			$this->market_area = $in_zone;
       			$this->date = $in_date;
  
   		}

     	public function run(){
     		$test = new db();
			$inscon = $test->connect();

			$insert_data = "(NOW(),".$this->market_area.",'".$this->name."')";
			$sql = "INSERT into model_runs (runtime,zone_id,name) VALUES $insert_data";
			mysql_query($sql);
			$this->id = mysql_insert_id();

			$sql = "SELECT `".$this->geo_type."` from zones where id = ".$this->market_area;
			//echo "SQL=".$sql;
			$rs=mysql_query($sql) or die($sql." ".mysql_error());
			$row = mysql_fetch_assoc( $rs );
			$this->parseZones($this->zones = json_decode($row[$this->geo_type]));
			$output['status'] = "FINISHED MODEL RUN:".$this->id;
     	}
     	public function getOutput(){

     		return $this->output;
     	}

     	private function parseZones($zones){
     		foreach ($zones as $index => $fips) {
     			if($index >= 0){
					$this->getTractTrips(substr($fips,9,2),substr($fips,11,3),substr($fips,14,6));
     				$output['census_tracts'][] = $index." ".substr($fips,9,2)." ".substr($fips,11,3)." ".substr($fips,14,6)."<br>";
				}
     		}
     	}

     	private function getTractTrips($in_state,$in_county,$in_tract){
     		$sql = "select state3 as state, county, tract, qpowst, qpowco, qpowtract, `table301-1` as total_workers, `table302-1-5` as bus_avail, `table306-8` as bus_total from  workplace_flow_data where state3 = '0$in_state' and county = '$in_county' and tract = '$in_tract'";
 			$rs=mysql_query($sql) or die($sql." ".mysql_error());
 			$data = array();
 		
 			while($row = mysql_fetch_assoc($rs)){
 				$data[] = $row;
 			}	
 			foreach ($data as $key => $tract) {
 				$this->makeTrips($tract);	
 			}
     	}

     	private function makeTrips($tract){
     		//$('#model_output').prepend('from:'+tract.tract+'-> to:'+tract.qpowtract+':#num trips:'+tract.bus_total+'<br>');
			$begin_stops =$this->getStops($tract['state'],$tract['county'],$tract['tract']);
			$end_stops = $this->getStops($tract['qpowst'],$tract['qpowco'],$tract['qpowtract']);
			
			//echo $tract['state'].$tract['county'].$tract['tract'].'->'.$tract['qpowst'].$tract['qpowco'].$tract['qpowtract'].'total workers '.$tract['total_workers'].' num_trips:'.$tract['bus_total'].' tips_avail:'.$tract['bus_avail'].'<br>';
		
			//echo count($begin_stops)." ".count($end_stops)." ".intval($tract['bus_total']).'<br>';;

			//console.log('orig_stops:',begin_stops.length);
			//console.log('dest_stops:',end_stops.length);
			if(count($begin_stops) > 0 && count($end_stops) > 0 && intval($tract['bus_total']) >0){
			
				$output['flows'][] = $tract['state'].$tract['county'].$tract['tract'].'->'.$tract['qpowst'].$tract['qpowco'].$tract['qpowtract'].'total workers '.$tract['total_workers'].' num_trips:'.$tract['bus_total'].' tips_avail:'.$tract['bus_avail'].'<br>';
				
				for($i=0;$i<$tract['bus_total']*1;$i++){
					$begin_stop =  rand(0,count($begin_stops)-1);
					$end_stop =  rand(0,count($end_stops)-1);
					//$('#model_output').prepend('['+begin_stops[begin_stop].lat+','+begin_stops[begin_stop].lon+']->['+end_stops[end_stop].lat+','+end_stops[end_stop].lon+']<br>');
					$this->planTrip($begin_stops[$begin_stop]['lat'],$begin_stops[$begin_stop]['lon'],$end_stops[$end_stop]['lat'],$end_stops[$end_stop]['lon']);
				}
			}	
     	}

		private function getStops($in_state,$in_county,$in_tract){
			$in_state = substr($in_state, 1,2);
			$sql = "select a.stop_id, b.stop_lat as lat,b.stop_lon as lon from stop_fips as a join stops as b on a.stop_id = b.stop_id  where state = '$in_state' and county = '$in_county' and tract = '$in_tract'";
 			$rs=mysql_query($sql) or die($sql." ".mysql_error());
 			$data = array();
 			//echo $sql.'<br>';
 			while($row = mysql_fetch_assoc($rs)){
 				//echo $row['stop_id'].'<br>';
 				$data[] = $row;
 			}
 			return $data;
		}

		private function  planTrip ($from_lat,$from_lon,$to_lat,$to_lon)
		{
		 $otp_url = "http://localhost:8080/opentripplanner-api-webapp/ws/plan?";
		  	$otp_url .= "fromPlace=$from_lat,$from_lon";
		  	$otp_url .= "&toPlace=$to_lat,$to_lon";
		  	$otp_url .= "&mode=TRANSIT,WALK";
		  	$otp_url .= "&min:QUICK";
		  	$otp_url .= "&maxWalkDistance:1000";
		  	$otp_url .= "&walkSpeed:1.341";
		  	$otp_url .= "&time:".rand($this->start_hour,$this->end_hour).':'.rand(0,59).'am';
		  	$otp_url .= "&date:".$this->date;
		  	$otp_url .= "&arriveBy:false";
		  	$otp_url .= "&itinID:1";
		  	$otp_url .= "&wheelchair:false";
		  	$otp_url .= "&preferredRoutes:";
		  	$otp_url .= "&unpreferredRoutes:";
		  	//echo $otp_url.'<br>';
		  	$this->processTrip(json_decode($this->curl_download($otp_url),true));
		}

		private function curl_download($Url){ 
		    // is cURL installed yet?
		    if (!function_exists('curl_init')){
		        die('Sorry cURL is not installed!');
		    }
		 
		  	// OK cool - then let's create a new cURL resource handle
		  	
		   	$ch = curl_init();
		   	curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']); 
			//curl_setopt($ch, CURLOPT_HEADER, 1); 
		   	curl_setopt($ch, CURLOPT_URL, $Url);
		   	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		   	$output = curl_exec($ch);

		    return $output;
		}
		private function processTrip($data){
			if(count($data['plan']['itineraries']) > 0){
				//this.trips.push(data.plan.itineraries[getRandomInt(0,data.plan.itineraries.length-1)]);
				$trip = $data['plan']['itineraries'][rand(0,count($data['plan']['itineraries'])-1)];
				$insert_data = "(".$this->id.",".$trip['startTime'].",".$trip['endTime'].",".$trip['duration'].",".$trip['transitTime'].",".$trip['waitingTime'].",".$trip['walkTime'].",".$trip['walkDistance'].")";
	 			$sql = "INSERT into model_trips (run_id,start_time,end_time,duration,transit_time,waiting_time,walking_time,walk_distance) VALUES $insert_data";
				mysql_query($sql) or die(mysql_error());
				$insert_trip_id =  mysql_insert_id();
	 			$leg_data = '';
				foreach ($trip['legs'] as $index => $leg) {

					if($leg['mode'] == 'BUS'){
				
						$leg_data .= "(".$this->id.",$insert_trip_id,'".$leg['mode']."',".$leg['duration'].",'".$leg['distance']."','".$leg['route']."','".$leg['routeId']."','".$leg['tripId']."','".$leg['from']['stopCode']."','".$leg['from']['stopId']['id']."','".$leg['to']['stopCode']."','".$leg['to']['stopId']['id']."'),";
				 	
				 	}
				 	else if($leg['mode'] == 'WALK'){

				 		$leg_data .= "(".$this->id.",$insert_trip_id,'".$leg['mode']."',".$leg['duration'].",'".$leg['distance']."','','','','','','',''),";
				 	}
					
				}
				$leg_data = substr($leg_data, 0,-1);
				$sql = "INSERT into model_legs (run_id,trip_id, mode,duration,distance,route,route_id,gtfs_trip_id,on_stop_code,on_stop_id,off_stop_code,off_stop_id) VALUES $leg_data";
				mysql_query($sql) or die($sql.'<br>'.mysql_error());
				$output['trips'][] =  $insert_trip_id;
			}
		}

	}

	$zone = 2;
	$name = "untitled model";
	$date='6/3/2013';
	if(isset($_GET['zone'])){ $zone = $_GET['zone'];}
	if(isset($_GET['name'])){ $name = $_GET['name'];}
	if(isset($_GET['date'])){ $name = $_GET['date'];}
	$model = new transitModel($name,$zone,$date);
	$model->run();
	echo json_encode($model->getOutput());