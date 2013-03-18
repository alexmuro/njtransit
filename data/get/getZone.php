<?php
	$geo_type = $_POST['geo_type'];
	$current_zone = $_POST['current_zone'];

	include '../../config/db.php'; 
	
	$test = new db();
		
	$inscon = $test->connect();
	$sql = "SELECT `".$geo_type."` from zones where id = ".$current_zone;
	//echo "SQL=".$sql;
	$rs=mysql_query($sql) or die($sql." ".mysql_error());
	$row = mysql_fetch_assoc( $rs );
	echo $row[$geo_type];

?>