<?php

	$model_id = $_GET['model_run'];

 	include '../../config/db.php'; 
	$test = new db();
	$inscon = $test->connect();
	
	$origins = array();
	$origins ['type'] = 'FeatureCollection';

	$sql = "select from_lat,from_lon from model_trip_table where run_id = $model_id";
	$rs =mysql_query($sql) or die($sql." ".mysql_error());
	
	while($row = mysql_fetch_array($rs)){
		 $feature = array();
		 $geometry = array();
		 $coordinates = array();
		 $feature['type'] = 'Feature';
		 $geometry['type'] = 'Point'; 
         $coordinates = array($row['from_lon']*1,$row['from_lat']*1);
         $geometry['coordinates'] = $coordinates;
         $feature['geometry'] = $geometry;
         $origins['features'][]=$feature;
		//echo ." ".."<br>";
	}

	echo json_encode($origins)

?>