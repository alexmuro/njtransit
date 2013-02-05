<?php
ini_set("memory_limit","512M");
ini_set('max_execution_time', 300);
//error_reporting(E_ALL);
//ini_set('display_errors', '1');

$source = $_GET['s'];
$var = $_GET['v'];
$source = 0;
$fips = 34;
$counties = ["001","003","005","007","009","011","013","015","017","019","021","023","025","027","029","031","033","035","037","039","041"];
$inputTracts = ["1400000US34021001200","1400000US34021001300","1400000US34021001402","1400000US34021001101","1400000US34021001102","1400000US34021001500","1400000US34021001401","1400000US34021003400","1400000US34021003601","1400000US34021001700","1400000US34021001800","1400000US34021001900","1400000US34021002000","1400000US34021001600","1400000US34021000900","1400000US34021001000","1400000US34021000100","1400000US34021000800","1400000US34021000200","1400000US34021002400","1400000US34021000300","1400000US34021002601","1400000US34021002602","1400000US34021002701","1400000US34021002800","1400000US34021000700","1400000US34021000400","1400000US34021000500","1400000US34021000600","1400000US34021002200","1400000US34021002100","1400000US34021002702","1400000US34021002500","1400000US34021002902","1400000US34021003100","1400000US34021003500","1400000US34021003602","1400000US34021002903","1400000US34021003202","1400000US34021003201","1400000US34021003705","1400000US34021003703","1400000US34021003704","1400000US34021003008"];
$noapi = $_GET['nodata'];


$dataurl = "http://localhost/olcensus/data/states/".$fips."/census_tracts.json";
//echo $dataurl;
$geo = curl_download($dataurl);
$foo =  utf8_encode($geo);
$geo = json_decode($foo, true);
//echo '<pre>Test';
//print_r($geo);
//echo 'End Test<pre>';

    
$sources = Array('sf1','acs5');
$handles = Array( 'sf1' =>Array('P0010001','P0030002','P0030003','P0030005','P0040001','P0120002','P0120026','P0180001'), 'acs5' => Array('B00001_001E','B00002_001E','B23001_001E','B25044_003E','B25044_004E','B25119_001E','B08006_008E','B08006_009E','B08006_011E'));


$cursor = 1;
$geoSort=Array();
foreach($geo['features'] as $feature){
    
    if(in_array($feature['properties']['GEO_ID'],$inputTracts)){
    $geoSort[$feature['properties']['GEO_ID']] = $feature;
    }
}


foreach($counties as $county)
{
    //echo "FipsCode: $fipscode <br>";
    $vars = 'P0010001,P0030002,P0030003,P0030005,P0040001,P0120002,P0120026,P0180001';
    $var = $handles[$sources[$source]][$var];
    $jURL = 'http://api.census.gov/data/2010/'.$sources[$source].'?key=564db01afc848ec153fa77408ed72cad68191211&get='.$vars.'&for=tract:*&in=county:'.$county.'+state:'.$fips;

    //echo $jURL."<br>";
    $cdata = curl_download($jURL);
    //echo $cdata;
    $foo =  utf8_encode($cdata);
    $cdata = json_decode($foo, true); 


    for($cursor =1;$cursor <count($cdata);$cursor++)
    {
    $length = count($cdata[$cursor]);
    $geoid = '1400000US'.$cdata[$cursor][$length-3]. $cdata[$cursor][$length-2]. $cdata[$cursor][$length-1];
    //echo  $geoSort[$geoid]['properties']['NAME'].' '.$geoSort[$geoid]['properties']['LSAD'].' Population:'.number_format ($cdata[$cursor][0]).    "-$cursor".'<br>';
        for($var = 0;$var < $length-2;$var++)
        { 
        //echo $handles[$sources[$source]][$var];
            if(in_array($geoid, $inputTracts)){
             $geoSort[$geoid]['properties'][$handles[$sources[$source]][$var]] = $cdata[$cursor][$var];
         }
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