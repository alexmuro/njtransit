function listRoutes(zone)
{
	//console.log(listRoutes);
	//console.log(gtfs);
	routes= []

	for(i=0;i<gtfs.features.length;i++)
	{
		routes[gtfs.features[i].data.route] = 1;
	}
	console.log(routes);


	var routeColors =['#9E0142','#D53E4F','#F46D43','#FDAE61','#FEE08B','#FFFFBF','#E6F598','#ABDDA4','#66C2A5','#3288BD','#5E4FA2','#2D004B','#542788','#7E4DA4','#ccc','#5a5a5a'];

	
	var i = 0;
	$.each(routes, function(index, value) {
		if(value == 1){
			console.log('#'+zone+' .gtfs_listing')
  		$('#'+zone+' .gtfs_listing').append('<div data-order='+i+' data-route='+index+' class=route_listing style="background-color:'+routeColors[i]+';" >'+index+'</div>');
  		i++;
		}
	});

	$('.route_listing').live('mouseover',function(){
		for(i=0;i<gtfs.features.length;i++)
		{
			if($(this).data('route') == gtfs.features[i].data.route)
				{
					gtfs_select.select(gtfs.features[i]);	
				}
		}
		gtfsSelect.redraw();
		$(this).css('background-color','#0f0');
	});

	$('.route_listing').live('mouseout',function(){
		$(this).css('background-color',routeColors[$(this).data('order')]);
		gtfs_select.unselectAll()
	});


}