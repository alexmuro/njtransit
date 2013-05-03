function loadTrentonLayers()
{
    var zone = getUrlVars()['zone'];
    if(typeof zone == 'undefined')
    {
      zone = 2;
    }
    var cdata = 'P0010001';
    url = "/data/zones/"+zone+"/ct.json";
    
    var income_distrobution = 'B19001_001E,B19001_002E,B19001_003E,B19001_004E,B19001_005E,B19001_006E,B19001_007E,B19001_008E,B19001_009E,B19001_010E,B19001_011E,B19001_012E,B19001_013E,B19001_014E,B19001_015E,B19001_016E,B19001_017E';
    var transportation_to_work = 'B08006_001E,B08006_002E,B08006_003E,B08006_004E,B08006_005E,B08006_006E,B08006_007E,B08006_008E,B08006_009E,B08006_010E,B08006_011E,B08006_012E,B08006_013E,B08006_014E,B08006_015E,B08006_016E,B08006_017E,B08006_018E,B08006_019E,B08006_020E,B08006_021E,B08006_022E,B08006_023E,B08006_024E,B08006_025E,B08006_026E,B08006_027E,B08006_028E,B08006_029E,B08006_030E,B08006_031E,B08006_032E,B08006_033E,B08006_034E,B08006_035E,B08006_036E,B08006_037E,B08006_038E,B08006_039E,B08006_040E,B08006_041E,B08006_042E,B08006_043E,B08006_044E,B08006_045E,B08006_046E,B08006_047E,B08006_048E,B08006_049E,B08006_050E';

    stateCounties = new OpenLayers.Layer.Vector('Zones', {
    eventListeners:{
        'featureselected':function(evt){
            var feature = evt.feature;
            if(graphing==false)
            {
                document.getElementById("data").innerHTML = "<div >Tract:" + feature.attributes.NAME+" "+feature.attributes.LSAD +" <br>Geo ID: " + feature.attributes.GEO_ID+" <br>Pop: " + addCommas(feature.attributes.P0010001)+"</div>";
            }
            if(graphing == true)
            {
              //console.log(feature.attributes.GEO_ID)
              state = feature.attributes.GEO_ID[9]+feature.attributes.GEO_ID[10];
              county = feature.attributes.GEO_ID[11]+feature.attributes.GEO_ID[12]+feature.attributes.GEO_ID[13];
              tract = feature.attributes.GEO_ID[14]+feature.attributes.GEO_ID[15]+feature.attributes.GEO_ID[16]+feature.attributes.GEO_ID[17]+feature.attributes.GEO_ID[18]+feature.attributes.GEO_ID[19];
              get_data(state,county,tract,income_distrobution,source,"income_graph");
              //get_data(state,county,tract,transportation_to_work,source,"transport_graph");
            }
        },
        'featureunselected':function(evt){
            var feature = evt.feature; 
         }   
        }, 
    strategies: [new OpenLayers.Strategy.Fixed()],                
    protocol: new OpenLayers.Protocol.HTTP({
    url: url,
    format: new OpenLayers.Format.GeoJSON(),
    renderers: ["Canvas", "SVG", "VML"]
    })
    });
    
    map.addLayer(stateCounties);
    stateCounties.events.register("loadend", stateCounties, function (e) {
        
         activelayer = stateCounties;
         map.zoomToExtent(stateCounties.getDataExtent());
         data = stateCounties.features[0].data;
         
         loadCensusSelect(data);

         $('#sf1').val(cdata);
         quant = getLayerAttribute(stateCounties,$('#sf1').val());
         stateCounties.styleMap = getStyle($('#sf1').val(),$("#color").val(),quant);
         stateCounties.redraw();
    });

    url = "/data/zones/"+zone+"/gtfs.json";
    gtfs = new OpenLayers.Layer.Vector('GTFS', { 
        eventListeners:{
        'featureselected':function(evt){
            var feature = evt.feature;
            //console.log(feature.attributes.id+" "+feature.attributes.route+" "+feature.attributes.num_trips )
            //document.getElementById("data").innerHTML = "<div >Tract:" + feature.attributes.NAME+" "+feature.attributes.LSAD +" <br>Geo ID: " + feature.attributes.GEO_ID+" <br>Pop: " + addCommas(feature.attributes.P0010001)+"</div>";
        },
        'featureunselected':function(evt){
            var feature = evt.feature; 
         }   
        },
    strategies: [new OpenLayers.Strategy.Fixed()],                
    protocol: new OpenLayers.Protocol.HTTP({
    url: url,
    format: new OpenLayers.Format.GeoJSON(),
    renderers: ["Canvas", "SVG", "VML"]
    })
    });
    map.addLayer(gtfs);
    gtfs.events.register("loadend", gtfs, function (e) {
          quant = getLayerAttribute(gtfs,'num_trips');
          gtfs.styleMap =  getBusRouteStyle("route",quant);
          gtfs.redraw();
                  
    });
 
    //setZoomEnd();
    //map.setOptions({restrictedExtent: new OpenLayers.Bounds(-8395289.8769294,4831878.0185459,-8256480.2335828,4936749.6213385)});
}