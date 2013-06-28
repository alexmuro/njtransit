<!DOCTYPE html>
<meta charset="utf-8">
<title>AVAIL </title>
<style>
@import url(/resources/css/bostock.css);
@import url(/resources/css/jquery.dataTables.css);
@import url(/resources/css/TableTools.css);
.model_table{
	float:left;
	padding:15px;
}
</style>

<header>
  <a href="/" rel="author">AVAIL Labs Transit Demand Model</a>
  <aside><?php echo date("D M d, Y G:i a"); ?></aside>
</header>

<h1><span class='zone_title'></span> Transit Model Output</h1>

<aside>
<p>
<br>
Zone
<select id ='zone_select'>
  <option value="0">Newark</option>
  <option value="1">Patterson</option>
  <option value="2" selected>Atlantic City</option>
  <option value="3" >Greater Philadelphia</option>
  <option value="4" >Princeton</option>  	
</select>


Model Run
<select id='run_select'>
  <option value="29">29</option>
  <option value="dest_fips">Incoming Flows</option>
</select>

<br>
<p>How many people rode which routes from 7am to 9am in <span class='zone_title'></span>.</p>
</aside>
<div id="output"></div>
<script src="../resources/js/jquery-1.9.1.min.js"></script>
<script type="text/javascript" src="../resources/js/jquery.dataTables.min.js"></script>
<script src='../resources/js/TableTools.min.js'></script>
<script>
	console.log('starting');
	function loadData(run){
		$.ajax({url:"/data/get/getModelOutput.php",
				data:{run_id:run},
				method:"POST",
				dataType:'json'
		})
		.done(function(data) {
	
				 console.log(data);
				 displayCombinedRoutes(combineRoutesTrips(data.routes,data.trips));
				 displayStops(combineStops(data.boarding,data.alighting));


		})
		.fail(function(e) { console.log(e.responseText) });
	}

	function combineStops(boarding,alighting){
		boarding.forEach(function(on_stops){
		//	console.log("Route:",route);
			on_stops.off_stop_count = '0';
			alighting.forEach(function(off_stops,index){
				if(on_stops.on_stop_id == off_stops.off_stop_id){
		//			console.log('Trip',trip,index);
					on_stops.off_stop_count = off_stops.count;
					alighting.splice(index, 1);
				}
			})
		})
		console.log(boarding);
		return boarding;
	}	

	function combineRoutesTrips(routes,trips){
		routes.forEach(function(route){
		//	console.log("Route:",route);
			route.trips = [];
			trips.forEach(function(trip,index){
				if(trip.route == route.route){
		//			console.log('Trip',trip,index);
					route.trips.push(trip);
					trips.splice(index, 1);
				}
			})
		})
		//console.log(routes);
		return routes;
	}

	function displayCombinedRoutes(data){
		tableHead = "<div class='model_table'><h2>Passengers By Route & Trip Id</h2><table id='routes_table'  width='750px'><thead><tr><th>Route</th> <th>Trip</th><th>#</th></tr></thead><tbody>";
		tableBody = '';
		tableFoot = "</tbody></table></div>";
		total = 0;
		$.each(data,function(index,route){
			tableBody += '';
			tableBody += '';
			route_total = 0;
			$.each(route.trips,function(i,trip){
				tableBody += '<tr><td>'+route.route+'</td><td>'+trip.gtfs_trip_id+'</td><td>'+trip.count+'</td></tr>';
				route_total += trip.count*1;
			});
			tableBody += '<tr><td>'+route.route+' </td><td> Total</td><td>'+route_total+'</td></tr>';
			total += route_total;			
		});
		tableBody += '<tfoot><tr><th colspan = 2>Total Trips</th><th>'+total+'</th></tr></tfoot>';
			
		$('#output').append(tableHead+tableBody+tableFoot);
		$('#routes_table').dataTable({"sDom": 'T<"clear">lfrtip',"oTableTools": {"sSwfPath": "../resources/swf/copy_csv_xls_pdf.swf"}});

	}
	function displayStops(data){

		tableHead = "<div class='model_table'><h2>Boarding and Alighting by Stop Id</h2><table id='stops_table' width='750px'><thead><tr><th>Stop</th><th>Boarding</th><th>Alighting</th></tr></thead><tbody>";
		tableBody = '';
		tableFoot = "</tbody></table></div>";
		boarding_total = 0;
		alighting_total = 0;
		$.each(data,function(i,d){
			tableBody += '<tr><td>'+d.on_stop_id+'</td><td class="number_cell">'+d.count+'</td><td class="number_cell">'+d.off_stop_count+'</td></tr>';
			boarding_total += d.count*1;
			alighting_total += d.off_stop_count*1;
		});
		//tableBody += '<tfoot><tr><th>Totals </th><th>'+boarding_total+'</th><th>'+alighting_total+'</th></tr></tfoot>';
		$('#output').append(tableHead+tableBody+tableFoot);
		$('#stops_table').dataTable({"sDom": 'T<"clear">lfrtip',"oTableTools": {"sSwfPath": "../resources/swf/copy_csv_xls_pdf.swf"}});

	}
	
	function displayTotals(totalTrips,totalBusTrips){
		$('#output').append(totalTrips[0].count+' people took '+totalBusTrips[0].count+' tranist trips.<br>');
	}
	function loadModelRuns(zone){
		$('#run_select')
    	.find('option')
    	.remove()
    	.end();

		$.ajax({url:'/data/get/getModelRuns.php',data:{zone_id:zone},method:'POST',dataType:'json'})
  		.done(function(data){
  			
  			$('#run_select')
		         .append($("<option></option>")
		         .attr("value",0)
		         .text('-')); 	
  			$.each(data.zones,function(i,d){
		  		$('#run_select')
		         .append($("<option></option>")
		         .attr("value",d.id)
		         .text(d.id)); 
    		});
    	})
    	.fail(function(e) { console.log(e.responseText) });
	}
  
  $(function(){
    loadData(31);
  	loadModelRuns($('#zone_select').val());
  	$('.zone_title').html($('#zone_select').find(":selected").text());
  	});

    $('#zone_select').on('change',function(){
    	$('.zone_title').html($('#zone_select').find(":selected").text());
    	loadModelRuns($('#zone_select').val());
  	})

  	$('#run_select').on('change',function(){
  		$('#output').html("");
    	loadData($('#run_select').val());
  	})

</script>




