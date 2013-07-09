$(document).ready(function(){
  $.ajax({
    url: 'partials/zone_select.php',
    async:false,
    dataType: 'html',
    success: function(data){
      $('#content').html(data);
    }
  })
});

$("#census_tab").on("click", function() { 
	if(!$(this).hasClass('selected')){
		loadCensusPane();
		$("#tab_nav").find('.selected').removeClass('selected');
		$(this).addClass('selected');
		$("#sf1").val(sf1var[1]);
		$("#color").val(1);
		$("#sf1").val(sf1var[0]);
    if(gtfs_select != 'undefined')
    {
      load_census_select();
      $("#sf1").on("change",function() {
       
        quant = getLayerAttribute(activelayer,$(this).val());
        activelayer.styleMap = getStyle($(this).val(),$("#color").val(),quant);
        activelayer.redraw();
    });
    $("#color").on("change",function() {
        activelayer.styleMap = getStyle($('#sf1').val(),$(this).val(),quant);
        activelayer.redraw();
    });

    }
	} 
});

$("#transit_tab").on("click", function() {
  console.log('transit tab clicked') 
	if(!$(this).hasClass('selected')){
		loadTransitPane();
		$("#tab_nav").find('.selected').removeClass('selected');
		$(this).addClass('selected');
    census_select.destroy();
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

});
$("#graphing_tab").on("click", function() { 
  if(!$(this).hasClass('selected')){
		loadGraphingPane();
		$("#tab_nav").find('.selected').removeClass('selected');
		$(this).addClass('selected')
    if(typeof gtfs_select != 'undefined')
    {
      load_census_select()
    }

	}
});

function loadCensusPane()
{	
  $.ajax({
    url: 'partials/census.php',
    async:false,
    dataType: 'html',
    success: function(data){
      $('#content').html(data);
    }
  });
  graphing = false;	
}

function loadTransitPane()
{
	$.ajax({
    url: 'partials/transit.php',
    async:false,
    dataType: 'html',
    success: function(data){
      $('#content').html(data);
    }
	});
  graphing = false;
}

function loadGraphingPane()
{
	$.ajax({
    url: 'partials/graphing.php',
    async:false,
    dataType: 'html',
    success: function(data){
      $('#content').html(data);
    }
  });
  graphing = true;		
}

function load_census_select()
{
  gtfs_select.destroy();
    census_select = new OpenLayers.Control.SelectFeature([stateCounties],{
      selectStyle: OpenLayers.Util.extend({fill: true, stroke: true},
                          OpenLayers.Feature.Vector.style["select"]),             
      clickout: false, toggle: false,
      multiple: false, hover: true,
      toggleKey: "ctrlKey", // ctrl key removes from selection
      multipleKey: "shiftKey" // shift key adds to selection
    });
    map.addControl(census_select);
    census_select.onBeforeSelect = function(feature) {
        this.selectStyle.strokeColor ="#fff";
        this.selectStyle.fillColor ="#00f";
        this.selectStyle.strokeWidth = 4;
        this.selectStyle.fillOpacity = ".37";
      };
    census_select.activate();
}

function load_zone_select()
{
  fip =34;
  var zone_color = ['#E41A1C','#377EB8','#4DAF4A','#984EA3','#FF7F00']
    
  select0 = getCountyTractsTopo(fip,'none','0');
  select0.styleMap = getMultiStyle(zone_color[0]);
  select1 = getCountyTractsTopo(fip,'none','1');
  select1.styleMap = getMultiStyle(zone_color[1]);
  select2 = getCountyTractsTopo(fip,'none','2');
  select2.styleMap = getMultiStyle(zone_color[2]);
  select3 = getCountyTractsTopo(fip,'none','3');  
  select3.styleMap = getMultiStyle(zone_color[3]);
  select4 = getCountyTractsTopo(fip,'none','4');  
  select4.styleMap = getMultiStyle(zone_color[4]);
  map.addLayers([select0,select1,select2,select3,select4]);

  select0.events.register("loadend", select0, function(e){
    createSelection(e,0);
   });
  select1.events.register("loadend", select1, function(e){
    createSelection(e,1);
  });
  select2.events.register("loadend", select2, function(e){
    createSelection(e,2);
  });
  select3.events.register("loadend", select3, function(e){
    createSelection(e,3);
  });
  select4.events.register("loadend", select4, function(e){
    createSelection(e,4);
  });


  function createSelection (e,zone){
        $.ajax({
          type: "POST",
          url: "../data/get/getZone.php",
          data: {  geo_type: "ct", current_zone:zone }
          })
          .done(function( msg ) {
            data= JSON.parse(msg);
            for (var i = 0; i < data.length; i++){
                var feat = e.object.getFeaturesByAttribute("GEO_ID",data[i])[0];
                feat.renderIntent = 'select';
                e.object.selectedFeatures.push(feat);
            }
            e.object.redraw();
        });  
  }

}
