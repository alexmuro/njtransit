var model_runs = [];
$(function(){
	$.ajax({url:'../data/get/getAllModelRuns.php',
		data:{zone_id:2},
		method:'POST',
		dataType:'json',
		async:false
	})
	.done(function(data){
		model_runs = data;
		data.forEach(function(d,i){
			$('#model-select').append('<option value="'+d.id+'">'+d.id+' - '+d.name+'</option>');

		});
		updateModelInfo(269);
		loader.run();
	})
	.fail(function(e){
		console.log(e.responseText);
	});

	$("select").on('change',function(){
		busAnalyst.init($("#model-select").val(),$("#time_select").val());
		updateModelInfo($("#model-select").val());
	});
});
function updateModelInfo(id){
	model_runs.forEach(function(d,i){
		if(d.id == id){
			console.log(d.info);
			$("#model_id").html(d.info.id);
			$("#model_name").html(d.info.name);
			$("#model_season").html(d.info.season);
			$("#model_time").html(d.info.time);
			$("#model_type").html(d.info.type);
		}
	});
}
