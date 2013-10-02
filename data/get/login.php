<?php
	session_start();
	$in_username = $_POST['username'];
	$in_password = $_POST['password'];

	include '../../config/db.php'; 
	
	$test = new db();
		
	$inscon = $test->connect();
	$sql = "SELECT * from users where username = '$in_username' or email = '$in_username'";
	$output['status']='failure';
	$output['redirect'] = 'admin/';

	$rs=mysql_query($sql) or die($sql." ".mysql_error());
	if($row = mysql_fetch_assoc( $rs )){//if there is a user with this username
		if(md5($in_password) == $row['password']){
			$output['status'] = 'success';
			$_SESSION['status'] = 'connected';
			$_SESSION['first_name'] = $row['first_name'];
			$_SESSION['last_name']= $row['last_name'];
			$_SESSION['access_level'] = $row['access_level'];
			$_SESSION['id'] = $row['id'];
			$_SESSION['email'] = $row['email'];
		}
	}

	echo json_encode($output);
?>