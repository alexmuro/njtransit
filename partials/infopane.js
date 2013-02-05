$(document).ready(function(){
  $.ajax({
    url: 'partials/census.php',
    async:false,
    dataType: 'html',
    success: function(data){
      $('#content').html(data);
    },
  })
});

$("#census_tab").live("click", function() { 
	if(!$(this).hasClass('selected')){
		loadCensusPane();
		$("#tab_nav").find('.selected').removeClass('selected');
		$(this).addClass('selected');
		$("#sf1").val(1);
		$("#color").val(1);
	} 
});
$("#transit_tab").live("click", function() { 
	if(!$(this).hasClass('selected')){
		loadTransitPane();
		$("#tab_nav").find('.selected').removeClass('selected');
		$(this).addClass('selected')
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