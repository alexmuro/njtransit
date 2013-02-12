function listRoutes()
{
	//console.log(listRoutes);
	console.log(gtfs);

	for(i=0;i<gtfs.features.length;i++)
	{
		console.log(gtfs.features[i].strokeColor)
		$('#route_list').append(gtfs.features[i].data.route+'<br>');
	}
}