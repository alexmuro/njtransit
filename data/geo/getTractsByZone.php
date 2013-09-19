<?php 
include_once('../../config/db.php'); 
include_once('../../geoPHP/geoPHP.inc');
$test = new db();
$inscon = $test->connect();

$zone = $_POST['zone_id'];

function wkt_to_json($wkt) {
  $geom = geoPHP::load($wkt,'wkt');
  return $geom->out('json');
}


$sql = "select replace(replace(replace(ct,'[','('),'1400000US',''),']',')') as ct from njtransit.zones where id =$zone";
$rs =mysql_query($sql) or die($sql." ");

$row = mysql_fetch_array($rs);


$sql = "SELECT 
    a.geoid, 
    AsText(shape) as shape, 
    aland,
    b.OutboundWorkers, 
    c.InboundWorkers,
    c1.P0010001,c1.P0030002,c1.P0030003,c1.P0030005
from
    us_atlas.34_tracts as a
left outer join
    us_atlas.sf1 as c1 on a.geoid = c1.geoid 
left outer join
    (select h_geocode, sum(s000) as OutboundWorkers from LEHD_2011.nj_od_j00_ct group by h_geocode) as b
 on b.h_geocode = a.geoid
left outer join
     (select w_geocode, sum(s000) as InboundWorkers from LEHD_2011.nj_od_j00_ct group by w_geocode) as c
on c.w_geocode = a.geoid
where
    a.geoid in".$row['ct'];

$rs = mysql_query($sql) or die($sql." ".mysql_error());

$output = array();
$output ['type'] = 'FeatureCollection';
$sources = Array('sf1','acs5');
$handles = Array( 'sf1' =>Array('P0010001','P0030002','P0030003','P0030005'), 
                'acs5' => Array('B23025_001E','B23025_002E'));


while($row = mysql_fetch_array($rs)){

    $properties = array();
    $feature = array();
    $geometry = array();

    if($row['P0010001'] == null){
        $state = substr($row['geoid'],0,2);
        $county = substr($row['geoid'],2,3);
        $tract = substr($row['geoid'],5,6);
        $source= 0;
        $vars = 'P0010001,P0030002,P0030003,P0030005';
        $jURL = 'http://api.census.gov/data/2010/'.$sources[$source].'?key=564db01afc848ec153fa77408ed72cad68191211&get='.$vars.'&for=tract:'.$tract.'&in=county:'.$county.'+state:'.$state;
        $cdata = curl_download($jURL);
        $foo =  utf8_encode($cdata); 
        $cdata = json_decode($foo, true);

        for($i =0; $i < 4; $i++ ){
            $properties[$handles[$sources[$source]][$i]] = intval($cdata[1][$i]);
        }
        $properties['api'] = "true";

        $sql = "INSERT into us_atlas.sf1 (geoid,P0010001,P0030002,P0030003,P0030005) values ('".$row['geoid']."',".$cdata[1][0].",".$cdata[1][1].",".$cdata[1][2].",".$cdata[1][3].")";
        mysql_query($sql) or die($sql." ".mysql_error());;
    }
    else{
        $properties['P0010001'] = intval($row['P0010001']);
        $properties['P0030002'] = intval($row['P0030002']);
        $properties['P0030003'] = intval($row['P0030003']);
        $properties['P0030005'] = intval($row['P0030005']);

    }


    $state = substr($row['geoid'],0,2);
    $county = substr($row['geoid'],2,3);
    $tract = substr($row['geoid'],5,6);
    $source= 1;
    $vars = 'B23025_001E,B23025_002E';
    $jURL = 'http://api.census.gov/data/2010/'.$sources[$source].'?key=564db01afc848ec153fa77408ed72cad68191211&get='.$vars.'&for=tract:'.$tract.'&in=county:'.$county.'+state:'.$state;
    $cdata = curl_download($jURL);
    $foo =  utf8_encode($cdata); 
    $cdata = json_decode($foo, true);

    for($i =0; $i < 2; $i++ ){
        $properties[$handles[$sources[$source]][$i]] = intval($cdata[1][$i]);
    }

	
    
    $properties['geoid'] = $row['geoid'];
    $properties['land_area'] = $row['aland'];
    $properties['outbound_workers']= $row['OutboundWorkers'];
    $properties['inbound_workers']= $row['InboundWorkers'];
    
    $feature['type'] = 'Feature';
    $feature['properties'] = $properties;
    $feature['geometry'] = json_decode(wkt_to_json($row['shape']));
  	$output['features'][]=$feature;

}
echo json_encode($output);


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
