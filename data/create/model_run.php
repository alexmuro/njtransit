<?php

	include '../../config/db.php'; 
	
	$test = new db();
		
	$inscon = $test->connect();
	$insert_data = "(NOW(),".$_POST['zone_id'].",'".$_POST['name']."')";
	$sql = "INSERT into model_runs (runtime,zone_id,name) VALUES $insert_data";
	mysql_query($sql);
	echo mysql_insert_id();
?>