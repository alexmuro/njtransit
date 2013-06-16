<?php

	include '../../config/db.php'; 
	

	$to =$_POST['to'];
	$from =$_POST['from'];
	$trip = $_POST['trip'];

	 $test = new db();
	 $inscon = $test->connect();

	 $insert_data = "(".$_POST['run_id'].",".$trip['startTime'].",".$trip['endTime'].",".$trip['duration'].",".$trip['transitTime'].",".$trip['waitingTime'].",".$trip['walkTime'].",".$trip['walkDistance'].")";
	 $sql = "INSERT into model_trips (run_id,start_time,end_time,duration,transit_time,waiting_time,walking_time,walk_distance) VALUES $insert_data";
	 
	mysql_query($sql) or die(mysql_error());
	$insert_trip_id =  mysql_insert_id();
	 $leg_data = '';
	foreach ($trip['legs'] as $index => $leg) {

		if($leg['mode'] == 'BUS'){
	
			$leg_data .= "(".$_POST['run_id'].",$insert_trip_id,'".$leg['mode']."',".$leg['duration'].",'".$leg['distance']."','".$leg['route']."','".$leg['routeId']."','".$leg['tripId']."','".$leg['from']['stopCode']."','".$leg['from']['stopId']['id']."','".$leg['to']['stopCode']."','".$leg['to']['stopId']['id']."'),";
	 	
	 	}
	 	else if($leg['mode'] == 'WALK'){

	 		$leg_data .= "(".$_POST['run_id'].",$insert_trip_id,'".$leg['mode']."',".$leg['duration'].",'".$leg['distance']."','','','','','','',''),";
	 	}
		
	}
	$leg_data = substr($leg_data, 0,-1);
	$sql = "INSERT into model_legs (run_id,trip_id, mode,duration,distance,route,route_id,gtfs_trip_id,on_stop_code,on_stop_id,off_stop_code,off_stop_id) VALUES $leg_data";
	mysql_query($sql) or die($sql.'<br>'.mysql_error());
	echo $insert_trip_id;
?>