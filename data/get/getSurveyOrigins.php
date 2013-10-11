<?php

	$zone = $_GET['zone'];

 	include '../../config/db.php'; 
	$test = new db();
	$inscon = $test->connect();
	
	$origins = array();
	$origins ['type'] = 'FeatureCollection';

	$sql = "select replace(replace(replace(ct,'[','('),'1400000US',''),']',')') as ct from njtransit.zones where id =$zone";
	$rs =mysql_query($sql) or die($sql." ");
	$row = mysql_fetch_array($rs);

	$sql = "select O_MAT_LAT,O_MAT_LONG from survey_geo where o_geoid10 in ".$row['ct'];
	$rs =mysql_query($sql) or die($sql." ".mysql_error());
	
	while($row = mysql_fetch_array($rs)){
		 $feature = array();
		 $geometry = array();
		 $coordinates = array();
		 $feature['type'] = 'Feature';
		 $geometry['type'] = 'Point'; 
         $coordinates = array($row['O_MAT_LONG']*1,$row['O_MAT_LAT']*1);
         $geometry['coordinates'] = $coordinates;
         $feature['geometry'] = $geometry;
         $origins['features'][]=$feature;
		//echo ." ".."<br>";
	}

	echo json_encode($origins)

?>