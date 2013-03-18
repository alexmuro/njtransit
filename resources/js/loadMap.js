function loadCensusLayers()
{
    var cdata = 'P0010001';
    //map.fractionalZoom = true;
    var fip = 34;//Starting State

    stateCounties = getCountyTractsTopo(fip,'none','NJ Census Tracts');
    stateCounties.styleMap= getDefaultStyle();
    map.addLayer(stateCounties);
    stateCounties.events.register("loadend", stateCounties, function (e) {
        
        activelayer = stateCounties;
        
        var bbox = new OpenLayers.Bounds(-8411257.7538454, 4711437.6979671, -8225840.1138238,5065205.2814741);
        map.zoomToExtent(bbox);


    });

 load_zone_select();
   

}