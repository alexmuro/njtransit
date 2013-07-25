<?php
	$run_id = $_POST['run_id'];

 
 	include '../../config/db.php'; 
	$test = new db();
	$inscon = $test->connect();

	$date = array();
	$sql = "select distinct on_stop_code, count(on_stop_id) as count,b.stop_name  from model_legs as a join gtfs_20130712.stops as b on b.stop_id = a.off_stop_id where run_id = $run_id and mode = 'BUS' group by on_stop_code order by count desc";
 	$rs=mysql_query($sql) or die($sql." ".mysql_error());
 	$data = array();

 	while($row = mysql_fetch_assoc($rs)){
 		$data['boarding'][] = $row;
 	}

 	$sql = "select distinct off_stop_code, count(off_stop_id) as count, b.stop_name  from model_legs as a join gtfs_20130712.stops as b on b.stop_id = a.off_stop_id where run_id = $run_id and mode = 'BUS' group by off_stop_code order by count desc";
 	$rs=mysql_query($sql) or die($sql." ".mysql_error());
 	while($row = mysql_fetch_assoc($rs)){
 		$data['alighting'][] = $row;
 	}

 	$sql = "select distinct route, count(route) as count from model_legs where run_id = $run_id and mode = 'BUS' group by route order by count desc";
 	$rs=mysql_query($sql) or die($sql." ".mysql_error());
 	while($row = mysql_fetch_assoc($rs)){
 		$data['routes'][] = $row;
 	}
	
 	$sql = "select distinct a.gtfs_trip_id, a.route ,count(a.gtfs_trip_id) as count,b.trip_headsign,date_format(c.departure_time,'%h:%i %p') as departure_time from model_legs as a join gtfs_20130712.trips as b on b.trip_id = a.gtfs_trip_id join gtfs_20130712.stop_times as c on c.trip_id = a.gtfs_trip_id and c.stop_sequence = 1 where a.run_id = $run_id and a.mode = 'BUS' group by gtfs_trip_id order by route,count desc";
 	$rs=mysql_query($sql) or die($sql." ".mysql_error());
 	//$data['sql'] = $sql;
 	while($row = mysql_fetch_assoc($rs)){
 		$data['trips'][] = $row;
 	}

 	// $sql = "select count(1) as count from model_trips where run_id = $run_id";
 	// $rs=mysql_query($sql) or die($sql." ".mysql_error());
 	// //$data['sql'] = $sql;
 	// while($row = mysql_fetch_assoc($rs)){
 	// 	$data['totalTrips'][] = $row;
 	// }
 	
 	// $sql = "select count(1) as count from model_legs where run_id = $run_id and mode = 'BUS'";
 	// $rs=mysql_query($sql) or die($sql." ".mysql_error());
 	// //$data['sql'] = $sql;
 	// while($row = mysql_fetch_assoc($rs)){
 	// 	$data['totalBusTrips'][] = $row;
 	// }
 	echo json_encode($data);
