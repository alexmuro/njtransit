 function setZoomEnd()
{
 map.events.register("moveend", map, function() {
        var projWGS84 = new OpenLayers.Projection("EPSG:4326");
        var proj900913 = map.getProjection();
        var someGeom = map.getExtent().transform(proj900913  , projWGS84 );
            //console.log(map.getProjection());
            //console.log(someGeom);
            var jURL =  'data/load/getGTFSLayerID.php?nelat='+someGeom.top+'&nelon='+someGeom.right+'&swlat='+someGeom.bottom+'&swlon='+someGeom.left;  
          //console.log('loading bus route:... \n' + jURL);
          $.ajax({
                url:  jURL,
                dataType: "json",
                global: false, 
                cache: true,
                success: function(data) {
                    console.log(data.length)
                    console.log(data);
                    /*for (x in data)
                    {
                        console.log(data[x]["shape_id"]); 
                    }*/
                
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    //console.error("XMLHttpRequest="+XMLHttpRequest.responseText+"\ntextStatus="+textStatus+"\nerrorThrown="+errorThrown);
                }
            });
        });
}