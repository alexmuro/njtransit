<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <title>AVAIL Census Data Visualizer</title>        
        <link rel="stylesheet" href="openlayers/theme/default/style.css" type="text/css">
        <link rel="stylesheet" href="style.css" type="text/css">
        <link rel="stylesheet" href="css/layout.css" type="text/css">

        <!--<script src="http://maps.google.com/maps/api/js?v=3&amp;sensor=false"></script>-->
        <script type="text/javascript" src="js/jquery-1.4.4.min.js"></script>
        <script src="openlayers/lib/OpenLayers.js"></script>
        <script src="js/countyDataLayer.js"></script>
        
        <script src="js/getFilter.js"></script> 
        <script src="js/getStateCounties.js"></script> 
        <script src="js/helper_functions.js"></script>
        <script src="js/protodata32.min.js"></script>
        <script src="js/getLayerAttribute.js"></script>
        <script src="js/getLegend.js"></script>
        <script src="js/getStyle.js"></script>
        
        <!--initialization script -->
        <script src="js/loadMap.js"></script>
       
       
        <script>
        //----------------
        //GLOBAL VARIABLES
        //----------------
        var quant = {};
        var activelayer,selectlayer;
        var sources = ['sf1','acs5'];
        var sf1var = ['P0010001','P0030002','P0030003','P0030005','P0040001','P0120002','P0120026','P0180001']
        var acsvar = ['B00001_001E','B00002_001E','B23001_001E','B25044_003E','B25044_004E','B25119_001E','B08006_008E','B08006_009E','B08006_011E'];
        //---------------------------------------------------
        // Screen Behavior Jquery - to be Refactored
        //---------------------------------------------------
        jQuery(document).ready(function(){
        $("#acs").change(function() {
                //console.log(); // the selected options’s value
                var page = 'data/load/?s=1&v='+$(this).val();
                /*
                map.removeLayer(counties);
                selector.destroy();
                counties.destroy();
                */
                activelayer.log(counties['features'])
                activelayer.styleMap = getStyle(sf1var[$(this).val()]);
                activelayer.redraw();
                $("#sf1").css("border-color","black");
                $("#acs").css("border-color","red");
            });
        
        $("#sf1").change(function() {
                /*
                for (var i = 0; i < counties.features.length; i++)
                {
                  quant[counties.features[i]['data']['GEO_ID']] = parseInt(counties.features[i]['data'][]);
                }*/
                quant = getLayerAttribute(activelayer,sf1var[$(this).val()]);

                activelayer.styleMap = getStyle(sf1var[$(this).val()],$("#color").val(),quant);
                activelayer.redraw();
                map.raiseLayer(selectlayer,map.layers.length);

                $("#acs").css("border-color","black");
                $("#sf1").css("border-color","red");
            });
       
        $("#color").change(function() {
                activelayer.styleMap = getStyle(sf1var[$('#sf1').val()],$(this).val(),quant);
                activelayer.redraw();
            });
        });
        

        </script>
        
        
</head>
<body onload="init()">
    <div id="wrapper">
        <div id="left">
            <?php
                include "partials/infopane.php";
                include "partials/legend.php";
            ?>  
        </div><!-- end left -->    
        <div id="map"></div>
    </div>
</body>
</html>
