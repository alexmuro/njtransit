<?php	
	include '../../config/db.php'; 
	
	$test = new db();
	$user = $_POST['user'];
	$output = array();
	// if(isset($_POST['user_id']) && !empty($_POST['user_id']) )
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
	$password = "";
	if(isset($user['password'])){
		$password = $user['password'];
	}
	$password2 = "";
	if(isset($user['password2'])){
		$password2 = $user['password2'];
	}

	if(!empty($password) && $password == $password2){
		if(!empty($username) && !empty($email)){
			$inscon = $test->connect();
			$sql = "Insert into users (username,email,first_name,last_name,password,access_level) values ('$username','$email','$first_name','$last_name','".md5($password)."',3)";
			$rs=mysql_query($sql) or die($sql." ".mysql_error());
			$output['status'] = 1;
			$output['message'] = $sql;

		} else {

			$output['status'] = 0;
			$output['message'] = "Must enter username and email";

		}

	}else{

		$output['status'] = 0;
		$output['message'] = "Passwords don't match";
	}	
	echo json_encode($output);
?>