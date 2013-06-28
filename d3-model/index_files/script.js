/* 

FUNCTIONS

1. 	loader
2. 	viz
	a. 	sanfrancisco()
	b. 	zurich()
	c. 	geneva()
3. 	popup
4.	toggles

*/


//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
var loader = { 
	queue: [],
	push: function(fn, scope, params) { 
		this.queue.push(function(){ fn.apply(scope||window, params||[]); }); 
	},
	run: function() { 
		if (this.queue.length) this.queue.shift().call(); 
	}
};

//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
var viz = {
	zone:2,
	model_run:31,
    //----------------------------------------------------------------------------------------------------------
   	njtransit  : function() {

	    // clean viz div
	    $("#viz").html("");

		// set variables
		var lonlat = [-74.465093,39.349667];
		var width = $(window).width();
		var height = $(window).height();
		var center = {
			x: width/2,
			y: height/2
		};

		// stop id: # of stop points & avg delay
		//var stopsData = {"390":[3537,2.22],"913":[543,3.95],"3008":[859,3.17],"3012":[416,4.30],"3018":[416,2.00],"3019":[337,4.10],"3026":[11,0.15],"3034":[1081,2.82],"3035":[914,1.53],"3041":[46,-0.03],"3051":[1084,3.07],"3052":[905,1.72],"3057":[1099,3.03],"3058":[910,1.55],"3070":[42,3.77],"3071":[77,1.75],"3089":[431,2.23],"3093":[1467,2.97],"3094":[127,0.25],"3095":[887,5.90],"3103":[49,2.20],"3104":[59,6.92],"3136":[44,5.17],"3137":[3304,2.60],"3141":[3163,1.72],"3144":[1208,3.05],"3161":[136,4.85],"3163":[2148,2.42],"3164":[181,4.93],"3165":[50,3.52],"3182":[107,0.30],"3183":[602,2.08],"3184":[1031,3.80],"3185":[893,0.43],"3196":[709,4.23],"3197":[702,3.05],"3203":[808,3.38],"3208":[794,3.33],"3209":[112,3.58],"3214":[2703,2.57],"3215":[3360,2.13],"3238":[831,2.28],"3244":[1348,2.82],"3245":[1370,3.82],"3247":[1416,1.87],"3254":[476,3.32],"3255":[687,2.23],"3281":[2162,2.30],"3282":[2512,3.37],"3291":[1531,2.08],"3293":[1681,3.45],"3295":[1663,1.55],"3296":[1590,3.22],"3311":[1835,6.07],"3313":[414,1.27],"3317":[1658,1.47],"3325":[738,5.15],"3326":[791,4.35],"3338":[733,3.32],"3352":[1073,2.00],"3356":[3158,3.75],"3358":[662,5.45],"3370":[2746,4.37],"3371":[1448,3.83],"3390":[1429,3.57],"3391":[1466,2.08],"3406":[384,3.13],"3410":[3503,1.90],"3411":[1179,3.78],"3435":[607,1.80],"3439":[684,4.28],"3450":[686,4.13],"3462":[676,3.05],"3463":[702,2.58],"3476":[2297,3.32],"3477":[704,3.93],"3511":[1557,3.15],"3540":[1855,1.22],"3541":[1432,3.23],"3545":[1191,1.18],"3557":[21,-0.13],"3558":[544,1.57],"3559":[1344,1.20],"3560":[609,1.33],"3576":[534,0.95],"3577":[646,2.63],"3604":[641,2.22],"3606":[542,1.28],"3608":[3253,2.02],"3611":[868,3.68],"3612":[802,4.90],"3621":[412,3.43],"3622":[318,2.05],"3629":[72,3.92],"3636":[781,1.57],"3648":[746,6.52],"3693":[878,4.18],"3695":[1397,4.20],"3696":[1129,2.23],"3703":[745,1.90],"3706":[2417,3.65],"3718":[882,1.77],"3719":[665,5.55],"3725":[1195,2.10],"3730":[915,2.07],"3731":[839,6.23],"3746":[889,1.05],"3747":[842,6.68],"3754":[1097,2.65],"3772":[3021,3.05],"3778":[703,3.82],"3779":[736,1.33],"3815":[90,-2.22],"3824":[1577,1.03],"3825":[1411,0.52],"3826":[1873,0.88],"3827":[53,0.83],"3832":[53,0.90],"3860":[1555,0.73],"3861":[56,-0.87],"3862":[118,1.32],"3867":[726,2.92],"3868":[631,3.27],"3886":[23,0.82],"3887":[50,1.02],"3890":[744,3.13],"3891":[644,2.30],"3892":[2478,1.15],"3893":[2341,1.23],"3912":[1615,8.72],"3913":[1375,6.52],"3927":[2827,2.93],"3935":[1752,4.80],"3941":[3220,2.85],"3942":[1610,0.90],"3956":[123,-1.47],"3957":[287,0.92],"3986":[69,6.62],"3995":[705,6.75],"3996":[833,2.18],"4000":[905,2.43],"4005":[113,2.13],"4008":[1684,3.40],"4015":[3554,0.80],"4017":[18,-0.40],"4026":[1725,1.50],"4027":[1730,1.60],"4028":[2014,1.22],"4087":[653,1.77],"4110":[594,1.32],"4111":[1336,3.28],"4119":[1076,4.20],"4120":[3344,2.12],"4131":[698,2.60],"4132":[802,4.35],"4148":[1642,2.53],"4155":[1549,1.12],"4202":[332,0.80],"4224":[792,2.45],"4229":[1470,3.38],"4230":[1548,2.78],"4269":[101,2.60],"4270":[68,0.72],"4277":[2918,1.25],"4278":[2292,2.72],"4279":[2306,1.62],"4295":[2749,1.25],"4296":[3011,2.43],"4314":[1398,1.90],"4315":[1387,2.00],"4326":[1434,1.73],"4327":[1421,1.88],"4341":[3799,3.55],"4347":[489,1.75],"4350":[428,-0.77],"4356":[688,2.95],"4367":[316,5.88],"4369":[231,2.47],"4386":[1056,3.30],"4387":[1092,2.60],"4394":[403,4.20],"4397":[477,3.65],"4411":[2753,2.50],"4414":[1487,2.05],"4415":[2419,2.00],"4423":[1480,1.68],"4424":[1404,1.47],"4434":[1354,2.10],"4435":[1508,1.47],"4456":[351,5.52],"4474":[801,2.15],"4475":[1011,2.88],"4476":[797,2.82],"4494":[1009,2.42],"4495":[806,2.73],"4530":[928,9.55],"4547":[1623,0.08],"4558":[703,2.97],"4564":[800,3.55],"4568":[728,1.42],"4572":[233,2.85],"4575":[403,3.10],"4580":[124,1.47],"4603":[3084,1.92],"4609":[1594,1.77],"4618":[1681,2.85],"4620":[1541,2.52],"4628":[1560,2.18],"4629":[1660,2.73],"4640":[1555,2.90],"4641":[1666,2.03],"4648":[2361,2.28],"4658":[534,2.05],"4664":[528,1.52],"4665":[433,5.68],"4677":[513,1.25],"4678":[424,5.73],"4684":[328,0.02],"4685":[393,0.33],"4687":[390,0.78],"4688":[332,1.13],"4726":[1068,6.17],"4727":[1008,7.77],"4728":[4,14.68],"4729":[2627,2.23],"4732":[1129,3.08],"4733":[1354,1.55],"4735":[299,1.07],"4748":[1217,3.47],"4749":[1412,2.08],"4755":[2826,2.32],"4756":[3050,1.80],"4757":[2760,1.87],"4758":[2777,2.13],"4759":[3008,2.07],"4768":[2730,1.77],"4776":[2344,3.07],"4777":[6,23.58],"4778":[2,21.35],"4781":[537,1.25],"4782":[1163,1.50],"4803":[1818,3.08],"4805":[1702,3.73],"4823":[2208,2.85],"4824":[277,3.65],"4826":[1209,3.77],"4843":[533,0.17],"4871":[947,5.27],"4873":[657,2.83],"4885":[1295,1.90],"4886":[2612,2.03],"4895":[896,2.02],"4898":[2,14.28],"4900":[1298,1.45],"4923":[1116,0.85],"4932":[692,1.83],"4933":[664,3.13],"4952":[1518,2.97],"4953":[1460,2.65],"4958":[1434,2.27],"4962":[746,5.92],"4963":[1469,3.65],"4968":[427,4.65],"4970":[1463,0.45],"4991":[1258,1.42],"4992":[1139,0.33],"5001":[1257,1.78],"5002":[1134,0.07],"5013":[1233,1.43],"5041":[765,3.78],"5056":[2892,3.40],"5057":[71,0.50],"5063":[342,5.62],"5064":[563,13.98],"5088":[539,14.67],"5089":[600,13.25],"5129":[629,1.78],"5130":[542,1.78],"5138":[382,3.58],"5139":[396,1.03],"5147":[818,1.63],"5156":[539,14.43],"5165":[1788,4.63],"5167":[2615,1.92],"5184":[1805,7.68],"5187":[823,2.73],"5199":[1688,9.27],"5200":[1592,5.70],"5223":[1558,5.20],"5224":[1739,9.27],"5225":[1446,5.57],"5226":[1723,2.65],"5239":[1212,10.92],"5240":[1492,5.87],"5245":[2660,2.98],"5247":[3248,3.28],"5274":[1474,3.98],"5275":[1303,2.05],"5300":[124,2.28],"5301":[134,1.13],"5309":[2155,2.80],"5331":[2807,1.42],"5334":[441,0.47],"5335":[2360,3.93],"5349":[1272,4.68],"5350":[1246,1.13],"5364":[482,10.95],"5389":[1464,3.12],"5390":[1578,2.95],"5404":[1448,2.80],"5405":[1566,2.38],"5418":[1316,6.82],"5419":[3377,5.25],"5433":[344,3.80],"5434":[1644,3.45],"5435":[1647,1.73],"5448":[1286,7.47],"5452":[619,3.50],"5471":[641,0.15],"5472":[2741,1.58],"5509":[50,2.55],"5510":[55,7.45],"5511":[1277,1.72],"5535":[1912,4.40],"5536":[1899,4.72],"5544":[1744,3.93],"5545":[1743,5.28],"5551":[2805,3.80],"5552":[2514,5.98],"5553":[840,4.90],"5565":[2766,3.32],"5566":[2531,6.42],"5571":[3334,3.30],"5572":[2628,6.17],"5574":[590,1.43],"5586":[319,5.22],"5592":[1990,4.97],"5593":[3298,3.43],"5601":[1430,3.22],"5602":[1389,5.70],"5603":[984,3.43],"5605":[693,3.27],"5619":[23,-0.40],"5620":[3142,3.65],"5621":[2793,4.93],"5631":[1788,2.72],"5633":[1354,0.52],"5641":[2958,2.85],"5642":[1504,4.38],"5643":[4986,4.37],"5648":[1511,2.43],"5650":[3454,3.12],"5656":[3554,3.70],"5657":[917,6.10],"5661":[924,8.28],"5662":[914,5.27],"5665":[525,3.47],"5667":[734,1.57],"5684":[2778,1.87],"5685":[1172,3.88],"5688":[3634,2.07],"5689":[2626,0.83],"5692":[2527,4.32],"5694":[3813,3.13],"5696":[2473,4.67],"5703":[418,2.70],"5711":[1138,2.50],"5712":[942,3.28],"5713":[890,2.53],"5728":[1965,4.62],"5764":[124,0.35],"5765":[119,1.07],"5772":[136,2.32],"5796":[866,5.02],"5817":[2965,3.12],"5818":[2963,2.93],"5828":[1581,2.63],"5852":[940,3.72],"5853":[857,2.15],"5858":[421,3.28],"5859":[1363,3.08],"5863":[2501,3.38],"5864":[1597,3.90],"5914":[331,2.72],"5922":[894,1.23],"5923":[954,4.87],"5926":[2061,2.65],"5927":[2112,3.28],"5946":[48,0.10],"5948":[1416,2.48],"5949":[1235,3.10],"5952":[48,3.32],"5953":[47,-0.63],"5997":[690,3.63],"5998":[799,3.12],"5999":[691,3.43],"6000":[802,3.20],"6010":[688,2.63],"6012":[466,0.35],"6021":[1004,1.27],"6022":[1017,1.93],"6024":[7,25.98],"6026":[1427,2.20],"6027":[1465,4.12],"6028":[724,2.65],"6029":[825,5.17],"6038":[1418,2.33],"6039":[1478,4.57],"6049":[1055,11.13],"6050":[977,15.00],"6063":[1009,8.72],"6064":[1024,14.25],"6075":[1043,11.48],"6076":[998,14.32],"6086":[1127,2.48],"6088":[867,3.25],"6089":[2117,1.82],"6092":[102,0.37],"6093":[70,-0.22],"6160":[225,1.03],"6197":[801,3.70],"6229":[619,2.60],"6263":[86,2.60],"6283":[67,4.37],"6290":[56,3.18],"6293":[1525,4.57],"6295":[1885,1.17],"6296":[1705,1.30],"6311":[1867,1.10],"6312":[1874,1.00],"6314":[1874,0.95],"6327":[865,2.10],"6329":[57,6.02],"6333":[962,2.90],"6337":[94,-2.67],"6343":[1038,1.15],"6347":[18,12.17],"6352":[2736,1.83],"6359":[1273,0.45],"6364":[2473,2.25],"6365":[1477,4.97],"6391":[44,0.30],"6414":[1078,3.40],"6415":[904,2.07],"6421":[912,3.02],"6422":[1076,2.47],"6453":[850,2.97],"6464":[760,3.45],"6465":[683,2.05],"6483":[810,3.72],"6490":[1545,2.45],"6491":[1573,1.75],"6497":[5681,1.63],"6498":[2771,3.98],"6503":[1370,8.33],"6523":[3249,2.27],"6524":[4640,1.83],"6539":[1262,2.45],"6540":[1307,4.08],"6548":[313,3.27],"6575":[1166,3.77],"6591":[1238,0.18],"6592":[1006,1.53],"6596":[3290,2.77],"6603":[1220,0.13],"6604":[1232,0.27],"6606":[1820,1.37],"6613":[2,23.33],"6618":[1341,6.35],"6619":[1392,2.18],"6640":[1355,7.20],"6641":[1368,2.30],"6642":[534,11.05],"6644":[294,4.00],"6678":[330,4.45],"6679":[340,3.85],"6684":[532,3.02],"6685":[408,-0.65],"6694":[435,2.38],"6695":[431,-0.13],"6700":[430,-1.23],"6701":[415,2.30],"6708":[125,3.95],"6724":[1031,2.52],"6725":[904,2.20],"6739":[3312,6.53],"6740":[2547,2.45],"6744":[1118,3.03],"6750":[3822,2.22],"6751":[1608,2.00],"6776":[347,2.33],"6781":[917,1.83],"6786":[1259,1.62],"6787":[1315,2.50],"6800":[48,1.52],"6801":[50,1.13],"6815":[2020,3.98],"6816":[1947,3.17],"6817":[1987,3.50],"6819":[4367,3.18],"6821":[2050,3.72],"6824":[2011,3.30],"6827":[2008,3.85],"6832":[1938,3.18],"6833":[2002,4.40],"6835":[870,1.88],"6882":[676,1.18],"6928":[290,0.33],"6932":[2822,4.82],"6968":[400,1.12],"6969":[338,4.93],"6991":[1907,6.98],"6992":[3392,5.42],"6996":[3351,7.75],"7038":[1844,2.50],"7041":[347,3.72],"7057":[507,1.28],"7058":[2473,6.90],"7065":[893,1.63],"7073":[1559,2.78],"7074":[65,2.38],"7099":[3548,3.18],"7109":[1638,2.35],"7142":[1357,2.65],"7149":[877,3.73],"7160":[23,0.57],"7165":[671,4.98],"7166":[911,5.75],"7179":[9,-4.67],"7186":[803,1.87],"7204":[647,3.05],"7211":[394,1.13],"7217":[3405,7.13],"7219":[1646,11.15],"7221":[655,1.95],"7223":[1069,1.72],"7227":[994,2.18],"7235":[6166,2.07],"7253":[401,5.38],"7264":[939,7.55],"7269":[130,-0.42],"7309":[62,1.12],"7334":[310,2.95],"7342":[729,8.90],"7347":[653,4.15],"7353":[675,4.57],"7355":[884,4.77],"7362":[771,11.25],"7364":[709,11.02],"7380":[94,6.57],"7392":[738,10.23],"7397":[776,9.85],"7398":[642,3.93],"7402":[666,4.57],"7408":[63,-0.62],"7440":[34,10.98],"7476":[135,0.63],"7499":[2324,0.93],"7518":[800,0.45],"7522":[393,1.92],"7528":[346,1.77],"7543":[852,2.22],"7558":[733,-1.05],"7562":[26,0.38],"7563":[1513,2.48],"7605":[919,0.92],"7619":[3726,2.45],"7621":[215,-0.20],"7629":[108,4.50],"7669":[289,2.48],"7671":[2355,3.42],"7676":[293,0.92]}



		// d3 geo
		var projection = d3.geo.mercator()
			.center(lonlat)  
			.scale(1950000)
			.translate([width/2, height/2]);
		var path = d3.geo.path()
			.projection(projection);
		var colorScale = ["#EAF5DA","#CFE8AC","#9FC961","#7CAD34","#64961B","#41660A"];
			
		var routeID = function(d,i) {
			return "route-" + d.properties.route.replace(" ","-");
		};

		var routeName = function(d,i) {
			return d.properties.route_name;
		};
		
		var zoom = d3.behavior.zoom()
			.translate(projection.translate())
			.scale(projection.scale())
			.scaleExtent([1250000,6000000])
			.on("zoom", function() {
				projection.translate(d3.event.translate).scale(d3.event.scale);
				group.selectAll("path").attr("d", path);
				group.selectAll("circle.stop").attr("cx", function(d) {
				    return projection(d.geometry.coordinates)[0] 
				});
				group.selectAll("circle.stop").attr("cy", function(d) {
				    return projection(d.geometry.coordinates)[1] 
				});
		});
		// var map = new L.Map("map", {
  		//     		center: [37.8, -96.9],
  		//     		zoom: 4
  		//   	})
  		//   	.addLayer(new L.TileLayer("http://{s}.tile.cloudmade.com/117aaa97872a451db8e036485c9f464b/998/256/{z}/{x}/{y}.png"))


		// initialize viz
		var group = d3.select("#viz").append("svg").attr("width",width).attr("height",height);
		group.call(zoom).on("mousemove", mousemoved);

		//http://a.tile.cloudmade.com//86564/256/${z}/${x}/${y}.png

		// functions to draw tracts, routes, and stops
		var tracts = function() {
			d3.json('../data/zones/'+viz.zone+'/ct.json', function(data) {
				group.selectAll("path.tract")
					.data(data.features)
					.enter()
					.append("path")
					.attr("d", path)
					.attr("class", "tract")
					.style("fill",colorScale[5])
					.style("stroke",'#ccc')
					.attr("id-number", 'test-id')
					.on("mouseover", function(self) {
						self = $(this);
						self.css({
							"stroke-width": "2px"
						});
						var textTitle = "<p><strong>" + self.attr("id-number") + "</strong></p>";
						//var textPoverty = "<p><span class=\"poverty\">" + self.attr("poverty") + "%" + "</span> of residents live under the federal poverty line</p>";
						//var textRace = "<table class=\"race\"><tr><td><span>" + self.attr("race-white") + "%" + "</span></td><td>&nbsp;identify as White</td></tr><tr><td><span>" + self.attr("race-black") + "%" + "</span></td><td>&nbsp;identify as Black or African American</td></tr><tr><td><span>" + self.attr("race-native") + "%" + "</span></td><td>&nbsp;identify as American Indian or Alaska Native</td></tr><tr><td><span>" + self.attr("race-asian") + "%" + "</span></td><td>&nbsp;identify as Asian</td></tr><tr><td><span>" + self.attr("race-pi") + "%" + "</span></td><td>&nbsp;identify as Native Hawaiian or Pacific Islander</td></tr><tr><td><span>" + self.attr("race-other") + "%" + "</span></td><td>&nbsp;identify as Other</td></tr><tr><td><span>"+ self.attr("race-hispanic") + "%" + "</span></td><td>&nbsp;identify as Hispanic or Latino (of any race)" + "</td></tr></table>";
						$("#info").show().html(textTitle);// + textPoverty + textRace
					})
					.on("mouseout", function(self) {
						self = $(this);
						self.css({
							"stroke-width": 0
						});
						$("#info").hide().html("");
					});
				loader.run();
			});
		};


		
		var routes = function() {
			
			data = transitData.getGTFSRoutes(viz.zone);
			data.features.forEach(function(d,i){
				//console.log(i.properties)
				$('#routes').append('<li><a href="#" id="toggle-route-'+d.properties.route.replace(" ","-")+'" class="toggle-routes">'+d.properties.route_name.replace("\"","").replace("\"","")+'</a></li>');
			});
			group.selectAll("path.route")
				.data(data.features)
				.enter()
				.append("path")
				.attr("d", path)
				.style("fill", "none")
				.attr("class", "route")
				.attr("id", routeID)
				.attr("title", routeName);
			
			toggles.init();
			popup.init();
			loader.run();
		
		};
		
		
		var stops = {
			data :{},
			min_r:0,
			max_r:5,
			min_c:0,
			max_c:15,
			sizeScale :function(){},
			colorScaleFreq:function(){},
			preload: function(){
				stops.data = transitData.getGTFSStops();
				stops.setBounds('on');
				stops.colorScaleFreq = d3.scale.linear()
					.domain([stops.min_c,stops.max_c])
					.range(['#ED3A2D', '#2e0101']);
				stops.sizeScale = d3.scale.linear()
					.domain([stops.min_r,stops.max_r])
					.range([1,20]);	 
				loader.run();
			},
			setBounds: function(stopsBy){
				stops.data.features.forEach(function(d){
					r_var = d.properties.on_count;
					if(stopsBy == 'off'){
						r_var = d.properties.off_count;
					}
					if(r_var < stops.min_r){
						stops.min_r = r_var;
					}
					if(r_var > stops.max_r){
						stops.max_r = r_var;
					}
					if(d.properties.stop_frequency < stops.min_c){
						stops.min_c = d.properties.stop_frequency;
					}
					if(d.properties.stop_frequency > stops.max_c){
						stops.max_c = d.properties.stop_frequency;
					}
				});
			},
			stopR: function(d, i) {
				return stops.sizeScale(d.properties.on_count);
			},
			fillDelay: function(d,i) {
				return stops.colorScaleFreq(d.properties.stop_frequency);
			},
			load: function() {
				group.selectAll("circle.stop")
					.data(stops.data.features)
					.enter()
					.append("circle")
					.classed("stop", true)
					.attr({
						r: stops.stopR,
						cx: function(d,i) { 
							return projection(d.geometry.coordinates)[0] 
						},
						cy: function(d,i) { 
							return projection(d.geometry.coordinates)[1] 
						},
						"fill": stops.fillDelay,
						"stopid": function(d,i) { 
							return d.properties.stop_id
						},
						"intersection": function(d,i) { 
							return (d.properties.stop_name)
						},
						"frequency": function(d,i) { 
							if(d.properties.stop_frequency != 'undefined'){
								return(d.properties.stop_frequency)
							}else{return 0;}

						},
						"boarding_count": function(d,i) { 
							if(d.properties.on_count != 'undefined'){
								return(d.properties.on_count)
							}else{return 0;}
						},
						"alighting_count": function(d,i) { 
							if(d.properties.off_count != 'undefined'){
								return(d.properties.off_count)
							}else{return 0;}
						}

					})
					.on("mouseover", function(self) {
						self = $(this);
						self.animate({
							"stroke-width": ".5px",
							"opacity": 1
						}, 100);
						var text = "";
						var text = "<p><strong>Stop " + self.attr("stopid") + "</strong><br/><span>" + self.attr("intersection") + "</span></p><p><strong>Boarding Count</strong><br/> " + self.attr("boarding_count") + "</p><p><strong>Aligthing Count</strong><br/> " + self.attr("alighting_count") + "</p><p><strong>Stop Frequency</strong><br/> " + self.attr("frequency") + "</p>";
						$("#info").show().html(text);
					})
					.on("mouseout", function(self) {
						self = $(this);
						self.animate({
							"stroke-width": 0,
							"opacity": .3
						}, 100);
						$("#info").hide().html("");
					})			
				loader.run();
				$("#loading").fadeOut(1000);
				
				}
		};
		
		function mousemoved() {
		  $('#coords').text(formatLocation(projection.invert(d3.mouse(this)), zoom.scale()));
		}
		function formatLocation(p, k) {
 			var format = d3.format("." + Math.floor(Math.log(k) / 2 - 2) + "f");
  			return (p[1] < 0 ? format(-p[1]) + "°S" : format(p[1]) + "°N") + " "
       		+ (p[0] < 0 ? format(-p[0]) + "°W" : format(p[0]) + "°E");
		}
		
		// queue up and run the functions
		loader.push(tracts);
		loader.push(routes);
		loader.push(stops.preload);
		loader.push(stops.load);
		loader.run();



		// zoom in & out buttons
	    $("#zoom-in").on("click", function() {
		    var newScale = projection.scale() + 500000;
		    projection.scale(newScale);
		    group.selectAll("path").attr("d", path);
		    group.selectAll("circle.stop").attr("cx", function(d) {
		        return projection(d.geometry.coordinates)[0] 
		    });
		    group.selectAll("circle.stop").attr("cy", function(d) {
		        return projection(d.geometry.coordinates)[1] 
		    });
		    // important! assigns the new scale to the zoom mouse behavior
		    var zoom = d3.behavior.zoom()
		       .translate(projection.translate())
		       .scale(newScale)
		       .scaleExtent([1250000,6000000])
		       .on("zoom", function() {
		       	projection.translate(d3.event.translate).scale(d3.event.scale);
		       	group.selectAll("path").attr("d", path);
		       	group.selectAll("circle.stop").attr("cx", function(d) {
		       	    return projection(d.geometry.coordinates)[0] 
		       	});
		       	group.selectAll("circle.stop").attr("cy", function(d) {
		       	    return projection(d.geometry.coordinates)[1] 
		       	});
		    });
		    group.call(zoom);
		});
	    $("#zoom-out").on("click", function() {
		    var newScale = projection.scale() - 500000;
		    projection.scale(newScale);
		    group.selectAll("path").attr("d", path);
		    group.selectAll("circle.stop").attr("cx", function(d) {
		        return projection(d.geometry.coordinates)[0] 
		    });
		    group.selectAll("circle.stop").attr("cy", function(d) {
		        return projection(d.geometry.coordinates)[1] 
		    });
		    // important! assigns the new scale to the zoom mouse behavior
		    var zoom = d3.behavior.zoom()
		       .translate(projection.translate())
		       .scale(newScale)
		       .scaleExtent([1250000,6000000])
		       .on("zoom", function() {
		       	projection.translate(d3.event.translate).scale(d3.event.scale);
		       	group.selectAll("path").attr("d", path);
		       	group.selectAll("circle.stop").attr("cx", function(d) {
		       	    return projection(d.geometry.coordinates)[0] 
		       	});
		       	group.selectAll("circle.stop").attr("cy", function(d) {
		       	    return projection(d.geometry.coordinates)[1] 
		       	});
		    });
		    group.call(zoom);
		});
    },
    
};



//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
var popup = {

    init : function() {

		// position popup
		windowW = $(window).width();
		$("#viz").on("mousemove", function(e) {
			
			var x = e.pageX + 20;
			var y = e.pageY;
			var windowH = $(window).height();
			if (y > (windowH - 100)) {
				var y = e.pageY - 100;
			} else {
				var y = e.pageY - 20;
			}

			$("#info").css({
				"left": x,
				"top": y
			});
		});

	}

};


//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
var transitData = {
	getGTFSRoutes : function(zone){
		var output = {};
		$.ajax({url:'/data/get/getGTFSbyZone.php',
			data:{zone_id:zone},
			method:'POST',
			dataType:'json',
			async:false
		})
		.done(function(data){
			output = data;
		})
		.fail(function(e){
			console.log(e.responseText);
		});
		return(output);		
	},
	getGTFSStops : function(){
		var output = {};
		$.ajax({url:'/data/get/getStopsByZone.php',
			data:{zone_id:viz.zone,model_run:viz.model_run},
			method:'POST',
			dataType:'json',
			async:false
		})
		.done(function(data){
			output = data;
		})
		.fail(function(e){
			console.log(e.responseText);
		});
		return(output);
	}
}
//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------
var toggles = {

    init : function() {

		$("#legend h2 a").on("click", function() {
			$(this).toggleClass("closed");
			$("#legend-detail").slideToggle(300);
			return false;
		});

		$("#toggle-tracts").on("click", function() {
			var self = $(this); 
			if (self.hasClass("active")) {
				//$("#viz .tract").fadeOut(500);
			    setTimeout(function() {
			        $("#viz .tract").each(function(i) {
			            var self = $(this); 
			            setTimeout(function() { 
			            	self.fadeOut(300);
			            }, 5 * i);
			        });
			    }, 5);   	
				self.removeClass("active");
			} else {
				//$("#viz .tract").fadeIn(500);
			    setTimeout(function() {
			        $("#viz .tract").each(function(i) {
			            var self = $(this); 
			            setTimeout(function() { 
			            	self.fadeIn(300);
			            }, 5 * i);
			        });
			    }, 5);   	
				self.addClass("active");
			}
			return false;
		});

		$(".toggle-routes").on("click", function() {
			var self = $(this); 
			var route = "#" + self.attr("id").replace("toggle-","");
			if (self.hasClass("active")) {
				$(route).css({
					"stroke-width": "2px"
				});
				$(route).animate({
					opacity: .1
				}, 100);
				self.removeClass("active");
			} else {
				$(route).css({
					"stroke-width": "5px"
				});
				$(route).animate({
					opacity: 1
				}, 100);
				self.addClass("active");
			}
			return false;
		});

		$(".toggle-routes-alt").on("click", function() {
			var self = $(this); 
			var route = "#viz ." + self.attr("id").replace("toggle-","");
			if (self.hasClass("active")) {
				$(route).css({
					"stroke-width": "2px"
				});
				$(route).animate({
					opacity: .1
				}, 100);
				self.removeClass("active");
			} else {
				$(route).css({
					"stroke-width": "5px"
				});
				$(route).animate({
					opacity: 1
				}, 100);
				self.addClass("active");
			}
			return false;
		});

	},

};



//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
$(document).ready(function() {
	
	//toggles.init();
});
$(window).resize(function() {
	$("#viz svg").width($(window).width());
	$("#viz svg").height($(window).height());
});