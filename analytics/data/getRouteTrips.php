<?php
	//error_reporting(E_ALL ^ E_DEPRECATED);
	if(isset($_POST['route_id'])){
		$route_id = $_POST['route_id'];
	}
	if(isset($_GET['route_id'])){
		$route_id = $_GET['route_id'];
	}

	include 'db.php'; 
	
	$test = new db();
	$inscon = $test->connect();
	
	$sql = "SELECT 
			    trip_id, group_concat(arrival_time) as times, group_concat(stop_id) as stops
			from
			    gtfs_20130712.stop_times
				where
			    trip_id in (select 
			            trips.trip_id
			        from
			            gtfs_20130712.routes
			                join
			            gtfs_20130712.trips ON routes.route_id = trips.route_id
			        where
			            route_short_name = '$route_id')
			group by
				trip_id";

	$rs=mysql_query($sql) or die($sql." ".mysql_error());
	$rows = array();
	while($r = mysql_fetch_assoc($rs)) {
		$trip = array();
		$trip['trip_id'] = $r['trip_id'];
		$trip['type'] = 'bus';
		$stop_ids = split(',',$r['stops']);
		$times = split(',',$r['times']);
		$trip['stops'] = array();
		for($i =0; $i < count($times);$i++){
			$stop = array();
			$stop['stop_id'] = $stop_ids[$i];
			$stop['time'] = $times[$i];
			array_push($trip['stops'],$stop);
		}
		$rows[] = $trip;

    	
	}
	
	echo json_encode($rows);
	
?>