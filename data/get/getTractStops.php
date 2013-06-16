<?php
	$in_state = $_POST['state'];
	$in_county = $_POST['county'];
	$in_tract = $_POST['tract'];

 
 	include '../../config/db.php'; 
	$test = new db();
	$inscon = $test->connect();

	$sql = "select a.stop_id, b.stop_lat as lat,b.stop_lon as lon from stop_fips as a join stops as b on a.stop_id = b.stop_id  where state = '$in_state' and county = '$in_county' and tract = '$in_tract'";
 	$rs=mysql_query($sql) or die($sql." ".mysql_error());
 	$data = array();
 	//$data['sql'] = $sql;
 	while($row = mysql_fetch_assoc($rs)){
 		$data[] = $row;
 	}
 	echo json_encode($data);