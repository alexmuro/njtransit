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
	var busTrips = {};
	var run_id=182;
	var busRoute,busRoutesGroup,startTimeDimension,busTripsAllDimension = {};
	var route_id = -1;
	var censusGeo = {};
	
	
	//var delayCountChart = dc.barChart("#chart-delay-count");


	function loadData(){
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
			busTrips = crossfilter(data);
			loader.run();
		})
		.fail(function(e){
			console.log(e.responseText);
		});	
	}

	function marley(){
		var stations = []; // lazily loaded

var formatTime = d3.time.format("%I:%M%p");
var gtfsFormatTime = d3.time.format("%H:%M:%S")

var margin = {top: 20, right: 30, bottom: 200, left: 200},
    width = 900 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var x = d3.time.scale()
    .domain([parseTime("5:30AM"), parseTime("10:00am")])
    .range([0, width]);

var y = d3.scale.linear()
    .range([0, height]);

var z = d3.scale.linear()
    .domain([.0001, .0003])
    .range(["purple", "orange"])
    .interpolate(d3.interpolateLab);

var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(8)
    .tickFormat(formatTime);

var svg = d3.select("#chart-marley").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("y", -margin.top)
    .attr("width", width)
    .attr("height", height + margin.top + margin.bottom);


  var stations2 = loadStops();
  var trains2 = loadTrips();
  y.domain(d3.extent(stations2, function(d) { return d.distance; }));
  var stop_to_distance = {};
  stations2.forEach(function(d){
    stop_to_distance[d.stop_id] = d.distance;
  });

  var station = svg.append("g")
      .attr("class", "station")
    .selectAll("g")
      .data(stations2)
    .enter().append("g")
      .attr("transform", function(d) { return "translate(0," + y(d.distance) + ")"; });

  station.append("text")
      .attr("x", -6)
      .attr("dy", ".35em")
      .text(function(d,i) { if(i%3 !== 0){return '';}else{return d.stop_name;} })
      //.attr("transform", function(d) {return "rotate(-35)"});

  station.append("line")
      .attr("x2", width);

  svg.append("g")
      .attr("class", "x top axis")
      .call(xAxis.orient("top"));

  svg.append("g")
      .attr("class", "x bottom axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis.orient("bottom"));

  var train = svg.append("g")
      .attr("class", "train")
      .attr("clip-path", "url(#clip)")
    .selectAll("g")
      .data(trains2)//.data(trains.filter(function(d) { return /[NLB]/.test(d.type); }))
    .enter().append("g")
      .attr("class", function(d) { return d.type; });

  train.selectAll("line")
      .data(function(d) { return d.stops.slice(1).map(function(b, i) { return [d.stops[i], b]; }); })
    .enter().append("line")
      .attr("x1", function(d) { return x(gtfsFormatTime.parse(d[0].time)); })
      .attr("x2", function(d) { return x(gtfsFormatTime.parse(d[1].time)); })
      .attr("y1", function(d) { return y(stop_to_distance[d[0].stop_id]); })
      .attr("y2", function(d) { return y(stop_to_distance[d[1].stop_id]); })
      .style("stroke", function(d) { return z(Math.abs((stop_to_distance[d[1].stop_id] - stop_to_distance[d[0].stop_id]) / (gtfsFormatTime.parse(d[1].time) - gtfsFormatTime.parse(d[0].time)))); })
      .on("mouseover",function(d){
            self = $(this);
            console.log(self.parent());
            self.parent().addClass("highlighted")
      })
      .on("mouseout",function(d){
            self = $(this);

            self.css({
              "stroke": z(Math.abs((stop_to_distance[d[1].stop_id] - stop_to_distance[d[0].stop_id]) / (gtfsFormatTime.parse(d[1].time) - gtfsFormatTime.parse(d[0].time))))
            });
      });

  train.selectAll("circle")
      .data(function(d) { return d.stops; })
    .enter().append("circle")
      .attr("transform", function(d) { return "translate(" + x(gtfsFormatTime.parse(d.time)) + "," + y(stop_to_distance[d.stop_id]) + ")"; })
      .attr("r", 2);
      loader.run();
	}
	function filterData(){
		//console.log("2");
		busRoutes = busTrips.dimension(function(d){return d.route;});
		busRoutesGroup = busRoutes.group(function(d){return d;});
		// busDelay = busTrips.dimension(function(d){return d.delay/60; });
		// busDelayGroup = busDelay.group().reduceCount();
		startMinuteDimension = busTrips.dimension(function(d){return d.minute;});
		countPerMinute = startMinuteDimension.group().reduceCount();
		loader.run();
	}

	function makeGraphs(){
		loader.push(startTimeChart);
		loader.push(RouteCountChart);
		loader.push(dc.renderAll);
		loader.run();
	}

	function startTimeChart(){
		var busTripbyStartTimeChart  = dc.barChart("#chart-start-time");
		startMinuteDimension.top(1000).forEach(function(d){
			//console.log(d.minute.getFullYear()+" "+d.minute.getMonth()+" "+d.minute.getDate()+" "+d.minute.getHours()+" "+d.minute.getMinutes());

		});
		
		busTripbyStartTimeChart
			.width(900).height(400)
				.dimension(startMinuteDimension)
				.group(countPerMinute)
				.x(d3.time.scale().domain([new Date(2013,6,23, 5,30,0), new Date(2013,6,23, 16,0,0)]))
				.centerBar(true)
        .gap(1)
				.elasticY(true)
				.round(d3.time.minute.round)
        .xUnits(d3.time.minutes);

		loader.run();
	}

	function RouteCountChart(){
	var routeCountChart = dc.rowChart("#chart-route-count");
		routeCountChart
    .width(425).height(300)
    .dimension(busRoutes)
    .group(busRoutesGroup)
    .elasticX(true);
		loader.run();
	}

	function DelayCountChart(){
		delayCountChart
		.width(900).height(400)
				.dimension(startMinuteDimension)
				.group(countPerMinute)
				.x(d3.time.scale().domain([new Date(2013,6,23,6,0,0), new Date(2013,6,23, 16,0,0)]))
				.centerBar(true)
        .gap(1)
				.elasticY(true)
				.round(d3.time.minute.round)
        .xUnits(d3.time.minutes);

		loader.run();
	}
	function geoChart(){
		var routeCountChart = dc.rowChart("#chart-route-count");
	}

	function routesDOM(){
		$('#data-display').html('<div id="chart-route-count"></div><div id="chart-delay-count"></div><div id="chart-start-time"></div>');
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
			loader.push(loadData);
			loader.push(getCensusTracts);
			loader.run();
		},
		init_routes:function(){
			loader.push(routesDOM);
			loader.push(filterData);
			loader.push(makeGraphs);
			loader.run();
		},
		init_geography:function(){
			loader.push(geoDOM);
			console.log(censusGeo)
			loader.run();
		},
		init_route:function(routeID){
			route_id = routeID;
			loader.push(routeDOM);
			loader.push(marley);
			loader.run();
		}

	};
function getCensusTracts(){
	var output = {};
	//console.log('modelrun', viz.model_run)
	$.ajax({url:'/data/geo/getTractsByZone.php',
		data:{zone_id:2,model_run:run_id},
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
};

function loadStops(){
var output = []
$.ajax({url:'data/getRouteStops.php',
data:{route_id:route_id},
method:'POST',
dataType:'json',
async:false
})
.done(function(data){
output = data;
})
.fail(function(e){
console.log(e.responseText);
});
return output;

}
function loadTrips(){
var output = []
$.ajax({url:'data/getRouteTrips.php',
data:{route_id:route_id},
method:'POST',
dataType:'json',
async:false
})
.done(function(data){
output = data;
})
.fail(function(e){
console.log(e.responseText);
});
return output;
}
function parseTime(s) {
  var formatTime = d3.time.format("%I:%M%p");
var gtfsFormatTime = d3.time.format("%H:%M:%S")
  var t = formatTime.parse(s);
  if (t != null && t.getHours() < 3) t.setDate(t.getDate() + 1);
  return t;
}
}());

function DecimalRound(num,places){
	return Math.round( num * Math.pow(10,places) ) / Math.pow(10,places);
}