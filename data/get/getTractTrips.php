<?php
	$in_state = $_POST['state'];
	$in_county = $_POST['county'];
	$in_tract = $_POST['tract'];

 
 	include '../../config/db.php'; 
	$test = new db();
	$inscon = $test->connect();

	$sql = "select state3 as state, county, tract, qpowst, qpowco, qpowtract, `table301-1` as total_workers, `table302-1-5` as bus_avail, `table306-8` as bus_total from  workplace_flow_data where state3 = '0$in_state' and county = '$in_county' and tract = '$in_tract'";
 	$rs=mysql_query($sql) or die($sql." ".mysql_error());
 	$data = array();
 	//$data['sql'] = $sql;
 	while($row = mysql_fetch_assoc($rs)){
 		$data[] = $row;
 	}
 	echo json_encode($data);