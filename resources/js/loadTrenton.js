function loadTrentonLayers()
{
    var cdata = 'P0010001';
    url = "data/states/34/trentonCT.json";
    //url = "data/taz.json";
    
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
              console.log(feature.attributes.GEO_ID)
              state = feature.attributes.GEO_ID[9]+feature.attributes.GEO_ID[10];
              county = feature.attributes.GEO_ID[11]+feature.attributes.GEO_ID[12]+feature.attributes.GEO_ID[13];
              tract = feature.attributes.GEO_ID[14]+feature.attributes.GEO_ID[15]+feature.attributes.GEO_ID[16]+feature.attributes.GEO_ID[17]+feature.attributes.GEO_ID[18]+feature.attributes.GEO_ID[19];
              get_data(state,county,tract,vars,source);
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
         data = stateCounties.features[0].data
         $.each(data, function(index, value) {
              //console.log(index)
              if((index[0] == 'P' || index[0] == 'B') && value != 'null'){  
                $('#sf1')
                 .append($('<option>', {index : index })
                 .text(index)); 
               }
          });
         $('#sf1').val(cdata);
         quant = getLayerAttribute(stateCounties,$('#sf1').val());
         stateCounties.styleMap = getStyle($('#sf1').val(),$("#color").val(),quant);
         stateCounties.redraw();
    });

    url = "data/gtfs/trenton.json";
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
    //map.addLayer(gtfs);
    gtfs.events.register("loadend", countiesSelect, function (e) {
          quant = getLayerAttribute(gtfs,'num_trips');
          gtfs.styleMap =  getBusRouteStyle("route",quant);
          gtfs.redraw();
                  
    });
 
    //setZoomEnd();
    map.setOptions({restrictedExtent: new OpenLayers.Bounds(-8395289.8769294,4831878.0185459,-8256480.2335828,4936749.6213385)});
}