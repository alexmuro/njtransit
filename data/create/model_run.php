<?php

	include '../../config/db.php'; 
	
	$test = new db();
		
	$inscon = $test->connect();
	$insert_data = "(NOW(),".$_POST['zone_id'].")";
	$sql = "INSERT into model_runs (runtime,zone_id) VALUES $insert_data";
	mysql_query($sql);
	echo mysql_insert_id();
?>