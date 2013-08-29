/* 
FUNCTIONS
1. 	loader
2. 	viz
	a. 	sanfrancisco()
	b. 	zurich()
	c. 	geneva()
3. 	popup
4.	toggles
*/


//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
var loader = { 
	queue: [],
	push: function(fn, scope, params) { 
		this.queue.push(function(){ fn.apply(scope||window, params||[]); }); 
	},
	run: function() { 
		if (this.queue.length) this.queue.shift().call(); 
	}
};

//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
var viz = {
	zone:2,
	model_run:31,
	centroid:[-74.465093,39.349667],
	projection:{},
	path:{},
	map:{},
	svg:{},
	g:{},
	routeData:{},
	tractData:{},
	stopData:{},
    //----------------------------------------------------------------------------------------------------------
   	njtransit  : function() {

	    // clean viz div and routes ul
	    $("#viz").html("");
	    $('#routes').html("");

		// set variables
		var lonlat = viz.centroid;
		var width = $(window).width();
		var height = $(window).height();
		var center = {
			x: width/2,
			y: height/2
		};
		 ﻿
		// d3 geo
		viz.projection = d3.geo.mercator()
			.center(lonlat)  
			.scale(1950000)
			.translate([width/2, height/2]);
		viz.path = d3.geo.path()
			.projection(viz.projection);

		viz.map = new L.Map("viz", {
  		     		center: [viz.centroid[1],viz.centroid[0]],//[37.8, -96.9],
  		     		zoom: 13
  		   	})
			//.addLayer(new L.TileLayer("http://{s}.tile.cloudmade.com/117aaa97872a451db8e036485c9f464b/998/256/{z}/{x}/{y}.png"));	
  			L.control.scale().addTo(viz.map);
  		
  		viz.svg = d3.select(viz.map.getPanes().overlayPane).append("svg"),
    	viz.g = viz.svg.append("g").attr("class", "leaflet-zoom-hide");

		
			
		var routeID = function(d,i) {
			return "route-" + d.properties.route.replace(" ","-");
		};

		var routeName = function(d,i) {
			return d.properties.route_name;
		};
		
		
		
		var routes = function() {

			
			collection = viz.routeData = transitData.getGTFSRoutes(viz.zone);
			var bounds = d3.geo.bounds(collection),
     		path = d3.geo.path().projection(viz.project);
     		var feature = viz.g.selectAll("path.route")
     			.data(collection.features)
     			.enter().append("path")
     			.attr("d", path)
				.style("fill", "none")
				.attr("class", "route")
				.attr("id", routeID)
				.attr("title", routeName);

     		viz.map.on("viewreset", function(){
     			viz.reset(bounds,feature);
     		});
     		viz.reset(bounds,feature)
  		

		  	
			collection.features.forEach(function(d,i){
				$('#routes').append('<li><a href="#" id="toggle-route-'+d.properties.route.replace(" ","-")+'" class="toggle-routes">'+d.properties.route_name.replace("\"","").replace("\"","")+'</a></li>');
			});
			
			toggles.init();
			popup.init();
			loader.run();
		
		};
		
		function mousemoved() {
		  $('#coords').text(formatLocation(projection.invert(d3.mouse(this)), zoom.scale()));
		}

		function formatLocation(p, k) {
 			var format = d3.format("." + Math.floor(Math.log(k) / 2 - 2) + "f");
  			return (p[1] < 0 ? format(-p[1]) + "°S" : format(p[1]) + "°N") + " "
       		+ (p[0] < 0 ? format(-p[0]) + "°W" : format(p[0]) + "°E");
		}
		
		// queue up and run the functions
		loader.push(viz.tracts.draw);
		loader.push(routes);
		loader.push(viz.stops.preload);
		loader.push(viz.stops.load);
		loader.run();

	},
	stops: {
			data :{},
			min_r:0,
			max_r:5,
			min_c:0,
			max_c:15,
			stopsBy:'off_count',
			sizeScale :function(){},
			colorScaleFreq:function(){},
			preload: function(){
				viz.stops.data = transitData.getGTFSStops();
				viz.stops.setBounds(viz.stops.stopsBy);
				viz.stops.colorScaleFreq = d3.scale.linear()
					.domain([viz.stops.min_c,viz.stops.max_c])
					.range(['#ED3A2D', '#2e0101']);
				viz.stops.sizeScale = d3.scale.linear()
					.domain([viz.stops.min_r,viz.stops.max_r])
					.range([1,40]);	 
				loader.run();
			},
			setBounds: function(){
				viz.stops.min_r = 0;
				viz.stops.max_r = 5;
				viz.stops.min_c = 0;
				viz.stops.max_c = 15;


				viz.stops.data.features.forEach(function(d){
					
					r_var = d.properties[viz.stops.stopsBy];
					if(r_var < viz.stops.min_r){
						viz.stops.min_r = r_var;
					}
					if(r_var > viz.stops.max_r){
						viz.stops.max_r = r_var;
					}
					if(d.properties.stop_frequency < viz.stops.min_c){
						viz.stops.min_c = d.properties.stop_frequency;
					}
					if(d.properties.stop_frequency > viz.stops.max_c){
						viz.stops.max_c = d.properties.stop_frequency;
					}
				});
			},
			stopR: function(d, i) {
				return viz.stops.sizeScale(d.properties[viz.stops.stopsBy]);
			},
			fillDelay: function(d,i) {
				return viz.stops.colorScaleFreq(d.properties.stop_frequency);
			},
			visualize:function(){
				viz.stops.setBounds();

				viz.stops.sizeScale = d3.scale.linear()
					.domain([viz.stops.min_r,viz.stops.max_r])
					.range([1,40]);
				viz.g.selectAll("circle.stop")
				.transition().duration(1000)
    			.attr('r', function(d){ 
    				return viz.stops.sizeScale(d.properties[viz.stops.stopsBy])
    			});
			},
			load: function() {
				var bounds = d3.geo.bounds(viz.stops.data),
     			path = d3.geo.path().projection(viz.project);
				var feature = viz.g.selectAll("circle.stop")
					.data(viz.stops.data.features)
					.enter()
					.append("circle")
					.classed("stop", true)
					.attr({
						r: viz.stops.stopR,
						cx: function(d,i) { 
							return viz.project(d.geometry.coordinates)[0]; 
						},
						cy: function(d,i) { 
							return viz.project(d.geometry.coordinates)[1]; 
						},
						"fill": viz.stops.fillDelay,
						"stopid": function(d,i) { 
							return d.properties.stop_id
						},
						"intersection": function(d,i) { 
							return (d.properties.stop_name)
						},
						"frequency": function(d,i) { 
							if(d.properties.stop_frequency != 'undefined'){
								return(d.properties.stop_frequency)
							}else{return 0;}

						},
						"boarding_count": function(d,i) { 
							if(d.properties.on_count != 'undefined'){
								return(d.properties.on_count)
							}else{return 0;}
						},
						"alighting_count": function(d,i) { 
							if(d.properties.off_count != 'undefined'){
								return(d.properties.off_count)
							}else{return 0;}
						}

					})
					.on("mouseover", function(self) {
						self = $(this);
						self.animate({
							"stroke-width": ".5px",
							"opacity": 1
						}, 100);
						var text = "";
						var text = "<p><strong>Stop " + self.attr("stopid") + "</strong><br/><span>" + self.attr("intersection") + "</span></p><p><strong>Boarding Count</strong><br/> " + self.attr("boarding_count") + "</p><p><strong>Alighting Count</strong><br/> " + self.attr("alighting_count") + "</p><p><strong>Stop Frequency</strong><br/> " + self.attr("frequency") + "</p>";
						$("#info").show().html(text);
					})
					.on("mouseout", function(self) {
						self = $(this);
						self.animate({
							"stroke-width": 0,
							"opacity": .3
						}, 100);
						$("#info").hide().html("");
					})

				viz.map.on("viewreset", function(){
     				viz.reset(bounds,feature);
     			});
     			viz.reset(bounds,feature);

				loader.run();
				$("#loading").fadeOut(1000);
				
			}
	},
	tracts:{
			data:{},
			max:0,
			min:10000,
			symbol:'P0010001',
			changeSymbol:function(){

				viz.tracts.max=0;
				viz.tracts.min=10000
				viz.tracts.data.features.forEach(function(f){
				 	if(f.properties[viz.tracts.symbol] > viz.tracts.max){
				 		viz.tracts.max = f.properties[viz.tracts.symbol];
				 	}
				 	else if(f.properties[viz.tracts.symbol] < viz.tracts.min){
			 			viz.tracts.min = f.properties[viz.tracts.symbol];
				 	}
				})
				var color = d3.scale.quantile()
	    			.domain([viz.tracts.min,viz.tracts.max])
	    			.range(["#EAF5DA","#CFE8AC","#9FC961","#7CAD34","#64961B","#41660A"])

	    		viz.g.selectAll("path.tract")
				.transition().duration(1000)
    			.style("fill",function(d){
						if(d.properties[viz.tracts.symbol] == null){
							return "#f00";
						}else{
							return color(d.properties[viz.tracts.symbol]);
						}

				});

			},
			draw:function(){
				viz.tracts.data = transitData.getCensusTracts(viz.zone);
				console.log(viz.tracts.data);
				var bounds = d3.geo.bounds(viz.tracts.data);
				path = d3.geo.path().projection(viz.project);
				
				

				
				viz.tracts.data.features.forEach(function(f){

					f.properties["inbound_transit"] = (f.properties["inbound_workers"]*.05).toFixed(0);
					f.properties["outbound_transit"] = (f.properties["outbound_workers"]*.05).toFixed(0);

				 	if(f.properties[viz.tracts.symbol] > viz.tracts.max){
				 		viz.tracts.max = f.properties[viz.tracts.symbol];
				 	}
				 	else if(f.properties[viz.tracts.symbol] < viz.tracts.min){
			 			viz.tracts.min = f.properties[viz.tracts.symbol];
				 	}
				})
				var color = d3.scale.quantile()
	    			.domain([viz.tracts.min,viz.tracts.max])
	    			.range(["#EAF5DA","#CFE8AC","#9FC961","#7CAD34","#64961B","#41660A"]);
	    				
				var feature = viz.g.selectAll("path.tract")
					.data(viz.tracts.data.features)
					.enter()
					.append("path")
					.attr("d", path)
					.attr("class", "tract")
					.style("fill",function(d){
						if(d.properties[viz.tracts.symbol] == null){
							return "#f00";
						}else{
							return color(d.properties[viz.tracts.symbol]);
						}

					})
					.style("stroke",'#333')
					.on("mouseover", function(d){
						self = $(this);
						self.css({
							"stroke-width": "2px"
						});
						var textTitle = "<p>";
						textTitle += "<strong>Census Tract:</strong>" + d.properties["geoid"] + "<br>";
						textTitle += "<strong>Total Population:</strong>" + d.properties['P0010001'] + "<br>";
						textTitle += "<strong>Inbound Workers:</strong>" + d.properties["inbound_workers"]+ "<br>";
						textTitle += "<strong>Inbound Transit Trips:</strong>" +d.properties["inbound_transit"]+ "<br>";
						textTitle += "<strong>Outbound Workers:</strong>" + d.properties["outbound_workers"] + "<br>";
						textTitle += "<strong>Outbound Transit Trips:</strong>" + d.properties["outbound_transit"]+ "<br></p>";
						//var textPoverty = "<p><span class=\"poverty\">" + self.attr("poverty") + "%" + "</span> of residents live under the federal poverty line</p>";
						//var textRace = "<table class=\"race\"><tr><td><span>" + self.attr("race-white") + "%" + "</span></td><td>&nbsp;identify as White</td></tr><tr><td><span>" + self.attr("race-black") + "%" + "</span></td><td>&nbsp;identify as Black or African American</td></tr><tr><td><span>" + self.attr("race-native") + "%" + "</span></td><td>&nbsp;identify as American Indian or Alaska Native</td></tr><tr><td><span>" + self.attr("race-asian") + "%" + "</span></td><td>&nbsp;identify as Asian</td></tr><tr><td><span>" + self.attr("race-pi") + "%" + "</span></td><td>&nbsp;identify as Native Hawaiian or Pacific Islander</td></tr><tr><td><span>" + self.attr("race-other") + "%" + "</span></td><td>&nbsp;identify as Other</td></tr><tr><td><span>"+ self.attr("race-hispanic") + "%" + "</span></td><td>&nbsp;identify as Hispanic or Latino (of any race)" + "</td></tr></table>";
						$("#info").show().html(textTitle);// + textPoverty + textRace
					})
					.on("mouseout", function(self) {
						self = $(this);
						self.css({
							"stroke-width": 0
						});
						$("#info").hide().html("");
					});
				
				viz.map.on("viewreset", function(){
     				viz.reset(bounds,feature);
     			});
     			viz.reset(bounds,feature)
				
				loader.run();
			}
		},
		reproject :function (){
    		viz.projection = d3.geo.mercator()
				.center(viz.centroid)  
				.scale(1950000)
				.translate([$(window).width()/2, $(window).width()/2]);
			viz.path = d3.geo.path()
				.projection(viz.projection);

    	},
    	reset :function (bounds,feature) { 

  				
				var bottomLeft = viz.project(bounds[0]),
				topRight = viz.project(bounds[1]);

				viz.svg .attr("width", topRight[0] - bottomLeft[0])
					.attr("height", bottomLeft[1] - topRight[1])
					.style("margin-left", bottomLeft[0] + "px")
					.style("margin-top", topRight[1] + "px");

				viz.g   .attr("transform", "translate(" + -bottomLeft[0] + "," + -topRight[1] + ")");

				//console.log("test",viz.g.attr("transform"));

				console.log();
			    if(feature.attr('cx') == null){
			    //polygons only need path updated	
			    	feature
			    		.attr("d", path)
			    
			    }
			    else{
			    //circles must have their centers adjusted
				    feature
				    	.attr("d", path)  
				    	.attr("cx", function(d) {
					    	return viz.project(d.geometry.coordinates)[0];
			    		})
			    		.attr("cy", function(d) {
			        		return viz.project(d.geometry.coordinates)[1]; 
			    		});
		    	}	
		},
		project :function(x) {
			var point = viz.map.latLngToLayerPoint(new L.LatLng(x[1], x[0]));
			return [point.x, point.y];
		}
};



//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
var popup = {

    init : function() {

		// position popup
		windowW = $(window).width();
		$("#viz").on("mousemove", function(e) {
			
			var x = e.pageX + 20;
			var y = e.pageY;
			var windowH = $(window).height();
			if (y > (windowH - 100)) {
				var y = e.pageY - 100;
			} else {
				var y = e.pageY - 20;
			}

			$("#info").css({
				"left": x,
				"top": y
			});
		});

	}

};


//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
var transitData = {
	getGTFSRoutes : function(zone){
		var output = {};
		$.ajax({url:'/data/get/getGTFSbyZone.php',
			data:{zone_id:zone},
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
		return(output);		
	},
	getGTFSStops : function(){
		var output = {};
		console.log('modelrun', viz.model_run)
		$.ajax({url:'/data/get/getStopsByZone.php',
			data:{zone_id:viz.zone,model_run:viz.model_run},
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
		return(output);
	},
	getCensusTracts : function(){
		var output = {};
		//console.log('modelrun', viz.model_run)
		$.ajax({url:'/data/geo/getTractsByZone.php',
			data:{zone_id:viz.zone,model_run:viz.model_run},
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
		return(output);
	}
}
//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------
var toggles = {

    init : function() {

		$("#legend h2 a").on("click", function() {
			$(this).toggleClass("closed");
			$("#legend-detail").slideToggle(300);
			return false;
		});

		$("#toggle-tracts").on("click", function() {
			var self = $(this); 
			if (self.hasClass("active")) {
				//$("#viz .tract").fadeOut(500);
			    setTimeout(function() {
			        $("#viz .tract").each(function(i) {
			            var self = $(this); 
			            setTimeout(function() { 
			            	self.fadeOut(300);
			            }, 5 * i);
			        });
			    }, 5);   	
				self.removeClass("active");
			} else {
				//$("#viz .tract").fadeIn(500);
			    setTimeout(function() {
			        $("#viz .tract").each(function(i) {
			            var self = $(this); 
			            setTimeout(function() { 
			            	self.fadeIn(300);
			            }, 5 * i);
			        });
			    }, 5);   	
				self.addClass("active");
			}
			return false;
		});

		$(".toggle-routes").on("click", function() {
			var self = $(this); 
			var route = "#" + self.attr("id").replace("toggle-","");
			if (self.hasClass("active")) {
				$(route).css({
					"stroke-width": "2px"
				});
				$(route).animate({
					opacity: .1
				}, 100);
				self.removeClass("active");
			} else {
				$(route).css({
					"stroke-width": "5px"
				});
				$(route).animate({
					opacity: 1
				}, 100);
				self.addClass("active");
			}
			return false;
		});

		$(".toggle-routes-alt").on("click", function() {
			var self = $(this); 
			var route = "#viz ." + self.attr("id").replace("toggle-","");
			if (self.hasClass("active")) {
				$(route).css({
					"stroke-width": "2px"
				});
				$(route).animate({
					opacity: .1
				}, 100);
				self.removeClass("active");
			} else {
				$(route).css({
					"stroke-width": "5px"
				});
				$(route).animate({
					opacity: 1
				}, 100);
				self.addClass("active");
			}
			return false;
		});

	},

};

//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
$(window).resize(function() {
	$("#viz svg").width($(window).width());
	$("#viz svg").height($(window).height());
});