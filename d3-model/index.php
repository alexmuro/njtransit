<!DOCTYPE html>
<!-- 
	Based on Urban Data Challenge 2013 Submission by Raymon Sutedjo-
	The Transit Quality and Equity - http://ray-mon.com/ &
	http://urbanprototyping.org/prototype/challenges/urban-data-challenge-zurich-sf-geneva/transit-quality-and-equity/
 -->
<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<!-- Meta Data -->
	<meta name="description" content="description">
	<meta name="keywords" content="keywords">
	
	<!-- Cascading Style Sheets -->
	<link href="./index_files/font.css" rel="stylesheet" type="text/css">
	<link rel="stylesheet" type="text/css" href="./index_files/style.css">
	<link rel="stylesheet" href="../resources/css/leaflet.css" />
	
	<!-- Javascript Includes -->
	<script type="text/javascript" src="../resources/js/jquery-1.9.1.min.js"></script><style type="text/css"></style>
	<script type="text/javascript" src="../resources/js/d3.v3.min.js"></script>	
	<script type="text/javascript" src="../resources/js/colorbrewer.js"></script>
	<script type="text/javascript" src="../resources/js/Tangle-0.1.0/Tangle.js"></script>

    <!-- TangleKit (optional) -->
    <link rel="stylesheet" href="../resources/js/Tangle-0.1.0/TangleKit/TangleKit.css" type="text/css">
    <script type="text/javascript" src="../resources/js/Tangle-0.1.0/TangleKit/mootools.js"></script>
    <script type="text/javascript" src="../resources/js/Tangle-0.1.0/TangleKit/sprintf.js"></script>
    <script type="text/javascript" src="../resources/js/Tangle-0.1.0/TangleKit/BVTouchable.js"></script>
    <script type="text/javascript" src="../resources/js/Tangle-0.1.0/TangleKit/TangleKit.js"></script>

	<script src="../resources/js/leaflet0.6.4.js"></script>
	<script type="text/javascript" src="index_files/script.js"></script>
	<script type="text/javascript" src="index_files/tangle-legend.js"></script>
	
	<title>AVAIL Transit Demand Modeling</title>
</head>

<body>

<div id="viz"></div>

<div id="loading">loading</div>


<div id="info"></div>
<div id="coords"></div>


<div id="legend">
	<h2><a href="#" class="closed">Legend</a></h2>
	<div id="legend-detail">
		<ul>
			<li><svg width="20" height="20"><path d="M0 10 L20 10 Z" stroke="#2C7BC9" stroke-width="2"></path></svg><span>route<span></span></span></li>
			<li><svg width="20" height="20"><circle cx="10" cy="10" r="7" fill="#ED3A2D" class='legend_circle'></circle></svg><span>stop</span></li>
		</ul>
		<hr>
		<ul>
			<li>
				<svg width="170" height="30" class='stopLegend'>
					<circle class='legend_circle' cx="3" cy="15" r="3" fill="#ED3A2D"></circle>
					<circle class='legend_circle' cx="155" cy="15" r="15" fill="#ED3A2D"></circle>
				</svg>
				<span class="c-01">less people<br><span class="stops_legend"></span></span>
				<span class="c-02">more people<br><span class="stops_legend" style="float:right;"></span></span>
			</li>
		</ul>
		<hr>
		<div id="choro_legend">
		</div>
		<!-- <hr>
			Color Scale : <select id="colorbrews"></select> 
		-->
	</div>
</div>
<div id="info-tab">
	<h2><a href="#" class="closed">Model Info</a></h2>
	<div id="info-detail"></div>
</div>
	
<div id="container">

	<h1>
		<select id="zone-select">
			<option value=0>Newark</option>
			<option value=1>Paterson</option>
			<option value=2 selected>Atlantic City</option>
			<option value=3>Philadelphia</option>
			<option value=4>Princeton</option>
		</select>
	</h1>
	
	<div id="content">

		<h2>Demographic Data</h2>
		<ul id="economic">
			<li><a href="#" id="toggle-tracts" >Display Census Tracts</a></li>
			<li>
				<center>
					<select id="tracts-select" class='inverse-select'>
						<option value="P0010001" selected>Total Population</option>
						<OPTGROUP LABEL="Race">
							<option value="P0030002" >White Population</option>
							<option value="P0030003" >Black Population</option>
							<option value="P0030005" >Asian Population</option>
						</optgroup>
						<optgroup LABEL = "Employment">
							<option value="B23025_001E">Total Workers</option>
							<option value="B23025_002E">Employed Workers</option>
						</optgroup>
						<optgroup LABEL = "Transportation to Work">
							<option value="B08006_001E">Total Commuters</option>
							<option value="B08006_002E">Car, truck, or van</option>
							<option value="B08006_003E">Drove alone</option>
							<option value="B08006_004E">Carpooled</option>
							<option value="B08006_008E">Public transportation</option>
							
						</optgroup>
						<optgroup LABEL = "LEHD (O-D ES)">
							<option value="inbound_transit">Inbound Transit</option>
							<option value="outbound_transit">Outbound Transit</option>
						</optgroup>
					</select>
				</center>
			</li>
		</ul>

		<hr>
		<h2>Origin Destination Data</h2>
			<center>
				<p id="od_label" >Click to load OD points.</p>
				<svg width="130" height="30" class="stopLegend">
					<rect x="2" y="2" width="25" height="25" fill="#FF7F00" id="so" class="hidden"/>
					<rect x="32" y="2" width="25" height="25" fill="#FF7F00" id="sd" class="hidden"/>
					<rect x="62" y="2" width="25" height="25" fill="#FF7F00" id="mo" class="hidden"/>
					<rect x="92" y="2" width="25" height="25" fill="#FF7F00" id="md" class="hidden"/>
					<circle class="od_circle" cx="15" cy="15" r="10" fill="#E41A1C" color="#E41A1C" on="0"sel="so" text="Survey Origins"></circle>
					<circle class="od_circle" cx="45" cy="15" r="10" fill="#377EB8" color="#377EB8" on="0" sel="sd" text="Survey Destinations"></circle>
					<circle class="od_circle" cx="75" cy="15" r="10" fill="#4DAF4A" color="#4DAF4A" on="0" sel="mo" text="Model Origins"></circle>
					<circle class="od_circle" cx="105" cy="15" r="10" fill="#984EA3" color="#984EA3" on="0" sel="md" text="Model Destinations"></circle>

				</svg>
			</center>
		<hr>
		<h2>Display Stops by</h2>
			<center>
			<h2>
				<select id="stops-select" class='inverse-select'>
					<option value="on_count" >Boarding</option>
					<option value="off_count" selected>Alighting</option>
				</select>
			</h2>
			</center>
		<hr>
		<h2>Routes</h2>
		<ul id='routes'>
		</ul>

	</div>		

</div>
<script type="text/javascript">
	$(document).ready(function() {

		$('#zone-select').val(<?php echo intval($_GET['ma']);?>);
    	$.ajax({url:'../data/get/getZoneforD3.php',data:{zone:<?php echo intval($_GET['ma']);?>},aync:false,dataType:'json',method:"POST"})
    	.done(function(data){
    		viz.zone = $('#zone-select').val();
    		viz.model_run = <?php echo intval($_GET['mr']);?>;
    		viz.centroid = JSON.parse(data.centroid);
    		viz.njtransit();
    	})
    	.fail(function(e){
    		console.log(e.responseText);
    	})

		$(".stops_legend").html($("#stops-select").find(":selected").text())
		$("#stops-select").on('change',function(){
			$(".stops_legend").html($("#stops-select").find(":selected").text())
			viz.stops.stopsBy = $("#stops-select").val();
			if(viz.stops.stopsBy == 'off_count'){
					 $('.legend_circle').css('fill','#ED3A2D');
				}else{
					$('.legend_circle').css('fill','#89ca27');
				}
			viz.stops.visualize();
			
		});

		viz.tracts.brewer.forEach(function(d,i){

  			$('#colorbrews')
		         	.append($("<option></option>")
		         	.attr("value",i)
		         	.text(d));

  		});

		$("#tracts-select").on('change',function(){
			//console.log()
			viz.tracts.symbol = $("#tracts-select").val();
			viz.tracts.changeSymbol();
			
		});

		$('.od_circle').on('mouseover',function(){
			$("#od_label").html($(this).attr("text"));
			$(this).attr("fill","#00f");

		});
		$('.od_circle').on('mouseout',function(){
			
			$("#od_label").html("Click to load OD points.");
			$(this).attr("fill",$(this).attr("color"));

		})
		$('.od_circle').on('click',function(){
			if($(this).attr("on") === "0"){
				$(this).attr("on","1");
				if($(this).attr("sel") == "so"){
					if($(this).attr("loaded") == 1){
						$('.so_dot').show();
					}else{
						viz.od.drawSurveyOrigins();
						$(this).attr('loaded',1);
					}
				}else if($(this).attr("sel") == "sd"){
					if($(this).attr("loaded") == 1){
						$('.sd_dot').show();
					}else{
						viz.od.drawSurveyDestinations();
						$(this).attr('loaded',1);
					}
				}else if($(this).attr("sel") == "mo"){
					if($(this).attr("loaded") == 1){
						$('.mo_dot').show();
					}else{
						viz.od.drawModelOrigins();
						$(this).attr('loaded',1);
					}
				}else if($(this).attr("sel") == "md"){
					if($(this).attr("loaded") == 1){
						$('.md_dot').show();
					}else{
						viz.od.drawModelDestinations();
						$(this).attr('loaded',1);
					}
				}


				$('#'+$(this).attr("sel")).show();
			}else{
				$(this).attr("on","0");
				if($(this).attr("sel") == "so"){
					$('.so_dot').hide();
				}else if($(this).attr("sel") == "sd"){
					$('.sd_dot').hide();
				}else if($(this).attr("sel") == "mo"){
					$('.mo_dot').hide();
				}else if($(this).attr("sel") == "md"){
					$('.md_dot').hide();
				}
				$('#'+$(this).attr("sel")).hide();
			}

		})





		

	});
</script>
</body>
</html>