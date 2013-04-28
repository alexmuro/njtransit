<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Avail Zone Selector</title>
        
        <script src="openlayers/lib/OpenLayers.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
        <script type="text/javascript" src="resources/js/ext-base.js"></script>
        <script type="text/javascript" src="resources/js/ext-all.js"></script>
        <link rel="stylesheet" type="text/css" href="resources/css/ext-all.css"/>
         <link rel="stylesheet" type="text/css" href="resources/css/blue/style.css"/>
        <script type="text/javascript" src="resources/js/GeoExt.js"></script>
        <link rel="stylesheet" href="style.css" type="text/css">

        <!--<script src="http://maps.google.com/maps/api/js?v=3&amp;sensor=false"></script>-->
        <script src="http://maps.google.com/maps/api/js?v=3&amp;sensor=false"></script>
        <script src="resources/js/countyDataLayer.js"></script>
        <script src="resources/js/getFilter.js"></script> 
        <script src="resources/js/getStateCounties.js"></script>
        <script src="resources/js/getCountyTracts.js"></script> 
        <script src="resources/js/getCountyTractsTopo.js"></script> 
        <script src="resources/js/getTrackBlockGroups.js"></script>  
        <script src="resources/js/helper_functions.js"></script>
        <script src="resources/js/protodata32.min.js"></script>
        <script src="resources/js/getLayerAttribute.js"></script>
        <script src="resources/js/getLegend.js"></script>
        <script src="resources/js/getStyle.js"></script>
        <script src="resources/js/upOneLevel.js"></script>
        <script src="resources/js/global.js"></script>
        <script src="resources/js/doubleclickControl.js"></script>
        <script src="resources/js/loadMap.js"></script>
        <script src="resources/js/getJson.js"></script>
        <script src="resources/js/addBusRoute.js"></script>
        <script src="resources/js/onZoomEnd.js"></script>
        <script src="resources/js/gtfsController.js"></script>
        <script src="resources/js/jquery.tablesorter.min.js"></script>
        <script src="partials/infopane.js"></script>


        <script type="text/javascript" src="app.js"></script>

    </head>
    <body>
        <div id="desc">
            <div style="height:100%;overflow:auto;">
            <?php
                include "config/db.php"; 
                include "partials/infopane.php";
            ?>
            </div>
        </div>
    </body>
</html>
