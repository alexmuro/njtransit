<?php
	error_reporting(E_ALL ^ E_DEPRECATED);
	ini_set('memory_limit', '-1');

	if(isset($_POST['run_id'])){
		$run_id = $_POST['run_id'];
	}
	if(isset($_GET['run_id'])){
		$run_id = $_GET['run_id'];
	}

	include 'db.php'; 
	
	$test = new db();
	$inscon = $test->connect();
	
	$sql = "select * from njt_trips 
		WHERE START_TIME BETWEEN ('6:00:00') AND ('10:00:00') and RUN_DATE = '2013-07-08' and
		LINE in ('501','502','504','505','507','508','509','551','552','553','554','559')";

	$rs=mysql_query($sql) or die($sql." ".mysql_error());
	$rows = array();
	while($r = mysql_fetch_assoc($rs)) {
    	$rows[] = $r;
	}
	
	echo json_encode($rows);
	
?>