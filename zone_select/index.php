<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Avail TDM - Zone Selector</title>
        

        <link rel="stylesheet" type="text/css" href="/resources/css/ext-all.css"/>
        <link rel="stylesheet" type="text/css" href="/resources/css/blue/style.css"/>
        <link rel="stylesheet" type="text/css" href="/resources/css/style.css" >
        
        <script src="/openlayers/lib/OpenLayers.js"></script>
        <script src="http://maps.google.com/maps/api/js?v=3&amp;sensor=false"></script>
        <script src="/resources/js/jquery-1.9.1.min.js"></script>
        <script type="text/javascript" src="/resources/js/ext-base.js"></script>
        <script type="text/javascript" src="/resources/js/ext-all.js"></script>
        <script type="text/javascript" src="/resources/js/GeoExt.js"></script>
        <script src="/resources/js/protodata32.min.js"></script>
        <script src="/resources/js/jquery.tablesorter.min.js"></script>
  
        <script src="/map_functions/countyDataLayer.js"></script>
        <script src="/map_functions/getFilter.js"></script> 
        <script src="/map_functions/getStateCounties.js"></script>
        <script src="/map_functions/getCountyTracts.js"></script> 
        <script src="/map_functions/getCountyTractsTopo.js"></script> 
        <script src="/map_functions/getTrackBlockGroups.js"></script>  
        <script src="/map_functions/helper_functions.js"></script>
        <script src="/map_functions/getStyle.js"></script>  
        <script src="/map_functions/getLayerAttribute.js"></script>
        <script src="/map_functions/global.js"></script>
        <script src="/map_functions/getJson.js"></script>
        <script src="/map_functions/addBusRoute.js"></script>
        <script src="/map_functions/onZoomEnd.js"></script>
        <script src="/map_functions/gtfsController.js"></script>
        <script src="/map_functions/loadMap.js"></script>
        
        <script src="partials/infopane.js"></script>


        <script type="text/javascript" src="app.js"></script>

    </head>
    <body>
        <div id="desc">
            <div style="height:100%;overflow:auto;">
            <?php
                include "/config/db.php"; 
                include "partials/infopane.php";
            ?>
            </div>
        </div>
    </body>
</html>
