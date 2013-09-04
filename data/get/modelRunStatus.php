<?php
	$run_id = $_GET['model_run_id'];

 	include '../../config/db.php'; 
	$test = new db();
	$inscon = $test->connect();
	
	$ouput = array();

	$sql = "select finished from model_runs where id = $run_id";
	$rs=mysql_query($sql) or die($sql." ".mysql_error());
 	$row = mysql_fetch_assoc($rs);
 	$output['finished'] = $row['finished'];

 	$sql = "select count(id) as numTrips from model_trips where run_id = $run_id";
 	$rs=mysql_query($sql) or die($sql." ".mysql_error());
 	$row = mysql_fetch_assoc($rs);
 	$output['numTrips'] = $row['numTrips'];

 	echo json_encode($output);