function getFilter(attribute, value,type)
//if no type Equal is assumed
{   var filter;
	if(type == 'like')
    {
        filter = new OpenLayers.Filter.Logical({
        type: OpenLayers.Filter.Logical.AND,
        filters: [
            new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.LIKE,
                property: attribute,
                value: value
            })
        ]
    });
    }
    else
    {
	    filter = new OpenLayers.Filter.Logical({
            type: OpenLayers.Filter.Logical.AND,
            filters: [
                new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQAUL_TO,
                    property: attribute,
                    value: value
                })
            ]
        });
    }
    return filter;
}