<?php
	ini_set("memory_limit","1024M");
	ini_set('max_execution_time', 300);

	$xml_input = file_get_contents('../acs_5yr_2011_var.xml');
	//$xml_input = file_get_contents('../sf1.xml');
	$p = xml_parser_create();
	xml_parse_into_struct($p, $xml_input, $vals, $index);
	xml_parser_free($p);
	//echo "Values : ".count($vals). " Indexes : ".count($index)."<br>";
	//print_r($index);
	
display_concept(20573,$vals);
print_values($vals);

function display_concept($index,$array){
	$i = $index;
	print_r($array[$i]);
	echo "<br>";
	while(!($array[$i]['tag'] == 'CONCEPT' && $array[$i]['type'] == 'close')){
		if($array[$i]['tag'] == 'VARIABLE'){
			echo $array[$i]['attributes']['NAME']." ".$array[$i]['value']."<br>";
		}
		echo "<br>";
		$i++;
	}
}

function print_values($array){
	$num_concepts = 0;
	for($i=0;$i<count($array);$i++){
		//echo 'hello'.$i;
		  // print_r($vals[$i]);
		  // echo "<br>";

	 	if($array[$i]['tag'] == 'CONCEPT' && $array[$i]['type'] == 'open'){
		 	echo $array[$i]['attributes']['NAME']." [$i] <br>";
		 	$num_concepts++;
		}
	}
	echo "Number of Concepts:". $num_concepts;
}

