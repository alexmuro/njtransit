<?php
	$run_id = $_POST['run_id'];

 
 	include '../../config/db.php'; 
	$test = new db();
	$inscon = $test->connect();

	$date = array();
	$data = array();
	
	$sql = "select * from model_runs where id = $run_id";
	$rs=mysql_query($sql) or die($sql." ".mysql_error());
	$data['overview'][] = mysql_fetch_assoc($rs);


 	
echo json_encode($data);
