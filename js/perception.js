
Perception = function(_parentElement, _comp, _mono){
    this.parentElement = _parentElement;
    this.compData = _comp.splice(0,5);
    this.filteredData = this.data;
    this.monoData = _mono;

    this.initVis();
}


/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

Perception.prototype.initVis = function(){
    var vis = this;

    vis.margin = {top: 10, bottom: 20, left: 100, right: 120};
    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = vis.width + 50 - vis.margin.top - vis.margin.bottom;
    // vis.width = 350;
    // vis.height = 220;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.compData.sort(function(a, b) { return b.Very_positive - a.Very_positive; });

    // Scales and axes
    vis.x = d3.scaleBand()
        .domain(vis.compData.map(function(d) {return d.Company}))
        .rangeRound([0, vis.width])
        .paddingInner(0.3);

    vis.y = d3.scaleLinear()
        .domain([0, 100])
        .range([vis.height, 0])

    vis.xAxis = d3.axisBottom()
        .scale(vis.x);

    vis.yAxis = d3.axisLeft()
        .scale(vis.y);

    vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + vis.height + ")")
        .call(vis.xAxis);

    vis.svg.append("g")
        .attr("class", "y-axis axis")
        .call(vis.yAxis);

    vis.colorScale = d3.scaleOrdinal()
        .domain(["Very_positive","Rather_positive","Neutral","Rather_negative","Very_negative","Not_answered"])
        .range(['#1a9641','#a6d96a','#ffffbf','#fdae61','#d7191c', '#D3D3D3']);

    vis.colors = ['#1a9641','#a6d96a','#ffffbf','#fdae61','#d7191c', '#D3D3D3']

    // vis.dataCategories = vis.x.domain();
    vis.dataCategories = ["Very_positive","Rather_positive","Neutral","Rather_negative","Very_negative","Not_answered"]
    vis.stack = d3.stack()
        .keys(vis.dataCategories);

    vis.stackedData = vis.stack(vis.compData);

    // vis.y.domain([0, d3.max(vis.stackedData, function(d) {  return d3.max(d, function(d) { return d[0] + d[1]; })})])

    vis.svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (vis.width + 10) + "," + (vis.height - 110) + ")");

    vis.legend = d3.legendColor()
        .labels(["Very Positive", "Rather Positive", "Neutral", "Rather Negative", "Very Negative", 'Not Answered'])
        .shapeWidth(20);

    vis.legend
        .title("Perception")
        .labelFormat(d3.format(".2s"))
        .scale(vis.colorScale);

    vis.svg.select(".legend")
        .call(vis.legend);

    vis.tool_tip = d3.tip()
        .attr("class", "d3-tip")
        // .offset([-8, 0]);

    vis.tool_tip.html(function(d) {return (d[1] - d[0]) + "%" });

    vis.svg.call(vis.tool_tip);

    // (Filter, aggregate, modify data)
    vis.wrangleData();
}



/*
 * Data wrangling
 */

Perception.prototype.wrangleData = function(){
    var vis = this;



    vis.updateVis();
}



/*
 * The drawing function
 */

Perception.prototype.updateVis = function(){
    var vis = this;

    vis.groups = vis.svg.selectAll("g.cost")
        .data(vis.stackedData)
        .enter().append("g")
        .attr("class", "cost")
        .style("fill", function(d, i) {return vis.colors[i]});

    vis.rect = vis.groups.selectAll("rect")
        .data(function(d) { return d; })
        .enter()
        .append("rect")
        .attr("x", function(d) { return vis.x(d.data.Company); })
        .attr("y", function(d) { return vis.y(d[1]); })
        .attr("height", function(d) { return vis.y(d[0]) - vis.y(d[1]); })
        .attr("width", vis.x.bandwidth())
        .on('mouseover', vis.tool_tip.show)
        .on('mouseout', vis.tool_tip.hide);

    vis.svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 30)
        .attr("x", 0 - (height / 2) + 90)
        .attr("dy", "1em")
        .style("font-size", "10px")
        .style("text-anchor", "middle")
        .text("Percentage of Survey");
}


Perception.prototype.onSelectionChange = function(selection){
    var vis = this;

    vis.wrangleData();
}
