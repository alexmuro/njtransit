<?php 
$zone_id = $_GET['zone'];
$path = "../zones/$zone_id/";
if(makeDir($path)){
	$curl_url = "http://".$_SERVER['SERVER_NAME']."/data/get/getCTRegion.php?zone=".$zone_id;
	curl_file($curl_url,$path,'ct.json');

  $curl_url = "http://".$_SERVER['SERVER_NAME']."/data/get/getGTFSbyRoute.php?zone=".$zone_id;
  curl_file($curl_url,$path,'gtfs.json');
}
else{
	echo "error could not create path: $path .<br>";
}


//=====================================================

function makeDir($path)
{
   return is_dir($path) || mkdir($path);
}

function curl_download($Url){
 
    // is cURL installed yet?
    if (!function_exists('curl_init')){
        die('Sorry cURL is not installed!');
    }
 
    // OK cool - then let's create a new cURL resource handle
     $ch = curl_init();
   curl_setopt($ch, CURLOPT_URL, $Url);
   curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
   $output = curl_exec($ch);

    return $output;
}

function curl_file($url, $local_path, $newfilename) 
{ 
    $err_msg = ''; 
    echo "<br>Attempting message download for $url<br>"; 
    $out = fopen($local_path.$newfilename,"wb");
    if ($out == FALSE){ 
      print "File not opened<br>"; 
      exit; 
    } 

    $ch = curl_init(); 

    curl_setopt($ch, CURLOPT_FILE, $out); 
    curl_setopt($ch, CURLOPT_HEADER, 0); 
    curl_setopt($ch, CURLOPT_URL, $url); 

    curl_exec($ch); 
    echo "<br>Error is : ".curl_error ( $ch); 

    curl_close($ch); 
    //fclose($handle); 

}
