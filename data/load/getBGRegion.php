<?php
//error_reporting(E_ALL);
//ini_set('display_errors', '1');
ini_set("memory_limit","1024M");
ini_set('max_execution_time', 300);

$fips = 34;
$noapi = $_GET['nodata'];
$source = 1;
$inputTracts = ["1400000US34021003705","1400000US34021003703","1400000US34021003800","1400000US34021003904","1400000US34021003704","1400000US34021003706","1400000US34021003903","1400000US34021003500","1400000US34021003602","1400000US34021001300","1400000US34021001200","1400000US34021001102","1400000US34021001401","1400000US34021003601","1400000US34021003400","1400000US34021003100","1400000US34021003201","1400000US34021003301","1400000US34021004501","1400000US34021004000","1400000US34021004201","1400000US34023008601","1400000US34023008605","1400000US34023008606","1400000US34023008602","1400000US34021004301","1400000US34021003302","1400000US34021003202","1400000US34021002903","1400000US34021002904","1400000US34021002902","1400000US34021001800","1400000US34021001700","1400000US34021001600","1400000US34021001500","1400000US34021000900","1400000US34021002200","1400000US34021002000","1400000US34021001900","1400000US34021002800","1400000US34021002100","1400000US34021000800","1400000US34021001000","1400000US34021001101","1400000US34021000200","1400000US34021000500","1400000US34021000700","1400000US34021000300","1400000US34021000400","1400000US34021000100","1400000US34021002500","1400000US34021002602","1400000US34021002601","1400000US34021002702","1400000US34021003009","1400000US34021003004","1400000US34005701502","1400000US34005701700","1400000US34005704200","1400000US34005701401","1400000US34005701302","1400000US34005701301","1400000US34005701103","1400000US34021004502","1400000US34021004204","1400000US34021003008","1400000US34021003006","1400000US34021003007","1400000US34021004310","1400000US34021003001","1400000US34021003003","1400000US34021003002","1400000US34021004309","1400000US34025811900","1400000US34025812502","1400000US34029717300","1400000US34005701402","1400000US34005701303"];
//trenton



$dataurl = "http://localhost/olcensus/data/states/".$fips."/block_groups.json";

$geo = curl_download($dataurl);
$foo =  utf8_encode($geo);
$geo = json_decode($foo, true);
//echo '<pre>Test';
//print_r($geo);
//echo 'End Test<pre>';

    
$sources = Array('sf1','acs5');
$handles = Array( 'sf1' =>Array('P0010001','P0030002','P0030003','P0030005','P0040001','P0120002','P0120026','P0180001'), 'acs5' => Array('B00001_001E','B00002_001E','B23001_001E','B25044_003E','B25044_004E','B25119_001E','B08006_008E','B08006_009E','B08006_011E','B08006_001E','B08011_001E','B08012_001E','B08013_001E','B08014_001E','B08015_001E','B08016_001E','B08017_001E','B08018_001E','B08101_001E','B08119_001E','B08121_001E','B08122_001E','B08124_001E','B08126_001E','B08128_001E','B08130_001E','B08132_001E','B08133_001E','B08137_001E','B08141_001E','B08202_001E','B08301_001E','B08302_001E','B19001_001E','B99080_001E','B99081_001E','B08014_003E','B08014_002E','B08014_005E','B08014_006E','B08014_007E','B08141_001E','B08141_001E','B08141_003E','B08141_004E','B08141_005E'));

$cursor = 1;
$geoSort=Array();
$tracts=Array();
foreach($inputTracts as $tract)
{
  $tracts[] = $tract[11].$tract[12].$tract[13].$tract[14].$tract[15].$tract[16].$tract[17].$tract[18].$tract[19];
}


foreach($geo['features'] as $feature){
   $tractfip = $feature['properties']['GEO_ID'][11].$feature['properties']['GEO_ID'][12].$feature['properties']['GEO_ID'][13].$feature['properties']['GEO_ID'][14].$feature['properties']['GEO_ID'][15].$feature['properties']['GEO_ID'][16].$feature['properties']['GEO_ID'][17].$feature['properties']['GEO_ID'][18].$feature['properties']['GEO_ID'][19];
    //echo $inputTracts[0].' '.$feature['properties']['GEO_ID']." <br>";
        
    if(in_array($tractfip, $tracts)){  
        //echo $tractfip.' '.$feature['properties']['GEO_ID']." <br>";
        $geoSort[$feature['properties']['GEO_ID']] = $feature;
    }
}



foreach($inputTracts as $tract)
{

  $tractfip = $tract[14].$tract[15].$tract[16].$tract[17].$tract[18].$tract[19];
  $countyfip = $tract[11].$tract[12].$tract[13];
  $fip = $tract[9].$tract[10];

  //echo "FipsCode: $fip $countyfip $tractfip <br>";
  $vars = 'B00001_001E,B00002_001E,B23001_001E,B25044_003E,B25044_004E,B25119_001E,B08006_008E,B08006_009E,B08006_011E,B08006_001E,B08011_001E,B08012_001E,B08013_001E,B08014_001E,B08015_001E,B08016_001E,B08017_001E,B08018_001E,B08101_001E,B08119_001E,B08121_001E,B08122_001E,B08124_001E,B08126_001E,B08128_001E,B08130_001E,B08132_001E,B08133_001E,B08137_001E,B08141_001E,B08202_001E,B08301_001E,B08302_001E,B19001_001E,B99080_001E,B99081_001E,B08014_003E,B08014_002E,B08014_005E,B08014_006E,B08014_007E,B08141_001E,B08141_001E,B08141_003E,B08141_004E,B08141_005E';
  $var = $handles[$sources[$source]][$var];
  $jURL = 'http://api.census.gov/data/2010/'.$sources[$source].'?key=564db01afc848ec153fa77408ed72cad68191211&get='.$vars.'&for=block+group:*&in=state:'.$fip.'+county:'.$countyfip.'+tract:'.$tractfip;



  //echo $jURL."<br>";
  $cdata = curl_download($jURL);
  //echo $cdata;
  $foo =  utf8_encode($cdata);
  $cdata = json_decode($foo, true); 


  for($cursor =1;$cursor <count($cdata);$cursor++)
  {
  $length = count($cdata[$cursor]);
  $geoid = '1500000US'.$cdata[$cursor][$length-4].$cdata[$cursor][$length-3]. $cdata[$cursor][$length-2]. $cdata[$cursor][$length-1];
  //echo $geoid.'<br>';
  $geotract = $geoid[14].$geoid[15].$geoid[16].$geoid[17].$geoid[18].$geoid[19];
  //echo $geotract.' '.$tracts[0].' '.in_array($geoid, $tracts).'<br>';
      for($var = 0;$var < $length-4;$var++)
      { 
        //echo 'cdata '.$geoid.' '.$handles[$sources[$source]][$var].' '.$cdata[$cursor][$var].'<br>';
        
        $geoSort[$geoid]['properties'][$handles[$sources[$source]][$var]] = $cdata[$cursor][$var];
        
      }
    
      //echo  $cdata[$cursor][0];
  }
}
$source = 0;
foreach($inputTracts as $tract)
{

  $tractfip = $tract[14].$tract[15].$tract[16].$tract[17].$tract[18].$tract[19];
  $countyfip = $tract[11].$tract[12].$tract[13];
  $fip = $tract[9].$tract[10];

  //echo "FipsCode: $fip $countyfip $tractfip <br>";
  
  $vars = 'P0010001,P0030002,P0030003,P0030005,P0040001,P0120002,P0120026,P0180001';
    $var = $handles[$sources[$source]][$var];
    

  $var = $handles[$sources[$source]][$var];
  $jURL = 'http://api.census.gov/data/2010/'.$sources[$source].'?key=564db01afc848ec153fa77408ed72cad68191211&get='.$vars.'&for=block+group:*&in=state:'.$fip.'+county:'.$countyfip.'+tract:'.$tractfip;



  //echo $jURL."<br>";
  $cdata = curl_download($jURL);
  //echo $cdata;
  $foo =  utf8_encode($cdata);
  $cdata = json_decode($foo, true); 


  for($cursor =1;$cursor <count($cdata);$cursor++)
  {
  $length = count($cdata[$cursor]);
  $geoid = '1500000US'.$cdata[$cursor][$length-4].$cdata[$cursor][$length-3]. $cdata[$cursor][$length-2]. $cdata[$cursor][$length-1];
  //echo $geoid.'<br>';
  $geotract = $geoid[14].$geoid[15].$geoid[16].$geoid[17].$geoid[18].$geoid[19];
  //echo $geotract.' '.$tracts[0].' '.in_array($geoid, $tracts).'<br>';
      for($var = 0;$var < $length-4;$var++)
      { 
        //echo 'cdata '.$geoid.' '.$handles[$sources[$source]][$var].' '.$cdata[$cursor][$var].'<br>';
        
        $geoSort[$geoid]['properties'][$handles[$sources[$source]][$var]] = $cdata[$cursor][$var];
        
      }
    
      //echo  $cdata[$cursor][0];
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