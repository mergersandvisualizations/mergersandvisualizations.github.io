
Piechart = function(_parentElement, _data, _total_data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.total_data = _total_data;

    this.initVis();
}


/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

Piechart.prototype.initVis = function(){
    var vis = this;

    vis.margin = {top: 20, bottom: 20, left: 0, right: 100};
    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = vis.width - 650 - vis.margin.top - vis.margin.bottom;
    vis.radius = Math.min(vis.width, vis.height) / 2

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + (vis.width * (2/5)) + "," + (vis.height / 2) + ")");

    vis.colorScale = d3.scaleOrdinal()
        .domain(['very_worried','concerned','dont_feel_good','dont_care','dont_know', 'positive', 'negative'])
        .range(['#d7191c','#fdae61','#a6d96a','#1a9641', '#D3D3D3', '#a50026','#006837']);

    vis.colorScale2 = d3.scaleOrdinal()
        .domain(['very_worried','dont_care','dont_know'])
        .range(['#a50026','#006837', '#D3D3D3']);

    vis.pie = d3.pie()
        .sort(null)

    vis.arc = d3.arc()
        .innerRadius(0)
        .outerRadius(vis.radius - 20)

    vis.arc2 = d3.arc()
        .innerRadius(vis.radius - 20)
        .outerRadius(vis.radius)

    vis.svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (vis.width * (2/10)) + "," + (-50) + ")");

    vis.legend = d3.legendColor()
        .labels(["Very Worried", "Concerned", "Don't Feel Good", "Don't Care", "Don't Know", 'Negative', 'Positive'])
        .shapeWidth(20);

    vis.legend
        .title("Feeling")
        .labelFormat(d3.format(".2s"))
        .scale(vis.colorScale);

    vis.svg.select(".legend")
        .call(vis.legend);

    vis.tool_tip = d3.tip()
        .attr("class", "d3-tip")
    // .offset([-8, 0]);

    vis.tool_tip.html(function(d) {return d.data + "%" });

    vis.svg.call(vis.tool_tip);

    // (Filter, aggregate, modify data)
    vis.wrangleData();
}



/*
 * Data wrangling
 */

Piechart.prototype.wrangleData = function(){
    var vis = this;

    vis.path = vis.svg.selectAll("path1")
        .data(vis.pie(vis.data))

    vis.path.enter().append("path")
        .attr("class", "path1")
        .attr("fill", function(d, i) {
            return vis.colorScale(i)
        })
        .attr("d", vis.arc)
        .attr("stroke", "white")
        .attr("stroke-width", "1px")
        .each(function(d) { this._current = d; })
        .on('mouseover', vis.tool_tip.show)
        .on('mouseout', vis.tool_tip.hide);

    vis.path2 = vis.svg.selectAll("path2")
        .data(vis.pie(vis.total_data))

    vis.path2.enter().append("path")
        .attr("class", "path2")
        .attr("fill", function(d, i) {
            return vis.colorScale2(i)
        })
        .attr("d", vis.arc2)
        .attr("stroke", "white")
        .attr("stroke-width", "1px")
        .each(function(d) { this._current = d; })
        .on('mouseover', vis.tool_tip.show)
        .on('mouseout', vis.tool_tip.hide);

    vis.updateVis();
}



/*
 * The drawing function
 */

Piechart.prototype.updateVis = function(){
    var vis = this;


}


Piechart.prototype.onSelectionChange = function(selection){
    var vis = this;

    vis.wrangleData();
}
