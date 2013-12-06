var loader = {
	queue: [],
	push: function(fn, scope, params) {
		this.queue.push(function(){ fn.apply(scope||window, params||[]);});
	},
	run:function(){
		if (this.queue.length) this.queue.shift().call();
	}
};

var Marley = function(){
	var route_id = '505';
	function loadData(){
		
		$.ajax({url:'data/getRouteStops.php',
			data:{route_id:route_id},
			method:'POST',
			dataType:'json',
			async:false
		})
		.done(function(data){
			data.forEach(function(d,i){
				//if(i < 10) console.log(d3.time.minute(timeFormat.parse(d.start_time)));
				d.start_time_d = timeFormat.parse(d.start_time);
				d.minute = d3.time.minute(d.start_time_d);
			});
			busTrips = crossfilter(data);
			loader.run();
		})
		.fail(function(e){
			console.log(e.responseText);
		});
		
	}
	return{
		init:function(routeID){
			route_id = routeID;
			loader.push(loadData);
			loader.run();
		}
	};
};

