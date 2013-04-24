<script>
 $(document).ready(function() {

$("#test").click(function()
	{
		console.log($("#file_select").attr('value'));
		console.log(map.getLayersByName($("#file_select").attr('value'))[0].getDataExtent());
		map.zoomToExtent(map.getLayersByName($("#file_select").attr('value'))[0].getDataExtent())
	});

$("#file_select").change(function() 
	{
		var layerurl = 'data/load/getGTFSshapes.php?route='+$(this).val();
		console.log(layerurl);
		var newLayer = new OpenLayers.Layer.Vector($(this).attr('value'), {
		                    strategies: [new OpenLayers.Strategy.Fixed()],                
		                    protocol: new OpenLayers.Protocol.HTTP({
		                        //url: "test.json",
		                        url: layerurl,
		                        format: new OpenLayers.Format.GeoJSON()
		                    }),
		                    //styleMap: styles,
		                    //renderers: ["Canvas", "SVG", "VML"]
		                });        
		map.addLayer(newLayer);
		map.raiseLayer(newLayer, map.layers.length);
		console.log(newLayer.getDataExtent()); 
		//map.zoomToExtent(newLayer.getDataExtent());

		$(".layer_listing").click(function()
		{
			console.log('layer clicked');
			console.log($(this).attr('value'));
			var layerurl = "../models/getLayerGeoJSON.php?layer="+ $(this).attr('value');

			if(!$(this).hasClass('added'))
			{
				$(this).addClass('added');
				console.log('add class');
				var newLayer = new OpenLayers.Layer.Vector($(this).attr('value'), {
		                    strategies: [new OpenLayers.Strategy.Fixed()],                
		                    protocol: new OpenLayers.Protocol.HTTP({
		                        //url: "test.json",
		                        url: layerurl,
		                        format: new OpenLayers.Format.GeoJSON()
		                    }),
		                    styleMap: styles,
		                    renderers: ["Canvas", "SVG", "VML"]
		                });
		        
					map.addLayer(newLayer);
					console.log(newLayer.getDataExtent());
			}
			else
			{
				$(this).removeClass('added');
				console.log(map.getLayersByName($(this).attr('value')));
				console.log(map.getLayersByName($(this).attr('value'))[0].getDataExtent());
				//map.zoomToExtent(map.getLayersByName($(this).attr('value'))[0].getDataExtent());
				map.removeLayer(map.getLayersByName($(this).attr('value'))[0]);
				//console.log('remove class');
			}
		});//layerlisting on click

 	});//file select on change
});
</script>
<style>
.added{
	color:#000;
	background-color: #ccc;
}
</style>
<?php

	$data = new db();
	$inscon = $data->connect();

	$sql = "select route_id,route_short_name from routes";
	$rs = $data->do_query($sql);?>
	<h1>GTFS Routes</h1>
	<div id='left_control'>
		Select Map:
		<select id='file_select'>
		<?php
		while ( $row = mysql_fetch_assoc( $rs )) {
			$id = $row['route_id'];
			$name = $row['route_short_name'];
			echo "<option value ='$id'>$id - $name</option>";      
		      
		    }
		?>
			</select>

		<div id="file_listing">
		</div>
		<button id='test'>Run</button>
	</div>	
?>