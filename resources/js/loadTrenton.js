function loadTrentonLayers()
{
    var cdata = 'P0010001';
    url = "data/states/34/trentonBG.json";
    //url = "data/taz.json";
    
    stateCounties = new OpenLayers.Layer.Vector('Zones', {
    eventListeners:{
        'featureselected':function(evt){
            var feature = evt.feature;
            document.getElementById("data").innerHTML = "<div >Tract:" + feature.attributes.NAME+" "+feature.attributes.LSAD +" <br>Geo ID: " + feature.attributes.GEO_ID+" <br>Pop: " + addCommas(feature.attributes.P0010001)+"</div>";
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
    map.addLayer(gtfs);
    gtfs.events.register("loadend", countiesSelect, function (e) {
          quant = getLayerAttribute(gtfs,'num_trips');
          gtfs.styleMap =  getBusRouteStyle("route",quant);
          gtfs.redraw();
                  
    });
 
    //setZoomEnd();
    map.setOptions({restrictedExtent: new OpenLayers.Bounds(-8395289.8769294,4831878.0185459,-8256480.2335828,4936749.6213385)});
}