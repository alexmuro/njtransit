<?php
	error_reporting(E_ALL ^ E_DEPRECATED);
	ini_set('memory_limit', '-1');

	$time = 'am';
	if(isset($_POST['time'])){
		$time = $_POST['time'];
	}
	if(isset($_GET['time'])){
		$time = $_GET['time'];
	}

	include 'db.php'; 
	
	$test = new db();
	$inscon = $test->connect();
	
	$sql = "select * from njt_trips 
		WHERE START_TIME BETWEEN ('6:00:00') AND ('10:00:00') and RUN_DATE = '2013-07-17' and
		LINE in ('501','502','504','505','507','508','509','551','552','553','554','559')
		and BOARDING_ZONE in (1,10,11,12,13,14,15,16,18,2,21,22,24,25,26,28,29,3,30,31,34,35,36,37,38,39,4,5,6,7,8,9)
		and ALIGHTING_ZONE in (1,10,11,12,13,14,15,16,18,2,21,22,24,25,26,28,29,3,30,31,34,35,36,37,38,39,4,5,6,7,8,9)";
	if($time == 'pm'){
		$sql ="select * from njt_trips 
		WHERE START_TIME BETWEEN ('15:00:00') AND ('19:00:00') and RUN_DATE = '2013-07-17' and
		LINE in ('501','502','504','505','507','508','509','551','552','553','554','559')
		and BOARDING_ZONE in (1,10,11,12,13,14,15,16,18,2,21,22,24,25,26,28,29,3,30,31,34,35,36,37,38,39,4,5,6,7,8,9)
		and ALIGHTING_ZONE in (1,10,11,12,13,14,15,16,18,2,21,22,24,25,26,28,29,3,30,31,34,35,36,37,38,39,4,5,6,7,8,9)";
	}else if($time == 'combined'){
		$sql ="select * from njt_trips 
		WHERE (START_TIME BETWEEN ('6:00:00') AND ('10:00:00') or  START_TIME BETWEEN ('15:00:00') AND ('19:00:00')) and RUN_DATE = '2013-07-17' and
		LINE in ('501','502','504','505','507','508','509','551','552','553','554','559')
		and BOARDING_ZONE in (1,10,11,12,13,14,15,16,18,2,21,22,24,25,26,28,29,3,30,31,34,35,36,37,38,39,4,5,6,7,8,9)
		and ALIGHTING_ZONE in (1,10,11,12,13,14,15,16,18,2,21,22,24,25,26,28,29,3,30,31,34,35,36,37,38,39,4,5,6,7,8,9)";
	}else if($time == 'fullday'){
		$sql ="select * from njt_trips 
		WHERE RUN_DATE = '2013-07-17' and
		LINE in ('501','502','504','505','507','508','509','551','552','553','554','559')
		and BOARDING_ZONE in (1,10,11,12,13,14,15,16,18,2,21,22,24,25,26,28,29,3,30,31,34,35,36,37,38,39,4,5,6,7,8,9)
		and ALIGHTING_ZONE in (1,10,11,12,13,14,15,16,18,2,21,22,24,25,26,28,29,3,30,31,34,35,36,37,38,39,4,5,6,7,8,9)";

	}

 	// $sql = "SELECT 
		// 	    RUN_DATE,
		// 	    START_TIME,
		// 	    LINE,
		// 	    RUN,
		// 	    BOARDING_ZONE,
		// 	    ALIGHTING_ZONE,
		// 	    FLOOR(AVG(TOTAL_TRANSACTIONS)) as TOTAL_TRANSACTIONS
		// 	from
		// 	    njt_trips
		// 	WHERE
		// 	    START_TIME BETWEEN ('6:00:00') 
		// 	    AND ('10:00:00') 
		// 	    AND LINE in ('501','502','504','505','507','508','509','551','552','553','554','559')
		// 	group by LINE ,  BOARDING_ZONE , ALIGHTING_ZONE , START_TIME";

	$rs=mysql_query($sql) or die($sql." ".mysql_error());
	$rows = array();
	while($r = mysql_fetch_assoc($rs)) {
    	$rows[] = $r;
	}
	
	echo json_encode($rows);
	
?>