<?php
include "../../config/db.php";

ini_set('display_errors', 'On');
error_reporting(E_ALL);
//select tract,QPOWTRACT, `table301-1`,`table302-1-1`,`table302-1-5`,`table302-1-6` from workplace_flow_data where state3 ='034' and county = '021' and tract = '001100' order by `table302-1-5` desc;

$con = new db();
$con->connect();
$result = $con->do_query('select tract,QPOWTRACT, `table301-1`,`table302-1-1`,`table302-1-5`,`table302-1-6` from workplace_flow_data where state3 ='. $_GET['state'] . ' and county =' . $_GET['county'] . ' and tract =' . $_GET['tract'] . ' order by `table302-1-5` desc');
while($row =  mysql_fetch_array($result)){
	
	echo json_encode($row);

}

$con->close();

?>


