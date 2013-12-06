<?php
	error_reporting(E_ALL ^ E_DEPRECATED);
	if(isset($_POST['run_id'])){
		$run_id = $_POST['run_id'];
	}
	if(isset($_GET['run_id'])){
		$run_id = $_GET['run_id'];
	}

	include 'db.php'; 
	
	$test = new db();
	$inscon = $test->connect();
	
	$sql = "SELECT
			    a.trip_id,
			    a.duration,
			    a.distance,
			    a.route,
			    a.on_stop_code,
			    a.gtfs_trip_id,
			    a.off_stop_code,
			    b.start_time,
			    b.waiting_time,
			    b.walk_distance,
			    b.walking_time,
			    c.arrival_time,
			    d.arrival_time as trip_start_time,
			    CONCAT(e.state, e.county, e.tract) as on_tract
			from
			    model_legs a
			        join
			    model_trips b ON a.trip_id = b.id
			        join
			    gtfs_20130712.stop_times c ON a.on_stop_id = c.stop_id
			        and a.gtfs_trip_id = c.trip_id
			        join
			    gtfs_20130712.stop_times d ON d.stop_sequence = 1
			        and a.gtfs_trip_id = d.trip_id
			        join
			    gtfs_20130712.stop_fips e ON e.stop_id = a.on_stop_id
			where
			    a.run_id = $run_id and mode = 'BUS'
			    and a.route in ('319','501','502','504','505','507','508','509','551','552','553','554','559')";

	$rs=mysql_query($sql) or die($sql." ".mysql_error());
	$rows = array();
	while($r = mysql_fetch_assoc($rs)) {
		$r['count'] = 1;
    	$rows[] = $r;
	}
	
	echo json_encode($rows);
	
?>