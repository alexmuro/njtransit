<?php
	$run_id = $_GET['run_id'];

 
 	include '../../config/db.php'; 
	$test = new db();
	$inscon = $test->connect();

	$date = array();
	$data = array();
	
	$sql = "select a.*,b.routes from model_runs as a join zones as b on a.zone_id = b.id where a.id = $run_id";
	$rs=mysql_query($sql) or die($sql." ".mysql_error());
	$data['overview'] = array();
	while($row =  mysql_fetch_assoc($rs)){
		$data['overview'][] = $row;
	};
	echo json_encode($data);
?>