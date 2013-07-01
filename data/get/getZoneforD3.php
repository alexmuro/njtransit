<?php
	$current_zone = $_POST['zone'];

	include '../../config/db.php'; 
	
	$test = new db();
		
	$inscon = $test->connect();
	$sql = "SELECT centroid from zones where id = ".$current_zone;
	$rs=mysql_query($sql) or die($sql." ".mysql_error());
	$row = mysql_fetch_assoc( $rs );
	$output['centroid'] = $row['centroid'];
	
	$sql = "SELECT id from model_runs where zone_id = ".$current_zone;
	$rs=mysql_query($sql) or die($sql." ".mysql_error());
	$model_runs = array();
	while($row = mysql_fetch_assoc( $rs )){
		$model_runs[] = $row['id'];
	}
	$output['model_runs'] = $model_runs;
	
	echo json_encode($output);
	
?>