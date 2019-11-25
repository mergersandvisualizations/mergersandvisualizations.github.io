
AcquisitionForce = function(_parentElement, _data, _return){
    this.parentElement = _parentElement;
    this.data = _data;
    this.filteredData = this.data;
    this.return = _return;

    this.initVis();
}

var idMap = {"Microsoft": 1, "Apple": 2, "Amazon": 3, "Alphabet": 4, "Google": 4, "Facebook": 5}


/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

AcquisitionForce.prototype.initVis = function(){
    var vis = this;

    vis.margin = { top: 20, right: 20, bottom: 20, left: 20 };

    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
        vis.height = vis.width * 0.8 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.circleScale = d3.scaleLinear()
        // .base(10000)
        .domain([1, 26200000000])
        .range([1,30])

    vis.switch = true

    vis.data.nodes[1].fx = vis.width;
    vis.data.nodes[1].fy = vis.height;

    vis.data.nodes[1].fx = 0.15 *  vis.width;
    vis.data.nodes[1].fy = 0.15 *  vis.height;

    vis.data.nodes[2].fx = 0.85 *  vis.width;
    vis.data.nodes[2].fy = 0.15 *  vis.height;

    vis.data.nodes[3].fx = 0.08 *  vis.width;
    vis.data.nodes[3].fy = 0.6 *  vis.height;

    vis.data.nodes[4].fx = 0.92 *  vis.width;
    vis.data.nodes[4].fy = 0.6 *  vis.height;

    vis.data.nodes[5].fx = 0.5 *  vis.width;
    vis.data.nodes[5].fy = 0.9 *  vis.height;

    vis.dateParse = d3.timeParse("%d-%b-%y");

    vis.update = vis.data.links

    // (Filter, aggregate, modify data)
    vis.wrangleData();
}



/*
 * Data wrangling
 */

AcquisitionForce.prototype.wrangleData = function(){
    var vis = this;

    vis.updateVis();
}



/*
 * The drawing function
 */

AcquisitionForce.prototype.updateVis = function(){
    var vis = this;

    console.log("yo")

    vis.acquired = vis.data.nodes.slice(5, 752)
    console.log(vis.acquired)

    console.log(d3.max(vis.acquired, function(d) {return d.price}))

    // 1) INITIALIZE FORCE-LAYOUT

    vis.force = d3.forceSimulation(vis.data.nodes)
        .force("charge", d3.forceManyBody().strength(-15))
        .force("link", d3.forceLink(vis.return).distance(40))
        // .force('collision', d3.forceCollide())
        .force("center", d3.forceCenter().x(vis.width/2).y(vis.height/2))
        // .force("x", d3.forceX().x(vis.width/2).strength(0.2))
        // .force("y", d3.forceY().y(vis.height/2).strength(0.02));

    console.log(vis.data.nodes)

    // vis.force = d3.forceSimulation(vis.data.nodes)
    //     .force("charge", d3.forceManyBody().strength(-5).distanceMax(100))
    //     .force("link", d3.forceLink(vis.data.links).distance(20).id(function(d,i) {return d.id}))
    //     .force("center", d3.forceCenter().x(vis.width/2).y(vis.height/2));

    // 2a) DEFINE 'NODES' AND 'EDGES'
    vis.node = vis.svg.selectAll(".node")
        .data(vis.data.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", function(d) {
            if (d.id == 0) {
                return 0
            }
            if (d.id < 6) {
                return 40
            } else {
                if (d.price != 0) {
                    return vis.circleScale(d.price)
                } else {
                    return vis.circleScale(100000000)
                }
            }
        })
        .attr("fill", function(d) {
            if (d.id < 6) {
                if (d.name == "Facebook") {
                    return "#3b5998"
                } if (d.name == "Apple") {
                    return "#7d7d7d"
                } else if (d.name == "Amazon") {
                    return "#ff9900"
                } else if (d.name == "Microsoft") {
                    return "black"
                } else if (d.name == "Alphabet") {
                    return "#3cba54"
                }
            } else if (d.price == 0) {
                return "blue"
            } else {
                return "red"
            }
        })
        .style("stroke", "black")
        .style("stroke-width", 0.15)
        .call(d3.drag()
            .on("start", dragStarted)
            .on("drag", dragging)
            .on("end", dragEnded));;

    vis.edge = vis.svg.selectAll("line")
        .data(vis.data.links)
        .enter()
        .append("line")
        // .style("stroke", "#ccc")
        .style("stroke-width", 1);

    // 2b) START RUNNING THE SIMULATION
    // 3) DRAW THE LINKS (SVG LINE)
    // 4) DRAW THE NODES (SVG CIRCLE)

    // 5) LISTEN TO THE 'TICK' EVENT AND UPDATE THE X/Y COORDINATES FOR ALL ELEMENTS
    vis.force.on("tick", function() {
        vis.edge.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
        vis.node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    });

    vis.node.append("title")
        .text(function(d) { return d.name; });

    function dragStarted(d) {
        if (!d3.event.active) vis.force.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragging(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragEnded(d) {
        if (!d3.event.active) vis.force.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}


AcquisitionForce.prototype.forceTogether = function(){
    var vis = this;

    if (vis.switch) {
        vis.force.force("link", d3.forceLink(vis.data.links).distance(20))
            // .force("link", d3.forceLink(vis.return).distance(60))
            // .force("center", d3.forceCenter().x(vis.width/2).y(vis.height/2))
            .alpha(0.1);
        vis.switch = !vis.switch
    } else {
        vis.force
            // .force("charge", d3.forceManyBody().strength(-25).distanceMax(100))
            .force("link", d3.forceLink(vis.return).distance(20))
            // .force('collision', d3.forceCollide())
            .alpha(0.1);
        vis.switch = !vis.switch
    }

    // vis.wrangleData();
}



AcquisitionForce.prototype.onSelectionChange = function(selection){
    var vis = this;

    vis.update = []

    for (var i = 6; i < vis.data.nodes.length; i++) {
        if (vis.dateParse(vis.data.nodes[i].date).getFullYear() <= selection) {
            vis.update.push({"target": vis.data.nodes[i].id, "source": idMap[vis.data.nodes[i].acquirer]})
        } else {
            vis.update.push({"target": vis.data.nodes[i].id, "source": 0})
        }
    }

    vis.force.force("link", d3.forceLink(vis.update).distance(20))
        .force("center", d3.forceCenter().x(vis.width/2).y(vis.height/2))
        .alpha(0.2);

    // vis.wrangleData();
}
