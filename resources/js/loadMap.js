function loadCensusLayers()
{
    var cdata = 'P0010001';
    //map.fractionalZoom = true;
    var fip = 34;//Starting State


    stateCounties = getStateCounties(fip);
    stateCounties.styleMap= getDefaultStyle('thick');
    map.addLayer(stateCounties);
    stateTracts = getCountyTractsTopo(fip,'none','NJ Census Tracts');
    stateTracts.styleMap= getDefaultStyle();
    map.addLayer(stateTracts);
    stateTracts.events.register("loadend", stateTracts, function (e) {
        
        activelayer = stateTracts;
        
        var bbox = new OpenLayers.Bounds(-8411257.7538454, 4711437.6979671, -8225840.1138238,5065205.2814741);
        map.zoomToExtent(bbox);


    });

 load_zone_select();
 //setZoomEnd();

}