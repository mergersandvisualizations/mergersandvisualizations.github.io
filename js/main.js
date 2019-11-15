
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

var tool_tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, 0]);

var circleScale = d3.scaleLinear()
    .domain([0, 1200000000000])
    .range([0,100])

var forceData = {"nodes":[], "links":[]};

var aaplMC, amznMC, fbMC, googlMC, msftMC, cities, aaplCircle;

var MCjs = {"aapl": [], "amzn": [], "fb": [], "goog": [], "msft": []};

queue()
    .defer(d3.json, "data/states-10m.json")
    .defer(d3.csv, "data/cities-over-250k.csv")
    .defer(d3.csv, "data/aapl_marketcap_clean.csv")
    .defer(d3.csv, "data/amzn_marketcap_clean.csv")
    .defer(d3.csv, "data/fb_marketcap_clean.csv")
    .defer(d3.csv, "data/googl_marketcap_clean.csv")
    .defer(d3.csv, "data/msft_marketcap_clean.csv")
    .await(function(error, mapTopoUs, citiesTopo, aaplMCt, amznMCt, fbMCt, googlMCt, msftMCt) {

        console.log(mapTopoUs)
        console.log(citiesTopo)

        var count = 1980;

        citiesTopo.forEach(function(d,i){
            d.latitude = +d.latitude
            d.longitude = +d.longitude
            d.POP_2010 = +d.POP_2010

            forceData.nodes.push({"id":i+1, "name": d.NAME, "latitude": d.latitude, "longitude": d.longitude})
        })

        aaplMCt.forEach(function(d){
            d.Date = new Date(d.Date)
            d.MarketCap = +d.MarketCap

            if (count == d.Date.getFullYear()) {
                count += 1
                MCjs.aapl.push({"year": new Date(d.Date.getFullYear(), 0, 1), "marketcap": d.MarketCap})
            }
        })

        console.log(MCjs)

        console.log(MCjs.aapl)

        amznMCt.forEach(function(d){
            d.Date = new Date(d.Date)
            d.MarketCap = +d.MarketCap
        })

        fbMCt.forEach(function(d){
            d.Date = new Date(d.Date)
            d.MarketCap = +d.MarketCap
        })

        googlMCt.forEach(function(d){
            d.Date = new Date(d.Date)
            d.MarketCap = +d.MarketCap
        })

        msftMCt.forEach(function(d){
            d.Date = new Date(d.Date)
            d.MarketCap = +d.MarketCap
        })

        cities = citiesTopo

        aaplMC = aaplMCt
        amznMC = amznMCt
        fbMC = fbMCt
        googlMC = googlMCt
        msftMC = msftMCt


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
        // svg.selectAll(".city")
        //     .data(citiesTopo)
        //     .enter().append("circle")
        //     .attr("class", "city")
        //     .attr("r", 5) // size will be by how big the company is
        //     .attr("fill", "yellow")
        //     .attr("transform", function(d) {
        //         // console.log(d)
        //         return "translate(" + projection([d.longitude, d.latitude]) + ")";
        //     })

        // also added city names
        // comment out if unneeded
        // svg.append("g")
        //     .selectAll(".city")
        //     .data(citiesTopo)
        //     .enter()
        //     .append("text")
        //     .attr("class", "city")
        //     .attr("transform", function(d) {
        //         // console.log(d)
        //         return "translate(" + projection([d.longitude, d.latitude]) + ")";
        //     })
        //     .text(function(d){
        //         return d.NAME
        //     })

        aaplCircle = svg
        // .selectAll(".aapl")
            .append("circle")
            .attr("class", "aapl")
            .attr("r", 0) // size will be by how big the company is
            .attr("fill", "red")
            .attr("transform", function(d) {
                return "translate(" + projection([-121.8949555, 37.3393857,]) + ")";
            })

        svg.call(tool_tip);

        // inspiration from https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518
        var dataTime = d3.range(0, 40).map(function(d) {
            return new Date(1980 + d, 0, 1);
        });

        var dataStepTime = d3.range(0, 40, 5).map(function(d) {
            return new Date(1980 + d, 0, 1);
        });

        var sliderTime = d3
            .sliderBottom()
            .min(d3.min(dataTime))
            .max(d3.max(dataTime))
            .step(1000 * 60 * 60 * 24 * 365)
            .width(700)
            .tickFormat(d3.timeFormat('%Y'))
            .tickValues(dataStepTime)
            .default(new Date(1980, 1, 1))
            .on('onchange', val => {
                updateMarketCap(val)
                d3.select('p#value-time').text(d3.timeFormat('%Y')(val));
            });

        var gTime = d3
            .select('div#slider-time')
            .append('svg')
            .attr('width', 900)
            .attr('height', 100)
            .append('g')
            .attr('transform', 'translate(15,30)');

        gTime.call(sliderTime);

        d3.select('p#value-time').text(d3.timeFormat('%Y')(sliderTime.value()));

    })

var mcFormat = d3.format("$.2s")

function updateMarketCap(currentDate) {

    // var aaplCircle = svg.selectAll(".aapl")
    //     .data(MCjs.aapl)
    //
    // console.log("Call")
    //
    // aaplCircle.enter().append("circle")
    //     .attr("class", "corp")
    //     .merge(MCjs.aapl)
    //     // .transition()
    //     .attr("r", MCjs.aapl) // size will be by how big the company is
    //     .attr("fill", "red")
    //     .attr("transform", function(d) {
    //         // console.log(d)
    //         return "translate(" + projection([-121.8949555, 37.3393857,]) + ")";
    //         // return "translate(" + projection([d.longitude, d.latitude]) + ")";
    //     })
    //
    // aaplCircle.remove();

    aaplCircle.remove();

    var date_index = currentDate.getFullYear() - 1980

    aaplCircle = svg
        // .selectAll(".aapl")
        .append("circle")
        .attr("class", "aapl")
        .attr("r", function(){
            return circleScale(MCjs.aapl[date_index]["marketcap"])
        }) // size will be by how big the company is
        .attr("fill", "red")
        .attr("transform", "translate(" + projection([-121.8949555, 37.3393857,]) + ")")
        .on("mouseover", tool_tip.html("Apple<br>Market Cap: " +
            mcFormat(MCjs.aapl[date_index]["marketcap"]).replace(/G/,"B")).show)
        .on("mouseout", tool_tip.hide);


}


