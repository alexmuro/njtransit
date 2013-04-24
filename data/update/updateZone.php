<?php
	$geo_string = $_POST['geo_string'];
	$geo_type = $_POST['geo_type'];
	$current_zone = $_POST['current_zone'];

	include '../../config/db.php'; 
	
	$test = new db();
		
		$inscon = $test->connect();
		$sql = "UPDATE zones SET `".$geo_type."` = '".$geo_string."' where id = ".$current_zone;
		//echo "SQL=".$sql;
		$rs=mysql_query($sql) or die($sql."<br><br>".mysql_error());
?>