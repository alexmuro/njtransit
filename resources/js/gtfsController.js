
function listRoutes(zone)
{
	//console.log(listRoutes);
	//console.log(gtfs);
	routes= {}

	$('#zone'+zone+' .zone_content').html('');
	for(i=0;i<gtfs.features.length;i++)
	{

		if(typeof gtfs.features[i].data.route_name != 'undefined'){
			routes[gtfs.features[i].data.route] = String(gtfs.features[i].data.route_name.replace(/['"]/g,""));
		}
	}
	
	//console.loggtfs.features[0].data

	var routeColors =['#9E0142','#D53E4F','#F46D43','#FDAE61','#FEE08B','#FFFFBF','#E6F598','#ABDDA4','#66C2A5','#3288BD','#5E4FA2','#2D004B','#542788','#7E4DA4','#ccc','#5a5a5a'];

	
	var x = 0;
	route_string = '<table id="zone'+zone+'_table" class="route_table tablesorter"><thead><th>Route</th><th>Trips</th><th># Shapes</th></tr></thead><tbody>';
	$.each(routes, function(index, value) {
		//console.log(index+" "+value)
		num_trips = 0;
		num_shapes = 0
		routes = gtfs.getFeaturesByAttribute('route',String(index));
		for(i=0; i<routes.length;i++)
		{
			num_trips += routes[i].data.num_trips*1;
			num_shapes++;	
		}
		if(typeof value != 'undefined'){
			if(x%2 === 1){
				route_string += '<tr data-order='+x+' data-route='+index+' class="route_listing odd"><td>';
			}else{
				route_string += '<tr data-order='+x+' data-route='+index+' class="route_listing"><td>';
			}
			route_string += '<div  style="padding:3px">';
			route_string += '<input type="checkbox" data-route='+index+'> ';
			route_string += +String(value)+'</div>';
			route_string += '</td><td> ';
			route_string +=  num_trips;
			route_string += '</td><td> ';
			route_string +=  num_shapes;
			route_string += ' </td></tr>';
			x++;
		}
		
	});
	route_string +='</tbody></table>';
	$('#zone'+zone+' .zone_content')
	  		.append(route_string);

	 $('#zone'+zone+'_table').tablesorter(); 

	$('.zone_content input').on('click',function(){
		//console.log('check / uncheck')
		//console.log($(this).data('route'));
		var routes = '[';
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
		var routes = '[';
		$('.zone_content input').each(function(){
			if($(this)[0].checked){	
				routes += '"'+$(this).data('route')+'",';
			}
		});
		routes = routes.slice(0,-1) + "]";
		$.ajax({
         	type: "POST",
            url: "data/update/updateZone.php",
            data: { geo_string: routes, geo_type: "routes",current_zone:currentZone }
            }).done(function( msg ) {
                 //console.log( "Data Saved"+msg );
            });
		//console.log(routes);
		gtfs.redraw();
	});

	
	$('.route_listing').on('mouseover',function(){
		routes = gtfs.getFeaturesByAttribute('route',String($(this).data('route')));
		for(i=0; i<routes.length;i++)
		{
			gtfs_select.select(routes[i]);	
		}
		$(this).addClass('currentGTFS');
	});
	

	$('.route_listing').on('mouseout',function(){
		$(this).removeClass('currentGTFS');
		gtfs_select.unselectAll();
		gtfs.redraw();
	});
}