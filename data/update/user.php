<?php	
	include '../../config/db.php'; 
	
	$test = new db();
	$inscon = $test->connect();
	$output = array();

	if(isset($_POST['del'])){

		$sql = "update users set deleted = 1 where id = ".$_POST['user'];
		$output['status'] = 0;
		$rs=mysql_query($sql) or die($sql." ".mysql_error());
		$output['status'] = 1;
		$output['message'] = $sql;

	}else{
		$user = $_POST['user'];
		// if(isset($_POST['user_id']) && !empty($_POST['user_id']) ){
		// 	$where = "where id = ".$_POST['user_id'];
		// }
		$username = "";
		if(isset($user['username'])){
			$username = $user['username'];
		}
		$email = "";
		if(isset($user['email'])){
			$email = $user['email'];
		}
		$first_name = "";
		if(isset($user['first_name'])){
			$first_name = $user['first_name'];
		}
		$last_name = "";
		if(isset($user['last_name'])){
			$last_name = $user['last_name'];
		}
		$access_level = 1;
		if(isset($user['access_level'])){
			$access_level = $user['access_level']*1;
		}
		
		$sql = "update users set username = '".$username."', email = '".$email."', first_name ='".$first_name."',last_name ='".$last_name."',access_level ='".$access_level."' where id = ".$user['id'];
		
		$output['status'] = 0;
		$rs=mysql_query($sql) or die($sql." ".mysql_error());
		$output['status'] = 1;
		$output['message'] = $sql;
	}
	echo json_encode($output);
?>