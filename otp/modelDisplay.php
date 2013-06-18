<!DOCTYPE html>
<meta charset="utf-8">
<title>AVAIL </title>
<style>
@import url(/resources/css/bostock.css);
.model_table{
	float:left;
	padding:15px;
}
</style>

<header>
  <a href="/" rel="author">AVAIL Labs Transit Demand Model</a>
  <aside><?php echo date("D M d, Y G:i a"); ?></aside>
</header>

<h1><span id='heading_commidity'>Atlantic City</span> Transit Model Output</h1>

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
<p>How many people rode which routes from 7am to 9am in Atlanctic City.</p>
</aside>
<div id="output"></div>
<script src="../resources/js/jquery-1.9.1.min.js"></script>
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
				 displayTotals(data.totalTrips,data.totalBusTrips);
				 displayRoutes(data.routes);
				 displayTrips(data.trips);
				 displayBoardingStops(data.boarding);
				 displayAlightingStops(data.alighting);
		})
		.fail(function() { console.log("error") });
	}
	function displayRoutes(data){
		tableHead = "<table class='model_table'><tr><th>Route</th><th>Riders</th></tr><tbody>";
		tableBody = '';
		tableFoot = "</tbody></table>";
		$.each(data,function(i,d){
			tableBody += '<tr><td>'+d.route+'</td><td>'+d.count+'</td></tr>'
		});
		$('#output').append(tableHead+tableBody+tableFoot);

	}
	function displayTrips(data){
		tableHead = "<table class='model_table'><tr><th>Route</th><th>Trip</th<th>Riders</th></tr><tbody>";
		tableBody = '';
		tableFoot = "</tbody></table>";
		$.each(data,function(i,d){
			tableBody += '<tr><td>'+d.route+'</td><td>'+d.gtfs_trip_id+'</td><td>'+d.count+'</td></tr>'
		});
		$('#output').append(tableHead+tableBody+tableFoot);

	}
	function displayBoardingStops(data){
		tableHead = "<table class='model_table'><tr><th>Stop</th><th>Boarding</th></tr><tbody>";
		tableBody = '';
		tableFoot = "</tbody></table>";
		$.each(data,function(i,d){
			tableBody += '<tr><td>'+d.on_stop_id+'</td><td>'+d.count+'</td></tr>'
		});
		$('#output').append(tableHead+tableBody+tableFoot);

	}
	function displayAlightingStops(data){
		tableHead = "<table class='model_table'><tr><th>Stop</th><th>Alighting</th></tr><tbody>";
		tableBody = '';
		tableFoot = "</tbody></table>";
		$.each(data,function(i,d){
			tableBody += '<tr><td>'+d.off_stop_id+'</td><td>'+d.count+'</td></tr>'
		});
		$('#output').append(tableHead+tableBody+tableFoot);

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
    	});
	}
  
  $(function(){
    loadData(31);
  	loadModelRuns($('#zone_select').val());
  	});

    $('#zone_select').on('change',function(){
    	loadModelRuns($('#zone_select').val());
  	})

  	$('#run_select').on('change',function(){
  		$('#output').html("");
    	loadData($('#run_select').val());
  	})

</script>




