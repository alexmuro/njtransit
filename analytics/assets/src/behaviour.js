$(function(){
	$.ajax({url:'../data/get/getAllModelRuns.php',
		data:{zone_id:2},
		method:'POST',
		dataType:'json',
		async:false
	})
	.done(function(data){
		console.log('model runs',data);
		data.forEach(function(d,i){
			$('#model-select').append('<option value="'+d.id+'">'+d.id+' - '+d.name+'</option>');
		});
		loader.run();
	})
	.fail(function(e){
		console.log(e.responseText);
	});

	$("#model-select").on('change',function(){
		busAnalyst.init($("#model-select").val());
	});
});