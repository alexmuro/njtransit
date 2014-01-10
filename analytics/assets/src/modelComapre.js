var numberFormat = d3.format(".0f");
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
	var run_id=269;
	var ampm = 'am';
	var modelRoute,
		modelRoutesGroup,
		fareRoute,
		fareRoutesGroup,
		startTimeDimension,
		modelTripsAllDimension,
		modelGeoIDBoarding,
		modelGeoIDBoardingGroup,
		modelGeoIDAlighting,
		modelGeoIDAlightingGroup= {};

	var route_id = -1;
	var censusGeo = {};

	function loadModelData(){
		//console.log('1');
		var minutes;
		var hours;
		console.log('test',ampm,run_id)
		$.ajax({url:'data/getBusTrips.php',
			data:{run_id:run_id,ampm:ampm},
			method:'POST',
			dataType:'json',
			async:false
		})
		.done(function(data){
			data.forEach(function(d,i){
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

	function loadCensusTracts(){
		var output = {};
		$.ajax({url:'/data/geo/getTractsByZone.php',
			data:{zone_id:2,run_id:run_id},
			method:'POST',
			dataType:'json',
			async:false
		})
		.done(function(data){
			censusGeo = data;
			loader.run();
		})
		.fail(function(e){
			console.log(e.responseText);
			loader.run();
		});
	}

	function loadFareData(){
		//console.log('1');
		var minutes;
		var hours;
		$.ajax({url:'data/getRealTrips.php',
			data:{time:ampm},
			method:'POST',
			dataType:'json',
			async:false
		})
		.done(function(data){
			//console.log('fare data:',data);
			fareTrips = crossfilter(data);
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
		
		modelGeoIDBoarding = modelTrips.dimension(function(d){return d.on_tract;});
		modelGeoIDBoardingGroup = modelGeoIDBoarding.group(function(d){return d;});
		
		modelGeoIDAlighting = modelTrips.dimension(function(d){return d.off_tract;});
		modelGeoIDAlightingGroup = modelGeoIDAlighting.group(function(d){return d;});

		modelRouteStart = modelTrips.dimension(function(d){return d.route+" "+d.trip_start_time;});
		modelRouteStartGroup = modelRouteStart.group(function(d){return d;});

		fareRoutes = fareTrips.dimension(function(d){return d.LINE;});
		fareRoutesGroup = fareRoutes.group().reduceSum(function(d) { return d.TOTAL_TRANSACTIONS*1; });

		fareFareZones = fareTrips.dimension(function(d){return d.BOARDING_ZONE;});
		fareFareZonesGroup = fareFareZones.group().reduceSum(function(d){ return d.TOTAL_TRANSACTIONS*1; });

		fareFareZonesAlighting = fareTrips.dimension(function(d){return d.ALIGHTING_ZONE;});
		fareFareZonesAlightingGroup = fareFareZonesAlighting.group().reduceSum(function(d){ return d.TOTAL_TRANSACTIONS*1; });

		fareRouteStart = fareTrips.dimension(function(d){return d.LINE+" "+d.START_TIME;});
		fareRouteStartGroup = fareRouteStart.group().reduceSum(function(d){ return d.TOTAL_TRANSACTIONS*1; });

		startMinuteDimension = modelTrips.dimension(function(d){return d.minute;});
		countPerMinute = startMinuteDimension.group().reduceCount();
		loader.run();
	
	}

	function makeGraphs(){
		
		loader.push(RouteCountCharts);
		//loader.push(TripCountCharts);
		loader.push(FareZoneCountCharts);
		loader.push(RouteComparisonTable);
		loader.push(CensusTractBoardingChart);
		loader.push(dc.renderAll);
		loader.run();
	
	}
	function CensusTractBoardingChart(){
		var width = 550;
		var height = 650;
		var censusTractBoarding = dc.geoChoroplethChart("#chart-model-census-tracts-boarding");
		var correctProject = getProjection(height,width,censusGeo);
		censusTractBoarding
			.width(width)
			.height(height)
			.dimension(modelGeoIDBoarding)
			.group(modelGeoIDBoardingGroup)
			.colors(d3.scale.quantize().range(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"]))
			.colorDomain([0, 200])
			.colorCalculator(function (d) { return d ? censusTractBoarding.colors()(d) : '#ccc'; })
			.overlayGeoJson(censusGeo.features, "tract", function (d) {
						return d.properties.geoid;
			})
			.projection(correctProject)
			.title(function (d) {
						return "Censust Tract: " + d.key + "\n # Boarding: " + numberFormat(d.value ? d.value : 0);
			});
			censusTractBoarding.legend(dc.legend());

    

    var censusTractAlighting = dc.geoChoroplethChart("#chart-model-census-tracts-alighting");
		censusTractAlighting
			.width(width)
      .height(height)
      .dimension(modelGeoIDAlighting)
      .group(modelGeoIDAlightingGroup)
      .colors(d3.scale.quantize().range(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"]))
      .colorDomain([0, 200])
      .colorCalculator(function (d) { return d ? censusTractAlighting.colors()(d) : '#ccc'; })
      .overlayGeoJson(censusGeo.features, "tract", function (d) {
				return d.properties.geoid;
      })
      .projection(correctProject)
      .title(function (d) {
				return "Census Tract: " + d.key + "\n # Alighting: " + numberFormat(d.value ? d.value : 0);
      });

		loader.run();
	}

	function getProjection(width,height,json){
		var center = d3.geo.centroid(json);
		var scale  = 150;
		var offset = [width/2, height/2];
		var projection = d3.geo.mercator().scale(scale).center(center)
          .translate(offset);

      // create the path
      var path = d3.geo.path().projection(projection);

      // using the path determine the bounds of the current map and use 
      // these to determine better values for the scale and translation
      var bounds  = path.bounds(json);
      var hscale  = scale*width  / (bounds[1][0] - bounds[0][0]);
      var vscale  = scale*height / (bounds[1][1] - bounds[0][1]);
      scale   = (hscale < vscale) ? hscale : vscale;
      offset  = [width - (bounds[0][0] + bounds[1][0])/2, height - (bounds[0][1] + bounds[1][1])/2];

      // new projection
      return d3.geo.mercator().center(center).scale(scale).translate(offset);
	}


	function RouteCountCharts(){

		var fareFiltered,modelFiltered = false;
		var routeCountChart = dc.rowChart("#chart-model-route-count");
		routeCountChart
			.width(550).height(600)
			.dimension(modelRoutes)
			.group(modelRoutesGroup)
			.elasticX(true)
			.renderTitleLabel(true);


		var fareCountChart = dc.rowChart("#chart-fare-route-count");
		fareCountChart
			.width(550).height(600)
			.dimension(fareRoutes)
			.group(fareRoutesGroup)
			.elasticX(true)
			.renderTitleLabel(true);

		routeCountChart.on("filtered", function(chart, filter){
			if(!modelFiltered){
				fareCountChart.filter(filter);
				modelRouteStartGroup = modelRouteStart.group(function(d){if(d.substring(0,3) == filter){ return d;}});
				TripCountCharts(true);
				modelFiltered = true;
			}else{
				modelRouteStartGroup = modelRouteStart.group(function(d){return d;});
				TripCountCharts(true);
				modelFiltered = false;
			}

		});

		fareCountChart.on("filtered", function(chart, filter){
			if(!fareFiltered){
				fareRouteStart = fareTrips.dimension(function(d){if(d.LINE == filter){return d.LINE+" "+d.START_TIME;}});
				fareRouteStartGroup = fareRouteStart.group().reduceSum(function(d){if(d.LINE == filter){return d.TOTAL_TRANSACTIONS*1;}});
			}else{
				fareRouteStart = fareTrips.dimension(function(d){return d.LINE+" "+d.START_TIME;});
				fareRouteStartGroup = fareRouteStart.group().reduceSum(function(d){return d.TOTAL_TRANSACTIONS*1;});
			}
			TripCountCharts(true);
		});

		loader.run();
	}

	function TripCountCharts(redraw){
		var modelTripCountChart = dc.rowChart("#chart-model-trip-count");
		modelTripCountChart
			.width(550).height(700)
			.dimension(modelRouteStart)
			.group(modelRouteStartGroup)
			.elasticX(true)
			.renderTitleLabel(true);
		

		var fareTripCountChart = dc.rowChart("#chart-fare-trip-count");
		fareTripCountChart
			.width(550).height(700)
			.dimension(fareRouteStart)
			.group(fareRouteStartGroup)
			.elasticX(true)
			.renderTitleLabel(true);

		dc.renderAll();
		
	}

	function FareZoneCountCharts(){
		
		var modelCountChart = dc.rowChart("#chart-model-farezone-count");
		modelCountChart
			.width(550).height(700)
			.dimension(modelFareZones)
			.group(modelFareZonesGroup)
			.renderTitleLabel(true)
			.elasticX(true);
		
		
		var fareCountChart = dc.rowChart("#chart-fare-farezone-count");
		fareCountChart
			.width(550).height(700)
			.dimension(fareFareZones)
			.group(fareFareZonesGroup)
			.elasticX(true)
			.renderTitleLabel(true);

		var modelCountChartOff = dc.rowChart("#chart-model-farezone-off-count");
		modelCountChartOff
			.width(550).height(700)
			.dimension(modelFareZonesAlighting)
			.group(modelFareZonesAlightingGroup)
			.elasticX(true)
			.renderTitleLabel(true);
		
		var fareCountChartOff = dc.rowChart("#chart-fare-farezone-off-count");
		fareCountChartOff
			.width(550).height(700)
			.dimension(fareFareZonesAlighting)
			.group(fareFareZonesAlightingGroup)
			.elasticX(true)
			.renderTitleLabel(true);

		loader.run();
	}

	function RouteComparisonTable(){
		var output = '<table class="table table-hover"><thead><tr><th>Route</th><th>Model Riders</th><th>Fare Riders</th><th>% difference</th></tr></thead><tbody>';
		var modelTotal= 0, faresTotal = 0;
		fareRoutesGroup.all().forEach(function(d,i){
			var difference = Math.round(((modelRoutesGroup.all()[i].value-fareRoutesGroup.all()[i].value) / fareRoutesGroup.all()[i].value)*100);
			output += "<tr><td>"+d.key+"</td><td>"+modelRoutesGroup.all()[i].value+'</td><td>'+numberFormat(fareRoutesGroup.all()[i].value)+"</td><td>"+difference+"%</td><td><tr>";
			modelTotal += modelRoutesGroup.all()[i].value;
			faresTotal += fareRoutesGroup.all()[i].value;
		});
		var difference = Math.round(((modelTotal-faresTotal) / faresTotal)*100);
		output += "</tbody><tfoot><tr><td>Total</td><td>"+modelTotal+'</td><td>'+numberFormat(faresTotal)+"</td><td>"+difference+"%</td><td><tr></tfoot>";
		output += '<table>';
		$("#table-route-comparison").html(output);
		loader.run();
	}

	return{
		init:function(runID,time){
			run_id = runID;
			ampm = time;
			loader.push(loadModelData);
			loader.push(loadFareData);
			loader.push(loadCensusTracts);
			loader.push(filterData);
			loader.push(makeGraphs);
			loader.run();
		},
		init_routes:function(){
			
			loader.run();
		}
	};
})();

function DecimalRound(num,places){
	return Math.round( num * Math.pow(10,places) ) / Math.pow(10,places);
}