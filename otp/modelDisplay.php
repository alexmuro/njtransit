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
Model Run
<select id ='orig_or_dest'>
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
	$.ajax({url:"/data/get/getModelOutput.php",
			data:{run_id:29},
			method:"POST"
	})
	.done(function(data) {
			 data = JSON.parse(data);
			 console.log(data);
			 displayRoutes(data.routes);
			 displayTrips(data.trips);
			 displayBoardingStops(data.boarding);
			 displayAlightingStops(data.alighting);
	})
	.fail(function() { console.log("error") });

	function displayRoutes(data){
		tableHead = "<table class='model_table'><tr><th>Route</th><th># of Riders</th></tr><tbody>";
		tableBody = '';
		tableFoot = "</tbody></table>";
		$.each(data,function(i,d){
			tableBody += '<tr><td>'+d.route+'</td><td>'+d.count+'</td></tr>'
		});
		$('#output').append(tableHead+tableBody+tableFoot);

	}
	function displayTrips(data){
		tableHead = "<table class='model_table'><tr><th>Route</th><th>Trip</th<th># of Riders</th></tr><tbody>";
		tableBody = '';
		tableFoot = "</tbody></table>";
		$.each(data,function(i,d){
			tableBody += '<tr><td>'+d.route+'</td><td>'+d.gtfs_trip_id+'</td><td>'+d.count+'</td></tr>'
		});
		$('#output').append(tableHead+tableBody+tableFoot);

	}
	function displayBoardingStops(data){
		tableHead = "<table class='model_table'><tr><th>Stop</th><th># Boarding</th></tr><tbody>";
		tableBody = '';
		tableFoot = "</tbody></table>";
		$.each(data,function(i,d){
			tableBody += '<tr><td>'+d.on_stop_id+'</td><td>'+d.count+'</td></tr>'
		});
		$('#output').append(tableHead+tableBody+tableFoot);

	}
	function displayAlightingStops(data){
		tableHead = "<table class='model_table'><tr><th>Stop</th><th># Alighting</th></tr><tbody>";
		tableBody = '';
		tableFoot = "</tbody></table>";
		$.each(data,function(i,d){
			tableBody += '<tr><td>'+d.off_stop_id+'</td><td>'+d.count+'</td></tr>'
		});
		$('#output').append(tableHead+tableBody+tableFoot);

	}
  
  $(function(){
    $('select').on('change',function(){
    	console.log('t');
  	})
})
</script>




