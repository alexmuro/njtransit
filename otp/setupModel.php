<?php
	include '../config/db.php';
	class transitModel
	{
		 public $id= 1,
    	 $market_area =1,
    	 $name = 'Untitiled Model',
    	 $start_hour=6,
    	 $start_min =0,
    	 $end_hour=9,
    	 $end_min=59,
    	 $date='7/22/2013',
    	 $trips=array(),
    	 $totalTrips=0,
     	 $message='',
     	 $geo_type='ct',
     	 $zones = array(),
     	 $output = array(),
     	 $walk_speed = 1.341,
     	 $walk_distance = 1000,
     	 $type="CTPP2000",
     	 $survey=false,
     	 $user=0,
     	 $insert = "Insert into model_trip_table (run_id,from_tract,to_tract,from_lat,from_lon,to_lat,to_lon) values ";
     	 

     	function __construct($in_name="Untitiled Mode",$in_zone=1,$in_date='7/22/2013',$distance,$speed,$type,$user) {
       			$this->name = $in_name;
       			$this->market_area = $in_zone;
       			$this->date = $in_date;
       			$this->walk_distance = $distance * 1609;
       			$this->walk_speed = $speed * 1.60934;
       			$this->type = $type;
       			$this->user = $user;
       			if($this->market_area == 1 || $this->market_area == 4){
       				$this->survey = true;
       			}
  
   		}

     	 function run(){
     		$start = microtime(TRUE);  
     		$test = new db();
			$inscon = $test->connect();

			$sql = "SELECT `".$this->geo_type."` from zones where id = ".$this->market_area;
			$rs=mysql_query($sql) or die($sql." ".mysql_error());
			$row = mysql_fetch_assoc( $rs );

			$insert_data = "(NOW(),".$this->market_area.",'".$this->name."','".date('l',strtotime($this->date))."','".date('F Y',strtotime($this->date))."','AM Peak','".$this->walk_distance."','".$this->walk_speed."','".$this->type."','".$row[$this->geo_type]."')";
			$sql = "INSERT into model_runs (runtime,zone_id,name,dow,season,time,max_walk_distance,walk_speed,type,zones) VALUES $insert_data";
			mysql_query($sql);
			$this->id = mysql_insert_id();

			$sql = "Insert into user_model  (user_id,run_id) values (".$this->user.",".$this->id.")";
			$rs=mysql_query($sql) or die($sql." ".mysql_error());

			
			$this->parseZones($this->zones = json_decode($row[$this->geo_type]));
			//Parse Zones distributes all the work here

			//and we're back
			$rs=mysql_query(rtrim($this->insert,",")) or die(rtrim($this->insert,",")." ".mysql_error());
			$finish = microtime(TRUE);

			$sql = "select count(id) as numTrips from model_trip_table where run_id = ". $this->id;
			$rs=mysql_query($sql) or die($sql." ".mysql_error());
			$row = mysql_fetch_assoc( $rs );
			$totaltime = $finish - $start; 
			$this->output['numTrips'] = $row['numTrips'];
			$this->output['time'] = "This script took ".$totaltime." seconds to run";  
			$this->output['status'] = "TRIP TABLE CALCULATED, RUNNING MODEL #".$this->id;
			$this->output['run_id'] = $this->id;
     	}

     	public function getOutput(){
     		return $this->output;
     	}

     	public function runOTP(){
     		$command = "php5 -f cliRunModel.php ".$this->id;
			$pid = exec( "$command > /dev/null &", $arrOutput );
			
     	}

     	private function parseZones($zones){
     		foreach ($zones as $index => $fips) {
     			if($index >= 0){
					$this->getTractTrips(substr($fips,9,2),substr($fips,11,3),substr($fips,14,6));
     				$this->output['census_tracts'][] = $index." ".substr($fips,9,2)." ".substr($fips,11,3)." ".substr($fips,14,6);
				}
     		}
     	}

     	private function getTractTrips($in_state,$in_county,$in_tract){
     		if($this->type == "LEHD5"){
     			$sql="select CONCAT('0',substring(h_geocode ,1, 2)) as state,substring(h_geocode,3,3) as county,substring(h_geocode,6,6) as tract, CONCAT('0',substring(w_geocode ,1, 2)) as qpowst,substring(w_geocode,3,3) as qpowco,substring(w_geocode,6,6) as qpowtract,CAST(s000/20 as UNSIGNED) as bus_total from LEHD_2011.nj_od_j00_ct where h_geocode = '".$in_state.$in_county.$in_tract."' or w_geocode = '".$in_state.$in_county.$in_tract."'";

     		}else{
     			$sql = "select state3 as state, county, tract, qpowst, qpowco, qpowtract, `table301-1` as total_workers, `table302-1-5` as bus_avail, `table306-8` as bus_total from  workplace_flow_data_2010 where (state3 = '0$in_state' and county = '$in_county' and tract = '$in_tract' ) or  (qpowst = '0$in_state' and qpowco = '$in_county' and qpowtract = '$in_tract' )";
     		}
 			
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
     		$begin_stops = array();
     		$end_stops = array();
     		$from_tract = $tract['state'].$tract['county'].$tract['tract'];
			$to_tract = $tract['state'].$tract['county'].$tract['tract'];
			
     		if($this->survey){
     			
     			$begin_stops =$this->getOD($from_tract,'o');
				$end_stops = $this->getOD($to_tract,'d');

     		}else{
				
				$begin_stops =$this->getStops($tract['state'],$tract['county'],$tract['tract'],'o');
				$end_stops = $this->getStops($tract['qpowst'],$tract['qpowco'],$tract['qpowtract'],'d');
			
			}

			
			
			if(count($begin_stops) > 0 && count($end_stops) > 0 && intval($tract['bus_total']) >0){
			
				//$this->output['flows'][] = $tract['state'].$tract['county'].$tract['tract'].'->'.$tract['qpowst'].$tract['qpowco'].$tract['qpowtract'].'total workers '.$tract['total_workers'].' num_trips:'.$tract['bus_total'].' tips_avail:'.$tract['bus_avail'];
				
				for($i=0;$i<$tract['bus_total']*1;$i++){
					$begin_stop =  rand(0,count($begin_stops)-1);
					$end_stop =  rand(0,count($end_stops)-1);
					$begin_lat = $begin_stops[$begin_stop]['lat']+(rand(0,20)/10000);
					$begin_lon = $begin_stops[$begin_stop]['lon']+(rand(0,20)/10000);
					$end_lat = $end_stops[$end_stop]['lat']+(rand(1,20)/10000);
					$end_lon = $end_stops[$end_stop]['lon']+(rand(1,20)/10000);
					$this->planTrip($from_tract,$to_tract,$begin_lat,$begin_lon ,$end_lat,$end_lon);
				}
			}	
     	}

		private function getStops($in_state,$in_county,$in_tract){
			$in_state = substr($in_state, 1,2);
			$sql = "select a.stop_id, b.stop_lat as lat,b.stop_lon as lon from gtfs_20130712.stop_fips as a join gtfs_20130712.stops as b on a.stop_id = b.stop_id  where state = '$in_state' and county = '$in_county' and tract = '$in_tract'";
 			$rs=mysql_query($sql) or die($sql." ".mysql_error());
 			$data = array();
 			//echo $sql.'<br>';
 			while($row = mysql_fetch_assoc($rs)){
 				//echo $row['stop_id'].'<br>';
 				$data[] = $row;
 			} 
 			return $data;
		}

		private function getOD($in_fips,$od){
			$sql = "";
			$in_fips = substr($in_fips,1);
			if($od == 'o'){
				$sql = "select O_MAT_LAT as lat, O_MAT_LONG as lon from survey_geo where o_geoid10 = '".$in_fips."'";
			}
			else{
				$sql = "select D_MAT_LAT as lat, D_MAT_LONG as lon from survey_geo where d_geoid10 = '".$in_fips."'";
			}
			//echo $sql;
			$rs=mysql_query($sql) or die($sql." ".mysql_error());
 			$data = array();
 			
 			while($row = mysql_fetch_assoc($rs)){

 				$data[] = $row;
 			}
 			return $data;
		}

		private function  planTrip ($from_tract,$to_tract,$from_lat,$from_lon,$to_lat,$to_lon)
		{
		  $this->insert .= "(".$this->id.",'$from_tract','$to_tract',$from_lat,$from_lon,$to_lat,$to_lon),";
		  
		}

		private function curl_download($Url){ 
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

		private function processTrip($data){
			print_r($data);
			if(count($data['plan']['itineraries']) > 0){
				//this.trips.push(data.plan.itineraries[getRandomInt(0,data.plan.itineraries.length-1)]);
				$trip = $data['plan']['itineraries'][rand(0,count($data['plan']['itineraries'])-1)];
				//print_r($trip);
				//echo "Start Time: ".date('Y-m-d H:i:s',$trip['startTime']/1000).",".$trip['startTime']."<br>";
				$insert_data = "(".$this->id.",'".date('Y-m-d H:i:s',$trip['startTime']/1000)."','".date('Y-m-d H:i:s',$trip['endTime']/1000)."',".$trip['duration'].",".$trip['transitTime'].",".$trip['waitingTime'].",".$trip['walkTime'].",".$trip['walkDistance'].")";
	 			$sql = "INSERT into model_trips (run_id,start_time,end_time,duration,transit_time,waiting_time,walking_time,walk_distance) VALUES $insert_data";
				mysql_query($sql) or die(mysql_error());
				$insert_trip_id =  mysql_insert_id();
	 			$leg_data = '';
				foreach ($trip['legs'] as $index => $leg) {

					if($leg['mode'] == 'BUS'){
						//echo "Route:" .$leg['route']." ".$leg['tripId']."<br>";
						$leg_data .= "(".$this->id.",$insert_trip_id,'".$leg['mode']."',".$leg['duration'].",'".$leg['distance']."','".$leg['route']."','".$leg['routeId']."','".$leg['tripId']."','".$leg['from']['stopCode']."','".$leg['from']['stopId']['id']."','".$leg['to']['stopCode']."','".$leg['to']['stopId']['id']."'),";
				 	
				 	}
				 	else if($leg['mode'] == 'WALK'){

				 		//echo "WALK<br>";
				 		$leg_data .= "(".$this->id.",$insert_trip_id,'".$leg['mode']."',".$leg['duration'].",'".$leg['distance']."','','','','','','',''),";
				 	}
					
				}
				$leg_data = substr($leg_data, 0,-1);
				$sql = "INSERT into model_legs (run_id,trip_id, mode,duration,distance,route,route_id,gtfs_trip_id,on_stop_code,on_stop_id,off_stop_code,off_stop_id) VALUES $leg_data";
				mysql_query($sql) or die($sql.'<br>'.mysql_error());
				//$output['trips'][] =  $insert_trip_id;
			}
		}

	}

	$zone = 2;
	$name = "untitled model";
	$user_id = -1;
	if(isset($_GET['zone'])){ $zone = $_GET['zone'];}
	if(isset($_GET['name'])){ $name = $_GET['name'];}
	if(isset($_GET['season'])){ 
		$date = $_GET['season'];
		$dow = $_GET['dow'];
		$run_date = date('m/d/Y',strtotime($date)+ ($dow * 24 * 60 * 60));
		$model_time = $_GET['time'];
		$model_type = $_GET['type'];
		$walk_distance = $_GET['walk_distance'];
		$walk_speed = $_GET['walk_speed'];
		
	}
	if(isset($_GET['user_id'])){ $user_id = $_GET['user_id']; } 
	
	$model = new transitModel($name,$zone,$run_date,$walk_distance,$walk_speed,$model_type,$user_id);
	$model->run();
	$model->runOTP();
	echo json_encode($model->getOutput());

