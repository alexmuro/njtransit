var county_layer = L.geoJson(null, {
        style: {
            color: '#666',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.3
        }
    }),
    state_layer = L.geoJson(null, {
        style: {
            color: '#333',
            weight: 3,
            opacity: 1,
            fillOpacity: 0
        }
    }),
    map = L.map('map');
 
L.tileLayer('http://{s}.tiles.mapbox.com/v3/jcsanford.map-xu5k4lii/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data &copy; Someone, Somewhere.',
}).addTo(map);
 
map
    .addLayer(county_layer)
    .addLayer(state_layer)
    .setView([40, -100], 5);
 
$.getJSON('us_counties.json', function (data) {
    var county_geojson = topojson.object(data, data.objects.counties),
        state_geojson = topojson.object(data, data.objects.states);
    county_layer.addData(county_geojson);
    state_layer.addData(state_geojson);
});