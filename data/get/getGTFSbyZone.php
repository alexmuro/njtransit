<?php
//Pass Map ID by Map ID
ini_set("memory_limit","1500M");
ini_set('max_execution_time', 1200);
include '../../config/db.php'; 
$test = new db();
$inscon = $test->connect();


$zone_id = $_POST['zone_id'];
$sql = "select routes from zones where id = $zone_id";
$rs=mysql_query($sql) or die($select."<br><br>".mysql_error());
$results = array();
$row = mysql_fetch_assoc( $rs );
$routes= json_decode($row['routes']);


$output ['type'] = 'FeatureCollection';
 

//Sql call & json encod
foreach($routes as $route)
{
    
    $sql ="select
    trips.shape_id as shapeID,
    trips.route_id as routeID,
    count(distinct trips.trip_id) as numTrips,
    count(distinct trips.service_id) numService,
    count(shapes.shape_pt_sequence) as length,
    routes.route_id,
    routes.route_short_name as route_name
    FROM shapes,trips,routes where shapes.shape_id = trips.shape_id
    AND trips.route_id = $route
    AND routes.route_id = $route
    group by trips.shape_id 
    order by length desc,shapes.shape_id
    limit 0,1";
    $rs=mysql_query($sql) or die($sql."<br><br>".mysql_error());
    $row = mysql_fetch_assoc( $rs );
    $shape_id = $row['shapeID'];


    $sql = "select
    trips.route_id as routeID,
    count(distinct trips.trip_id) as numTrips,
    count(distinct trips.service_id) numService,
    shapes.shape_id as shape_id,
    shapes.shape_pt_lat,
    shapes.shape_pt_lon,
    shapes.shape_pt_sequence,
    routes.route_id,
    routes.route_short_name as route_name,
    trips.shape_id
    FROM shapes,trips,routes where shapes.shape_id = trips.shape_id
    AND trips.shape_id = $shape_id
    and trips.route_id = routes.route_id
    group by shapes.shape_id ,shapes.shape_pt_sequence
    order by shapes.shape_id , shapes.shape_pt_sequence";

//echo $sql."<br><br>";

$rs=mysql_query($sql) or die($sql."<br><br>".mysql_error());

$results = array();
while ($row = mysql_fetch_assoc( $rs ))
{
    $curr_shape_id=$row['shape_id'];
    $properties = array();
    $feature = array();
    $geometry = array();
    $properties['id'] = $row['shape_id'];
    $properties['route'] = $row['routeID'];
    $properties['num_trips'] = $row['numTrips'];
    $properties['num_service'] = $row['numService'];
    $properties['route_name'] = $row['route_name'];
    $properties['shape_id'] = $row['shape_id'];
    $properties['include'] = 0;

    $feature['type'] = 'Feature';
    $feature['properties'] = $properties;
    $geometry['type'] = 'LineString'; 
    $coordinates[] = array();

    $x=0;
    $coordinates[] = array();
    //echo $curr_shape_id;
    while($row['shape_id'] == $curr_shape_id)
    {        
           //$geo = json_decode($geodata, true);
           if (!empty($row['shape_pt_lat']) && !empty($row['shape_pt_lon']))
           {
            $coordinates[$x][0] = floatval($row['shape_pt_lon']);
            $coordinates[$x][1] = floatval($row['shape_pt_lat']);
            }
           $x++;            
           $row = mysql_fetch_assoc( $rs );
    }

    $geometry['coordinates'] = $coordinates;
    $feature['geometry'] = $geometry;
    $output['features'][]=$feature;
    unset($coordinates);
}
}
echo json_encode($output); 

?>