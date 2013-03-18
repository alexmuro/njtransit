<?php
ini_set("memory_limit","135M");
ini_set('max_execution_time', 300);
$geo = curl_download('http://b3nson.net/transit/maps/data/gz_2010_us_050_00_20m.json');
$foo =  utf8_encode($geo);
$geo = json_decode($foo, true);

$source = $_GET['s'];
$var = $_GET['v'];
;
    
$sources = Array('sf1','acs5');
$handles = Array( 'sf1' =>Array('P0010001','P0030002','P0030003','P0030005','P0040001','P0120002','P0120026','P0180001'), 'acs5' => Array('B00001_001E','B00002_001E','B23001_001E','B25044_003E','B25044_004E','B25119_001E','B08006_008E','B08006_009E','B08006_011E'));


$cursor = 1;
$geoSort=Array();
foreach($geo['features'] as $feature){
    $geoSort[$feature['properties']['GEO_ID']] = $feature;
}

$validFIPS = Array(1,2,4,5,6,8,9,10,11,12,13,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,44,45,46,47,48,49,50,51,53,54,55,56,72);


foreach($validFIPS as $fipscode)
{
    $vars = 'P0010001,P0030002,P0030003,P0030005,P0040001,P0120002,P0120026,P0180001';
    $var = $handles[$sources[$source]][$var];
    $jURL = 'http://api.census.gov/data/2010/'.$sources[$source].'?key=564db01afc848ec153fa77408ed72cad68191211&get='.$vars.'&for=county:*&in=state:'.$fipscode;

    //echo $jURL;
    $cdata = curl_download($jURL);
    //echo $cdata;
    $foo =  utf8_encode($cdata);
    $cdata = json_decode($foo, true); 



    for($cursor =1;$cursor <count($cdata);$cursor++)
    {
    $length = count($cdata[$cursor]);
    //echo $length;
    $geoid = '0500000US'.$cdata[$cursor][$length-2]. $cdata[$cursor][$length-1];
    //echo  $geoSort[$geoid]['properties']['NAME'].' '.$geoSort[$geoid]['properties']['LSAD'].' Population:'.number_format ($cdata[$cursor][0]).    "-$cursor".'<br>';
        for($var = 0;$var < $length-2;$var++)
        { 
            //echo $handles[$sources[$source]][$var];
         $geoSort[$geoid]['properties'][$handles[$sources[$source]][$var]] = $cdata[$cursor][$var];
        }
        //echo  $cdata[$cursor][0];
    }
}

$empty=Array();
$geo['features'] = $empty;
foreach($geoSort as $feature){
    //echo  $feature['properties']['STATE'].'-'.$feature['properties']['GEO_ID']."-$cursor".'<br>';
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