
var margin = {top: 0, right: 10, bottom: 0, left: 10};

var width = 700 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

var svg = d3.select("#map-US").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var projection = d3.geoMercator()
    // .translate([(width / 2), (height / 2)])
    // .scale(200);

queue()
    .defer(d3.json, "data/us-10m.v1.json")
    // .defer(d3.csv, "data/global-malaria-2015.csv")
    .await(function(error, mapTopUs) {

        console.log(mapTopUs.objects.states)

        var us = topojson.feature(mapTopUs, mapTopUs.objects.states).features

        svg.append("g")
            .selectAll("path")
            .data(us)
            .enter()
            .append("path")
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            // .attr("fill", function (d) { return "black"});

    })


