<?php 
ini_set("memory_limit","1024M");
ini_set('max_execution_time', 600);
include_once('../../config/db.php'); 
$test = new db();
$inscon = $test->connect();


$sql = "SELECT 
    a.geoid
from
    us_atlas.34_tracts as a";

$rs = mysql_query($sql) or die($sql." ".mysql_error());

$sources = Array('sf1','acs5');
$handles = Array( 'sf1' =>Array('P0010001','P0030002','P0030003','P0030005'), 
                'acs5' => Array('B23025_001E','B23025_002E','B08006_001E','B08006_002E','B08006_003E','B08006_004E','B08006_008E'));


while($row = mysql_fetch_array($rs)){

    $properties = array();
    $feature = array();
    $geometry = array();
    $columns = "(geoid,";
    $values = "(".$row['geoid'].",";
    $var_sets = [['B01003_001E','B12006_001E','B12006_005E','B12006_010E','B12006_016E','B12006_021E','B12006_027E','B12006_032E','B12006_038E','B12006_043E','B12006_049E','B12006_054E','B12006_006E','B12006_011E','B12006_017E','B12006_022E','B12006_028E','B12006_033E','B12006_039E','B12006_044E','B12006_050E','B12006_055E','B08301_001E','B08301_002E','B08301_010E','B08301_016E','B08301_017E','B08301_018E','B08301_019E','B08301_020E','B08301_021E','B08126_001E','B08126_002E','B08126_003E','B08126_004E','B08126_005E','B08126_006E','B08126_007E','B08126_008E','B08126_009E','B08126_010E','B08126_011E','B08126_012E','B08126_013E','B08126_014E','B08126_015E'],
['B19013_001E','B17001_002E','B14003_003E','B14003_012E','B14003_031E','B14003_040E','B23006_002E','B23006_009E','B23006_016E','B23006_023E','B05006_001E','B06007_005E','B06007_008E','B01001_002E','B01001_026E','B01001_004E','B01001_005E','B01001_006E','B01001_007E','B01001_008E','B01001_009E','B01001_010E','B01001_011E','B01001_012E','B01001_013E','B01001_014E','B01001_015E','B01001_016E','B01001_017E','B01001_018E','B01001_019E','B01001_020E','B01001_021E','B01001_022E','B01001_023E','B01001_024E','B01001_025E'],
['B01001_027E','B01001_028E','B01001_029E','B01001_030E','B01001_031E','B01001_032E','B01001_033E','B01001_034E','B01001_035E','B01001_036E','B01001_037E','B01001_038E','B01001_039E','B01001_040E','B01001_041E','B01001_042E','B01001_043E','B01001_044E','B01001_045E','B01001_046E','B01001_047E','B01001_048E','B01001_049E','B02001_002E','B02001_003E','B02001_004E','B02001_005E','B02001_006E','B02001_007E','B02001_008E','B25002_001E','B25002_002E','B25002_003E','B25024_002E','B25024_003E','B25024_004E','B25024_005E','B25024_006E','B25024_007E','B25024_008E','B25024_009E','B25024_010E','B25024_011E','B25003_002E','B25003_003E'],
['B08014_002E','B08014_003E','B08014_004E','B08014_005E','B08014_006E','B08014_007E','B19001_001E','B19001_002E','B19001_003E','B19001_004E','B19001_005E','B19001_006E','B19001_007E','B19001_008E','B19001_009E','B19001_010E','B19001_011E','B19001_012E','B19001_013E','B19001_014E','B19001_015E','B19001_016E','B19001_017E']];

	for($x = 0; $x < count($var_sets);$x++){
	    $state = substr($row['geoid'],0,2);
	    $county = substr($row['geoid'],2,3);
	    $tract = substr($row['geoid'],5,6);
	    $source= 1;
	    $vars = implode(",",$var_sets[$x]);
	    $jURL = 'http://api.census.gov/data/2011/'.$sources[$source].'?key=564db01afc848ec153fa77408ed72cad68191211&get='.$vars.'&for=tract:'.$tract.'&in=county:'.$county.'+state:'.$state;
	    //echo $jURL;
      $cdata = curl_download($jURL);
	    $foo =  utf8_encode($cdata); 
	    $cdata = json_decode($foo, true);

      
	    for($i =0; $i < count($var_sets[$x]); $i++ ){
	        $columns .= $var_sets[$x][$i].",";
          $values .= intval($cdata[1][$i]).",";
	    }
     
	}
  $columns = rtrim($columns, ",").")";
  $values = rtrim($values, ",").")";
  echo "insert into tl_2011_34_tract_acs $columns VALUES $values;";
  echo "<br>";
	

}
//echo json_encode($output);


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


?>
