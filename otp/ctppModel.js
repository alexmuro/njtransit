var transitModel = {
	id:1,
    zone:1,
    name:'',
    start_hour:7,
    start_min:0,
    end_hour:9,
    end_min:59,
    date:'6/3/2013',
    trips:[],
    totalTrips:0,
    message:'',
	run:function()
	{
		$.ajax({
				url:'../data/create/model_run.php',
				data:{zone_id:transitModel.zone,name:transitModel.name},
				method: 'POST'
				})
		.done(function(data) {
			 $('#model_output').prepend('Model Run:',data)
		  	 transitModel.id = data;  
		})
		.fail(function() { console.log("error") });

	 	url = '../data/get/getZone.php';
		
		$.ajax({
				url:url,
				data:{geo_type:'ct',current_zone:transitModel.zone},
				dataType:'json',
				method: 'POST'
				})
		.done(function(data) {
			 transitModel.getGeoData(data);  
		})
		.fail(function() { console.log("error") });
	},
	getGeoData:function(data)
	{
		$('#model_output').prepend('Total tracts:'+data.length);
		$.each(data,function(index,ct) //For each tract return getTrips
		{
			if(index >= 0){
				transitModel.getTractTrips(ct.substring(9,11),ct.substring(11,14),ct.substring(14,20));
			}
		});

	},
	getTractTrips:function(state,county,tract)
	{

		$('#model_output').prepend('county:'+county+' tract:'+tract+'<br>');
		$.ajax({url:'../data/get/getTractTrips.php',
				method:'POST',
				data:{state:state,county:county,tract:tract},
				dataType:'json'
		})
		.done(function(data)
		{
			data.forEach(function(tract){
				if(tract.bus_total*1 > 0){
					transitModel.makeTrips(tract);
				}
			})
		})
		.fail(function(e){
			console.log(e);
		});
	},
	makeTrips:function (tract)
	{
		//console.log(tract);
		$('#model_output').prepend('from:'+tract.tract+'-> to:'+tract.qpowtract+':#num trips:'+tract.bus_total+'<br>');
		begin_stops = this.getStops(tract.state,tract.county,tract.tract);
		end_stops = this.getStops(tract.qpowst,tract.qpowco,tract.qpowtract);
		$('#model_output').prepend('num_trips:'+tract.bus_total+'<br>')
		//console.log('orig_stops:',begin_stops.length);
		//console.log('dest_stops:',end_stops.length);
		if(begin_stops.length > 0 && end_stops.length > 0 && tract.bus_total*1 >0){
			for(i=0;i<tract.bus_total*1;i++){
				begin_stop =  Math.floor(Math.random() * (begin_stops.length ));
				end_stop =  Math.floor(Math.random() * (end_stops.length ));
				$('#model_output').prepend('['+begin_stops[begin_stop].lat+','+begin_stops[begin_stop].lon+']->['+end_stops[end_stop].lat+','+end_stops[end_stop].lon+']<br>');
				this.planTrip(begin_stops[begin_stop].lat,begin_stops[begin_stop].lon,end_stops[end_stop].lat,end_stops[end_stop].lon);
			}
		}	
	},
	getStops:function (state,county,tract)
	{
		var results = null;
		$('#model_output').prepend(state.substring(1),county,tract)
		$.ajax({url:'../data/get/getTractStops.php',
				method:'POST',
				data:{state:state.substring(1),county:county,tract:tract},
				dataType:'json',
				async:false
			})
			.done(function(data){
				results = data;

			})
			.fail(function(e){
				console.log(e);
			})

		return results;
	},
	planTrip:function (from_lat,from_lon,to_lat,to_lon)
	{
		var otp_url = 'http://localhost:8080/opentripplanner-api-webapp/ws/plan?';
		var trip = {};
		$.ajax({
		  type:"GET",
		  async:false,     
		  dataType: 'jsonp',
		  data:{
		  	fromPlace:from_lat+','+from_lon,
		  	toPlace:to_lat+','+to_lon,
		  	mode:'TRANSIT,WALK',
		  	min:'QUICK',
		  	maxWalkDistance:'1000',
		  	walkSpeed:'1.341',
		  	time:getRandomInt(transitModel.start_hour,transitModel.end_hour)+':'+getRandomInt(0,59)+'am',
		  	date: transitModel.date,
		  	arriveBy:'false',
		  	itinID:1,
		  	wheelchair:'false',
		  	preferredRoutes:'',
		  	unpreferredRoutes:''
		  },
		  url: otp_url,       
		  success: function(data, status) {
		   	transitModel.processTrip(data);
		  },
		 	error: function(xhr, status, e) {
		 		console.info(xhr, status, e);
		  }
		});
		
	},
	processTrip:function(data)
	{
		if(typeof data.plan.itineraries != 'undefined'){
			//this.trips.push(data.plan.itineraries[getRandomInt(0,data.plan.itineraries.length-1)]);
			$.ajax({
				url:'../data/create/model_trips.php',
				data:{run_id:transitModel.id,to:data.plan.to.geometry,from:data.plan.from.geometry,trip:data.plan.itineraries[getRandomInt(0,data.plan.itineraries.length-1)]},
				//dataType:'json',
				method: 'POST'
				})
				.done(function(data) {
			 
		  	 			$('#model_output').prepend('Inserting Trip ID:'+data+'<br>');  
				})
				.fail(function(e) { console.log(e) });

		}
	}
}


function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}