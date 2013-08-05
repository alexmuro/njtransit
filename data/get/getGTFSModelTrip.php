<?php
$run_id = $_POST['run_id'];
$trip_id = $_POST['trip_id'];

include '../../config/db.php'; 
$test = new db();
$inscon = $test->connect();

$output = array();
$sql = "SELECT a.stop_sequence,a.arrival_time,a.stop_id,b.boarded,c.disembarked,d.stop_code,d.stop_name from gtfs_20130712.stop_times as a 
		left outer join
		 (select 
		    on_stop_code, on_stop_id, count(on_stop_id) as boarded
		from
		    model_legs
		where
		    mode = 'BUS' and gtfs_trip_id = $trip_id and run_id = $run_id
		group by 
		    on_stop_id) as b on b.on_stop_id = a.stop_id
		left outer join
		 (select 
		    off_stop_code, off_stop_id, count(off_stop_id) as disembarked
		from
		    model_legs
		where
		    mode = 'BUS' and gtfs_trip_id = $trip_id and run_id = $run_id
		group by 
		    off_stop_id) as c on c.off_stop_id = a.stop_id
		join 
    		gtfs_20130712.stops as d on d.stop_id = a.stop_id
		where a.trip_id = $trip_id";
 
$rs=mysql_query($sql) or die($sql."<br><br>".mysql_error());
while($row = mysql_fetch_array($rs)){
	$output[] = $row;
}

echo json_encode($output);