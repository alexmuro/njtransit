<?php
	$data = new db();
	$inscon = $data->connect();

	$sql = "select route_id,route_short_name from routes";
	$rs = $data->do_query($sql);
	$id = array();
		while ( $row = mysql_fetch_assoc( $rs )) {
			$id[] = $row['route_id'];
			$name = $row['route_short_name'];      
		}
?>
<script>
	var routes = <?php echo json_encode($id);?>;
	 for(var i=0;i<routes.length;i++){
        var obj = routes[i];
        addBusRoute(obj);
    }

</script>