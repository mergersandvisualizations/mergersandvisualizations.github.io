
var width = 500,
    height = 500;

var svg = d3.select("#bubblechart").append("svg")
    .attr("width", width)
    .attr("height", height);

// Load data
d3.json("data/acquisitions_data/acquisitions.json", function(data) {
    console.log(data);

        // 1) INITIALIZE FORCE-LAYOUT
        var force = d3.forceSimulation(data.nodes)
            .force("charge", d3.forceManyBody().strength(-10))
            .force("link", d3.forceLink(data.links).distance(40))
            .force("center", d3.forceCenter().x(width/2).y(height/2));

        // 2a) DEFINE 'NODES' AND 'EDGES'
        var node = svg.selectAll(".node")
            .data(data.nodes)
            .enter().append("circle")
            .attr("class", "node")
            .attr("r", 5)
            .attr("fill", function(d) {
                if (d.country === "United States") {return "blue"}
                else {return "red"}
            });

        var edge = svg.selectAll("line")
            .data(data.links)
            .enter()
            .append("line")
            .style("stroke", "#ccc")
            .style("stroke-width", 1);

        // 2b) START RUNNING THE SIMULATION
        // 3) DRAW THE LINKS (SVG LINE)
        // 4) DRAW THE NODES (SVG CIRCLE)

        // 5) LISTEN TO THE 'TICK' EVENT AND UPDATE THE X/Y COORDINATES FOR ALL ELEMENTS
        force.on("tick", function() {
            edge.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });
            node.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        });

        node.append("title")
            .text(function(d) { return d.name; });


});
