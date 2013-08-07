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

//echo $row['ct'];

$sql = "select geoid,AsText(shape) as shape from us_atlas.34_tracts where geoid in ".$row['ct'];
$rs =mysql_query($sql) or die($sql." ");

$output = array();
$output ['type'] = 'FeatureCollection';

while($row = mysql_fetch_array($rs)){

	
    $properties = array();
    $feature = array();
    $geometry = array();
    $properties['geoid'] = $row['geoid'];
    //$properties['route'] = $meta['routeID'];
    //$properties['num_trips'] = $meta['numTrips'];
    $feature['type'] = 'Feature';
    $feature['properties'] = $properties;
    $feature['geometry'] = json_decode(wkt_to_json($row['shape']));
    
	//echo $row['geoid']." ---".wkt_to_json($row['shape'])."<br>";
    $output['features'][]=$feature;

}
echo json_encode($output);


?>
