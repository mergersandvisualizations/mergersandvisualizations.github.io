
Stockchart = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.filteredData = _data
    this.initVis();
}


/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

Stockchart.prototype.initVis = function(){
    var vis = this;

    vis.margin = {top: 10, bottom: 20, left: 20, right: 10};
    vis.width = 600 - vis.margin.left - vis.margin.right;
    // vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = 500 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.fromDate = "12/01/80";
    vis.toDate = "12/01/19";

    vis.x = d3.scaleTime()
        .range([0, vis.width - 60]);

    vis.y = d3.scaleLinear()
        .range([vis.height, vis.margin.top]);

    vis.formatDate = d3.timeFormat("%m/%d/%y");

    vis.parseDate = d3.timeParse("%m/%d/%y");

    vis.path = vis.svg.append("g")
        .append("path")
        .attr("class", "line");


    vis.tool_tip = d3.tip()
        .attr("class", "3-tip")
        .html(function (d){return (vis.formatDate(d.YEAR) + "<br>" + "AAPL: " + d.AAPL);})
        .offset([-30,0]);

    vis.svg.call(vis.tool_tip);

    vis.xGroup = vis.svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0, " + vis.height + ")");

    vis.yGroup = vis.svg.append("g")
        .attr("class", "axis y-axis");




    vis.circle = vis.svg.selectAll("circle")
        .data(vis.filteredData);

    vis.circle
        .on("mouseover", vis.tool_tip.show)
        .on("mouseout", vis.tool_tip.hide);
    // .on("click", function(d){showEdition(d);});

    vis.circle.exit().remove();

  // (Filter, aggregate, modify data)
    vis.wrangleData();
}



/*
 * Data wrangling
 */

Stockchart.prototype.wrangleData = function(){
    var vis = this;

    vis.data.forEach(function(d){
        // Convert string to 'date object'
        d.YEAR = vis.parseDate(d.YEAR);

        // Convert numeric values to 'numbers'
        d.AAPL = +d.AAPL;
        d.AMZN = +d.AMZN;
        d.MSFT = +d.MSFT;
        d.FB = +d.FB;
        d.GOOG = +d.GOOG;
        d.SP500 = +d.SP500;
        d.VGT = +d.VGT;
    });



    vis.updateVis();
}



/*
 * The drawing function
 */

Stockchart.prototype.updateVis = function(){
    var vis = this;


    vis.chartData = document.getElementById("chart-data");
    vis.selectedChartData = vis.chartData.options[vis.chartData.selectedIndex].value;

    if (vis.selectedChartData == "AAPL") {
        vis.fromDate = "12/01/80";
    } else if (vis.selectedChartData == "AMZN") {
        vis.fromDate = "04/01/97";
    } else if (vis.selectedChartData == "MSFT") {
        vis.fromDate = "02/01/86";
    } else if (vis.selectedChartData == "FB") {
        vis.fromDate = "04/01/12";
    } else {
        vis.fromDate = "07/01/04";
    }

    vis.filteredData = vis.data.filter(function(value, index) {
        return (value["YEAR"] >= vis.parseDate(vis.fromDate)) && (value["YEAR"] <= vis.parseDate(vis.toDate)) ;
    });


    vis.x.domain([vis.parseDate(vis.fromDate), vis.parseDate(vis.toDate)]);
    vis.y.domain([0, d3.max(vis.filteredData, function(d) { return d[vis.selectedChartData]; })]);

    vis.line = d3.line()
        .curve(d3.curveMonotoneX)
        .x(function(d) { return vis.x(d["YEAR"]); })
        .y(function(d) { return vis.y(d[vis.selectedChartData]); });

    vis.path.datum(vis.filteredData)
        .transition()
        .duration(800)
        .attr("d", vis.line)
        .attr("stroke", function(d){
            if (d[vis.selectedChartData] == ''){
                return "transparent"
            } else {
                return "blue"
            }})
        .attr("fill", function(d){
            if (d[vis.selectedChartData] == ''){
                return "transparent"
            } else {
                return "blue"
            }})
        .attr("stroke-width", function(d){
            if (d[vis.selectedChartData] == ''){
                return 0;
            } else {
                return .5;
            }});

    vis.tool_tip = d3.tip()
        .attr("class", "3-tip")
        .html(function (d){return (vis.formatDate(d.YEAR) + "<br>" + vis.selectedChartData + ": " + d[vis.selectedChartData]);});

    vis.svg.call(vis.tool_tip);

    vis.circle = vis.svg.selectAll("circle")
        .data(vis.filteredData);

    vis.circle
        .on("mouseover", vis.tool_tip.show)
        .on("mouseout", vis.tool_tip.hide)
    // .on("click", function(d){showEdition(d);});

    vis.circle.exit().remove();

    vis.circle.enter().append("circle")
        .attr("fill", "blue")
        .attr("stroke", "blue")
        .attr("class", "circle")
        .attr("cx", function(d) { return vis.x(d["YEAR"]); })
        .attr("cy", function(d) { return vis.y(d[vis.selectedChartData]); })
        .attr("r", 2)
        .merge(vis.circle)
        .transition()
        .duration(800)
        .attr("class", "circle")
        .attr("fill", function(d){if (d[vis.selectedChartData] == ''){return "transparent"}else{return "blue"}})
        .attr("stroke", function(d){if (d[vis.selectedChartData] == ''){return "transparent"}else{return "blue"}})
        .attr("cx", function(d) { return vis.x(d["YEAR"]); })
        .attr("cy", function(d) { return vis.y(d[vis.selectedChartData]); })
        .attr("r", 2);

    vis.circle.exit().remove();

    vis.xAxis = d3.axisBottom()
        .scale(vis.x);

    vis.yAxis = d3.axisLeft()
        .scale(vis.y);

    vis.svg.select(".x-axis")
        .transition()
        .duration(800)
        .call(vis.xAxis);

    vis.svg.select(".y-axis")
        .transition()
        .duration(800)
        .call(vis.yAxis);

}


Stockchart.prototype.onSelectionChange = function(selection){
    var vis = this;
    vis.wrangleData();
}
