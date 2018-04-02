//define margins and area for graph
var svgWidth = 1000;
var svgHeight = 700;
var margin = { top: 30, right: 40, bottom: 100, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart = svg.append("g");

// Append a div to the body to create tooltips, assign it a class
var div = d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

// Retrieve data from CSV file and execute everything below

// D3.json("/gunDataFinal", function(error, gunData){
//     if (error) return console.warn(error);

d3.csv("gundata_final.csv", function(err, gunData) {
    if(err) throw err;
    gunData.forEach(function(data) {
      data.state = data.state;
      data.abbr = data.abbr;
      data.gun_ownership_perc = +data.gun_ownership_perc;
      data.gun_deaths = +data.gun_deaths;
    });

    // Create scale functions
    var yLinearScale = d3.scaleLinear().range([height, 0]);
    var xLinearScale = d3.scaleLinear().range([0, width]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //scaling
    // variables to store the min and max values of csv file
    var xMin;
    var xMax;
    var yMin;
    var yMax;

    xMin = d3.min(gunData, function(data) {
        return +data.gun_ownership_perc * 0.85;
    });

    xMax = d3.max(gunData, function(data) {
        return +data.gun_ownership_perc * 1;
    });

    yMin = d3.min(gunData, function(data) {
        return +data.gun_deaths * 0.85;
    });

    yMax = d3.max(gunData, function(data) {
        return +data.gun_deaths * 1;
    });

    xLinearScale.domain([xMin, xMax]);
    yLinearScale.domain([yMin, yMax]);
    console.log(xMin);
    console.log(yMax);

    // see below for an explanation of the calcLinear function
    var lg = calcLinear(gunData, "gun_ownership_perc", "gun_deaths",xMin,yMax );
    console.log(lg)

    chart.append("line")
        .attr("class", "regression")
        .attr("fill", "red")
        .attr("x1", xLinearScale(lg.ptA.x))
        .attr("y1", yLinearScale(lg.ptA.y))
        .attr("x2", xLinearScale(lg.ptB.x))
        .attr("y2", yLinearScale(lg.ptB.y));


    var state_text = "State: "
    var gun_perc = "Gun Ownership: "
    var gundeaths = "Gun Deaths: "
    
    // create chart
    chart.selectAll("circle")
        .data(gunData)
        .enter()
        .append("circle")
        .attr("cx", function(data, index) {
            return xLinearScale(data.gun_ownership_perc);
        })
        .attr("cy", function(data, index) {
            return yLinearScale(data.gun_deaths);
        })
        .attr("r", 12)
        .attr("fill", "#fc8af4")
        // display tooltip on click
        .on("mouseover", function (data) {
            div.transition()
                .duration(100)
                .style("opacity", .9);
            div.html(state_text.bold() + data.state + "<br/>" + gun_perc.bold() + data.gun_ownership_perc + "<text>%</text>" + "<br/>" + gundeaths.bold() + data.gun_deaths)
                .style("left", (d3.event.pageX)+ 10 + "px")
                .style("top", (d3.event.pageY - 0) + "px");
        })
        // hide tooltip on mouseout
        .on("mouseout", function(data, index) {
            div.transition()
                .duration(500)
                .style("opacity",0);
        });

    chart.append("text")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .style("font-family", "arial")
        .selectAll("tspan")
        .data(gunData)
        .enter()
        .append("tspan")
            .attr("x", function(data) {
                return xLinearScale(data.gun_ownership_perc - 0);
            })
            .attr("y", function(data) {
                return yLinearScale(data.gun_deaths - 0.1);
            })
            .text(function(data) {
                return data.abbr
                });

    // Append an SVG group for the xaxis, then display x-axis 
    chart
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chart.append("g").call(leftAxis);

    chart
        .append("text")
        .style("font-family", "arial")
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .attr("transform", "rotate(-90)")
        .attr("y", 0-margin.left + 20)
        .attr("x", 0 - height/2)
        .attr("dy","1em")
        .attr("class", "axis-text")
        .text("Gun Deaths (per 100,000 residents)");
  
    // Append x-axis labels
    chart
        .append("text")
        .style("font-family", "arial")
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .attr(
            "transform",
            "translate(" + width / 2 + " ," + (height + margin.top + 30) + ")"
        )
        .attr("class", "axis-text")
        .text("Gun Ownership (percentage of adults)");

// Calculate a linear regression from the data

    // Returns an object with two points, where each point is an object with an x and y coordinate

    function calcLinear(gunData, gun_ownership_perc,gun_deaths, minX, maxY){
  
        // Let n = the number of data points
        var n = gunData.length;
        console.log(n)
  
        // Get just the points
        var pts = [];
        gunData.forEach(function(d,i){
          var obj = {};
          obj.x = d[gun_ownership_perc];
          obj.y = d[gun_deaths];
          obj.mult = obj.x*obj.y;
          pts.push(obj);
        });
        console.log(pts)
  
        var sum = 0;
        var xSum = 0;
        var ySum = 0;
        var sumSq = 0;
        pts.forEach(function(pt){
          sum = sum + pt.mult;
          xSum = xSum + pt.x;
          ySum = ySum + pt.y;
          sumSq = sumSq + (pt.x * pt.x);
        });
        var a = sum * n;
        var b = xSum * ySum;
        var c = sumSq * n;
        var d = xSum * xSum;
        console.log(a)
        console.log(b)
        console.log(c)
        console.log(d)
  
        // Plug the values that you calculated for a, b, c, and d into the following equation to calculate the slope
        // slope = m = (a - b) / (c - d)
        var m = (a - b) / (c - d);
        var e = ySum;
        var f = m * xSum;
        var b = (e - f) / n;

        // return an object of two points
        // each point is an object with an x and y coordinate
        return {
          ptA : {
            x: minX,
            y: m * minX + b
          },
          ptB : {
            y: maxY,
            x: (maxY - b) / m
          }
        }
  
      }

});