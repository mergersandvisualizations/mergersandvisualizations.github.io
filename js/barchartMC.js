
BarchartMC = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.row = this.data[0]
    this.filteredData = this.data;

    this.initVis();
}


/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

BarchartMC.prototype.initVis = function(){
    var vis = this;

    vis.margin = {top: 20, bottom: 60, left: 100, right: 130};
    // vis.width = $("#" + vis.parentElement).width() - 50 - vis.margin.left - vis.margin.right;
    // vis.height = vis.width - vis.margin.top - vis.margin.bottom;

    vis.width = 700 - vis.margin.left - vis.margin.right;
    vis.height = 200 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.x = d3.scaleBand()
        .rangeRound([0, vis.height])
        // .rangeRound([0, vis.width])
        .paddingInner(0.1);

    vis.y = d3.scaleLinear()
        .range([0, vis.width])
        // .range([vis.height, 0])
        .domain([0, 849500000000]);

    // vis.xAxis = d3.axisBottom()
    //     .scale(vis.x);
    //
    // vis.yAxis = d3.axisLeft()
    //     .tickFormat(d3.format("$.2s"))
    //     .scale(vis.y);

    vis.xAxis = d3.axisLeft()
        .scale(vis.x)
        .tickFormat(function(d) {
            if (d == "fb") {
                return "Facebook"
            } if (d == "aapl") {
                return "Apple"
            } else if (d == "amzn") {
                return "Amazon"
            } else if (d == "msft") {
                return "Microsoft"
            } else if (d == "googl") {
                return "Google"
            } else if (d == "adbe") {
                return "Adobe"
            } else if (d == "csco") {
                return "Cisco"
            } else if (d == "ibm") {
                return "IBM"
            } else if (d == "intc") {
                return "Intel"
            } else if (d == "crm") {
                return "Salesforce"
            }
        });

    vis.yAxis = d3.axisTop()
        .tickFormat(d3.format("$.2s"))
        // .ticks(9)
        // .tickValues([0, 100, 200, 300, 400, 500, 600, 700, 800])
        .scale(vis.y);

    vis.xAxisContain = vis.svg.append("g")
        .attr("class", "axis x-axis")
        // .attr("transform", "translate(0," + vis.height + ")");

    vis.yAxisContain = vis.svg.append("g")
        .attr("class", "axis y-axis");

    vis.tool_tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 0]);

    vis.tool_tip.html(function(d) { return (d[0]).toUpperCase() + "<br/>MktCap: " + d3.format('.2s')(d[1]).replace(/G/, 'B'); });

    vis.svg.call(vis.tool_tip);

    // (Filter, aggregate, modify data)
    vis.wrangleData();
}



/*
 * Data wrangling
 */

BarchartMC.prototype.wrangleData = function(){
    var vis = this;

    vis.temp = []

    for (var k in vis.row) vis.temp.push([k, vis.row[k]])

    vis.temp.splice(0,1)

    vis.row = vis.temp


    vis.updateVis();
}



/*
 * The drawing function
 */

BarchartMC.prototype.updateVis = function(){
    var vis = this;

    vis.row = vis.row.sort(function(a, b){ return b[1] - a[1]})

    vis.rect = vis.svg.selectAll("rect")
        .data(vis.row, function(d) {
            return d[0]
        });

    vis.x.domain(vis.row.map(function(d) { return d[0]}))
    // vis.y.domain([0, d3.max(vis.row, function(d) { return d[1]})]);

    vis.xAxis.scale(vis.x);
    vis.yAxis.scale(vis.y);

    vis.svg.selectAll("#axis").remove();

    vis.xAxisContain.transition()
        .duration(500)
        .call(vis.xAxis);

    vis.yAxisContain.transition()
        .duration(500)
        .call(vis.yAxis);

    vis.rect
        .enter()
        .append("rect")
        .attr("class", "bar")
        .merge(vis.rect)
        .transition()
        .duration(500)
        // .attr("x", function(d) {return vis.x(d[0]);})
        // .attr("y", function(d) { return vis.y(d[1]); })
        // .attr("width", vis.x.bandwidth())
        // .attr("height", function(d) { return vis.height - vis.y(d[1]); })
        .attr("x", 0) //function(d) {return vis.x(d[0]);})
        .attr("y", function(d) { return vis.x(d[0]); })
        .attr("width", function(d) { return vis.y(d[1]); })
        .attr("height", vis.x.bandwidth())
        .attr("fill", function(d){
            if (d[0] == "fb") {
                return "#3b5998"
            } if (d[0] == "aapl") {
                return "#7d7d7d"
            } else if (d[0] == "amzn") {
                return "#ff9900"
            } else if (d[0] == "msft") {
                return "black"
            } else if (d[0] == "googl") {
                return "#3cba54"
            } else if (d[0] == "adbe") {
                return "#ff0000"
            } else if (d[0] == "csco") {
                return "#C5112E"
            } else if (d[0] == "ibm") {
                return "#1F70C1"
            } else if (d[0] == "intc") {
                return "#0071c5"
            } else if (d[0] == "crm") {
                return "#21A0DF"
            }
        })

     vis.rect
        .on('mouseover', vis.tool_tip.show)
        .on('mouseout', vis.tool_tip.hide)
        .on('click', function(d) {
            if (d[0] == 'googl') {
                stockchart.onSelectionChange('GOOG')
            } else {
                stockchart.onSelectionChange(d[0].toUpperCase())
            }

        });

    vis.rect.exit().remove();

}


BarchartMC.prototype.onSelectionChange = function(selection){
    var vis = this;

    if (selection > 2019) {
        selection = 2019
    }

    vis.row = vis.data[selection - 1979]

    d3.select('.value-time').text(selection);

    vis.wrangleData();
}
