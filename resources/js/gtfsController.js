function listRoutes(zone)
{
	//console.log(listRoutes);
	//console.log(gtfs);
	routes= []

	console.log('#zone'+zone+' .zone_content');
	$('#zone'+zone+' .zone_content').html('');
	for(i=0;i<gtfs.features.length;i++)
	{
		routes[gtfs.features[i].data.route] = 1;
	}
	
	//console.loggtfs.features[0].data

	var routeColors =['#9E0142','#D53E4F','#F46D43','#FDAE61','#FEE08B','#FFFFBF','#E6F598','#ABDDA4','#66C2A5','#3288BD','#5E4FA2','#2D004B','#542788','#7E4DA4','#ccc','#5a5a5a'];

	
	var i = 0;
	$.each(routes, function(index, value) {
		
		route_string = '<div data-order='+i+' data-route='+index+' class="route_listing" style="background-color:'+routeColors[9]+';" >';
		route_string += '<input type="checkbox" data-route='+index+'>'
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
		//console.log($(this).data('route'));
		var val = 0;
		if($(this)[0].checked){
			val =1;
		}
		for(i=0;i<gtfs.features.length;i++)
		{
			if($(this).data('route') == gtfs.features[i].data.route)
				{
					gtfs.features[i].attributes.include = val;
				}
		}
		gtfs.redraw();
	});

	
	$('.route_listing').on('mouseover',function(){
		console.log('route listing mouse over');
		routes = gtfs.getFeaturesByAttribute('route',String($(this).data('route')));
		for(i=0; i<routes.length;i++)
		{
			//console.log(route);
			gtfs_select.select(routes[i]);	
		}
		//gtfs_select.select();	
				
		//gtfsSelect.redraw();
		$(this).css('background-color','#0f0');
	});
	

	$('.route_listing').on('mouseout',function(){
		$(this).css('background-color',routeColors[9]);
		gtfs_select.unselectAll()
	});
	


}