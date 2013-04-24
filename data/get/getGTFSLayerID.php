<?php
	$nelat = $_GET['nelat'];
	$nelon = $_GET['nelon'];
	$swlat = $_GET['swlat'];
	$swlon = $_GET['swlon'];		
	include '../../config/db.php'; 
	$test = new db();
	$inscon = $test->connect();

		$sql = "select DISTINCT shape_id from shapes where ((shape_pt_lat > $swlat and shape_pt_lat < $nelat ) and (shape_pt_lon > $swlon and shape_pt_lon < $nelon))";
		$rs=mysql_query($sql) or die($select."<br><br>".mysql_error());
		$results = array();
		while ( $row = mysql_fetch_assoc( $rs )) {
			$results[] = $row;
		}
		echo json_encode($results); 