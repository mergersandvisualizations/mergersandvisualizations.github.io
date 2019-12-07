
Pyramid = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.initVis();
}


/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

Pyramid.prototype.initVis = function(){
    var vis = this;

    vis.margin = {top: 10, bottom: 10, left: 10, right: 10};
    vis.width = $("#" + vis.parentElement).width() - 500 - vis.margin.left - vis.margin.right;
    vis.height = 450 - vis.margin.top - vis.margin.bottom;

    vis.svgwidth = vis.width + vis.margin.left + vis.margin.right

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.color = d3.scaleOrdinal()
        .range(["#255aee","#3a6fff","#4f84ff","rgb(101,154,302)","rgb(122,175,323)", "rgb(144,197,345)", "rgb(165,218,366)"]);

    vis.rectangles = vis.svg.selectAll("rect")
         .data(vis.data)
         .enter()
         .append("rect");

    vis.tool_tip = d3.tip()
        .attr("class", "d3-tip")
    // .offset([-8, 0]);

    vis.tool_tip.html(function(d) {return (d.population*100).toFixed(0) + "%" });

    vis.svg.call(vis.tool_tip);

    vis.rectAttributes = vis.rectangles
        .attr("x", function(d, i) {return (vis.svgwidth - (d.population * 1750)/2)-300;})
        .attr("y", function(d, i) {return (i)*55 + 30;})
        .attr("width", function (d) { return d.population * 1750;})
        .attr("height", function (d) { return 50; })
        .style("fill", function(d) { return vis.color(d.region); })
        .on('mouseover', vis.tool_tip.show)
        .on('mouseout', vis.tool_tip.hide);

    vis.rectText = vis.svg.selectAll("text")
        .data(vis.data)
        .enter()
        .append("text");

    vis.textLabels = vis.rectText
        .attr("x", function(d, i) {return (vis.svgwidth/2)-85;})
        .attr("y", function(d, i) {return (i)*55 + 65;})
        .text( function (d) { return d.region; })
                   //   .attr("font-family", "sans-serif")
                   // .attr("font-size", "20px")
        .attr("fill", "white");


    // vis.rectText = svg.selectAll('.rectText')
    //     .data(vis.data);
    //
    // vis.rectText
    //     .append('text')
    //     .attr('class', 'rectText')
    //     .attr("x", function(d, i) {return (vis.svgwidth - (d.population * 1750)/2)-300;}) //leave 5 pixel space after the <rect>
    //     .attr("y", function(d, i) {return (i)*55 + 30;})
    //     .text(function(d) {
    //         return d.region
    //     })
    //     .style("fill", "white");

    //
    //
    // vis.rectangle = vis.svg.append("rect")
    //     .attr("x", 10)
    //     .attr("y", 10)
    //     .attr("width", 50)
    //     .attr("height", 50)
    //     .attr("fill", "green");
    //
    // vis.rectangle2 = vis.svg.append("rect")
    //     .attr("x", 50)
    //     .attr("y", 50)
    //     .attr("width", 50)
    //     .attr("height", 100)
    //     .attr("fill", "red");



    // // (Filter, aggregate, modify data)
    // vis.wrangleData();
}


/*
 * Data wrangling
 */

// Pyramid.prototype.wrangleData = function(){
//     var vis = this;
//     vis.updateVis();
// }
//
//
//
// /*
//  * The drawing function
//  */
//
// Pyramid.prototype.updateVis = function(){
//     var vis = this;
//
//     vis.pyramid = d3.pyramid()
//         .size([vis.width, vis.height])
//         .value(function(d) { return 100; });
//
//     vis.line = d3.line()
//         .curve(d3.curveLinearClosed)
//         // .interpolate('linear-closed')
//         .x(function(d,i) { return d.x; })
//         .y(function(d,i) { return d.y; });
//
//     vis.g = vis.svg.selectAll(".pyramid-group")
//         .data(vis.pyramid(vis.data))
//         .enter().append("g")
//         .attr("class", "pyramid-group")
//         ;
//
//     vis.g.append("path")
//         .attr("d", function (d){
//             // console.log(vis.line(d.coordinates));
//             return vis.line(d.coordinates);
//         })
//         .style("fill", function(d) { return vis.color(d.region); })
//         .on('mouseover', vis.tool_tip.show)
//         .on('mouseout', vis.tool_tip.hide);
//
//     vis.g.append("text")
//         .attr("y", function (d) {
//             if(d.coordinates.length === 4) {
//                 return (((d.coordinates[0].y-d.coordinates[1].y)/2)+d.coordinates[1].y) + 5;
//             } else {
//                 return (d.coordinates[0].y + d.coordinates[1].y)/2 + 10;
//             }
//         })
//         .attr("x", function (d) { return vis.width/2;})
//         .style("text-anchor", "middle")
//         .text(function(d){return d.region})
//         .style("fill", "#ffffff");
//
//     d3.select("body").append("table")
//         .attr({
//             "id" : "footer",
//             "width": vis.width + "px"
//         })
//
//
// }
//
//
// Pyramid.prototype.onSelectionChange = function(selection){
//     var vis = this;
//
//     vis.wrangleData();
// }
