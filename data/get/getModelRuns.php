<?php
	$zone_id = $_POST['zone_id'];

 
 	include '../../config/db.php'; 
	$test = new db();
	$inscon = $test->connect();

	$date = array();
	$sql = "select id,name from model_runs where zone_id = $zone_id";
 	$rs=mysql_query($sql) or die($sql." ".mysql_error());
 	$data = array();

 	while($row = mysql_fetch_assoc($rs)){
 		$model = array();
 		$model['id'] = $row['id'];
 		$model['name'] = $row['name']; 
 		$data[] = $model;
 	}
 	echo json_encode($data);