
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

    vis.margin = { top: 20, right: 20, bottom: 200, left: 60 };

    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
        vis.height = 500 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.corps = []

    for (var k in vis.row) vis.corps.push(k)

    vis.corps.splice(0, 1)

    vis.x = d3.scaleBand()
        .rangeRound([0, vis.width])
        .paddingInner(0.1)
        .domain(vis.corps);

    vis.y = d3.scaleLinear()
        .range([vis.height, 0]);

    vis.xAxis = d3.axisBottom()
        .scale(vis.x);

    vis.yAxis = d3.axisLeft()
        .tickFormat(d3.format("$.2s"))
        .scale(vis.y);

    vis.xAxisContain = vis.svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + vis.height + ")");

    vis.yAxisContain = vis.svg.append("g")
        .attr("class", "axis y-axis");


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

    vis.rect = vis.svg.selectAll("rect")
        .data(vis.row);

    vis.y.domain([0, d3.max(vis.row, function(d) { return d[1]})]);

    vis.xAxis.scale(vis.x);
    vis.yAxis.scale(vis.y);

    vis.svg.selectAll("#axis").remove();

    vis.xAxisContain.transition()
        .duration(500)
        .call(vis.xAxis);

    vis.yAxisContain.transition()
        .duration(500)
        .call(vis.yAxis);


    console.log(vis.row)

    vis.rect
        .enter()
        .append("rect")
        .attr("class", "bar")
        .merge(vis.rect)
        .transition()
        .duration(500)
        .attr("x", function(d) {return vis.x(d[0]);})
        .attr("y", function(d) { return vis.y(d[1]); })
        .attr("width", vis.x.bandwidth())
        .attr("height", function(d) { return vis.height - vis.y(d[1]); })
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
        });

    vis.rect.exit().remove();

}


BarchartMC.prototype.onSelectionChange = function(selection){
    var vis = this;

    console.log(selection)

    vis.row = vis.data[selection.getFullYear() - 1979]

    vis.wrangleData();
}