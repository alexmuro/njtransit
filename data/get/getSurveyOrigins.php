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

	$sql = "select O_MAT_LAT,O_MAT_LONG,WEIGHT,SURVEYNAME,CASINOWORKER,CASINOVISITOR,CAPTIVITY,VEHICLEAVAIL,TRIPFREQ,TRIPTENURE,GENDER,AGE,RACE,OCCUPATION,HOUSEHOLDSIZE,HOUSEHOLDCARS,INCOME,FREQUENTRIDER,INCOME_MIDPT,AGE_MIDPT from survey_geo as a join survey_attributes as b on a.ID = b.ID where o_geoid10 in ".$row['ct'];
	$rs =mysql_query($sql) or die($sql." ".mysql_error());
	
	while($row = mysql_fetch_array($rs)){
		$feature = array();
		$geometry = array();
		$coordinates = array();
		$properties = array();
		$properties['WEIGHT']=$row['WEIGHT'];
		$properties['SURVEYNAME']=$row['SURVEYNAME'];
		$properties['CASINOWORKER']=$row['CASINOWORKER'];
		$properties['CASINOVISITOR']=$row['CASINOVISITOR'];
		$properties['CAPTIVITY']=$row['CAPTIVITY'];
		$properties['VEHICLEAVAIL']=$row['VEHICLEAVAIL'];
		$properties['TRIPFREQ']=$row['TRIPFREQ'];
		$properties['TRIPTENURE']=$row['TRIPTENURE'];
		$properties['GENDER']=$row['GENDER'];
		$properties['AGE']=$row['AGE'];
		$properties['RACE']=$row['RACE'];
		$properties['OCCUPATION']=$row['OCCUPATION'];
		$properties['HOUSEHOLDSIZE']=$row['HOUSEHOLDSIZE'];
		$properties['HOUSEHOLDCARS']=$row['HOUSEHOLDCARS'];
		$properties['INCOME']=$row['INCOME'];
		$properties['FREQUENTRIDER']=$row['FREQUENTRIDER'];
		$properties['INCOME_MIDPT']=$row['INCOME_MIDPT'];
		$properties['AGE_MIDPT']=$row['AGE_MIDPT'];

		$feature['type'] = 'Feature';
		$geometry['type'] = 'Point'; 
        $coordinates = array($row['O_MAT_LONG']*1,$row['O_MAT_LAT']*1);
        $geometry['coordinates'] = $coordinates;
        $feature['geometry'] = $geometry;
        $feature['properties'] = $properties;
        $origins['features'][]=$feature;
}

	echo json_encode($origins)

?>