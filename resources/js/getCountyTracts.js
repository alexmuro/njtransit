function getCountyTracts(fip,county,name)
{
    var url = "data/load/getCountyTracts.php?fip="+fip+"&county="+county;
    if(fip == 34)
    {
       url = "data/states/34/census_tracts_sf1.json";
    }
    
    var vectorlayer = new OpenLayers.Layer.Vector(name, {
    eventListeners:{
        'featureselected':function(evt){
            var feature = evt.feature;
            var geoString = '[';
            document.getElementById("data").innerHTML = "<div >Tract:" + feature.attributes.NAME+" "+feature.attributes.LSAD +" <br>Geo ID: " + feature.attributes.GEO_ID+" <br>Pop: " + addCommas(feature.attributes.P0010001)+"</div>";
            for(var i = 0;i<selectlayer.selectedFeatures.length;i++)
            {
                geoString += '"' +selectlayer.selectedFeatures[i].attributes.GEO_ID+'",'
            }
            geoString += ']';
            console.log(geoString);
            document.getElementById("selectedFeatures").value =geoString;
        },
        'featureunselected':function(evt){
            var feature = evt.feature;
            var geoString = '[';
            for(var i = 0;i<selectlayer.selectedFeatures.length;i++)
            {
                geoString += '"' +selectlayer.selectedFeatures[i].attributes.GEO_ID+'",'
            }
            geoString += ']';
            document.getElementById("selectedFeatures").value =geoString;
            
         }   
        }, 
    strategies: [new OpenLayers.Strategy.Fixed()],                
    protocol: new OpenLayers.Protocol.HTTP({
    url: url,
    format: new OpenLayers.Format.GeoJSON(),
    renderers: ["Canvas", "SVG", "VML"]
    })
	});
    
    return vectorlayer;
}