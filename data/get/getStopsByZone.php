<?php
//Pass Map ID by Map ID
ini_set("memory_limit","1500M");
ini_set('max_execution_time', 1200);
include '../../config/db.php'; 
$test = new db();
$inscon = $test->connect();


$zone_id = $_POST['zone_id'];
$model_run = $_POST['model_run'];
$sql = "select routes from zones where id = $zone_id";
$rs=mysql_query($sql) or die($select."<br><br>".mysql_error());
$results = array();
$row = mysql_fetch_assoc( $rs );
$routes= json_decode($row['routes']);


$output ['type'] = 'FeatureCollection';
$stops = array();


foreach($routes as $route)
{
    
    //get the longest shape for each route
    $sql ="SELECT
    trips.shape_id as shapeID,
    trips.route_id as routeID,
    trips.trip_id as tripID,
    count(distinct trips.trip_id) as numTrips,
    count(distinct trips.service_id) numService,
    count(shapes.shape_pt_sequence) as length,
    routes.route_id,
    routes.route_short_name as route_name
    FROM gtfs_20130712.trips,gtfs_20130712.routes,gtfs_20130712.shapes where shapes.shape_id = trips.shape_id
    AND trips.route_id = routes.route_id
    AND routes.route_short_name = $route
    group by trips.shape_id 
    order by length desc,shapes.shape_id
    limit 0,1";

    $rs=mysql_query($sql)  or die($sql."<br><br>".mysql_error());
    $row = mysql_fetch_assoc( $rs );
    $trip_id = $row['tripID'];
    //echo $trip_id.',';
   
    //get all the stops
    //associated with longest trip
    if(!empty($trip_id)){
        $sql = "SELECT
        a.stop_id as stop_id,
        b.stop_code as stop_code,
        b.stop_name as stop_name,
        b.zone_id as zone_id,
        b.stop_lat as stop_lat,
        b.stop_lon as stop_lon,
        c.boarding,
        c.alighting,
        c.routes
        from
            gtfs_20130712.stop_times as a,
            gtfs_20130712.stops as b
        left outer join
            model_stops as c on b.stop_code = c.stop_code
        where
        a.stop_id = b.stop_id and a.trip_id = $trip_id and c.run_id = $model_run";


        $rs=mysql_query($sql) or die($sql."<br><br>".mysql_error());
        $results = array();
        

        while ($row = mysql_fetch_assoc( $rs ))
        {
            if (in_array($row['stop_id'], $stops)) {
                //if this stop has already been added
                //do nothing
            }
            else{
                                 

                //print_r($gow);
                $stops[] = $row['stop_id'];
                $properties = array();
                $feature = array();
                $geometry = array();
                $properties['on_count'] = intval($row['boarding']);
                $properties['off_count'] = intval($row['alighting']); 
                $properties['stop_id'] = intval($row['stop_id']);
                $properties['stop_code'] = $row['stop_code'];
                $properties['stop_name'] = $row['stop_name'];
                $properties['zone_id'] = $row['zone_id'];
                $properties['routes'] = $row['routes'];

                $properties['include'] = 0;

                $feature['type'] = 'Feature';
                $feature['properties'] = $properties;
                $geometry['type'] = 'Point'; 
                $coordinates = array(floatval($row['stop_lon']),floatval($row['stop_lat']));

                $geometry['coordinates'] = $coordinates;
                $feature['geometry'] = $geometry;
                $output['features'][]=$feature;
                unset($coordinates);
            }
        }
    }
}
//$output['stops'][] = $stops;
echo json_encode($output); 

?>