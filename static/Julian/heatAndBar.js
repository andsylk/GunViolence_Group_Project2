months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
years = ["2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016"]
years2 = [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016]

var darkMapBox = L.tileLayer("https://api.mapbox.com/styles/v1/julianalexander/cjez3ryi74tjx2rqrvnbsiykr/tiles/256/{z}/{x}/{y}?"+
"access_token=pk.eyJ1IjoianVsaWFuYWxleGFuZGVyIiwiYSI6ImNqZXZwM2puNTBwO"+
"HIyeW43cjNsNWNnanQifQ.rnM8MJ-3OxfUwtCEQwhshw");

var myMap = L.map("svg-map", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: [darkMapBox]
});

// Define the margins of the chart
var svgWidth = 1200;
var svgHeight = 600;

var margin = { top: 50, right: 50, bottom: 50, left: 75 };

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

var xBandScale = d3
  .scaleBand()
  .domain(months)
  .range([0, chartWidth])
  .padding(0.1);

// Define a linearScale which will be used to create our left axis and position and size our bars along the y-axis
var yLinearScale = d3.scaleLinear().domain([0,1600]).range([chartHeight, 0]);
// Configure a bottom axis function using the d3.axisBottom method and the band scale.
var bottomAxis = d3.axisBottom(xBandScale);
// Configure a left axis function using the d3.axisBottom method and the band scale.
var leftAxis = d3.axisLeft(yLinearScale);

var colors = ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"];

var n = 1;

data07 = [];
death07 = [];
death_07 = [];
countyDeaths = [];
heatArray = [];
timeArray = [];
gunData = [];

d3.json("http://127.0.0.1:5000/gunData", function(error, data){
    if (error) console.warn(error);
        console.log(data);
        gunData = data;
        countyDeaths.push(data.filter(function(obj){
            return obj.Year === years2[0]
        }))
        for (var i = 0; i < countyDeaths[0].length; i++){
            timeArray.push([countyDeaths[0][i].latitude, countyDeaths[0][i].longitude, countyDeaths[0][i].Deaths])      
        };
        console.log(timeArray)
        
         var heat = L.heatLayer(timeArray,{
            radius: 25,
            blur: 20,
            minOpacity:0.65,
            maxZoom: 18,
            gradient:{
                '0.0':'green',
                '0.5': 'blue',
                '1.0':'red'
            }
        }).addTo(myMap);  
        }) 


 d3.json("http://127.0.0.1:5000/totalGunDeaths", function(error, data){
    if (error) console.warn(error); //loading the data
    console.log(data); 

    data07.push(data.filter(function(obj){
        return obj.Year === years[0];
    }))
    console.log(data07)

    for (var i = 0; i < data07[0].length; i++){
        death07.push([data07[0][i].Deaths, data07[0][i].Month]);     
    };

    var deathsTotal = d3.nest()
        .key(function(d) { return d.Month; })
        .rollup(function(v) { return d3.sum(v, function(d) { return d.Deaths; }); })
        .object(data07[0]);
    console.log(deathsTotal)
  
     for (var key in deathsTotal){
          death_07.push(deathsTotal[key])
        };
    
    console.log(death_07);
    console.log(death_07.reduce((a,b) => a + b, 0))

    console.log(death07);

    var colorScale = d3.scaleQuantile()
    .domain([0, colors.length - 1, d3.max(death_07, function(d) {
    return d;
        })])
    .range(colors);


var svg = d3
    .select("#svg-area")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)
    .append("g")
    .attr("height", chartHeight)
    .attr("width", chartWidth)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "main");

// Append another SVG group and call the bottomAxis function inside
svg
.append("g")
.attr("transform", "translate(0," + chartHeight + ")")
.call(bottomAxis)
.style("font-size","15px")
.attr("class", "main-svg")


// Append another SVG group and call the leftAxis function inside
svg.append("g").call(leftAxis)
.style("font-size","15px");

svg.append("text")
.attr("class", "label")
.style("text-anchor","middle")
.style("font-size", "20px")
.style("font-weight", "bold")
.attr("x", chartWidth/2)
.attr("y", chartHeight + 50)
.text("Month");

svg.append("text")
.attr("class", "label")
.style("text-anchor","middle")
.style("font-size", "20px")
.style("font-weight", "bold")
.attr("transform", "rotate(-90)")
.attr("x", -250)
.attr("y", -50)
.text("Count of Gun related Deaths");

d3.select("#total")
.data(death_07)
.text(death_07.reduce((a,b) => a + b, 0))

svg
  .selectAll(".bar")
  .data(death_07)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", function(data, index) {
    return xBandScale(months[index]);
  })
  // Set the y coordinate to be the value returned from passing the data (current books value) into the linearScale function
  .attr("y", function(data) {
    return yLinearScale(data);
  })
  // Set the width of the bar using the bandWidth method attached to the bandScale function
  .attr("width", xBandScale.bandwidth())
  // Set the height of the bar to be the height of the chart minus the size calculated by the linear scale method
  .attr("height", function(data) {
    return chartHeight - yLinearScale(data);
  })
  .style("fill",function(d){
      return colorScale(d)
  })


  svg
  .selectAll(".text")
  .data(death_07)
  .enter()
  .append("text")
  .attr("class", "text")
  .attr("text-anchor","middle")
  .attr("x", function(data, index) {
    return xBandScale(months[index]);
  })
  // Set the y coordinate to be the value returned from passing the data (current books value) into the linearScale function
  .attr("y", function(data) {
    return yLinearScale(data)-20;
  })
  // Set the width of the bar using the bandWidth method attached to the bandScale function
  .text((function(data){
      return data}))
  .attr("dx", "2.5em")
  ;

  d3.select("#nextYear")
    .on("click", function(){

        dataYear = [];
        death_year = [];
        deathYear = [];
        gunDataYear = [];
        newTimeArray = [];
        

        console.log(gunData)
        console.log(data)
    
        dataYear.push(data.filter(function(obj){
            return obj.Year === years[n];
        }))
        console.log(dataYear)

        gunDataYear.push(gunData.filter(function(obj){
            return obj.Year === years2[n];
        }))
        console.log(gunDataYear)

        for (var i = 0; i < dataYear[0].length; i++){
            death_year.push([dataYear[0][i].Deaths, dataYear[0][i].Month])      
        };
        for (var j = 0; j < gunDataYear[0].length; j++){
            newTimeArray.push([gunDataYear[0][j].latitude, gunDataYear[0][j].longitude, gunDataYear[0][j].Deaths])
        }
        console.log(newTimeArray)
        var deathsTotal = d3.nest()
            .key(function(d) { return d.Month; })
            .rollup(function(v) { return d3.sum(v, function(d) { return d.Deaths; }); })
            .object(dataYear[0]);
        console.log(deathsTotal)
      
         for (var key in deathsTotal){
              deathYear.push(deathsTotal[key])
            };
        
        console.log(death_year);
    
        console.log(deathYear);
        n++;
        console.log(n)

        //update heatmap
        var heat = L.heatLayer(newTimeArray,{
            radius: 25,
            blur: 20,
            minOpacity:0.65,
            maxZoom: 18,
            gradient:{
                '0.0':'green',
                '0.5': 'blue',
                '1.0':'red'
            }
           }).addTo(myMap);
        // Append another SVG group and call the bottomAxis function inside
  
        svg
        .selectAll(".bar")
        .data(deathYear)
        .transition()
        .duration(1000)
        // Set the y coordinate to be the value returned from passing the data (current books value) into the linearScale function
        .attr("y", function(data) {
            return yLinearScale(data);
        })
        // Set the width of the bar using the bandWidth method attached to the bandScale function
        .attr("width", xBandScale.bandwidth())
        // Set the height of the bar to be the height of the chart minus the size calculated by the linear scale method
        .attr("height", function(data) {
            return chartHeight - yLinearScale(data);
        })
        .style("fill",function(data){
            return colorScale(data)
        });
         console.log(years2[n-1]);

        d3
        .select("#year")
        .data(years2)
        .text(years2[n-1] + "*")

        d3
        .select("#year2")
        .data(years2)
        .text(years2[n-1]+":")

        svg
        .selectAll(".text")
        .data(deathYear)
        .transition()
        .duration(1000)
         // Set the y coordinate to be the value returned from passing the data (current books value) into the linearScale function
        .attr("y", function(data) {
          return yLinearScale(data)-20;
        })
        // Set the width of the bar using the bandWidth method attached to the bandScale function
        .text(function(data){
            return data});

        d3.select("#total")
        .data(deathYear)
        .transition()
        .duration(1000)
        .text(deathYear.reduce((a,b) => a + b, 0))


    })
});


