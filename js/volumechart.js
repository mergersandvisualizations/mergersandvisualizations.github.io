var margin = {top: 20, bottom: 80, left: 70, right: 0};
var width = 700 - margin.left - margin.right;
var height = 550 - margin.top - margin.bottom;

// x y scales
var x_vol = d3.scaleLinear()
    .domain([1985, 2020])
    .range([0, width]);

var y_vol = d3.scaleLinear()
    .range([height, 0]);

// Add the axes and a title
var xAxis_vol = d3.axisBottom(x_vol)
    .ticks(16)
    .tickFormat(d3.format('.4'));

var yAxis_vol = d3.axisLeft(y_vol);

// volumeChart = svg
var volumeChart = d3.select("#volume-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return "<strong>Year: </strong>" + d.Year + "<br><strong>Number of Acquisitions: </strong>" + d.Number + "<br><strong>Value: $</strong>" + d.Value + " bil USD";
    });

volumeChart.call(tip);

d3.csv("data/acquisitions_data/acquisition_volume.csv", function(error, data) {
    data.forEach(function(d) {
        d.Year = +d.Year;
        d.Number = +d.Number;
        d.Value = +d.Value;
    });

    y_vol.domain([0, d3.max(data, function(d) { return d.Number; })]);

    volumeChart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis_vol)
        .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.9em")
            .attr("dy", "-.1em")
            .attr("transform", "rotate(-45)" );

    // text label for the x axis
    volumeChart.append("text")
        .attr("transform",
            "translate(" + (width/2) + " ," +
            (height + margin.top + 55) + ")")
        .style("text-anchor", "middle")
        .text("Year");

    volumeChart.append("g")
        .attr("class", "y axis")
        .call(yAxis_vol);

    // text label for the y axis
    volumeChart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Number of Acquisitions");

    volumeChart.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class","bar_vol")
        .attr("x", function(d) { return x_vol(d.Year); })
        .attr("width", 15)
        .attr("y", function(d) { return y_vol(d.Number); })
        .attr("height", function(d) { return height - y_vol(d.Number); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);


});