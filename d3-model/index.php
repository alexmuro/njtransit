<!DOCTYPE html>
<!-- saved from url=(0055)http://ray-mon.com/urbandatachallenge/sanfrancisco.html -->
<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	
	<meta name="description" content="description">
	<meta name="keywords" content="keywords">
	<link href="./index_files/font.css" rel="stylesheet" type="text/css">
	<link rel="stylesheet" type="text/css" href="./index_files/style.css">
	<script type="text/javascript" src="../resources/js/jquery-1.9.1.min.js"></script><style type="text/css"></style>
	<script type="text/javascript" src="../resources/js/d3.v3.min.js"></script>	
	<script src="http://d3js.org/d3.geo.tile.v0.min.js"></script>
		
	<script type="text/javascript" src="index_files/script.js"></script>
	
	<title>AVAIL Transit Demand Modeling</title>
</head>

<body>

<div id="viz"></div>

<div id="loading" style="display: none;">loading</div>

<div id="zoom">
	<a id="zoom-in" href="#"><img src="./index_files/zoom-in.png" alt="zoom in" width="30" height="30"></a>
	<a id="zoom-out" href="#"><img src="./index_files/zoom-out.png" alt="zoom out" width="30" height="30"></a>
</div>

<div id="info"></div>
<div id="coords"></div>


<div id="legend">
	<h2><a href="#" class="closed">Legend</a></h2>
	<div id="legend-detail">
		<ul>
			<li><svg width="20" height="20"><path d="M0 10 L20 10 Z" stroke="#2C7BC9" stroke-width="2"></path></svg><span>route<span></span></span></li>
			<li><svg width="20" height="20"><circle cx="10" cy="10" r="7" fill="#ED3A2D"></circle></svg><span>stop</span></li>
		</ul>
		<hr>
		<ul>
			<li>
				<svg width="170" height="30">
					<circle cx="3" cy="15" r="3" fill="#ED3A2D"></circle>
					<circle cx="155" cy="15" r="15" fill="#ED3A2D"></circle>
				</svg>
				<span class="c-01">less frequent<br>service</span>
				<span class="c-02">more frequent<br>service</span>
			</li>
		</ul>
		<hr>
		<ul>
			<li>
				<svg width="170" height="10">
					<rect width="170" height="10" fill="url(#gradient)"></rect>
					<defs>
						<lineargradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
							<stop offset="0%" style="stop-color:#ED3A2D;"></stop>
							<stop offset="100%" style="stop-color:#2e0101"></stop>
						</lineargradient>
					</defs>
				</svg>
				<span class="c-01">shorter<br>delay<br>(0 min.)</span>
				<span class="c-02">longer<br>delay<br>(15+ min.)</span>
			</li>
		</ul>
		<hr>
		<h3>Poverty Level</h3>
		<ul>
			<li><svg width="20" height="20"><rect width="300" height="100" fill="#EAF5DA"></rect></svg><span>&lt;= 5% of residents</span></li>
			<li><svg width="20" height="20"><rect width="300" height="100" fill="#CFE8AC"></rect></svg><span>5.01 - 10% of residents</span></li>
			<li><svg width="20" height="20"><rect width="300" height="100" fill="#9FC961"></rect></svg><span>10.01 - 15% of residents</span></li>
			<li><svg width="20" height="20"><rect width="300" height="100" fill="#7CAD34"></rect></svg><span>15.01 - 20% of residents</span></li>
			<li><svg width="20" height="20"><rect width="300" height="100" fill="#64961B"></rect></svg><span>20.01 - 25% of residents</span></li>
			<li><svg width="20" height="20"><rect width="300" height="100" fill="#41660A"></rect></svg><span>&gt; 25% of residents</span></li>
		</ul>
	</div>
</div>
	
<div id="container">

	<h1>
		<select id="zone-select">
			<option value=0>Newark</option>
			<option value=1>Patterson</option>
			<option value=2 selected>Atlantic City</option>
			<option value=3>Philedelphia</option>
			<option value=4>Princeton</option>
		</select>
	</h1>
	
	<div id="content">

		<h2>Demographic Data</h2>
		<ul id="economic">
			<li><a href="#" id="toggle-tracts">POVERTY LEVEL &amp;<br>RACIAL BREAKDOWN</a></li>
		</ul>

		<hr>

		<h2>Display Stops by</h2>
			<h3>
				<center>
					<select id="stops-select">
						<option value="on" selected>Boarding</option>
						<option value="off">Alighting</option>
					</select>
				</center>
			</h3>
		<hr>
		<h2>Routes</h2>
		<ul id='routes'>
		</ul>

	</div>		

</div>
	
<script type="text/javascript">
	$(document).ready(function() {
		$("#stops-select").on('change',function(){
			viz.stopsBy = $("#stop-select").val();
			loader.push(viz.njtransit.stops.preload);
			loader.push(viz.njtransit.stops.load);
			loader.run();
		});

		$('#zone-select').val(<?php echo intval($_GET['ma']);?>);
    	$.ajax({url:'../data/get/getZoneforD3.php',data:{zone:<?php echo intval($_GET['ma']);?>},aync:false,dataType:'json',method:"POST"})
    	.done(function(data){
    		console.log(data);
    		viz.zone = $('#zone-select').val();
    		viz.model = <?php echo intval($_GET['mr']);?>;
    		viz.centroid = JSON.parse(data.centroid);
    		viz.njtransit();
    	})
    	.fail(function(e){
    		console.log(e.responseText);
    	})

	});
</script>



</body></html>