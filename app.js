/**
 * Copyright (c) 2008-2011 The Open Source Geospatial Foundation
 * 
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

/** api: example[tree]
 *  Tree Nodes
 *  ----------
 *  Create all kinds of tree nodes.
 */
 
 /* Cloudmade Styles
  * 86367 - black and wite
  * 84168
  * 9202
 */
    var map = 1
     var urls = [[
    "http://a.tile.openstreetmap.org/${z}/${x}/${y}.png",
    "http://b.tile.openstreetmap.org/${z}/${x}/${y}.png",
    "http://c.tile.openstreetmap.org/${z}/${x}/${y}.png"
    ],[
    "http://a.tile.cloudmade.com/117aaa97872a451db8e036485c9f464b/86564/256/${z}/${x}/${y}.png",
    "http://b.tile.cloudmade.com/117aaa97872a451db8e036485c9f464b/86564/256/${z}/${x}/${y}.png",
    "http://c.tile.cloudmade.com/117aaa97872a451db8e036485c9f464b/86564/256/${z}/${x}/${y}.png"
    ],
    [ 
      "http://otile1.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
      "http://otile2.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
      "http://otile3.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
      "http://otile4.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png"
    ]
    ];
    //console.log(urls);


map = new OpenLayers.Map({

    layers: [
       new OpenLayers.Layer.XYZ("Open Street Map", urls[0], {
             transitionEffect: "resize", buffer: 2, sphericalMercator: true
            }),
       new OpenLayers.Layer.Google(
                "Google Terrain",{
                    type: google.maps.MapTypeId.TERRAIN,
                    animationEnabled: false,
                transitionEffect: "resize"
            }
            ),
        new OpenLayers.Layer.Google(
                "Google Streets", // the default
                {numZoomLevels: 20,
                animationEnabled: false,
                transitionEffect: "resize"}
            ),
            new OpenLayers.Layer.Google(
                "Google Hybrid",
                {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20,
                animationEnabled: false,
                transitionEffect: "resize"}
            ),
            new OpenLayers.Layer.Google(
                "Google Satellite",
                {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22,
                animationEnabled: false,
                transitionEffect: "resize"}
            ),
            new OpenLayers.Layer.XYZ("Custom Map", urls[map], {
            transitionEffect: "resize", buffer: 2, sphericalMercator: true
            }),
               new OpenLayers.Layer.XYZ("MapQuest", urls[2], {
             transitionEffect: "resize", buffer: 2, sphericalMercator: true
            })

    ],
    controls: [
        new OpenLayers.Control.Navigation({
            dragPanOptions: {
                enableKinetic: true
            }
        }),
        new OpenLayers.Control.Zoom(),
        new OpenLayers.Control.Attribution()
    ]
    
});
Ext.onReady(function() {
    // create a map panel with some layers that we will show in our layer tree
    // below.
    mapPanel = new GeoExt.MapPanel({
        border: true,
        region: "center",
        // we do not want all overlays, to try the OverlayLayerContainer
        map: map,
        center: [-8318539.5829974,4888321.4897206],
    zoom: 8    
    });

    // create our own layer node UI class, using the TreeNodeUIEventMixin
    var LayerNodeUI = Ext.extend(GeoExt.tree.LayerNodeUI, new GeoExt.tree.TreeNodeUIEventMixin());
        
    // using OpenLayers.Format.JSON to create a nice formatted string of the
    // configuration for editing it in the UI
    var treeConfig = [{
        nodeType: "gx_baselayercontainer"
    }, {
        nodeType: "gx_overlaylayercontainer",
        expanded: true,
        // render the nodes inside this container with a radio button,
        // and assign them the group "foo".
        loader: {
            baseAttrs: {
                radioGroup: "foo",
                uiProvider: "layernodeui"
            }
        }
    }
    ];
    // The line below is only needed for this example, because we want to allow
    // interactive modifications of the tree configuration using the
    // "Show/Edit Tree Config" button. Don't use this line in your code.
    treeConfig = new OpenLayers.Format.JSON().write(treeConfig, true);

    // create the tree with the configuration from above
    tree = new Ext.tree.TreePanel({
        border: true,
        region: "east",
        title: "Layers",
        width: 200,
        split: true,
        collapsible: true,
        collapseMode: "mini",
        collapsed:true,
        autoScroll: true,
        plugins: [
            new GeoExt.plugins.TreeNodeRadioButton({
                listeners: {
                    "radiochange": function(node) {
                        alert(node.text + " is now the active layer.");
                    }
                }
            })
        ],
        loader: new Ext.tree.TreeLoader({
            // applyLoader has to be set to false to not interfer with loaders
            // of nodes further down the tree hierarchy
            applyLoader: false,
            uiProviders: {
                "layernodeui": LayerNodeUI
            }
        }),
        root: {
            nodeType: "async",
            // the children property of an Ext.tree.AsyncTreeNode is used to
            // provide an initial set of layer nodes. We use the treeConfig
            // from above, that we created with OpenLayers.Format.JSON.write.
            children: Ext.decode(treeConfig)
            // Don't use the line above in your application. Instead, use
            //children: treeConfig
            
        },
        listeners: {
            "radiochange": function(node){
                alert(node.layer.name + " is now the the active layer.");
            }
        },
        rootVisible: false,
        lines: false,
        bbar: [{
            text: "Show/Edit Tree Config",
            handler: function() {
                treeConfigWin.show();
                Ext.getCmp("treeconfig").setValue(treeConfig);
            }
        }]
    });

    // dialog for editing the tree configuration
    var treeConfigWin = new Ext.Window({
        layout: "fit",
        hideBorders: true,
        closeAction: "hide",
        width: 300,
        height: 400,
        title: "Tree Configuration",
        items: [{
            xtype: "form",
            layout: "fit",
            items: [{
                id: "treeconfig",
                xtype: "textarea"
            }],
            buttons: [{
                text: "Save",
                handler: function() {
                    var value = Ext.getCmp("treeconfig").getValue()
                    try {
                        var root = tree.getRootNode();
                        root.attributes.children = Ext.decode(value);
                        tree.getLoader().load(root);
                    } catch(e) {
                        alert("Invalid JSON");
                        return;
                    }
                    treeConfig = value;
                    treeConfigWin.hide();
                }
            }, {
                text: "Cancel",
                handler: function() {
                    treeConfigWin.hide();
                }
            }]
        }]
    });
    
    new Ext.Viewport({
        layout: "fit",
        hideBorders: true,
        items: {
            layout: "border",
            deferredRender: false,
            items: [mapPanel, tree, {
                contentEl: "desc",
                region: "west",
                bodyStyle: {"padding": "0px"},
                collapsible: true,
                collapseMode: "mini",
                split: true,
                width: 300
            }]
        }
    });
});
loadTrentonLayers();

//loadCensusLayers();