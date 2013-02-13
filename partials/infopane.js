$(document).ready(function(){
  $.ajax({
    url: 'partials/census.php',
    async:false,
    dataType: 'html',
    success: function(data){
      $('#content').html(data);
      census_select = new OpenLayers.Control.SelectFeature([selectlayer],{              
      clickout: false, toggle: false,
      multiple: false, hover: true,
      toggleKey: "ctrlKey", // ctrl key removes from selection
      multipleKey: "shiftKey" // shift key adds to selection
      });
      map.addControl(census_select);
      census_select.activate();
    },
  })
});

$("#census_tab").live("click", function() { 
	if(!$(this).hasClass('selected')){
		loadCensusPane();
		$("#tab_nav").find('.selected').removeClass('selected');
		$(this).addClass('selected');
		$("#sf1").val(5);
		$("#color").val(1);
		$("#sf1").val(0);
    gtfs_select.destroy();
    census_select = new OpenLayers.Control.SelectFeature([selectlayer],{              
      clickout: false, toggle: false,
      multiple: false, hover: true,
      toggleKey: "ctrlKey", // ctrl key removes from selection
      multipleKey: "shiftKey" // shift key adds to selection
    });
    map.addControl(census_select);
    census_select.activate();
	} 
});

$("#transit_tab").live("click", function() { 
	if(!$(this).hasClass('selected')){
		loadTransitPane();
		$("#tab_nav").find('.selected').removeClass('selected');
		$(this).addClass('selected');
    census_select.destroy();
    gtfs_select = new OpenLayers.Control.SelectFeature([gtfsSelect],{      
      clickout: false, toggle: false,
      multiple: false, hover: true,
      toggleKey: "ctrlKey", // ctrl key removes from selection
      multipleKey: "shiftKey" // shift key adds to selection
    });
    map.addControl(gtfs_select);
    gtfs_select.activate();
	} 

});
$("#graphing_tab").live("click", function() { 
	if(!$(this).hasClass('selected')){
		loadGraphingPane();
		$("#tab_nav").find('.selected').removeClass('selected');
		$(this).addClass('selected')
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
    },
  });	
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
}