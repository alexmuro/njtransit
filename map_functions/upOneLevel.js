function upOneLevel()
{
 console.log('Up One Level');
 if(level == 1)
 {
 	console.log('1 --> 0');
 	map.removeLayer(activelayer);
 	map.removeLayer(selectlayer);
 	map.removeControl(selectlayerer);
 	selectlayerer.destroy();
 	
 	
 	activelayer = counties;
 	//map.zoomToExtent(activelayer.getDataExtent());
 	map.zoomTo(4);
 	quant = getLayerAttribute(activelayer,sf1var[$('#sf1').val()]);
    activelayer.styleMap = getStyle(sf1var[$('#sf1').val()],$("#color").val(),quant);
    activelayer.redraw()
    level--;
 }	
 if(level == 2)
 {
 	console.log('2 --> 1');
 	map.removeLayer(activelayer);
 	map.removeLayer(selectlayer);
 	map.removeControl(tractselectlayerer);
 	tractselectlayerer.destroy();
 	
 	activelayer = stateCounties;
 	selectlayer = countiesSelect;
 	map.zoomToExtent(activelayer.getDataExtent());
 	


 	quant = getLayerAttribute(activelayer,sf1var[$('#sf1').val()]);
    activelayer.styleMap = getStyle(sf1var[$('#sf1').val()],$("#color").val(),quant);
    activelayer.redraw()
    level--;
 }
 if(level == 3)
 {
 	console.log('3 --> 2');
 	map.removeLayer(activelayer);
 	map.removeLayer(selectlayer);
 	map.removeControl(bgselectlayerer);
 	bgselectlayerer.destroy();
 	
 	activelayer = countyTracts;
 	selectlayer = tractSelect;
 	map.zoomToExtent(activelayer.getDataExtent());
 	


 	quant = getLayerAttribute(activelayer,sf1var[$('#sf1').val()]);
    activelayer.styleMap = getStyle(sf1var[$('#sf1').val()],$("#color").val(),quant);
    activelayer.redraw()
    level--;
 }
}