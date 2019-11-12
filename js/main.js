
var margin = {top: 0, right: 10, bottom: 0, left: 10};

var width = 700 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

var svg = d3.select("#map-US").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var projection = d3.geoAlbersUsa()
    .translate([(width / 2), (height / 2)])
    .scale(800);

var forceData = {"nodes":[], "links":[]};

queue()
    .defer(d3.json, "data/states-10m.json")
    .defer(d3.csv, "data/cities-over-250k.csv")
    .await(function(error, mapTopoUs, citiesTopo) {

        console.log(mapTopoUs)
        console.log(citiesTopo)

        citiesTopo.forEach(function(d,i){
            d.latitude = +d.latitude
            d.longitude = +d.longitude
            d.POP_2010 = +d.POP_2010

            forceData.nodes.push({"id":i+1, "name": d.NAME, "latitude": d.latitude, "longitude": d.longitude})
        })

        console.log(forceData)

        var us = topojson.feature(mapTopoUs, mapTopoUs.objects.states).features

        console.log(us)

        svg.append("g")
            .selectAll("path")
            .data(us)
            .enter()
            .append("path")
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            .attr("fill", function (d) { return "white"})
            .attr("stroke", "black");

        // just added cities here in case we need them to pinpoint startups
        // comment out if unneeded
        svg.selectAll(".city")
            .data(citiesTopo)
            .enter().append("circle")
            .attr("class", "city")
            .attr("r", 5) // size will be by how big the company is
            .attr("fill", "yellow")
            .attr("transform", function(d) {
                // console.log(d)
                return "translate(" + projection([d.longitude, d.latitude]) + ")";
            })

        // also added city names
        // comment out if unneeded
        svg.append("g")
            .selectAll(".city")
            .data(citiesTopo)
            .enter()
            .append("text")
            .attr("class", "city")
            .attr("transform", function(d) {
                // console.log(d)
                return "translate(" + projection([d.longitude, d.latitude]) + ")";
            })
            .text(function(d){
                return d.NAME
            })

    })


