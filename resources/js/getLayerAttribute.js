
function getLayerAttribute(layer,attribute)
{
	var quant = {};
	for (var i = 0; i < layer.features.length; i++)
                {
                  quant[layer.features[i]['data']['GEO_ID']] = parseInt(layer.features[i]['data'][attribute]);
                }

    return quant;
}