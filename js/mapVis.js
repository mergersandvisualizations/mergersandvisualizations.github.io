
MapVis = function(_parentElement, _data, _cities){
    this.parentElement = _parentElement;
    this.topo = _data;
    this.cities = _cities;

    this.initVis();
}


/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

MapVis.prototype.initVis = function(){
    var vis = this;

    vis.margin = { top: 20, right: 20, bottom: 200, left: 60 };

    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
        vis.height = 500 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.projection = d3.geoAlbersUsa()
        .translate([(vis.width / 2), (vis.height / 2)])
        .scale(800);

    vis.tool_tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 0]);

    vis.circleScale = d3.scaleLinear()
        .domain([0, 1200000000000])
        .range([0,100])

    vis.us = topojson.feature(vis.topo, vis.topo.objects.states).features

    console.log(vis.us)

    vis.svg.append("g")
        .selectAll("path")
        .data(vis.us)
        .enter()
        .append("path")
        .attr("d", d3.geoPath()
            .projection(vis.projection)
        )
        .attr("fill", function (d) { return "white"})
        .attr("stroke", "black");

    // just added cities here in case we need them to pinpoint startups
    // comment out if unneeded
    // vis.svg.selectAll(".city")
    //     .data(this.cities)
    //     .enter().append("circle")
    //     .attr("class", "city")
    //     .attr("r", 5) // size will be by how big the company is
    //     .attr("fill", "yellow")
    //     .attr("transform", function(d) {
    //         // console.log(d)
    //         return "translate(" + vis.projection([d.longitude, d.latitude]) + ")";
    //     })

    // also added city names
    // comment out if unneeded
    // vis.svg.append("g")
    //     .selectAll(".city")
    //     .data(vis.cities)
    //     .enter()
    //     .append("text")
    //     .attr("class", "city")
    //     .attr("transform", function(d) {
    //         // console.log(d)
    //         return "translate(" + vis.projection([d.longitude, d.latitude]) + ")";
    //     })
    //     .text(function(d){
    //         return d.NAME
    //     })


    // aaplCircle = mapSvg.append("circle")
    //     .attr("class", "aapl")
    //     .attr("r", 0)
    //
    // amznCircle = mapSvg.append("circle")
    //     .attr("class", "amzn")
    //     .attr("r", 0)
    //
    // fbCircle = mapSvg.append("circle")
    //     .attr("class", "fb")
    //     .attr("r", 0)
    //
    // googlCircle = mapSvg.append("circle")
    //     .attr("class", "googl")
    //     .attr("r", 0)
    //
    // msftCircle = mapSvg.append("circle")
    //     .attr("class", "msft")
    //     .attr("r", 0)

    // tool_tip.html(function(name, mc){
    //     return name + "<br>Market Cap: " + d3.format("$.2s")(mc).replace(/G/, "B")
    // })

    // vis.svg.call(tool_tip);


    // (Filter, aggregate, modify data)
    vis.wrangleData();
}



/*
 * Data wrangling
 */

MapVis.prototype.wrangleData = function(){
    var vis = this;


    vis.updateVis();
}



/*
 * The drawing function
 */

MapVis.prototype.updateVis = function(){
    var vis = this;

    vis.mcFormat = d3.format("$.2s")



    // var aaplCircle = mapSvg.selectAll(".aapl")
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
    // aaplCircle = mapSvg
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
    // amznCircle = mapSvg
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
    // fbCircle = mapSvg
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
    // googlCircle = mapSvg
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
    // msftCircle = mapSvg
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


MapVis.prototype.onSelectionChange = function(selectionStart, selectionEnd){
    var vis = this;

    vis.wrangleData();
}
