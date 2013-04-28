<?php
ini_set("memory_limit","512M");
ini_set('max_execution_time', 300);


$zone_id = $_GET['zone'];
$source = 0;
$fips = 34;
$counties = ["001","003","005","007","009","011","013","015","017","019","021","023","025","027","029","031","033","035","037","039","041"];

include '../../config/db.php'; 
$test = new db();
$inscon = $test->connect();
$sql = "select ct from zones where id = $zone_id";
$rs=mysql_query($sql) or die($select."<br><br>".mysql_error());
$results = array();
$row = mysql_fetch_assoc( $rs );
$inputTracts= json_decode($row['ct']);

$dataurl = "http://localhost/zone/data/states/".$fips."/census_tracts.json";

$geo = curl_download($dataurl);
$foo =  utf8_encode($geo);
$geo = json_decode($foo, true);

    
$sources = Array('sf1','acs5');
$handles = Array( 'sf1' =>Array('P0010001','P0030002','P0030003','P0030005','P0040001','P0120002','P0120026','P0180001'), 'acs5' => Array('B00001_001E','B00002_001E','B23001_001E','B25044_003E','B25044_004E','B25119_001E','B08006_008E','B08006_009E','B08006_011E','B08006_001E','B08011_001E','B08012_001E','B08013_001E','B08014_001E','B08015_001E','B08016_001E','B08017_001E','B08018_001E','B08101_001E','B08119_001E','B08121_001E','B08122_001E','B08124_001E','B08126_001E','B08128_001E','B08130_001E','B08132_001E','B08133_001E','B08137_001E','B08141_001E','B08202_001E','B08301_001E','B08302_001E','B19001_001E','B99080_001E','B99081_001E','B08014_003E','B08014_002E','B08014_005E','B08014_006E','B08014_007E','B08141_001E','B08141_001E','B08141_003E','B08141_004E','B08141_005E'));


$cursor = 1;
$geoSort=Array();
foreach($geo['features'] as $feature){
    
    if(in_array($feature['properties']['GEO_ID'],$inputTracts)){
    $geoSort[$feature['properties']['GEO_ID']] = $feature;
    }
}


foreach($counties as $county)
{
  $vars = 'P0010001,P0030002,P0030003,P0030005,P0040001,P0120002,P0120026,P0180001';
  $jURL = 'http://api.census.gov/data/2010/'.$sources[0].'?key=564db01afc848ec153fa77408ed72cad68191211&get='.$vars.'&for=tract:*&in=county:'.$county.'+state:'.$fips;

  
  $cdata = curl_download($jURL);
  $foo =  utf8_encode($cdata);
  $cdata = json_decode($foo, true); 


  for($cursor =1;$cursor <count($cdata);$cursor++)
  {
    $length = count($cdata[$cursor]);
    $geoid = '1400000US'.$cdata[$cursor][$length-3]. $cdata[$cursor][$length-2]. $cdata[$cursor][$length-1];
    for($var = 0;$var < $length-3;$var++)
    { 
      if(in_array($geoid, $inputTracts)){
        $geoSort[$geoid]['properties'][$handles[$sources[$source]][$var]] = $cdata[$cursor][$var];
      }
    }
  }
}

$source = 1;
foreach($counties as $county)
{
  $vars = 'B00001_001E,B00002_001E,B23001_001E,B25044_003E,B25044_004E,B25119_001E,B08006_008E,B08006_009E,B08006_011E,B08006_001E,B08011_001E,B08012_001E,B08013_001E,B08014_001E,B08015_001E,B08016_001E,B08017_001E,B08018_001E,B08101_001E,B08119_001E,B08121_001E,B08122_001E,B08124_001E,B08126_001E,B08128_001E,B08130_001E,B08132_001E,B08133_001E,B08137_001E,B08141_001E,B08202_001E,B08301_001E,B08302_001E,B19001_001E,B99080_001E,B99081_001E,B08014_003E,B08014_002E,B08014_005E,B08014_006E,B08014_007E,B08141_001E,B08141_001E,B08141_003E,B08141_004E,B08141_005E';
  $jURL = 'http://api.census.gov/data/2010/'.$sources[$source].'?key=564db01afc848ec153fa77408ed72cad68191211&get='.$vars.'&for=tract:*&in=county:'.$county.'+state:'.$fips;

  $cdata = curl_download($jURL);
  $foo =  utf8_encode($cdata);
  $cdata = json_decode($foo, true); 


  for($cursor =1;$cursor <count($cdata);$cursor++)
  {
    $length = count($cdata[$cursor]);
    $geoid = '1400000US'.$cdata[$cursor][$length-3]. $cdata[$cursor][$length-2]. $cdata[$cursor][$length-1];
    for($var = 0;$var < $length-3;$var++)
    { 
      if(in_array($geoid, $inputTracts)){
        $geoSort[$geoid]['properties'][$handles[$sources[$source]][$var]] = $cdata[$cursor][$var];
      }
    } 
  }
}


$empty=Array();
$geo['features'] = $empty;
foreach($geoSort as $feature){
    $geo['features'][] = $feature;
}
echo json_encode($geo);


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