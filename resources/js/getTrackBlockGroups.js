function getTractBlockGroups(fip,county,tract,name)
{
    var url = "data/load/getBlockGroups.php?fip="+fip+"&county="+county+"&tract="+tract;
    console.log(url);
    
    var vectorlayer = new OpenLayers.Layer.Vector(name, {
    eventListeners:{
        'featureselected':function(evt){
            var feature = evt.feature;
            document.getElementById("data").innerHTML = "<div >County:" + feature.attributes.NAME+" "+feature.attributes.LSAD +" <br>Geo ID: " + feature.attributes.GEO_ID+" <br>Pop: " + addCommas(feature.attributes.P0010001)+"</div>";
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
	
    return vectorlayer;
    
}