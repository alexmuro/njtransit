
<script>
$('.zone').on('click',function(){
    $('.selected_zone')
        .css('border','0px')
        .removeClass('selected_zone');
    $(this)
        .css('border','2px solid '+$(this).data('color'))
        .addClass('selected_zone');
    setSelector($(this).data('color'),$(this).data('id'));
    //loadGTFS($(this).data('id'),$(this).attr('id'))
});


function loadGTFS(id,zone)
{
  /*
    if(typeof  != 'undefined'){
      gtfs.destroy();
   }
*/
    urls = ["data/gtfs/newark.json","data/gtfs/patterson.json","data/gtfs/atlantic_city.json","data/gtfs/philly.json"];
    url = urls[id];

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
    gtfs.events.register("loadend", gtfs, function (e) {
          quant = getLayerAttribute(gtfs,'num_trips');
          gtfs.styleMap =  getBusRouteStyle("route",quant);
          map.raiseLayer(gtfs,map.layers.length)
          gtfs.redraw();
          map.zoomToExtent(gtfs.getDataExtent());
          listRoutes(zone);

    });
     gtfs_select = new OpenLayers.Control.SelectFeature([gtfs], {
                          selectStyle: OpenLayers.Util.extend({fill: true, stroke: true},
                          OpenLayers.Feature.Vector.style["select"]),
                          clickout: false, toggle: false,
                          multiple: false, hover: true
              });

    map.addControl(gtfs_select);
    gtfs_select.onBeforeSelect = function(feature) {
        this.selectStyle.strokeColor ="#0f0";
        this.selectStyle.strokeWidth = 8;
    };
    gtfs_select.activate();
  
}
  

function setSelector(color,id)
{
  console.log(map.controls);
  currentlayer = map.getLayersByName(id)[0];
  currentlayer.styleMap = getMultiStyle(color)
  selector = new OpenLayers.Control.SelectFeature([currentlayer],{
              clickout: false, toggle: false,
              multiple: true, hover:false,
              toggleKey: "ctrlKey", // ctrl key removes from selection
              multipleKey: "shiftKey" // shift key adds to selection
  });
  map.addControl(selector);
  selector.activate();
  activelayer=currentlayer;
  currentZone = id;
}
</script>

<style>
.zone:hover{
    background-color: #efefef;
}

.route_listing{
  /*float:left;
  padding:7px;*/
  border:1px solid;
}

.color_select{
  float:left;
  padding:7px;
  border:1px solid;
  margin-right: 3px
}
</style>

<h1 id="title">Zone Select</h1>

<button id="uplevel" onclick='upOneLevel()' class='x-btn'>Zoom To Full State</button>

<div id="zone1" class="zone" data-id='0' data-color='#00f' style="padding:15px;">
    <h3 id="title"><div class='color_select' style="background-color:#0ff"></div>
    Large Urban Area - Newark
    </h3>
    <div class = 'gtfs_listing'></div>
</div>
<div id="zone2" class="zone" data-id='1' data-color='#0f0' style="padding:15px;">
    <h3 id="title"> 
      <div class='color_select' style="background-color:#0f0"></div>
      Small Urban Area – Paterson
    </h3> 
    <div class = 'gtfs_listing'></div>     
</div>
<div id="zone3" class="zone" data-id='2' data-color='#f00'style="padding:15px;">

    <h3 id="title">
      <div class='color_select' style="background-color:#f00"></div>
      South Jersey Urban Center – Atlantic City
    </h3>
    <div class = 'gtfs_listing'></div>    
</div>
<div id="zone4" class="zone" data-id='3' data-color='#f0f' style="padding:15px;"s>
    <h3 id="title"> 
      <div class='color_select' style="background-color:#f0f"></div>
      Intercity NJ Market – Philadelphia
    </h3>
    <div class = 'gtfs_listing'></div>     
</div>



