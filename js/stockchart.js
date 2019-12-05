//
// Pyramid = function(_parentElement, _data){
//     this.parentElement = _parentElement;
//     this.data = _data;
//     this.initVis();
// }
//
//
// /*
//  * Initialize visualization (static content, e.g. SVG area or axes)
//  */
//
// Pyramid.prototype.initVis = function(){
//     var vis = this;
//
//     vis.margin = {top: 10, bottom: 10, left: 10, right: 10};
//     vis.width = $("#" + vis.parentElement).width() - 500 - vis.margin.left - vis.margin.right;
//     vis.height = 450 - vis.margin.top - vis.margin.bottom;
//
//     // SVG drawing area
//     vis.svg = d3.select("#" + vis.parentElement).append("svg")
//         .attr("width", vis.width + vis.margin.left + vis.margin.right)
//         .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
//         .append("g")
//         .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");
//
//     vis.fromDate = "12/01/80";
//     vis.toDate = "12/01/19";
//
//     vis.x = d3.scaleTime()
//         .range([0, vis.width - 60]);
//
//     vis.y = d3.scaleLinear()
//         .range([vis.height, vis.margin.top]);
//
//     vis.formatDate = d3.timeFormat("%m/%d/%y");
//
//     vis.parseDate = d3.timeParse("%m/%d/%y");
//
// // Initialize data
//     vis.loadData();
//
//     vis.data;
//
//     vis.filteredData;
//
//
//   // (Filter, aggregate, modify data)
//     vis.wrangleData();
// }
//
//
//
// /*
//  * Data wrangling
//  */
//
// Pyramid.prototype.wrangleData = function(){
//     var vis = this;
//
//
//
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
//
//
// }
//
//
// Pyramid.prototype.onSelectionChange = function(selection){
//     var vis = this;
//     vis.wrangleData();
// }
