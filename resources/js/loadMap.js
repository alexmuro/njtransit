function loadCensusLayers()
{

    var cdata = 'P0010001';
    //map.fractionalZoom = true;
    var fip = 34;//Starting State
    
    /*   
    var vectorlayer = new OpenLayers.Layer.Vector("Taz", {
    strategies: [new OpenLayers.Strategy.Fixed()],                
    protocol: new OpenLayers.Protocol.HTTP({
    url: 'data/taz.json',
    format: new OpenLayers.Format.GeoJSON()
    })
    });
    map.addLayer(vectorlayer);
    vectorlayer.events.register("loadend", vectorlayer, function (e) {
       
         quant = getLayerAttribute(vectorlayer,'SUM_OccH20');
         vectorlayer.styleMap = getStyle('SUM_OccH20',3,quant);
         vectorlayer.redraw();
         activelayer = vectorlayer;
    }); 
    */   


    stateCounties = getCountyTracts(fip,'none','NJ Census Tracts');
    map.addLayer(stateCounties);
    stateCounties.events.register("loadend", stateCounties, function (e) {
        $('#sf1').val(1);
         quant = getLayerAttribute(stateCounties,sf1var[$('#sf1').val()]);
         stateCounties.styleMap = getStyle(sf1var[$('#sf1').val()],$("#color").val(),quant);
         stateCounties.redraw();
         activelayer = stateCounties;
    });

    countiesSelect = getCountyTracts(fip,'none','select');
    selectlayer = countiesSelect;
    map.addLayer(selectlayer);
    countiesSelect.events.register("loadend", countiesSelect, function (e) {
          countiesSelect.styleMap = getMultiStyle();
    }); 
    countiesSelect.styleMap =  getMultiStyle();
    selectlayerer = new OpenLayers.Control.SelectFeature([selectlayer],{
                    
                    clickout: false, toggle: false,
                    multiple: true, hover: false,
                    toggleKey: "ctrlKey", // ctrl key removes from selection
                    multipleKey: "shiftKey" // shift key adds to selection
    });
    map.addControl(selectlayerer);
    selectlayerer.activate();

    url = "data/gtfs/trenton.json";

     gtfs = new OpenLayers.Layer.Vector('GTFS', {
    eventListeners:{
        'featureselected':function(evt){
            var feature = evt.feature;
            console.log(feature.attributes.id+" "+feature.attributes.route+" "+feature.attributes.num_trips )
            //document.getElementById("data").innerHTML = "<div >Tract:" + feature.attributes.NAME+" "+feature.attributes.LSAD +" <br>Geo ID: " + feature.attributes.GEO_ID+" <br>Pop: " + addCommas(feature.attributes.P0010001)+"</div>";
        },
        'featureunselected':function(evt){
            var feature = evt.feature; 
         }   
        }, 
    strategies: [new OpenLayers.Strategy.Fixed()],                
    protocol: new OpenLayers.Protocol.HTTP({
    url: url,
    format: new OpenLayers.Format.GeoJSON()
    })
    });
    gtfs.styleMap =  getBusRouteStyle("route");
    map.addLayer(gtfs);

    /*
    var countydblclick = new DblclickFeature(countiesSelect, {
    dblclick: function (event) { 

            event.attributes.GEO_ID[1]=4;
            var name = event.attributes.NAME+" "+event.attributes.LSAD+" tracts";
            var statefip=event.attributes.GEO_ID[9]+event.attributes.GEO_ID[10];
            var countyfip=event.attributes.GEO_ID[11]+event.attributes.GEO_ID[12]+event.attributes.GEO_ID[13];
            console.log(name+' '+statefip+' '+countyfip);
            console.log(event.geometry.bounds);
            map.zoomToExtent(event.geometry.bounds);
            
            activelayer.styleMap = getDefaultStyle('blank');
            activelayer.redraw();

            countyTracts = getCountyTracts(statefip,countyfip,name);
            map.addLayer(countyTracts);
            activelayer = countyTracts;

            activelayer.styleMap = getStyle(sf1var[$('#sf1').val()],$("#color").val(),quant);
            activelayer.redraw();

            tractSelect =getCountyTracts(statefip,countyfip,name);
            selectlayer = tractSelect;
            map.addLayer(selectlayer);
            selectlayer.styleMap = getDefaultStyle();
            
            tractselectlayerer = new OpenLayers.Control.SelectFeature([selectlayer],{
                hover:true,
                tiple: true,
                autoActivate:true
            });
            map.addControl(tractselectlayerer);
            level++;

            var tractdblclick = new DblclickFeature(tractSelect, {
            dblclick: function (event) { 

                        event.attributes.GEO_ID[1]=4;
                        var name = event.attributes.NAME+"block groups";
                        var statefip=event.attributes.GEO_ID[9]+event.attributes.GEO_ID[10];
                        var countyfip=event.attributes.GEO_ID[11]+event.attributes.GEO_ID[12]+event.attributes.GEO_ID[13];
                        var tractfip = event.attributes.GEO_ID[14]+event.attributes.GEO_ID[15]+event.attributes.GEO_ID[16]+event.attributes.GEO_ID[17]+event.attributes.GEO_ID[18]+event.attributes.GEO_ID[19];
                        console.log(name+' '+statefip+' '+countyfip+' '+tractfip);
                        console.log(event.geometry.bounds);
                        map.zoomToExtent(event.geometry.bounds);
                    
                        activelayer.styleMap = getDefaultStyle('blank');
                        activelayer.redraw();

                        var TractBlockGroups = getTractBlockGroups(statefip,countyfip,tractfip,name);
                        map.addLayer(TractBlockGroups);
                        activelayer = TractBlockGroups;

                        activelayer.styleMap = getStyle(sf1var[$('#sf1').val()],$("#color").val(),quant);
                        activelayer.redraw();

                        var BGSelect = getTractBlockGroups(statefip,countyfip,tractfip,name); 
                        selectlayer = BGSelect;
                        map.addLayer(selectlayer);
                        selectlayer.styleMap = getDefaultStyle();
                        
                        bgselectlayerer = new OpenLayers.Control.SelectFeature([selectlayer],{
                            hover:true,
                            tiple: true,
                            autoActivate:true
                        });
                        map.addControl(bgselectlayerer);
                        level++;
                    } 
                });
            
            map.addControl(tractdblclick);
            tractdblclick.activate();


        }
    });
    map.addControl(countydblclick);
    countydblclick.activate();
    */
    //setZoomEnd();
}