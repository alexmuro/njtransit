<?php

	include '../../config/db.php'; 
	
	$test = new db();
		
	$inscon = $test->connect();

	$sql = "SELECT stop_id,stop_lat,stop_lon from stops where stop_id > 41000 and stop_id < 45000";
	$rs=mysql_query($sql) or die($sql." ".mysql_error());
	
	$i = 0;
	while($row = mysql_fetch_assoc( $rs )){
		
		$url ='http://data.fcc.gov/api/block/find?';
		//if($i < 1){
			?>
			<script src="../../resources/js/jquery-1.9.1.min.js"></script>
			<script>
			var lurl = '<?php echo $url;?>';
			$.ajax({
			  type:"GET",     
			  dataType: 'jsonp',
			  data:{
			  	format:'jsonp',
			  	latitude:<?php echo $row['stop_lat']; ?>,
			  	longitude:<?php echo $row['stop_lon']; ?>,
			  	showall:'true'
			  },
  			url: lurl,       
			success: function(indata, status) {
				console.log(indata.Block.FIPS);
			   	$.ajax({url:'/njtransit/data/create/stop_fips.php',
			   	type:'GET',
			   	data:{stop:<?php echo $row['stop_id']; ?>,block:indata.Block.FIPS}
			   	})
			   	.done(function(data){

			   		console.log(data);
			   		
			   	})	
			},
			error: function(xhr, status, e) {
				console.log('error');
			 	console.info(xhr, status, e);
			}
			});
			</script>		
			<?php
		//}
		$i++;

	}

function curl_download($Url){
 
  if(!function_exists('curl_init')){
    die('Sorry cURL is not installed!');
  }
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $Url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  $output = curl_exec($ch);

}