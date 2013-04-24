function getLegend(colors,quantiles)
{
	
	var legendhtml = "<div id=legendContent>";
	for(var x=1; x<quantiles.length;x++)
	{
	  legendhtml += "<div class='row'>";
	  legendhtml += "<div style='width:20px;height:15px;background-color:"+colors[x-1]+";float:left;'></div>";
	  if(x == quantiles.length-1){
	  	legendhtml += "&nbsp;&nbsp;< "+addCommas(parseInt(quantiles[x]));
	  }
	  else{
	  	legendhtml += "&nbsp;&nbsp;< "+addCommas(parseInt(quantiles[x]));
	  }
	  legendhtml += "</div>";
	}
	legendhtml += "</div>";
	$('#l').html(legendhtml);
}
