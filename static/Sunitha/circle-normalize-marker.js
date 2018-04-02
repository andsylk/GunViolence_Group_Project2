//
// var mapbox = "https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
//  "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
// "T6YbdDixkOBWH_k9GbS8JQ";

var mapbox = 'https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3VuaXRoYXJhbWE4MyIsImEiOiJjamZoMG00ODgyZzA2MzFwYWV0N2U3b3QxIn0.r9uUPLSAranlJokBMfOlvw';

// Create a map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

// Add a tile layer
L.tileLayer(mapbox).addTo(myMap);

// Define a markerSize function that will give each city a different radius based on its deaths
function markerSize(deaths) {
  // return deaths * 1000;
  // Normalizing gun deaths with population by every 100000 Hundred thousand people
     normalize = deaths/population * 100000,
     console.log(normalize);
  return normalize;
}

// loop through the csv data to assign and create a circle marker for each city object
d3.csv("./Data/gun_data_07-16.csv", function(error, shootingData) {
    if (error) throw error;
        

    // Loop through our csv data to assign 
    shootingData.forEach(function(data) {
      console.log(data);
      month = data.Month; 
      deaths = data.Deaths; 
      lat  = data.latitude;
      lon  = data.longitude;
      county = data.County;
      population = data.Population;
      
      // printing two decimals with the normalized value to display in tooltip
      // Normalizing the deaths with population of hundred thousand.
      normalize = markerSize(deaths)
      //  normalize = deaths/population * 100000;
      var num2decimal = normalize;
      num = num2decimal.toFixed(2);

      // popup data on the tooltip when clicked on a cluster marker
      var popup = '<b>County: </b>' + county +
                  '<br/><b>Deaths: </b>'  + num +
                  '<br/><b>Month: </b>' +  month;

      L.circle([lat ,lon ], {
        fillOpacity: .75,
        color: "lightgreen",
        fillColor: "purple", 
        // Setting our circle's radius equal to the output of our markerSize function
        // This will make our marker's size proportionate to its deaths 
        radius: markerSize(deaths),
      }).bindPopup(popup).addTo(myMap);
       
    }); 
})