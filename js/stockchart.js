
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

    vis.margin = {top: 10, bottom: 20, left: 50, right: 0};
    // vis.width = 600 - vis.margin.left - vis.margin.right;
    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = vis.width * 0.6 - vis.margin.top - vis.margin.bottom;
    // vis.width = 500;
    // vis.height = 250;

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

    // vis.tip_path = vis.svg.append("g")
    //     .append("path")
    //     .attr("class", "tip_line")

    vis.tool_tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8,0]);

    vis.tool_tip.html(function (d){return (vis.formatDate(d.YEAR) + "<br>" + vis.selectedChartData + ": " + d[vis.selectedChartData]);});

    vis.svg.call(vis.tool_tip);

    vis.xGroup = vis.svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0, " + vis.height + ")");

    vis.yGroup = vis.svg.append("g")
        .attr("class", "axis y-axis");

    vis.svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 25)
        .attr("x", 0 - (height / 2) + 125)
        .attr("dy", "1em")
        .style("font-size", "10px")
        .style("text-anchor", "middle")
        .text("Price ($ USD)");

    vis.selectedChartData = "AAPL"

    // vis.tip_line = vis.svg.append("g").append('line')
    //     .attr("class", "x-hover-line hover-line")
    //     .attr("class", "y-hover-line hover-line")
    //
    // vis.tip_line.append("circle")
    //     .attr("r", 7.5);
    //
    //
    // vis.tip_line.attr('stroke', '#515254')
    //     .attr('x1', vis.x(vis.parseDate("12/01/2000")))
    //     .attr('x2', vis.x(vis.parseDate("12/01/2000")))
    //     .attr('y1', 0)
    //     .attr('y2', vis.height)
    //     .attr('stroke-width', 2);

    // vis.svg.append('line')
    //     .attr("class", "vert")
    //     .attr('x1', vis.x(vis.parseDate("12/01/00")))
    //     .attr('x2', vis.x(vis.parseDate("12/01/00")))
    //     .attr('y1', 0)
    //     .attr('y2', vis.height)
    //     .attr('stroke-width', 2);

    // vis.tip_line = d3.line()
    //     .curve(d3.curveLinear)
    //     .x(function(d) { return vis.x(vis.parseDate("12/01/00")); })
    //     .y(function(d) { return vis.y(d.ID - 227); });

  // (Filter, aggregate, modify data)
    vis.wrangleData();
}



/*
 * Data wrangling
 */

Stockchart.prototype.wrangleData = function(){
    var vis = this;

    vis.updateVis();
}



/*
 * The drawing function
 */

Stockchart.prototype.updateVis = function(){
    var vis = this;


    // vis.chartData = document.getElementById("chart-data");
    // vis.selectedChartData = vis.chartData.options[vis.chartData.selectedIndex].value;

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
    vis.y.domain([0, d3.max(vis.filteredData, function(d) { return +d[vis.selectedChartData]; })]);

    vis.line = d3.line()
        .curve(d3.curveMonotoneX)
        .x(function(d) { return vis.x(d.YEAR); })
        .y(function(d) { return vis.y(d[vis.selectedChartData]); });

    vis.path.datum(vis.filteredData, function(d) { return d.ID; })
        .transition()
        .duration(800)
        .attr("d", vis.line)
        .attr("stroke", function(d) {
                if (d[vis.selectedChartData] == '') {
                    return "transparent"
                } else if (vis.selectedChartData == 'AAPL') {
                    return "#7d7d7d"
                } else if (vis.selectedChartData == 'AMZN') {
                    return "#ff9900"
                } else if (vis.selectedChartData == 'MSFT') {
                    return "black"
                } else if (vis.selectedChartData == 'FB') {
                    return "#3b5998"
                } else if (vis.selectedChartData == 'GOOG') {
                    return "#3cba54"
                } else if (vis.selectedChartData == 'S&P500') {
                    return "#ff0000"
                } else if (vis.selectedChartData == 'VGT') {
                    return "#21A0DF"
                } else if (vis.selectedChartData == 'ADBE') {
                    return "#ff0000"
                } else if (vis.selectedChartData == 'CSCO') {
                    return "#C5112E"
                } else if (vis.selectedChartData == 'IBM') {
                    return "#1F70C1"
                } else if (vis.selectedChartData == 'INTC') {
                    return "#0071c5"
                } else if (vis.selectedChartData == 'CRM') {
                    return "#21A0DF"
                }
            })
        .attr("fill", function(d) {
            if (d[vis.selectedChartData] == '') {
                return "transparent"
            } else if (vis.selectedChartData == 'AAPL') {
                return "#7d7d7d"
            } else if (vis.selectedChartData == 'AMZN') {
                return "#ff9900"
            } else if (vis.selectedChartData == 'MSFT') {
                return "black"
            } else if (vis.selectedChartData == 'FB') {
                return "#3b5998"
            } else if (vis.selectedChartData == 'GOOG') {
                return "#3cba54"
            } else if (vis.selectedChartData == 'S&P500') {
                return "#ff0000"
            } else if (vis.selectedChartData == 'VGT') {
                return "#21A0DF"
            } else if (vis.selectedChartData == 'ADBE') {
                return "#ff0000"
            } else if (vis.selectedChartData == 'CSCO') {
                return "#C5112E"
            } else if (vis.selectedChartData == 'IBM') {
                return "#1F70C1"
            } else if (vis.selectedChartData == 'INTC') {
                return "#0071c5"
            } else if (vis.selectedChartData == 'CRM') {
                return "#21A0DF"
            }
        })
        .attr("stroke-width", function(d){
            if (d[vis.selectedChartData] == ''){
                return 0;
            } else {
                return .5;
            }});

    // vis.tip_path.datum(vis.filteredData)
    //     .attr("d", vis.tip_line)

    vis.circle = vis.svg.selectAll("circle")
        .data(vis.filteredData, function(d){
            return d.ID
        });

    // vis.circle.exit().remove();

    vis.circle.enter().append("circle")
        .merge(vis.circle)
        .transition()
        .duration(800)
        .attr("class", "circle")
        .attr("fill", function(d) {
            if (d[vis.selectedChartData] == '') {
                return "transparent"
            } else if (vis.selectedChartData == 'AAPL') {
                return "#7d7d7d"
            } else if (vis.selectedChartData == 'AMZN') {
                return "#ff9900"
            } else if (vis.selectedChartData == 'MSFT') {
                return "black"
            } else if (vis.selectedChartData == 'FB') {
                return "#3b5998"
            } else if (vis.selectedChartData == 'GOOG') {
                return "#3cba54"
            } else if (vis.selectedChartData == 'S&P500') {
                return "#ff0000"
            } else if (vis.selectedChartData == 'VGT') {
                return "#21A0DF"
            } else if (vis.selectedChartData == 'ADBE') {
                return "#ff0000"
            } else if (vis.selectedChartData == 'CSCO') {
                return "#C5112E"
            } else if (vis.selectedChartData == 'IBM') {
                return "#1F70C1"
            } else if (vis.selectedChartData == 'INTC') {
                return "#0071c5"
            } else if (vis.selectedChartData == 'CRM') {
                return "#21A0DF"
            }
        })
        .attr("stroke", function(d) {
            if (d[vis.selectedChartData] == '') {
                return "transparent"
            } else if (vis.selectedChartData == 'AAPL') {
                return "#7d7d7d"
            } else if (vis.selectedChartData == 'AMZN') {
                return "#ff9900"
            } else if (vis.selectedChartData == 'MSFT') {
                return "black"
            } else if (vis.selectedChartData == 'FB') {
                return "#3b5998"
            } else if (vis.selectedChartData == 'GOOG') {
                return "#3cba54"
            } else if (vis.selectedChartData == 'S&P500') {
                return "#ff0000"
            } else if (vis.selectedChartData == 'VGT') {
                return "#21A0DF"
            } else if (vis.selectedChartData == 'ADBE') {
                return "#ff0000"
            } else if (vis.selectedChartData == 'CSCO') {
                return "#C5112E"
            } else if (vis.selectedChartData == 'IBM') {
                return "#1F70C1"
            } else if (vis.selectedChartData == 'INTC') {
                return "#0071c5"
            } else if (vis.selectedChartData == 'CRM') {
                return "#21A0DF"
            }
        })
        .attr("cx", function(d) { return vis.x(d["YEAR"]); })
        .attr("cy", function(d) { return vis.y(d[vis.selectedChartData]); })
        .attr("r", .7)

    vis.circle
        .on("mouseover", vis.tool_tip.show)
        .on("mouseout", vis.tool_tip.hide)

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

    vis.selectedChartData = selection

    // if (vis.tip_line) vis.tip_line.attr('stroke', 'none');
    //
    // vis.tip_line.attr('stroke', '#515254')
    //     .attr('x1', vis.x(year))
    //     .attr('x2', vis.x(year))
    //     .attr('y1', 0)
    //     .attr('y2', vis.height)
    //     .attr('stroke-width', 2);


    vis.wrangleData();
}
