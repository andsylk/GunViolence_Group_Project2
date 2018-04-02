
// Mapbox API
// https://www.mapbox.com/mapbox-gl-js/style-spec/
// https://www.mapbox.com/api-documentation/?language=Python#styles
var mapbox = 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3VuaXRoYXJhbWE4MyIsImEiOiJjamZoMG00ODgyZzA2MzFwYWV0N2U3b3QxIn0.r9uUPLSAranlJokBMfOlvw';

// var mapbox = 'https://api.mapbox.com/styles/v1/sunitharama83/cjevowbnp1msr2stnlsfw2e68/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3VuaXRoYXJhbWE4MyIsImEiOiJjamV2b3Iwd3M3MXdjMnJvN2FveXp3d2thIn0.uNhxhAOBzvHmvZqhAlWz5Q'

// Creating map object
var myMap = L.map('map', {
  center: [39,-95],
  zoom: 5,
});

// Adding tile layer to the map
L.tileLayer(mapbox).addTo(myMap);

// Building API query URL
// var baseURL = 'https://maps.googleapis.com/maps/api/geocode/json?';
// var key = "&key=AIzaSyCLE_2Yfxa_y12nZv53kflN0oYnxYDcQVI";


// Retrieve data from d3.csv file and execute everything below
d3.csv("./Data/gun_data_07-16.csv", function(error, shootingData) {
    if (error) throw error;

    // Creating a new marker cluster group
    var markers = L.markerClusterGroup();

    // Loop through our csv data to assign 
    shootingData.forEach(function(data) {
      console.log(data);
      month = data.Month; 
      deaths = data.Deaths; 
      lat  = data.latitude;
      lon  = data.longitude;  
      county = data.County;

    // popup data on the tooltip when clicked on a cluster marker
      var popup = '<b>County: </b>' + county +
                  '<br/><b>Deaths: </b>'  + deaths +
                  '<br/><b>Month: </b>' +  month;
      
      // https://asmaloney.com/2015/06/code/clustering-markers-on-leaflet-maps/
      markers.addLayer(
        L.marker([lat ,lon ]).bindPopup(popup),
      );
      // var query_url = baseURL + "address=" + data.city + key;
      // console.log(query_url) // how to handle the ex: st.louis, lauderdale lakes
    });
     
 // Add our marker cluster layer to the map
 myMap.addLayer(markers);
   
})
 
