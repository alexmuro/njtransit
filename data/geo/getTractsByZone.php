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
		    geoid, 
		    AsText(shape) as shape, 
		    b.total_workers as outgoing_workers, 
		    b.bus_avail, 
		    b.bus_total as outgoing_transit,
		    c.total_workers, 
		    c.bus_avail, 
		    c.bus_total
		from
		    us_atlas.34_tracts as a
		left outer join
		    (select 
		            state3,county,tract,
		            sum(`table301-1`) as total_workers, 
		            sum(`table302-1-5`) as bus_avail, 
		            sum(`table306-8`) as bus_total
		        from
		            njtransit.workplace_flow_data_2010_1
		        group by 
		            state3,county,tract
		    )
		    as b on a.statefp = SUBSTRING(b.state3,2,2) and a.countyfp=b.county and a.tractce=b.tract
		left outer join
		    (select 
		            qpowst, qpowco, qpowtract,
		            sum(`table301-1`) as total_workers, 
		            sum(`table302-1-5`) as bus_avail, 
		            sum(`table306-8`) as bus_total
		        from
		            njtransit.workplace_flow_data_2010_1
		        group by 
		            qpowst, qpowco, qpowtract
		    )
		    as c on a.statefp = SUBSTRING(c.qpowst,2,2) and a.countyfp=c.qpowco and a.tractce=c.qpowtract
		where
		    geoid in ".$row['ct'];

$rs = mysql_query($sql) or die($sql." ".mysql_error());

$output = array();
$output ['type'] = 'FeatureCollection';

while($row = mysql_fetch_array($rs)){
	
    $properties = array();
    $feature = array();
    $geometry = array();
    $properties['geoid'] = $row['geoid'];
    $feature['type'] = 'Feature';
    $feature['properties'] = $properties;
    $feature['geometry'] = json_decode(wkt_to_json($row['shape']));
  	$output['features'][]=$feature;

}
echo json_encode($output);


?>
