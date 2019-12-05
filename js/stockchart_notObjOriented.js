// var margin = {top: 40, right: 40, bottom: 60, left: 60};
//
// var width = 600 - margin.left - margin.right,
//     height = 500 - margin.top - margin.bottom;
//
// var svg = d3.select("#chart-area").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//
// var fromDate = "12/01/80";
// var toDate = "12/01/19";
//
// var x = d3.scaleTime()
//     .range([0, width - 60]);
//
// var y = d3.scaleLinear()
//     .range([height, margin.top]);
//
// var formatDate = d3.timeFormat("%m/%d/%y");
//
// var parseDate = d3.timeParse("%m/%d/%y");
//
// // Initialize data
// loadData();
//
// // FIFA world cup
// var data;
//
// var filteredData;
//
// // Load CSV file
// function loadData() {
//     d3.csv("data/stockchart.csv", function(error, csv) {
//
//         csv.forEach(function(d){
//             // Convert string to 'date object'
//             d.YEAR = parseDate(d.YEAR);
//
//             // Convert numeric values to 'numbers'
//             d.AAPL = +d.AAPL;
//             d.AMZN = +d.AMZN;
//             d.MSFT = +d.MSFT;
//             d.FB = +d.FB;
//             d.GOOG = +d.GOOG;
//             d.SP500 = +d.SP500;
//             d.VGT = +d.VGT;
//         });
//
//         // Store csv data in global variable
//         data = csv;
//
//         console.log(data);
//         //xxx
//         filteredData = data;
//
//         // Draw the visualization for the first time
//         updateVisualization();
//
//         var tool_tip = d3.tip()
//             .attr("class", "3-tip")
//             .html(function (d){return (formatDate(d.YEAR) + "<br>" + "AAPL: " + d.AAPL);})
//             .offset([-30,0]);
//
//         svg.call(tool_tip);
//
//         var circle = svg.selectAll("circle")
//             .data(filteredData);
//
//         circle
//             .on("mouseover", tool_tip.show)
//             .on("mouseout", tool_tip.hide);
//         // .on("click", function(d){showEdition(d);});
//
//         circle.exit().remove();
//     });
// }
//
//
// function updateDate(){
//     var chartData = document.getElementById("chart-data");
//     var selectedChartData = chartData.options[chartData.selectedIndex].value;
//
//     if (selectedChartData == "AAPL") {
//         fromDate = "12/01/80";
//     } else if (selectedChartData == "AMZN") {
//         fromDate = "05/01/97";
//     } else if (selectedChartData == "MSFT") {
//         fromDate = "03/01/86";
//     } else if (selectedChartData == "FB") {
//         fromDate = "05/01/12";
//     } else {
//         fromDate = "08/01/04";
//     }
//
//     // fromDate = +document.getElementById("fromDate").value;
//     // toDate = +document.getElementById("toDate").value;
//     // filteredData = data.filter(function(value, index)
//     // 	{return (value["YEAR"].getFullYear() >= fromDate) && (value["YEAR"].getFullYear() <= toDate) ;});
//
//     updateVisualization();
// }
//
// // create path
// var path = svg.append("g")
//     .append("path")
//     .attr("class", "line");
//
// // Render visualization
// function updateVisualization() {
//     var chartData = document.getElementById("chart-data");
//     var selectedChartData = chartData.options[chartData.selectedIndex].value;
//
//     if (selectedChartData == "AAPL") {
//         fromDate = "12/01/80";
//     } else if (selectedChartData == "AMZN") {
//         fromDate = "04/01/97";
//     } else if (selectedChartData == "MSFT") {
//         fromDate = "02/01/86";
//     } else if (selectedChartData == "FB") {
//         fromDate = "04/01/12";
//     } else {
//         fromDate = "07/01/04";
//     }
//
//     filteredData = data.filter(function(value, index)
//     {return (value["YEAR"] >= parseDate(fromDate)) && (value["YEAR"] <= parseDate(toDate)) ;});
//
//
//     x.domain([parseDate(fromDate),
//         parseDate(toDate)]);
//     y.domain([0, d3.max(filteredData, function(d) { return d[selectedChartData]; })]);
//
//     var line = d3.line()
//         .curve(d3.curveMonotoneX)
//         .x(function(d) { return x(d["YEAR"]); })
//         .y(function(d) { return y(d[selectedChartData]); });
//
//     path.datum(filteredData)
//         .transition()
//         .duration(800)
//         .attr("d", line)
//         .attr("stroke", function(d){if (d[selectedChartData] == ''){return "transparent"}else{return "blue"}})
//         .attr("fill", function(d){if (d[selectedChartData] == ''){return "transparent"}else{return "blue"}})
//         .attr("stroke-width", function(d){if (d[selectedChartData] == ''){return 0;}else{return .5;}});
//
//     var tool_tip = d3.tip()
//         .attr("class", "3-tip")
//         .html(function (d){return (formatDate(d.YEAR) + "<br>" + selectedChartData + ": " + d[selectedChartData]);});
//
//     svg.call(tool_tip);
//
//     var circle = svg.selectAll("circle")
//         .data(filteredData);
//
//     circle
//         .on("mouseover", tool_tip.show)
//         .on("mouseout", tool_tip.hide)
//     // .on("click", function(d){showEdition(d);});
//
//     circle.exit().remove();
//
//     circle.enter().append("circle")
//         .attr("fill", "blue")
//         .attr("stroke", "blue")
//         .attr("class", "circle")
//         .attr("cx", function(d) { return x(d["YEAR"]); })
//         .attr("cy", function(d) { return y(d[selectedChartData]); })
//         .attr("r", 2)
//         .merge(circle)
//         .transition()
//         .duration(800)
//         .attr("class", "circle")
//         .attr("fill", function(d){if (d[selectedChartData] == ''){return "transparent"}else{return "blue"}})
//         .attr("stroke", function(d){if (d[selectedChartData] == ''){return "transparent"}else{return "blue"}})
//         .attr("cx", function(d) { return x(d["YEAR"]); })
//         .attr("cy", function(d) { return y(d[selectedChartData]); })
//         .attr("r", 2);
//
//     circle.exit().remove();
//
//     var xAxis = d3.axisBottom()
//         .scale(x);
//
//     var yAxis = d3.axisLeft()
//         .scale(y);
//
//     svg.select(".x-axis")
//         .transition()
//         .duration(800)
//         .call(xAxis);
//
//     svg.select(".y-axis")
//         .transition()
//         .duration(800)
//         .call(yAxis);
// }
//
//
// var xGroup = svg.append("g")
//     .attr("class", "axis x-axis")
//     .attr("transform", "translate(0, " + height + ")");
//
// var yGroup = svg.append("g")
//     .attr("class", "axis y-axis");