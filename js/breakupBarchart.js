BreakupBarchart = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;

    this.initVis();
};


/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

BreakupBarchart.prototype.initVis = function(){
    var vis = this;

    vis.margin = {top: 50, bottom: 60, left: 100, right: 130};
    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right - 200;
    vis.height = 450 - vis.margin.top - vis.margin.bottom;

    console.log(vis.data);

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.x0 = d3.scaleBand()
        .range([0, vis.width])
        .round([.1]);

    vis.x1 = d3.scaleBand()
        //.domain(d3.range(5))
        .range([0, vis.x0.bandwidth()]);

    vis.y = d3.scaleLinear()
        .range([vis.height, 0]);

    vis.xAxis = d3.axisBottom()
        .scale(vis.x0)
        .tickSize(0);

    vis.yAxis = d3.axisLeft()
        .scale(vis.y);

    vis.color = d3.scaleOrdinal()
        .range(['#1a9641','#a6d96a','#fdae61','#d7191c','#D3D3D3','#ffffff']);


    vis.tool_tip = d3.tip()
        .attr("class", "d3-tip");
    // .offset([-8, 0]);

    vis.tool_tip.html(function(d) {return "" + d.value + "%"; });

    vis.svg.call(vis.tool_tip);


    vis.categoryNames = vis.data.map(function(d) { return d.category; });
    vis.rateNames = vis.data[0].values.map(function(d) { return d.rate; });

    vis.x0.domain(vis.categoryNames);
    //vis.x1.domain(vis.rateNames).scaleBand().rangeRound([0, 20]);
    vis.x1.domain(vis.rateNames).rangeRound([0, vis.x0.bandwidth()]);
    vis.y.domain([0, d3.max(vis.data, function(category) { return d3.max(category.values, function(d) { return d.value; }); })]);

    //console.log("domain:", vis.x1.domain());
    //console.log("range:", vis.x1.range());

    vis.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + vis.height + ")")
        .call(vis.xAxis);

    vis.svg.append("g")
        .attr("class", "y axis")
        .style('opacity','0')
        .call(vis.yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style('font-weight','bold')
        .style("font-size", "20px")
        .text("Value");

    vis.svg.select('.y').transition().duration(500).delay(1300).style('opacity','1');


    vis.slice = vis.svg.selectAll(".slice")
        .data(vis.data)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) { return "translate(" + vis.x0(d.category) + ",0)"; });

    vis.slice.selectAll("rect")
        .data(function(d) { return d.values; })
        .enter().append("rect")
        .attr("width", 35)
        .attr("x", function(d) { return vis.x1(d.rate); })
        .style("fill", function(d) { return vis.color(d.rate) })
        .attr("y", function(d) { return vis.y(0); })
        .attr("height", function(d) { return vis.height - vis.y(0); })
        // .on("mouseover", function(d) {
        //     d3.select(this).style("fill", d3.rgb(vis.color(d.rate)).darker(2));
        // })
        // .on("mouseout", function(d) {
        //     d3.select(this).style("fill", vis.color(d.rate));
        // });
        .on('mouseover', vis.tool_tip.show)
        .on('mouseout', vis.tool_tip.hide);

    vis.slice.selectAll("rect")
        .transition()
        .delay(function (d) {return Math.random()*1000;})
        .duration(1000)
        .attr("y", function(d) { return vis.y(d.value); })
        .attr("height", function(d) { return vis.height - vis.y(d.value); });

    //Legend
    vis.legend = vis.svg.selectAll(".legend")
        .data(vis.data[0].values.map(function(d) { return d.rate; }).reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; })
        .style("opacity","0");

    vis.legend.append("rect")
        .attr("x", vis.width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) { return  vis.color(d); });

    vis.legend.append("text")
        .attr("x", vis.width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {return d; });

    vis.legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1")
};