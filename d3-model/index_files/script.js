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
		var projection = d3.geo.mercator()
			.center(lonlat)  
			.scale(1950000)
			.translate([width/2, height/2]);
		var path = d3.geo.path()
			.projection(projection);
		var colorScale = ["#EAF5DA","#CFE8AC","#9FC961","#7CAD34","#64961B","#41660A"];
			
		var routeID = function(d,i) {
			return "route-" + d.properties.route.replace(" ","-");
		};

		var routeName = function(d,i) {
			return d.properties.route_name;
		};
		
		var zoom = d3.behavior.zoom()
			.translate(projection.translate())
			.scale(projection.scale())
			.scaleExtent([1250000,6000000])
			.on("zoom", function() {
				projection.translate(d3.event.translate).scale(d3.event.scale);
				group.selectAll("path").attr("d", path);
				group.selectAll("circle.stop").attr("cx", function(d) {
				    return projection(d.geometry.coordinates)[0] 
				});
				group.selectAll("circle.stop").attr("cy", function(d) {
				    return projection(d.geometry.coordinates)[1] 
				});
		});
		// var map = new L.Map("map", {
  		//     		center: [37.8, -96.9],
  		//     		zoom: 4
  		//   	})
  		//   	.addLayer(new L.TileLayer("http://{s}.tile.cloudmade.com/117aaa97872a451db8e036485c9f464b/998/256/{z}/{x}/{y}.png"))


		// initialize viz
		var group = d3.select("#viz").append("svg").attr("width",width).attr("height",height);
		group.call(zoom).on("mousemove", mousemoved);

		//http://a.tile.cloudmade.com//86564/256/${z}/${x}/${y}.png

		// functions to draw tracts, routes, and stops
		var tracts = function() {
			//../data/get/getCTRegion.php?zone='+viz.zone
			d3.json('../data/zones/'+viz.zone+'/ct.json', function(data) {
				group.selectAll("path.tract")
					.data(data.features)
					.enter()
					.append("path")
					.attr("d", path)
					.attr("class", "tract")
					.style("fill",colorScale[5])
					.style("stroke",'#ccc')
					.attr("id-number", 'test-id')
					.on("mouseover", function(self) {
						self = $(this);
						self.css({
							"stroke-width": "2px"
						});
						var textTitle = "<p><strong>" + self.attr("id-number") + "</strong></p>";
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
				loader.run();
			});
		};
		
		var routes = function() {

			
			data = transitData.getGTFSRoutes(viz.zone);
			data.features.forEach(function(d,i){
				$('#routes').append('<li><a href="#" id="toggle-route-'+d.properties.route.replace(" ","-")+'" class="toggle-routes">'+d.properties.route_name.replace("\"","").replace("\"","")+'</a></li>');
			});
			group.selectAll("path.route")
				.data(data.features)
				.enter()
				.append("path")
				.attr("d", path)
				.style("fill", "none")
				.attr("class", "route")
				.attr("id", routeID)
				.attr("title", routeName);
			
			toggles.init();
			popup.init();
			loader.run();
		
		};
		
		
		var stops = {
			data :{},
			min_r:0,
			max_r:5,
			min_c:0,
			max_c:15,
			sizeScale :function(){},
			colorScaleFreq:function(){},
			preload: function(){
				stops.data = transitData.getGTFSStops();
				stops.setBounds('on');
				stops.colorScaleFreq = d3.scale.linear()
					.domain([stops.min_c,stops.max_c])
					.range(['#ED3A2D', '#2e0101']);
				stops.sizeScale = d3.scale.linear()
					.domain([stops.min_r,stops.max_r])
					.range([3,30]);	 
				loader.run();
			},
			setBounds: function(stopsBy){
				stops.data.features.forEach(function(d){
					r_var = d.properties.on_count;
					if(stopsBy == 'off'){
						r_var = d.properties.off_count;
					}
					if(r_var < stops.min_r){
						stops.min_r = r_var;
					}
					if(r_var > stops.max_r){
						stops.max_r = r_var;
					}
					if(d.properties.stop_frequency < stops.min_c){
						stops.min_c = d.properties.stop_frequency;
					}
					if(d.properties.stop_frequency > stops.max_c){
						stops.max_c = d.properties.stop_frequency;
					}
				});
			},
			stopR: function(d, i) {
				return stops.sizeScale(d.properties.on_count);
			},
			fillDelay: function(d,i) {
				return stops.colorScaleFreq(d.properties.stop_frequency);
			},
			load: function() {
				group.selectAll("circle.stop")
					.data(stops.data.features)
					.enter()
					.append("circle")
					.classed("stop", true)
					.attr({
						r: stops.stopR,
						cx: function(d,i) { 
							return projection(d.geometry.coordinates)[0] 
						},
						cy: function(d,i) { 
							return projection(d.geometry.coordinates)[1] 
						},
						"fill": stops.fillDelay,
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
						var text = "<p><strong>Stop " + self.attr("stopid") + "</strong><br/><span>" + self.attr("intersection") + "</span></p><p><strong>Boarding Count</strong><br/> " + self.attr("boarding_count") + "</p><p><strong>Aligthing Count</strong><br/> " + self.attr("alighting_count") + "</p><p><strong>Stop Frequency</strong><br/> " + self.attr("frequency") + "</p>";
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
				loader.run();
				$("#loading").fadeOut(1000);
				
			}
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
		loader.push(tracts);
		loader.push(routes);
		loader.push(stops.preload);
		loader.push(stops.load);
		loader.run();

		// zoom in & out buttons
	    $("#zoom-in").on("click", function() {
		    var newScale = projection.scale() + 500000;
		    projection.scale(newScale);
		    group.selectAll("path").attr("d", path);
		    group.selectAll("circle.stop").attr("cx", function(d) {
		        return projection(d.geometry.coordinates)[0] 
		    });
		    group.selectAll("circle.stop").attr("cy", function(d) {
		        return projection(d.geometry.coordinates)[1] 
		    });

		    
		    // important! assigns the new scale to the zoom mouse behavior
		    var zoom = d3.behavior.zoom()
		       .translate(projection.translate())
		       .scale(newScale)
		       .scaleExtent([1250000,6000000])
		       .on("zoom", function() {
		       	projection.translate(d3.event.translate).scale(d3.event.scale);
		       	group.selectAll("path").attr("d", path);
		       	group.selectAll("circle.stop").attr("cx", function(d) {
		       	    return projection(d.geometry.coordinates)[0] 
		       	});
		       	group.selectAll("circle.stop").attr("cy", function(d) {
		       	    return projection(d.geometry.coordinates)[1] 
		       	});
		    });
		    group.call(zoom);
		});

	    $("#zoom-out").on("click", function() {
		    var newScale = projection.scale() - 500000;
		    projection.scale(newScale);
		    group.selectAll("path").attr("d", path);
		    group.selectAll("circle.stop").attr("cx", function(d) {
		        return projection(d.geometry.coordinates)[0] 
		    });
		    group.selectAll("circle.stop").attr("cy", function(d) {
		        return projection(d.geometry.coordinates)[1] 
		    });
		    // important! assigns the new scale to the zoom mouse behavior
		    var zoom = d3.behavior.zoom()
		       .translate(projection.translate())
		       .scale(newScale)
		       .scaleExtent([1250000,6000000])
		       .on("zoom", function() {
		       	projection.translate(d3.event.translate).scale(d3.event.scale);
		       	group.selectAll("path").attr("d", path);
		       	group.selectAll("circle.stop").attr("cx", function(d) {
		       	    return projection(d.geometry.coordinates)[0] 
		       	});
		       	group.selectAll("circle.stop").attr("cy", function(d) {
		       	    return projection(d.geometry.coordinates)[1] 
		       	});
		    });
		    group.call(zoom);
		});
    },
    
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
$(document).ready(function() {
	
	//toggles.init();
});
$(window).resize(function() {
	$("#viz svg").width($(window).width());
	$("#viz svg").height($(window).height());
});