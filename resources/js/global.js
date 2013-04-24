//----------------
//GLOBAL VARIABLES
//----------------
var currentZone = -1;
var quant = {};
var graphing =false;
var activelayer;
var selectlayer = []; 
var zoneColors = ['#E41A1C','#377EB8','#4DAF4A','#984EA3','#FF7F00'];
var usBounds;
var selectlayerer,tractselectlayerer,bgselectlayerer;
var gtfs_select, census_select;
var counties, states,countyTracts;
var stateCounties,countiesSelect,tractSelect;
var gtfs,gtfsSelect;
var gtfs_layers = {};
var level = 0;
var sources = ['sf1','acs5'];
var sf1var = ['P0010001','P0030002','P0030003','P0030005','P0040001','P0120002','P0120026','P0180001']
var acsvar = ['B00001_001E','B00002_001E','B23001_001E','B25044_003E','B25044_004E','B25119_001E','B08006_008E','B08006_009E','B08006_011E'];

//---------------------------------------------------
// Screen Behavior Jquery - to be Refactored
//---------------------------------------------------



