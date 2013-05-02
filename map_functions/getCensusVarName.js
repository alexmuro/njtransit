function getCensusVariableName(key, xmlFile){
	var output
	$.ajax( xmlFile )
		.done(function(data) {  
				$(data).find("apivariables").each(
				function (index, element){
					$(element).find("concept").each(function (index, element){
						$(element).find("variable").each(function(index, element){
							if($(element).attr("name") == key){
								output = $(element).text();
							}
						});
					});

				});



				})
		.fail(function(e) { console.log(e); });
		return output
}