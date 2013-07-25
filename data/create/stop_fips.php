<?php

	include '../../config/db.php'; 
	
	$test = new db();
		
	$inscon = $test->connect();
	$insert_data = "(".$_GET['stop'].",'".substr($_GET['block'],0,2)."', '".substr($_GET['block'],2,3)."','".substr($_GET['block'],5,6)."','".substr($_GET['block'],11,1)."','".substr($_GET['block'],12,3)."')";
	$sql = "INSERT into gtfs_20130712.stop_fips (stop_id,state,county,tract,block_group,block) VALUES $insert_data";
	mysql_query($sql);
	echo mysql_insert_id();
?>