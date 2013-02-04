function addBusRoute()
{
    var name = "NJTransit Bus GTFS";
    var url = "data/gtfs/bus.json";
    
    //console.log(name+" "+url);
    var vectorlayer = new OpenLayers.Layer.Vector(name, {
    eventListeners:{
        'featureselected':function(evt){
            var feature = evt.feature;
            //document.getElementById("data").innerHTML = "<div >County:" + feature.attributes.NAME+" "+feature.attributes.LSAD +" <br>Geo ID: " + feature.attributes.GEO_ID+" <br>Pop: " + addCommas(feature.attributes.P0010001)+"</div>";
        },
        'featureunselected':function(evt){
            var feature = evt.feature;
         }   
        }, 
    strategies: [new OpenLayers.Strategy.Fixed()],                
    protocol: new OpenLayers.Protocol.HTTP({
    url: url,
    format: new OpenLayers.Format.GeoJSON(),
    styleMap:getBusRouteStyle()
    })
	});
	
    map.addLayer(vectorlayer);
     selectroute = new OpenLayers.Control.SelectFeature([vectorlayer],{
        hover:true,
        tiple: true,
        autoActivate:true
    });
    map.addControl(selectroute);
}