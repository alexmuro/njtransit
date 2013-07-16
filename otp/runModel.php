<?php
	include '../config/db.php';
	class transitModel
	{
		public $id= 1,
    	 $market_area =1,
    	 $name = 'Untitiled Model',
    	 $start_hour=7,
    	 $start_min =0,
    	 $end_hour=9,
    	 $end_min=59,
    	 $date='6/3/2013',
    	 $trips=array(),
    	 $totalTrips=0,
     	 $message='',
     	 $geo_type='ct',
     	 $zones = array();
     	 

     	function __construct($in_name="Untitiled Mode",$in_zone=1,$in_date='6/3/2013') {
       		if(!empty($in_name)){
       			$this->name = $in_name;
       		}
       		if(!empty($in_zone)){
       			$this->market_area = $in_zone;
       		}
       		if(!empty($in_date)){
       			$this->date = $in_date;
       		}

   		}

     	public function run(){
     		$test = new db();
			$inscon = $test->connect();

			$insert_data = "(NOW(),".$this->market_area.",'".$this->name."')";
			$sql = "INSERT into model_runs (runtime,zone_id,name) VALUES $insert_data";
			mysql_query($sql);
			$this->id = mysql_insert_id();

			$sql = "SELECT `".$this->geo_type."` from zones where id = ".$this->market_area;
			//echo "SQL=".$sql;
			$rs=mysql_query($sql) or die($sql." ".mysql_error());
			$row = mysql_fetch_assoc( $rs );
			$this->parseZones($this->zones = json_decode($row[$this->geo_type]));
     	}

     	private function parseZones($zones){
     		foreach ($zones as $index => $fips) {
     			if($index >= 0){
					$this->getTractTrips(substr($fips,9,2),substr($fips,11,3),substr($fips,14,6));
     				echo $index." ".substr($fips,9,2)." ".substr($fips,11,3)." ".substr($fips,14,6)."<br>";
				}
     		}
     	}

     	private function getTractTrips($in_state,$in_county,$in_tract){
     		$sql = "select state3 as state, county, tract, qpowst, qpowco, qpowtract, `table301-1` as total_workers, `table302-1-5` as bus_avail, `table306-8` as bus_total from  workplace_flow_data where state3 = '0$in_state' and county = '$in_county' and tract = '$in_tract'";
 			$rs=mysql_query($sql) or die($sql." ".mysql_error());
 			$data = array();
 		
 			while($row = mysql_fetch_assoc($rs)){
 				$data[] = $row;
 			}	
 			foreach ($data as $key => $tract) {
 				$this->makeTrips($tract);	
 			}
     	}

     	private function makeTrips($tract){
     		//$('#model_output').prepend('from:'+tract.tract+'-> to:'+tract.qpowtract+':#num trips:'+tract.bus_total+'<br>');
			$begin_stops =$this->getStops($tract['state'],$tract['county'],$tract['tract']);
			$end_stops = $this->getStops($tract['qpowst'],$tract['qpowco'],$tract['qpowtract']);
			
			//echo count($begin_stops)." ".count($end_stops)." ".intval($tract['bus_total']);

			//console.log('orig_stops:',begin_stops.length);
			//console.log('dest_stops:',end_stops.length);
			if(count($begin_stops) > 0 && count($end_stops) > 0 && intval($tract['bus_total']) >0){
			
				echo $tract['state'].$tract['county'].$tract['tract'].'->'.$tract['qpowst'].$tract['qpowco'].$tract['qpowtract'].'total workers '.$tract['total_workers'].' num_trips:'.$tract['bus_total'].' tips_avail:'.$tract['bus_avail'].'<br>';
				
				for($i=0;$i<$tract['bus_total']*1;$i++){
					$begin_stop =  rand(0,count($begin_stops));
					$end_stop =  rand(0,count($end_stops));
					//$('#model_output').prepend('['+begin_stops[begin_stop].lat+','+begin_stops[begin_stop].lon+']->['+end_stops[end_stop].lat+','+end_stops[end_stop].lon+']<br>');
					//$this->planTrip($begin_stops[begin_stop].lat,begin_stops[begin_stop].lon,end_stops[end_stop].lat,end_stops[end_stop].lon);
				}
			}	
     	}

		private function getStops($in_state,$in_county,$in_tract){
			$sql = "select a.stop_id, b.stop_lat as lat,b.stop_lon as lon from stop_fips as a join stops as b on a.stop_id = b.stop_id  where state = '$in_state' and county = '$in_county' and tract = '$in_tract'";
 			$rs=mysql_query($sql) or die($sql." ".mysql_error());
 			$data = array();
 			//$data['sql'] = $sql;
 			while($row = mysql_fetch_assoc($rs)){
 				$data[] = $row;
 			}
 			return $data;
		}     	

	}

	$model = new transitModel("test");
	$model->run();