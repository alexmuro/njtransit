function getCensusVariableName(keys, xmlFile){

	var retVariableNames = [];	
	$.ajax({ url:xmlFile, async:false} )
		.done(function(data) { 
				var output = [];
				$(data).find("apivariables").each(
					function (index, element){
					$(element).find("concept").each(function (index, element){
						$(element).find("variable").each(function(index, element){

							for(i in keys){
								if($(element).attr("name") == keys[i]){
									retVariableNames[keys[i]] = ($(element).attr("concept")+':'+$(element).text());
								}
							}
						});
					});

				});


				})
	.fail(function(e) { console.log(e); });

	return retVariableNames;

}