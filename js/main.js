
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

var aaplMC, amznMC, fbMC, googlMC, msftMC, cities, aaplCircle, amznCircle, fbCircle, googlCircle, msftCircle;

var MCjs = {"aapl": [], "amzn": [], "fb": [], "googl": [], "msft": [], "adbe": [], "csco": [], "intc": [], "ibm": [], "crm": []};

var byYearMC = [];

queue()
    .defer(d3.json, "data/states-10m.json")
    .defer(d3.csv, "data/cities-over-250k.csv")
    .defer(d3.csv, "data/aapl_marketcap_clean.csv")
    .defer(d3.csv, "data/amzn_marketcap_clean.csv")
    .defer(d3.csv, "data/fb_marketcap_clean.csv")
    .defer(d3.csv, "data/googl_marketcap_clean.csv")
    .defer(d3.csv, "data/msft_marketcap_clean.csv")
    .defer(d3.csv, "data/adbe_marketcap_clean.csv")
    .defer(d3.csv, "data/csco_marketcap_clean.csv")
    .defer(d3.csv, "data/ibm_marketcap_clean.csv")
    .defer(d3.csv, "data/intc_marketcap_clean.csv")
    .defer(d3.csv, "data/crm_marketcap_clean.csv")
    .await(function(error, mapTopoUs, citiesTopo, aaplMCt, amznMCt, fbMCt, googlMCt, msftMCt, ad, ci, ib, int, sa) {

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

        count = 1997;

        amznMCt.forEach(function(d){
            d.Date = new Date(d.Date)
            d.MarketCap = +d.MarketCap
            if (count == d.Date.getFullYear()) {
                count += 1
                MCjs.amzn.push({"year": new Date(d.Date.getFullYear(), 0, 1), "marketcap": d.MarketCap})
            }
        })

        count = 2012;

        fbMCt.forEach(function(d){
            d.Date = new Date(d.Date)
            d.MarketCap = +d.MarketCap
            if (count == d.Date.getFullYear()) {
                count += 1
                MCjs.fb.push({"year": new Date(d.Date.getFullYear(), 0, 1), "marketcap": d.MarketCap})
            }
        })

        count = 2004;

        googlMCt.forEach(function(d){
            d.Date = new Date(d.Date)
            d.MarketCap = +d.MarketCap
            if (count == d.Date.getFullYear()) {
                count += 1
                MCjs.googl.push({"year": new Date(d.Date.getFullYear(), 0, 1), "marketcap": d.MarketCap})
            }
        })

        count = 1986;

        msftMCt.forEach(function(d){
            d.Date = new Date(d.Date)
            d.MarketCap = +d.MarketCap
            if (count == d.Date.getFullYear()) {
                count += 1
                MCjs.msft.push({"year": new Date(d.Date.getFullYear(), 0, 1), "marketcap": d.MarketCap})
            }
        })

        count = 1986

        ad.forEach(function(d){
            d.Date = new Date(d.Date)
            d.MarketCap = +d.MarketCap
            if (count == d.Date.getFullYear()) {
                count += 1
                MCjs.adbe.push({"year": new Date(d.Date.getFullYear(), 0, 1), "marketcap": d.MarketCap})
            }
        })

        count = 1990

        ci.forEach(function(d){
            d.Date = new Date(d.Date)
            d.MarketCap = +d.MarketCap
            if (count == d.Date.getFullYear()) {
                count += 1
                MCjs.csco.push({"year": new Date(d.Date.getFullYear(), 0, 1), "marketcap": d.MarketCap})
            }
        })

        count = 1979

        ib.forEach(function(d){
            d.Date = new Date(d.Date)
            d.MarketCap = +d.MarketCap
            if (count == d.Date.getFullYear()) {
                count += 1
                MCjs.ibm.push({"year": new Date(d.Date.getFullYear(), 0, 1), "marketcap": d.MarketCap})
            }
        })

        count = 1979

        int.forEach(function(d){
            d.Date = new Date(d.Date)
            d.MarketCap = +d.MarketCap
            if (count == d.Date.getFullYear()) {
                count += 1
                MCjs.intc.push({"year": new Date(d.Date.getFullYear(), 0, 1), "marketcap": d.MarketCap})
            }
        })

        count = 2004

        sa.forEach(function(d){
            d.Date = new Date(d.Date)
            d.MarketCap = +d.MarketCap
            if (count == d.Date.getFullYear()) {
                count += 1
                MCjs.crm.push({"year": new Date(d.Date.getFullYear(), 0, 1), "marketcap": d.MarketCap})
            }
        })

        var aaplAns = 0, amznAns = 0, fbAns = 0, googlAns = 0, msftAns = 0, adbeAns = 0, crmAns = 0, cscoAns = 0, ibmAns = 0, intcAns = 0;

        for (var i=1979; i < 2020; i++) {
            MCjs.aapl.forEach(function(d){
                if (i == d.year.getFullYear()) {
                    aaplAns = d.marketcap
                }
            })

            MCjs.amzn.forEach(function(d){
                if (i == d.year.getFullYear()) {
                    amznAns = d.marketcap
                }
            })

            MCjs.fb.forEach(function(d){
                if (i == d.year.getFullYear()) {
                    fbAns = d.marketcap
                }
            })

            MCjs.googl.forEach(function(d){
                if (i == d.year.getFullYear()) {
                    googlAns = d.marketcap
                }
            })

            MCjs.msft.forEach(function(d){
                if (i == d.year.getFullYear()) {
                    msftAns = d.marketcap
                }
            })



            MCjs.adbe.forEach(function(d){
                if (i == d.year.getFullYear()) {
                    adbeAns = d.marketcap
                }
            })

            MCjs.crm.forEach(function(d){
                if (i == d.year.getFullYear()) {
                    crmAns = d.marketcap
                }
            })

            MCjs.csco.forEach(function(d){
                if (i == d.year.getFullYear()) {
                    cscoAns = d.marketcap
                }
            })

            MCjs.ibm.forEach(function(d){
                if (i == d.year.getFullYear()) {
                    ibmAns = d.marketcap
                }
            })

            MCjs.intc.forEach(function(d){
                if (i == d.year.getFullYear()) {
                    intcAns = d.marketcap
                }
            })

            byYearMC.push({"year": i, "aapl": aaplAns, "amzn": amznAns, "fb": fbAns, "googl": googlAns, "msft": msftAns,
                "adbe": adbeAns, "crm": crmAns, "csco": cscoAns, "ibm": ibmAns, "intc": intcAns})

            aaplAns = 0, amznAns = 0, fbAns = 0, googlAns = 0, msftAns = 0, adbeAns = 0, crmAns = 0, cscoAns = 0, ibmAns = 0, intcAns = 0;
        }

        console.log(byYearMC)

        console.log(MCjs)

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

        // aaplCircle = svg.append("circle")
        //     .attr("class", "aapl")
        //     .attr("r", 0)
        //
        // amznCircle = svg.append("circle")
        //     .attr("class", "amzn")
        //     .attr("r", 0)
        //
        // fbCircle = svg.append("circle")
        //     .attr("class", "fb")
        //     .attr("r", 0)
        //
        // googlCircle = svg.append("circle")
        //     .attr("class", "googl")
        //     .attr("r", 0)
        //
        // msftCircle = svg.append("circle")
        //     .attr("class", "msft")
        //     .attr("r", 0)

        // tool_tip.html(function(name, mc){
        //     return name + "<br>Market Cap: " + d3.format("$.2s")(mc).replace(/G/, "B")
        // })

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

    // aaplCircle.remove();
    // amznCircle.remove();
    // fbCircle.remove();
    // googlCircle.remove();
    // msftCircle.remove();
    //
    // var aapl_date_index = currentDate.getFullYear() - 1980
    // var amzn_date_index = currentDate.getFullYear() - 1997
    // var fb_date_index = currentDate.getFullYear() - 2012
    // var googl_date_index = currentDate.getFullYear() - 2004
    // var msft_date_index = currentDate.getFullYear() - 1986
    //
    // aaplCircle = svg
    //     .append("circle")
    //     .attr("class", "aapl")
    //     .attr("r", function(){
    //         return circleScale(MCjs.aapl[aapl_date_index]["marketcap"])
    //     }) // size will be by how big the company is
    //     .attr("fill", "red")
    //     .attr("transform", "translate(" + projection([-121.8949555, 37.3393857]) + ")")
    //     // .on("mouseover", tool_tip.html("Apple<br>Market Cap: " +
    //     //     mcFormat(MCjs.aapl[aapl_date_index]["marketcap"]).replace(/G/,"B")).show)
    //     // .on("mouseout", tool_tip.hide);
    //
    // amznCircle = svg
    //     .append("circle")
    //     .attr("class", "amzn")
    //     .attr("r", function(){
    //         if (MCjs.amzn[amzn_date_index] == undefined) {
    //             return 0
    //         } else {
    //             return circleScale(MCjs.amzn[amzn_date_index]["marketcap"])
    //         }
    //     }) // size will be by how big the company is
    //     .attr("fill", "red")
    //     .attr("transform", "translate(" + projection([-122.33207080000, 47.60620950000]) + ")")
    //     // .on("mouseover", tool_tip.html(function(){
    //     //     if (MCjs.amzn[amzn_date_index] == undefined) {
    //     //         return "Amazon<br>Market Cap: "
    //     //     } else {
    //     //         return "Amazon<br>Market Cap: " +
    //     //             mcFormat(MCjs.amzn[amzn_date_index]["marketcap"]).replace(/G/,"B")
    //     //     }
    //     // }).show)
    //     // .on("mouseout", tool_tip.hide);
    //
    // fbCircle = svg
    //     .append("circle")
    //     .attr("class", "fb")
    //     .attr("r", function(){
    //         if (MCjs.fb[fb_date_index] == undefined) {
    //             return 0
    //         } else {
    //             return circleScale(MCjs.fb[fb_date_index]["marketcap"])
    //         }
    //     }) // size will be by how big the company is
    //     .attr("fill", "red")
    //     .attr("transform", "translate(" + projection([-121.8949555, 37.3393857,]) + ")")
    //     // .on("mouseover", tool_tip.html("Facebook<br>Market Cap: " +
    //     //     mcFormat(MCjs.fb[fb_date_index]["marketcap"]).replace(/G/,"B")).show)
    //     // .on("mouseout", tool_tip.hide);
    //
    // googlCircle = svg
    //     .append("circle")
    //     .attr("class", "googl")
    //     .attr("r", function(){
    //         if (MCjs.googl[googl_date_index] == undefined) {
    //             return 0
    //         } else {
    //             return circleScale(MCjs.googl[googl_date_index]["marketcap"])
    //         }
    //     }) // size will be by how big the company is
    //     .attr("fill", "red")
    //     .attr("transform", "translate(" + projection([-121.8949555, 37.3393857,]) + ")")
    //     // .on("mouseover", tool_tip.html("Google<br>Market Cap: " +
    //     //     mcFormat(MCjs.aapl[googl_date_index]["marketcap"]).replace(/G/,"B")).show)
    //     // .on("mouseout", tool_tip.hide);
    //
    // msftCircle = svg
    //     .append("circle")
    //     .attr("class", "msft")
    //     .attr("r", function(){
    //         if (MCjs.msft[msft_date_index] == undefined) {
    //             return 0
    //         } else {
    //             return circleScale(MCjs.msft[msft_date_index]["marketcap"])
    //         }
    //     }) // size will be by how big the company is
    //     .attr("fill", "red")
    //     .attr("transform", "translate(" + projection([-122.33207080000, 47.60620950000]) + ")")
    //     // .on("mouseover", tool_tip.html("Microsoft<br>Market Cap: " +
    //     //     mcFormat(MCjs.msft[msft_date_index]["marketcap"]).replace(/G/,"B")).show)
    //     // .on("mouseout", tool_tip.hide);


}


