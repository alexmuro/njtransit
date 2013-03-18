<?php
//Pass Map ID by Map ID
ini_set("memory_limit","1500M");
ini_set('max_execution_time', 1200);
$routeID = $_GET["route"];
include '../../config/db.php'; 
$test = new db();
$inscon = $test->connect();

$routes = [89,110,117,149,150,151,152,153,155,156,157,158,159,160,160,162,163,163];

//$routes =  ["1565","1566","1567","1568","1569","1570","1979","1980","1981","1982","1984","1986","1988","1990","1991","1992","1993","1995","1997","1999","2000","2004","2005","2006","2012","2013","2018","2019","2103","2104","2105","2106","2636","2637","2638","2639","2640","2641","2642","2644","2645","2646","2648","2649","2650","2651","2652","2653","2654","2655","2656","2657","2658","2659","2660","2661","2662","2663","2664","2665","2666","2667","2668","2669","2670","2671","2672","2673","2674","2675","2676","2677","2678","2679","2680","2681","2682","2683","2684","2685","2686","2687","2688","2689","2690","2691","2692","2693","2694","2695","2696","2697","2698","2699","2700","2715","2716","2717","2718","2719","2720","2721","2722","2723","2724","2725","2726","2727","2728","2729","2730","2731","2732","2733","2734","2735","2736","2737","2738","2739","2740","2741","2742","2743","2744","2745","2746","2747","2748","2749","2750","2751","2752","2753","2754","2755","2756","2757","2758","2759","2760","2761","2762","2763","2764","2765","2766","2767","2768","2769","2770","2771","2772","2773","2774","2775","2776","2777","2778","2779","2780","2781","2782","2783","2784","2785","2786","2787","2788","2789","2790","2791","2792","2793","2794","2795","2796","2797","2798","2799","2800","2801","2802","2803","2804","2805","2806","2807","2808","2809","2810","2811","2812","2813","2814","2815","2816","2817","2818","2819","2820","2821","2822","2823","2824","2825","2826","2828","2829","2830","2837","2838","2839","2840","2841","2842","2843","2844","2845","2846","2847","2848","2849","2850","2851","2852","2853","2854","2855","2856","2857","2858","2859","2860","2861","2862","2863","2864"];



$output ['type'] = 'FeatureCollection';
 

//Sql call & json encod
foreach($routes as $route)
{


$sql = "select
trips.route_id as routeID,
count(distinct trips.trip_id) as numTrips,
count(distinct trips.service_id) numService,
shapes.shape_id,
shapes.shape_pt_lat,
shapes.shape_pt_lon,
shapes.shape_pt_sequence
FROM shapes,trips where shapes.shape_id = trips.shape_id
AND trips.route_id = $route
group by shapes.shape_id ,shapes.shape_pt_sequence
order by shapes.shape_id , shapes.shape_pt_sequence";


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