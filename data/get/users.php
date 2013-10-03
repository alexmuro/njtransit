<?php	
	include '../../config/db.php'; 
	
	$test = new db();
	$where = "";
	if(isset($_POST['user_id']) && !empty($_POST['user_id']) ){
		$where = "and id = ".$_POST['user_id'];
	}
		
	$inscon = $test->connect();
	$sql = "SELECT * from users where deleted = 0 $where";
	$output = array();

	$rs=mysql_query($sql) or die($sql." ".mysql_error());
	while($row = mysql_fetch_assoc( $rs )){//if there is a user with this username
		
		$output[] = $row;
	}

	echo json_encode($output);
?>