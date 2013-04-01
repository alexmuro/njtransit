function listRoutes(zone)
{
	//console.log(listRoutes);
	//console.log(gtfs);
	routes= []

	$('#zone'+zone+' .zone_content').html('');
	for(i=0;i<gtfs.features.length;i++)
	{
		routes[gtfs.features[i].data.route] = 1;
	}
	console.log(routes);


	var routeColors =['#9E0142','#D53E4F','#F46D43','#FDAE61','#FEE08B','#FFFFBF','#E6F598','#ABDDA4','#66C2A5','#3288BD','#5E4FA2','#2D004B','#542788','#7E4DA4','#ccc','#5a5a5a'];

	
	var i = 0;
	$.each(routes, function(index, value) {
		
		route_string = '<div data-order='+i+' data-route='+index+' class=route_listing style="background-color:'+routeColors[i]+';" >';
		route_string += '<input type="checkbox" data-route='+index+' checked>'
		route_string += +index+'</div>'
  		

		if(value == 1){
			//console.log('#'+zone+' .gtfs_listing')
  		$('#zone'+zone+' .zone_content')
  		.append(route_string);
  		i++;
		}
	});

	$('.zone_content input').on('click',function(){
		console.log('check / uncheck')
		console.log($(this).data('route'));
		console.log($(this).attr("checked"));
		for(i=0;i<gtfs.features.length;i++)
		{
			if($(this).data('route') == gtfs.features[i].data.route)
				{
					console.log($(this).data('route'));	
				}
		}
	});

	/*
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
	*/


}