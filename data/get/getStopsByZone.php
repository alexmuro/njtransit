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
    FROM trips,routes,shapes where shapes.shape_id = trips.shape_id
    AND trips.route_id = $route
    AND routes.route_id = $route
    group by trips.shape_id 
    order by length desc,shapes.shape_id
    limit 0,1";

    $rs=mysql_query($sql)  or die($sql."<br><br>".mysql_error());
    $row = mysql_fetch_assoc( $rs );
    $trip_id = $row['tripID'];
    //echo $trip_id.',';
   
    //get all the stops
    //associated with longest trip
    $sql = "SELECT
    a.stop_id as stop_id,
    b.stop_code as stop_code,
    b.stop_name as stop_name,
    b.zone_id as zone_id,
    b.stop_lat as stop_lat,
    b.stop_lon as stop_lon
    from
        stop_times as a,
        stops as b
    where
    a.stop_id = b.stop_id and a.trip_id = $trip_id";


    $rs=mysql_query($sql) or die($sql."<br><br>".mysql_error());
    $results = array();
    

    while ($row = mysql_fetch_assoc( $rs ))
    {
        if (in_array($row['stop_id'], $stops)) {
            //if this stop has already been added
            //do nothing
        }
        else{
            
            $sql = "SELECT 
                    a.stop_id as stop_id,
                    count(a.stop_id) as stop_frequency
                    from
                        stop_times as a
                    where
                        a.stop_id = ".$row['stop_id']."
                    group by a.stop_id";
            $fs=mysql_query($sql)  or die($sql."<br><br>".mysql_error());
            $fow = mysql_fetch_assoc( $fs );

            $sql = "SELECT 
                        SUM(case
                            when on_stop_id = ".$row['stop_id']." then 1
                            else 0
                        end) as on_count,
                        SUM(case
                            when off_stop_id = ".$row['stop_id']." then 1
                            else 0
                        end) as off_count
                    from
                        model_legs
                    where
                        (on_stop_id = ".$row['stop_id']." or off_stop_id = ".$row['stop_id'].") and run_id = $model_run";
            $gs=mysql_query($sql)  or die($sql."<br><br>".mysql_error());
            $gow = mysql_fetch_assoc( $gs );                    
                    

            //print_r($gow);
            $stops[] = $row['stop_id'];
            $properties = array();
            $feature = array();
            $geometry = array();
            $properties['stop_frequency'] = intval($fow['stop_frequency']);
            $properties['on_count'] = intval($gow['on_count']);
            $properties['off_count'] = intval($gow['off_count']); 
            $properties['stop_id'] = intval($row['stop_id']);
            $properties['stop_code'] = $row['stop_code'];
            $properties['stop_name'] = $row['stop_name'];
            $properties['zone_id'] = $row['zone_id'];
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
$output['stops'][] = $stops;
echo json_encode($output); 

?>