function getStyle(cdata,color,quant)
{
var cchoice =color;
var colors =[['#F1EEF6','#ECE7F2','#D0D1E6','#A6BDDB','#74A9CF','#3690C0','#0570B0','#034E7B'],
              ['#F7FCF0','#E0F3DB','#CCEBC5','#A8DDB5','#7BCCC4','#4EB3D3','#2B8CBE','#08589E'],
              ['#66C2A5','#FC8D62','#8DA0CB','#E78AC3','#A6D854','#FFD92F','#E5C494','#B3B3B3'],
              ['#FFFFCC','#FFEDA0','#FED976','#FEB24C','#FD8D3C','#FC4E2A','#E31A1C','#B10026'],
              ['#FFF7F3','#FDE0DD','#FCC5C0','#FA9FB5','#F768A1','#DD3497','#AE017E','#7A0177'],
              ['#FFFFFF','#F0F0F0','#D9D9D9','#BDBDBD','#969696','#737373','#525252','#252525'],
              ['#D73027','#F46D43','#FDAE61','#FEE08B','#D9EF8B','#A6D96A','#66BD63','#1A9850']];

//console.log(quant);
//console.log(pv.values(quant))
var quantile = pv.Scale.quantile()
  .quantiles(8)
  .domain(pv.values(quant));

getLegend(colors[color],quantile.quantiles());

var style = new OpenLayers.Style(
    // the first argument is a base symbolizer
    // all other symbolizers in rules will extend this one
    {
        strokeWidth: 0,
        strokeColor:'#333',
        fillColor: "#0033cc",
        fillOpacity: ".4",
    },
    // the second argument will include all rules
    {
        rules: [
            new OpenLayers.Rule({
                // a rule contains an optional filter
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.LESS_THAN,
                    property: cdata, // the "foo" feature attribute
                    value: quantile.quantiles()[1]
                }),
                // if a feature matches the above filter, use this symbolizer
                symbolizer: {
                    
                    fillColor: colors[cchoice][0]
                }
            }),
            new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.BETWEEN,
                    property: cdata,
                    lowerBoundary: quantile.quantiles()[1],
                    upperBoundary: quantile.quantiles()[2]
                }),
                symbolizer: {
                    
                    fillColor: colors[cchoice][1]
                }
            }),
            new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.BETWEEN,
                    property: cdata,
                    lowerBoundary: quantile.quantiles()[2],
                    upperBoundary: quantile.quantiles()[3]
                }),
                symbolizer: {
                    fillColor: colors[cchoice][2]
                }
            }),
            new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.BETWEEN,
                    property: cdata,
                    lowerBoundary: quantile.quantiles()[3],
                    upperBoundary: quantile.quantiles()[4]
                }),
                symbolizer: {
                    fillColor: colors[cchoice][3]
                }
            }),
            new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.BETWEEN,
                    property: cdata,
                    lowerBoundary: quantile.quantiles()[4],
                    upperBoundary: quantile.quantiles()[5]
                }),
                symbolizer: {
                    fillColor: colors[cchoice][4]
                }
            }),
             new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.BETWEEN,
                    property: cdata,
                    lowerBoundary: quantile.quantiles()[5],
                    upperBoundary: quantile.quantiles()[6]
                }),
                symbolizer: {
                    fillColor: colors[cchoice][5]
                }
            }),
            new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.BETWEEN,
                    property: cdata,
                    lowerBoundary: quantile.quantiles()[6],
                    upperBoundary: quantile.quantiles()[7]
                }),
                symbolizer: {
                    fillColor: colors[cchoice][6]
                }
            }),
            new OpenLayers.Rule({
                // apply this rule if no others apply
                elseFilter: true,
                symbolizer: {
                    fillColor: colors[cchoice][7]
                }
            })
        ]
    }
);

return new OpenLayers.StyleMap(style);
}

function getBusRouteStyle(route)
{
var routeColors =['#9E0142','#D53E4F','#F46D43','#FDAE61','#FEE08B','#FFFFBF','#E6F598','#ABDDA4','#66C2A5','#3288BD','#5E4FA2','#2D004B','#542788'];

var routes = ['89','110','117','149','150','151','152','153','155','156','157','158','159','160','160','162','163'];
 console.log(routes[0]+" "+routeColors[0])

var style = new OpenLayers.Style( 
     {
        strokeWidth: 2,
        strokeColor:'#333',
        fillColor: "#0033cc",
        fillOpacity: ".4",
    },
    // the second argument will include all rules
    {
        rules: [
            new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                    property: 'route', 
                    value: routes[0]}),
                symbolizer: {   strokeColor: routeColors[0]}}),
            new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                    property: route, 
                    value: routes[1]}),
                symbolizer: {   strokeColor: routeColors[1]}}),
            new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                    property: route, 
                    value: routes[2]}),
                symbolizer: {   strokeColor: routeColors[2]}}),
            new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                    property: route, 
                    value: routes[3]}),
                symbolizer: {   strokeColor: routeColors[3]}}),
            new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                    property: route, 
                    value: routes[4]}),
                symbolizer: {   strokeColor: routeColors[4]}}),
            new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                    property: route, 
                    value: routes[5]}),
                symbolizer: {   strokeColor: routeColors[5]}}),new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                    property: route, 
                    value: routes[6]}),
                symbolizer: {   strokeColor: routeColors[6]}}),
                new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                    property: route, 
                    value: routes[7]}),
                symbolizer: {   strokeColor: routeColors[7]}}),
                new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                    property: route, 
                    value: routes[8]}),
                symbolizer: {   strokeColor: routeColors[8]}}),
                new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                    property: route, 
                    value: routes[9]}),
                symbolizer: {   strokeColor: routeColors[9]}}),
                new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                    property: route, 
                    value: routes[10]}),
                symbolizer: {   strokeColor: routeColors[10]}}),
                new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                    property: route, 
                    value: routes[11]}),
                symbolizer: {   strokeColor: routeColors[11]}})
                ,new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                    property: route, 
                    value: routes[12]}),
                symbolizer: {   strokeColor: routeColors[12]}})
        ]
    }
);

return new OpenLayers.StyleMap(style);
}

function getDefaultStyle(type)
{
    var styles = new OpenLayers.StyleMap({
        "default": {
            strokeWidth: 1,
            strokeColor:'#fff',
            fillColor: "#fff",
            fillOpacity: ".1" 
        },
        "select": {
             strokeColor: "#fff",
             fillColor: "#fff",
            strokeWidth: 4,
            fillOpacity: ".37" 
        }
    });
    
    if(type == 'blank')
    {
      styles = new OpenLayers.StyleMap({
            "default": {
            strokeWidth: 0,
            strokeColor:'#fff',
            fillColor: "#fff",
            fillOpacity: "0" 
            }
        });
    } 

 return styles;
}

function getGTFSStyle()
{
 var styles = new OpenLayers.StyleMap({
        "default": {
            strokeWidth: 2,
            strokeColor:'#f00'
        },
        "select": {
             strokeColor: "#0f0",
            strokeWidth: 4
        }
    });
    

 return styles;
}

function getMultiStyle()
{
    var styles = new OpenLayers.StyleMap({
        "default": {
            strokeWidth: .5,
            strokeColor:'#000',
            fillColor: "#fff",
            fillOpacity: ".1" 
        },
        "select": {
             strokeColor: "#00c",
             fillColor: "#00f",
            strokeWidth: 4,
            fillOpacity: ".37" 
        }
    });
    

 return styles;
}



