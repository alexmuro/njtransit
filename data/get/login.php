<?php
	$in_username = $_POST['username'];
	$in_password = $_POST['password'];

	include '../../config/db.php'; 
	
	$test = new db();
		
	$inscon = $test->connect();
	$sql = "SELECT password from users where username = '$in_username'";
	$output['status']='failure';
	$output['redirect'] = 'admin/';

	$rs=mysql_query($sql) or die($sql." ".mysql_error());
	if($row = mysql_fetch_assoc( $rs )){//if there is a user with this username
		if(md5($in_password) == $row['password']){
			$output['status'] = 'success';
		}
	}

	echo json_encode($output);
?>