function getCountyTractsTopo(fip,county,name)
{
    var url = "../data/load/getCountyTracts.php?fip="+fip+"&county="+county;
    
    if(fip == 34){

       url = "../data/states/34/topo_census_tracts_sf1.json";
    
    }
    
    var vectorlayer = new OpenLayers.Layer.Vector(name, {
        eventListeners:{
            'featureselected':function(evt){
                var feature = evt.feature;
                var geoString = '[';
                for(var i = 0;i<activelayer.selectedFeatures.length;i++){
                    geoString += '"' +activelayer.selectedFeatures[i].attributes.GEO_ID+'",';
                }
                geoString = geoString.slice(0,-1);
                geoString += ']';
                $.ajax({
                    type: "POST",
                    url: "/data/update/updateZone.php",
                    data: { geo_string: geoString, geo_type: "ct",current_zone:currentZone }
                })
                .done(function( msg ) {
                });
                $('#zone'+name+' .zone_content').html(zoneInfoPane(activelayer.selectedFeatures));  
            },
            'featureunselected':function(evt){
                var feature = evt.feature;
                var geoString = '[';
                for(var i = 0;i<activelayer.selectedFeatures.length;i++){
                    geoString += '"' +activelayer.selectedFeatures[i].attributes.GEO_ID+'",';
                }
                geoString = geoString.slice(0,-1);
                geoString += ']';
                $.ajax({
                    type: "POST",
                    url: "/data/update/updateZone.php",
                    data: { geo_string: geoString, geo_type: "ct",current_zone:currentZone }
                    })
                    .done(function( msg ) {
                        //console.log( "Data Saved" );
                    });
                $('#zone'+name+' .zone_content').html(zoneInfoPane(activelayer.selectedFeatures));
            }   
        }, 
        strategies: [new OpenLayers.Strategy.Fixed()],                
        protocol: new OpenLayers.Protocol.HTTP({
            url: url,
            format: new OpenLayers.Format.TopoJSON(),
            renderers: ["Canvas", "SVG", "VML"]
        })
	});
    
    return vectorlayer;
}