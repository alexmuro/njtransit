<?php
	error_reporting(E_ALL ^ E_DEPRECATED);
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
			    stop_times.stop_id,
				stops.stop_name,
				CAST(SUBSTRING_INDEX(group_concat(distinct shape_dist_traveled order by shape_dist_traveled desc), ',', 1)as DECIMAL(8,4)) as distance
			from
			    gtfs_20130712.stop_times
			join
				gtfs_20130712.stops
			on 
				stop_times.stop_id = stops.stop_id
			where
			    trip_id in (select 
			            trips.trip_id
			        from
			            gtfs_20130712.routes
			                join
			            gtfs_20130712.trips ON routes.route_id = trips.route_id
			        where
			            route_short_name = '$route_id' and trips.direction_id = 1)
			group by stop_id
			order by distance";

	$rs=mysql_query($sql) or die($sql." ".mysql_error());
	$rows = array();
	while($r = mysql_fetch_assoc($rs)) {
		
    	$rows[] = $r;
	}
	
	echo json_encode($rows);	
?>