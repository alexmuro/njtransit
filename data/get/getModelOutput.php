<?php
	$run_id = $_POST['run_id'];

 
 	include '../../config/db.php'; 
	$test = new db();
	$inscon = $test->connect();

	$date = array();
	$sql = "select distinct on_stop_id, count(on_stop_id) as count from model_legs where run_id = $run_id and mode = 'BUS' group by on_stop_id order by count desc";
 	$rs=mysql_query($sql) or die($sql." ".mysql_error());
 	$data = array();

 	while($row = mysql_fetch_assoc($rs)){
 		$data['boarding'][] = $row;
 	}

 	$sql = "select distinct off_stop_id, count(off_stop_id) as count from model_legs where run_id = $run_id and mode = 'BUS' group by off_stop_id order by count desc";
 	$rs=mysql_query($sql) or die($sql." ".mysql_error());
 	while($row = mysql_fetch_assoc($rs)){
 		$data['alighting'][] = $row;
 	}

 	$sql = "select distinct route, count(route) as count from model_legs where run_id = $run_id and mode = 'BUS' group by route order by count desc";
 	$rs=mysql_query($sql) or die($sql." ".mysql_error());
 	while($row = mysql_fetch_assoc($rs)){
 		$data['routes'][] = $row;
 	}
	
 	$sql = "select distinct gtfs_trip_id, route ,count(gtfs_trip_id) as count from model_legs where run_id = $run_id and mode = 'BUS' group by gtfs_trip_id order by route,count desc";
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
