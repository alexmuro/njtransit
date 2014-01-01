var loader = {
	queue: [],
	push: function(fn, scope, params) {
		this.queue.push(function(){ fn.apply(scope||window, params||[]);});
	},
	run:function(){
		if (this.queue.length) this.queue.shift().call();
	}
};

var busAnalyst = (function(){
	var timeFormat = d3.time.format("%Y-%m-%d %H:%M:%S");
	var modelTrips,fareTrips = {};
	var run_id=182;
	var modelRoute,modelRoutesGroup,fareRoute,fareRoutesGroup,startTimeDimension,modelTripsAllDimension = {};
	var route_id = -1;
	var censusGeo = {};
	
	
	//var delayCountChart = dc.barChart("#chart-delay-count");


	function loadModelData(){
		//console.log('1');
		var minutes;
		var hours;
		$.ajax({url:'data/getBusTrips.php',
			data:{run_id:run_id},
			method:'POST',
			dataType:'json',
			async:false
		})
		.done(function(data){
			data.forEach(function(d,i){
				//if(i < 10) console.log(d3.time.minute(timeFormat.parse(d.start_time)));
				d.start_time_d = timeFormat.parse(d.start_time);
				d.minute = d3.time.minute(d.start_time_d);
				d.minute.setHours(d.minute.getHours()-4);
			});
			console.log('model data',data);
			modelTrips = crossfilter(data);
			loader.run();
		})
		.fail(function(e){
			console.log(e.responseText);
		});
	}

	function loadFareData(){
		//console.log('1');
		var minutes;
		var hours;
		$.ajax({url:'data/getRealTrips.php',
			method:'POST',
			dataType:'json',
			async:false
		})
		.done(function(data){
			console.log('fare data:',data);
			fareTrips = crossfilter(data);
			console.log(data);
			loader.run();
		})
		.fail(function(e){
			console.log(e.responseText);
		});
	}
	
	function filterData(){

		modelRoutes = modelTrips.dimension(function(d){return d.route;});
		modelRoutesGroup = modelRoutes.group(function(d){return d;});
		modelFareZones = modelTrips.dimension(function(d){ return d.on_fare_zone;});
		modelFareZonesGroup = modelFareZones.group(function(d){return d;});
		modelFareZonesAlighting = modelTrips.dimension(function(d){ return d.off_fare_zone;});
		modelFareZonesAlightingGroup = modelFareZonesAlighting.group(function(d){return d;});


		fareRoutes = fareTrips.dimension(function(d){return d.LINE;});
		fareRoutesGroup = fareRoutes.group().reduceSum(function(d) { return d.TOTAL_TRANSACTIONS*1; });
		fareFareZones = fareTrips.dimension(function(d){return d.BOARDING_ZONE;});
		fareFareZonesGroup = fareFareZones.group().reduceSum(function(d){ return d.TOTAL_TRANSACTIONS*1; });
		fareFareZonesAlighting = fareTrips.dimension(function(d){return d.ALIGHTING_ZONE;});
		fareFareZonesAlightingGroup = fareFareZonesAlighting.group().reduceSum(function(d){ return d.TOTAL_TRANSACTIONS*1; });

		startMinuteDimension = modelTrips.dimension(function(d){return d.minute;});
		countPerMinute = startMinuteDimension.group().reduceCount();
		loader.run();
	
	}

	function makeGraphs(){
		
		loader.push(RouteCountCharts);
		loader.push(FareZoneCountCharts);
		loader.push(RouteComparisonTable);
		loader.push(dc.renderAll);
		loader.run();
	
	}
	function RouteCountCharts(){

		var routeCountChart = dc.rowChart("#chart-model-route-count");
		routeCountChart
			.width(425).height(300)
			.dimension(modelRoutes)
			.group(modelRoutesGroup)
			.elasticX(true);

		var fareCountChart = dc.rowChart("#chart-fare-route-count");
		fareCountChart
			.width(425).height(300)
			.dimension(fareRoutes)
			.group(fareRoutesGroup)
			.elasticX(true);

		loader.run();
	}
	function FareZoneCountCharts(){
		
		var modelCountChart = dc.rowChart("#chart-model-farezone-count");
		modelCountChart
			.width(425).height(600)
			.dimension(modelFareZones)
			.group(modelFareZonesGroup)
			.elasticX(true);
		
		console.log('fare farezone test',fareFareZonesGroup.all());
		var fareCountChart = dc.rowChart("#chart-fare-farezone-count");
		fareCountChart
			.width(425).height(600)
			.dimension(fareFareZones)
			.group(fareFareZonesGroup)
			.elasticX(true);
		var modelCountChartOff = dc.rowChart("#chart-model-farezone-off-count");
		modelCountChartOff
			.width(425).height(600)
			.dimension(modelFareZonesAlighting)
			.group(modelFareZonesAlightingGroup)
			.elasticX(true);
		
		console.log('fare farezone test',fareFareZonesGroup.all());
		var fareCountChartOff = dc.rowChart("#chart-fare-farezone-off-count");
		fareCountChartOff
			.width(425).height(600)
			.dimension(fareFareZonesAlighting)
			.group(fareFareZonesAlightingGroup)
			.elasticX(true);

		loader.run();
	}

	function RouteComparisonTable(){
		var output = '<table><tr><th>Route</th><th>Model Riders</th><th>Fare Riders</th><th>%</th></tr>';
		fareRoutesGroup.all().forEach(function(d,i){
			var difference = Math.round(((modelRoutesGroup.all()[i].value-fareRoutesGroup.all()[i].value) / fareRoutesGroup.all()[i].value)*100);
			output += "<tr><td>"+d.key+"</td><td>"+modelRoutesGroup.all()[i].value+'</td><td>'+fareRoutesGroup.all()[i].value+"</td><td>"+difference+"%</td><td><tr>";
		});
		output += '<table>';
		$("#table-route-comparison").html(output);
		loader.run();
	}

	

	
	function routesDOM(){
		$('#data-display')
			.html(
				'<div id="chart-model-route-count"></div>'+
				'<div id="chart-fare-route-count"></div>'+
				'<div id="chart-model-farezone-count"></div>'+
				'<div id="chart-fare-farezone-count"></div>'+
				'<div id="chart-model-farezone-off-count"></div>'+
				'<div id="chart-fare-farezone-off-count"></div>'+
				'<div id="table-route-comparison"></div>');
		loader.run();
	}

	function routeDOM(){
		$('#data-display').html('<h2>Route '+route_id+'</h2><div id="chart-marley"></div>');
		loader.run();
	}
	function geoDOM(){
		$('#data-display').html('Geographies<div id="chart-geo-count"></div>');
		loader.run();
	}

	return{
		init:function(runID){
			run_id = runID;
			loader.push(loadModelData);
			loader.push(loadFareData);
			loader.run();
		},
		init_routes:function(){
			loader.push(routesDOM);
			loader.push(filterData);
			loader.push(makeGraphs);
			loader.run();
		}
	};
})();

function DecimalRound(num,places){
	return Math.round( num * Math.pow(10,places) ) / Math.pow(10,places);
}