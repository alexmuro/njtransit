$(document).ready(function(){
  $.ajax({
    url: 'partials/census.php',
    async:false,
    dataType: 'html',
    success: function(data){
      $('#content').html(data);
      census_select = new OpenLayers.Control.SelectFeature([stateCounties],{   
      selectStyle: OpenLayers.Util.extend({fill: true, stroke: true},
                          OpenLayers.Feature.Vector.style["select"]),           
      clickout: false, toggle: false,
      multiple: false, hover: true,
      });
      map.addControl(census_select);
      census_select.onBeforeSelect = function(feature) {
        this.selectStyle.strokeColor ="#fff";
        this.selectStyle.fillColor ="#00f";
        this.selectStyle.strokeWidth = 4;
        this.selectStyle.fillOpacity = ".37";
      };
      census_select.activate();
    },
  })

$("#sf1").on("change",function() {
       
        quant = getLayerAttribute(activelayer,$(this).val());
        activelayer.styleMap = getStyle($(this).val(),$("#color").val(),quant);
        activelayer.redraw();
    });

$("#color").on("change",function() {
        activelayer.styleMap = getStyle($('#sf1').val(),$(this).val(),quant);
        activelayer.redraw();
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
      load_census_select()
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

});

function loadCensusPane()
{ 
  $.ajax({
    url: 'partials/census.php',
    async:false,
    dataType: 'html',
    success: function(data){
      $('#content').html(data);
      data = activelayer.features[0].data
         $.each(data, function(index, value) {
              //console.log(index)
              if((index[0] == 'P' || index[0] == 'B') && value != 'null'){  
                $('#sf1')
                 .append($('<option>', {index : index })
                 .text(index)); 
               }
          });
         $("#sf1").on("change",function() {
       
        quant = getLayerAttribute(activelayer,$(this).val());
        activelayer.styleMap = getStyle($(this).val(),$("#color").val(),quant);
        activelayer.redraw();
    });

$("#color").on("change",function() {
        activelayer.styleMap = getStyle($('#sf1').val(),$(this).val(),quant);
        activelayer.redraw();
    });
         
    },
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
    },
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
    },
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