<h1 id="title">Graphing</h1>
<meta charset="utf-8">
<style>

.income_graph {
  font: 10px sans-serif;
}

.arc path {
  stroke: #fff;
}

</style>
<script src='/resources/js/d3.v3.min.js'></script>
<script src='/map_functions/getCensusVarName.js'></script>
<script>

//var url = 'http://api.census.gov/data/2010/'.$sources[0].

var vars = 'B19001_001E,B19001_002E,B19001_003E,B19001_004E,B19001_005E,B19001_006E,B19001_007E,B19001_008E,B19001_009E,B19001_010E,B19001_011E,B19001_012E,B19001_013E,B19001_014E,B19001_015E,B19001_016E,B19001_017E';
//var vars = 'B08006_001E,B08006_002E,B08006_003E,B08006_004E,B08006_005E,B08006_006E,B08006_007E,B08006_008E,B08006_009E,B08006_010E,B08006_011E,B08006_012E,B08006_013E,B08006_014E,B08006_015E,B08006_016E,B08006_017E,B08006_018E,B08006_019E,B08006_020E,B08006_021E,B08006_022E,B08006_023E,B08006_024E,B08006_025E,B08006_026E,B08006_027E,B08006_028E,B08006_029E,B08006_030E,B08006_031E,B08006_032E,B08006_033E,B08006_034E,B08006_035E,B08006_036E,B08006_037E,B08006_038E,B08006_039E,B08006_040E,B08006_041E,B08006_042E,B08006_043E,B08006_044E,B08006_045E,B08006_046E,B08006_047E,B08006_048E,B08006_049E,B08006_050E';


var source = 'acs5';
//var tracts = ["1400000US34021003705","1400000US34021003706","1400000US34021003704","1400000US34021003800","1400000US34021003904","1400000US34021003903","1400000US34021003703","1400000US34021003500","1400000US34021003602","1400000US34021003601","1400000US34021001300","1400000US34021001200","1400000US34021001102","1400000US34021001401","1400000US34021003400","1400000US34021001800","1400000US34021003100","1400000US34021003201","1400000US34021003302","1400000US34021003301","1400000US34021004204","1400000US34021004502","1400000US34021004000","1400000US34021004201","1400000US34023008601","1400000US34023008606","1400000US34023008602","1400000US34023008605","1400000US34023008604","1400000US34021004307","1400000US34021004301","1400000US34021003202","1400000US34021002903","1400000US34021002902","1400000US34021002100","1400000US34021002200","1400000US34021002800","1400000US34021001700","1400000US34021002000","1400000US34021001900","1400000US34021000900","1400000US34021001101","1400000US34021001500","1400000US34021001402","1400000US34021001600","1400000US34021001000","1400000US34021000800","1400000US34021000500","1400000US34021000700","1400000US34021000200","1400000US34021000100","1400000US34021002500","1400000US34021000300","1400000US34021000400","1400000US34021000600","1400000US34021002601","1400000US34021002602","1400000US34021003004","1400000US34021003003","1400000US34021003002","1400000US34021003009","1400000US34021003008","1400000US34021003006","1400000US34021003007","1400000US34021004310","1400000US34021003001","1400000US34021004309","1400000US34025811900","1400000US34025812502","1400000US34021002904","1400000US34021004306","1400000US34021002701","1400000US34021002702","1400000US34005701502","1400000US34005701700","1400000US34005704200","1400000US34005701401","1400000US34005701302","1400000US34005701301","1400000US34005701303","1400000US34025812000","1400000US34029717300","1400000US34005981802","1400000US34005701402","1400000US34005704302","1400000US34021004501"];

function get_data(state,county,tract,vars,source,div)
{
var key = '?key=564db01afc848ec153fa77408ed72cad68191211'
var base = 'http://api.census.gov/data/2010/'+source
var query = '&get='+vars+'&for=tract:'+tract+'&in=county:'+county+'+state:'+state;
var url = base+key+query;


var jqxhr = $.ajax(url)
    .done(function(data) { process_data(data,div)  })
    .fail(function() { console.log("error") })
    .always(function() { console.log("complete") });

}

function process_data(input,div)
{
  var output = [];
  for(i = 1; i<input[0].length-3; i++)
  {
    output.push({name: input[0][i], count: input[1][i]});
  }
    draw_donut(output,div);
}




function draw_donut(data,div){

  //console.log('draw donut')
  var width = 300,
    height = 300,
    radius = Math.min(width, height) / 2;

    var colors = [];
  var color = d3.scale.ordinal()
      .range(['#9E0142','#D53E4F','#F46D43','#FDAE61','#FEE08B','#FFFFBF','#E6F598','#ABDDA4','#66C2A5','#3288BD','#5E4FA2','#2D004B','#542788','#7E4DA4','#ccc','#5a5a5a']);

  var arc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(radius - 70);

  var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d.count; });

  svg = d3.select('#' +div+'  svg');
    if (svg.empty()){
      var svg = d3.select("#"+div).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    path = svg.selectAll("path")
      .data(pie(data))
      .enter().append("path")
      .attr("fill", function(d, i) { 
        colors.push(color(i));
        return color(i); })
      .attr("d", arc)
      .each(function(d) { this._current = d; });

      print_legend(data,div,colors);
    } 


    data.forEach(function(d) {
      d.count = +d.count;
    });

  path = svg.selectAll("path");
  path = path.data(pie(data)); // update the data
  path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs

    path.append("text")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
      .text(function(d) { return d.data.name; });
function arcTween(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
}

}

function print_legend(data,div,color)
{
  var xml = '/data/acs_5yr_2011_var.xml';
  var legend_div = div+'_legend';
  //console.log('print legend'+legend_div+data.length);
  var acs5 = [];
         var z =0;
         data.forEach(function(d) {
            if(d.name[0] == 'B'){ 
              acs5[z] = d.name;
              z++;
            } 
          });

  var acsnames = getCensusVariableName(acs5, '/data/acs_5yr_2011_var.xml');
  //console.log(acsnames);

 for(i=0; i<data.length; i++)
 {
  $('#'+legend_div).append('<div style="Float:left;background-color:'+color[i]+'; width: 10px; height: 10px;"></div>');
  $('#'+legend_div).append(acsnames[data[i].name]+'</br>'); 
  //$('#'+legend_div).append(getCensusVariableName(data[i].name, xml)+'</br>');
  }



}





</script>



<h2>Income Distrobution</h2>
<div class='graph_container' style='width:400px;height:300px;'>
<div style= "float:left;font-size:75%;" id="income_graph_legend"> </div>
<div id="income_graph" style="float:left;"> 
</div>

</div>

<!-- <h2>Transportation to Work</h2>
<div class='graph_container' style='width:400px;height:300px;'>
  <div style= "float:left;font-size:75%;" id="transport_graph_legend"></div>
<div id="transport_graph"  style="float:left;">
</div> -->

</div>