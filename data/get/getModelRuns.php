<?php
	$zone_id = $_POST['zone_id'];
	$user_id = $_POST['user_id'];

 
 	include '../../config/db.php'; 
	$test = new db();
	$inscon = $test->connect();

	$date = array();
	$sql = "SELECT model_runs.id,model_runs.name 
			from 
				model_runs 
			JOIN 
				user_model 
				on model_runs.id = user_model.run_id 
			where 
				model_runs.zone_id = $zone_id and 
				user_model.user_id=$user_id 
				and  finished = 1 ";
 	$rs=mysql_query($sql) or die($sql." ".mysql_error());
 	$data = array();

 	while($row = mysql_fetch_assoc($rs)){
 		$model = array();
 		$model['id'] = $row['id'];
 		$model['name'] = $row['name']; 
 		$data[] = $model;
 	}
 	echo json_encode($data);