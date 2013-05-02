
function getLayerAttribute(layer,attribute)
{
	var quant = {};
	for (var i = 0; i < layer.features.length; i++)
	  {  	
    	if(attribute == 'num_trips'){
      	quant[layer.features[i]['data']['route']] = parseInt(layer.features[i]['data'][attribute]);
    	 	}
  		else{
	  		//for taz file rendering
	  		//quant[layer.features[i]['data']['TAZ2008']] = parseInt(layer.features[i]['data'][attribute]);
 		
	  		quant[layer.features[i]['data']['GEO_ID']] = parseInt(layer.features[i]['data'][attribute]);
	  	}
	  }

    return quant;
}