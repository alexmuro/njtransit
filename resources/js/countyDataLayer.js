function countyDataLayer(dataname,dataurl,layer)
{
    var style = new OpenLayers.Style(
        // the first argument is a base symbolizer
        // all other symbolizers in rules will extend this one
        {
            strokeWidth: 1,
            strokeColor:'#333',
            fillColor: "#0033cc",
            fillOpacity: ".7",
        },
        // the second argument will include all rules
        {
            rules: [
                new OpenLayers.Rule({
                    // a rule contains an optional filter
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.LESS_THAN,
                        property: "CDATA", // the "foo" feature attribute
                        value: 10000
                    }),
                    // if a feature matches the above filter, use this symbolizer
                    symbolizer: {
                        
                        fillColor: "#0099ff"
                    }
                }),
                new OpenLayers.Rule({
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.BETWEEN,
                        property: "CDATA",
                        lowerBoundary: 10000,
                        upperBoundary: 25000
                    }),
                    symbolizer: {
                        
                        fillColor: "#0055cc"
                    }
                }),
                new OpenLayers.Rule({
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.BETWEEN,
                        property: "CDATA",
                        lowerBoundary: 25000,
                        upperBoundary: 100000
                    }),
                    symbolizer: {
                        fillColor: "#0033bb"
                    }
                }),
                new OpenLayers.Rule({
                    // apply this rule if no others apply
                    elseFilter: true,
                    symbolizer: {
                        fillColor: "#0011aa",
                    }
                })
            ]
        }
    );
    map.removeLayer(layer);
    layer.destroy;
    layer = new OpenLayers.Layer.Vector(dataname, {
        eventListeners:{
            'featureselected':function(evt){
                var feature = evt.feature;
                document.getElementById("countydata").innerHTML = "<div >County: " + feature.attributes.NAME+" "+feature.attributes.LSAD +" <br>Geo ID: " + feature.attributes.GEO_ID+" <br>Pop: " + addCommas(feature.attributes.CDATA)+"</div>";
            },
            'featureunselected':function(evt){
                var feature = evt.feature;
             }   
            } ,
            strategies: [new OpenLayers.Strategy.Fixed()],                
            protocol: new OpenLayers.Protocol.HTTP({
                url: dataurl,
                format: new OpenLayers.Format.GeoJSON()
            }),
            styleMap: new OpenLayers.StyleMap(style)
    });
    map.addLayer(addCounty);
}