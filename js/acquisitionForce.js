
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

    vis.margin = { top: 0, right: 20, bottom: 20, left: 100 };

    vis.width = $("#" + vis.parentElement).width() - 100 - vis.margin.left - vis.margin.right,
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
        .range([3,30])

    vis.colorScale = d3.scaleOrdinal()
        .domain(['saas', 'hardware', 'social', 'content', 'commerce', 'media', 'analytics', 'chips', 'security', 'search'])
        .range(['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a'])

    vis.svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (-80) + ",80)");

    vis.legend = d3.legendColor()
        .labels(["SaaS", "Hardware", "Social", "Content", "Commerce", 'Media', 'Analytics', 'Chips', 'Security', 'Search'])
        .shapeWidth(20);

    vis.legend
        .title("Industry")
        .labelFormat(d3.format(".2s"))
        .scale(vis.colorScale);

    vis.svg.select(".legend")
        .call(vis.legend);

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

    vis.tool_tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 0]);

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

    vis.acquired = vis.data.nodes.slice(5, 752)

    // 1) INITIALIZE FORCE-LAYOUT

    vis.force = d3.forceSimulation(vis.data.nodes)
        .force("charge", d3.forceManyBody().strength(-15))
        .force("link", d3.forceLink(vis.return).distance(40))
        // .force('collision', d3.forceCollide())
        .force("center", d3.forceCenter().x(vis.width/2).y(vis.height/2))
        // .force("x", d3.forceX().x(vis.width/2).strength(0.2))
        // .force("y", d3.forceY().y(vis.height/2).strength(0.02));

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
                    return vis.circleScale(1000000000)
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
            } else {
                return vis.colorScale(d.category)
            }
            // } else {
            //     return "red"
            // }
        })
        .style("stroke", "black")
        .style("stroke-width", 0.15)
        .on('mouseover', vis.tool_tip.show)
        .on('mouseout', vis.tool_tip.hide)
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

    vis.tool_tip.html(function(d) {
        if (d.price == 0) {
            return d.name;
        } else {
            return d.name + "<br/>Value: " + d3.format(".2s")(d.price).replace("G", "B");
        }
    });

    vis.svg.call(vis.tool_tip);

    vis.svg.append('image')
        .attr('href', 'img/amazon_a.png')
        .attr('x', vis.data.nodes[3].fx - 20)
        .attr('y', vis.data.nodes[3].fy - 20)
        .attr('width', 40)
        .attr('height', 40)

    vis.svg.append('image')
        .attr('href', 'img/facebook.png')
        .attr('x', vis.data.nodes[5].fx - 20)
        .attr('y', vis.data.nodes[5].fy - 20)
        .attr('width', 40)
        .attr('height', 40)

    vis.svg.append('image')
        .attr('href', 'img/google_g.png')
        .attr('x', vis.data.nodes[4].fx - 20)
        .attr('y', vis.data.nodes[4].fy - 20)
        .attr('width', 40)
        .attr('height', 40)

    vis.svg.append('image')
        .attr('href', 'img/apple.svg')
        .attr('x', vis.data.nodes[2].fx - 20)
        .attr('y', vis.data.nodes[2].fy - 25)
        .attr('width', 40)
        .attr('height', 45)

    vis.svg.append('image')
        .attr('href', 'img/microsoft-simple.png')
        .attr('x', vis.data.nodes[1].fx - 20)
        .attr('y', vis.data.nodes[1].fy - 20)
        .attr('width', 40)
        .attr('height', 40)

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
