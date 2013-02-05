function loadTrentonLayers()
{

    var cdata = 'P0010001';
    //map.fractionalZoom = true;
    var fip = 34;//Starting State
    
    /*   
    var vectorlayer = new OpenLayers.Layer.Vector("Taz", {
    strategies: [new OpenLayers.Strategy.Fixed()],                
    protocol: new OpenLayers.Protocol.HTTP({
    url: 'data/taz.json',
    format: new OpenLayers.Format.GeoJSON()
    })
    });
    map.addLayer(vectorlayer);
    vectorlayer.events.register("loadend", vectorlayer, function (e) {
       
         quant = getLayerAttribute(vectorlayer,'SUM_OccH20');
         vectorlayer.styleMap = getStyle('SUM_OccH20',3,quant);
         vectorlayer.redraw();
         activelayer = vectorlayer;
    }); 
    */   
       url = "data/states/34/trentonBG.json";

    
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
    format: new OpenLayers.Format.GeoJSON()
    })
    });
    
    map.addLayer(stateCounties);
    stateCounties.events.register("loadend", stateCounties, function (e) {
        $('#sf1').val(1);
         quant = getLayerAttribute(stateCounties,sf1var[$('#sf1').val()]);
         stateCounties.styleMap = getStyle(sf1var[$('#sf1').val()],$("#color").val(),quant);
         stateCounties.redraw();
         activelayer = stateCounties;
         map.zoomToExtent(stateCounties.getDataExtent());
         //map.maxExtent(stateCounties.getDataExtent());
    });

    countiesSelect = new OpenLayers.Layer.Vector('select', {
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
    format: new OpenLayers.Format.GeoJSON()
    })
    });
    selectlayer = countiesSelect;
    map.addLayer(selectlayer);
    countiesSelect.events.register("loadend", countiesSelect, function (e) {
          countiesSelect.styleMap = getMultiStyle();
    }); 
    countiesSelect.styleMap =  getMultiStyle();

    url = "data/gtfs/trenton.json";
    gtfs = new OpenLayers.Layer.Vector('GTFS', { 
        eventListeners:{
        'featureselected':function(evt){
            var feature = evt.feature;
            console.log(feature.attributes.id+" "+feature.attributes.route+" "+feature.attributes.num_trips )
            //document.getElementById("data").innerHTML = "<div >Tract:" + feature.attributes.NAME+" "+feature.attributes.LSAD +" <br>Geo ID: " + feature.attributes.GEO_ID+" <br>Pop: " + addCommas(feature.attributes.P0010001)+"</div>";
        },
        'featureunselected':function(evt){
            var feature = evt.feature; 
         }   
        },
    strategies: [new OpenLayers.Strategy.Fixed()],                
    protocol: new OpenLayers.Protocol.HTTP({
    url: url,
    format: new OpenLayers.Format.GeoJSON()
    })
    });
    map.addLayer(gtfs);
    gtfs.events.register("loadend", countiesSelect, function (e) {
          quant = getLayerAttribute(gtfs,'num_trips');
          console.log(quant);
          gtfs.styleMap =  getBusRouteStyle("route",quant);
         
    });

    gtfsSelect = new OpenLayers.Layer.Vector('GTFS Select', {
    eventListeners:{
        'featureselected':function(evt){
            var feature = evt.feature;
            console.log(feature.attributes.id+" "+feature.attributes.route+" "+feature.attributes.num_trips )
            //document.getElementById("data").innerHTML = "<div >Tract:" + feature.attributes.NAME+" "+feature.attributes.LSAD +" <br>Geo ID: " + feature.attributes.GEO_ID+" <br>Pop: " + addCommas(feature.attributes.P0010001)+"</div>";
        },
        'featureunselected':function(evt){
            var feature = evt.feature; 
         }   
        }, 
    strategies: [new OpenLayers.Strategy.Fixed()],                
    protocol: new OpenLayers.Protocol.HTTP({
    url: url,
    format: new OpenLayers.Format.GeoJSON()
    })
    });
    gtfsSelect.styleMap =  getGTFSStyle();
    map.addLayer(gtfsSelect);

    selectlayerer = new OpenLayers.Control.SelectFeature([selectlayer,gtfsSelect],{
                    
                    clickout: false, toggle: false,
                    multiple: false, hover: true,
                    toggleKey: "ctrlKey", // ctrl key removes from selection
                    multipleKey: "shiftKey" // shift key adds to selection
    });
    map.addControl(selectlayerer);
    selectlayerer.activate();

    //setZoomEnd();
}