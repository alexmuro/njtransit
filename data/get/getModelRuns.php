<?php
	$zone_id = $_POST['zone_id'];

 
 	include '../../config/db.php'; 
	$test = new db();
	$inscon = $test->connect();

	$date = array();
	$sql = "select id from model_runs where zone_id = $zone_id";
 	$rs=mysql_query($sql) or die($sql." ".mysql_error());
 	$data = array();

 	while($row = mysql_fetch_assoc($rs)){
 		$data['zones'][] = $row;
 	}
 	echo json_encode($data);