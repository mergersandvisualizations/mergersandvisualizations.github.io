// Source: http://bl.ocks.org/wdickerson/64535aff478e8a9fd9d9facccfef8929

var margin = {top: 50, bottom: 60, left: 60, right: 130};
var width2 = 800 - margin.left - margin.right;
var height2 = 500 - margin.top - margin.bottom;

// x y scales
var x = d3.scaleLinear()
    .domain([1998, 2025])
    .range([0, width2]);

var y = d3.scaleLinear()
    .domain([0, 475])
    .range([height2, 0]);

var line = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.amount));

var fundingChart = d3.select('#funding-chart')
    .append('svg')
    .attr("width", width2 + margin.left + margin.right )
    .attr("height", height2 + margin.top + margin.bottom )
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var tooltip = d3.select('#tooltip');
var tooltipLine = fundingChart.append('line');

// Add the axes and a title
var xAxis = d3.axisBottom(x)
    .tickFormat(d3.format('.4'));

var yAxis = d3.axisLeft(y);

fundingChart.append('g')
    .call(yAxis)
    .attr("class", "yAxis");

fundingChart.append('g')
    .attr('transform', 'translate(0,' + height2 + ')')
    .call(xAxis)
    .attr("class", "xAxis");


// Load the data and draw a chart
let fundingData, tipBox;
d3.csv("data/trendRevenue.csv", function(error, csv) {
    var fundingjson = [];
    var colors = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00'];
    csv.forEach(function(d, index){
        fundingjson.push(
            {
                "source": d["sector"],
                "color": colors[index],
                "2025_funding": +d["2025"],
                "funding": [
                    {"year": 1998, "amount": +d["1998"]},
                    {"year": 1999, "amount": +d["1999"]},
                    {"year": 2000, "amount": +d["2000"]},
                    {"year": 2001, "amount": +d["2001"]},
                    {"year": 2002, "amount": +d["2002"]},
                    {"year": 2003, "amount": +d["2003"]},
                    {"year": 2004, "amount": +d["2004"]},
                    {"year": 2005, "amount": +d["2005"]},
                    {"year": 2006, "amount": +d["2006"]},
                    {"year": 2007, "amount": +d["2007"]},
                    {"year": 2008, "amount": +d["2008"]},
                    {"year": 2009, "amount": +d["2009"]},
                    {"year": 2010, "amount": +d["2010"]},
                    {"year": 2011, "amount": +d["2011"]},
                    {"year": 2012, "amount": +d["2012"]},
                    {"year": 2013, "amount": +d["2013"]},
                    {"year": 2014, "amount": +d["2014"]},
                    {"year": 2015, "amount": +d["2015"]},
                    {"year": 2016, "amount": +d["2016"]},
                    {"year": 2017, "amount": +d["2017"]},
                    {"year": 2018, "amount": +d["2018"]},
                    {"year": 2019, "amount": +d["2019"]},
                    {"year": 2020, "amount": +d["2020"]},
                    {"year": 2021, "amount": +d["2021"]},
                    {"year": 2022, "amount": +d["2022"]},
                    {"year": 2023, "amount": +d["2023"]},
                    {"year": 2024, "amount": +d["2024"]},
                    {"year": 2025, "amount": +d["2025"]}
                ]
            }
        );
        fundingData = fundingjson;
    });

    fundingChart.selectAll()
        .data(fundingData).enter()
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', d => d.color)
        .attr('stroke-width', 3)
        .datum(d => d.funding)
        .attr('d', line);

    fundingChart.selectAll()
        .data(fundingData).enter()
        .append('text')
        .html(d => d.source)
        .attr('fill', d => d.color)
        .attr('stroke', d => d.color)
        .attr('alignment-baseline', 'middle')
        .attr('x', width2)
        .attr('dx', '.2em')
        .attr('y', function(d){
                if (d["source"] == "digitalmarket"){
                    return y(d["2025_funding"]) + 13;
                }
                else{
                    return y(d["2025_funding"]);
                }
                })
        .attr('font-size', 13);

    fundingChart.append("text")
        .attr("class", "axis-title")
        .attr("x", -50)
        .attr("y", -20)
        .attr("font-size", 15)
        .attr("dy", ".1em")
        // .style("text-anchor", "end")
        .text("Funding in millions USD")
        .attr("fill", "white")
        .attr("stroke", "white");

    fundingChart.append("text")
        .attr("class", "axis-title")
        .attr("x", 320)
        .attr("y", height2 + 50)
        .attr("font-size", 15)
        .attr("dy", ".1em")
        // .style("text-anchor", "end")
        .text("Year")
        .attr("fill", "white")
        .attr("stroke", "white");

    tipBox = fundingChart.append('rect')
        .attr('width', width2)
        .attr('height', height2)
        .attr('opacity', 0)
        .on('mousemove', drawTooltip)
        .on('mouseout', removeTooltip);
})

// Source: http://bl.ocks.org/wdickerson/64535aff478e8a9fd9d9facccfef8929

function removeTooltip() {
    if (tooltip) tooltip.style('display', 'none');
    if (tooltipLine) tooltipLine.attr('stroke', 'none');
}

function drawTooltip() {
    var year = Math.floor((x.invert(d3.mouse(tipBox.node())[0] + 10)));

    fundingData.sort((a, b) => {
        return b.funding.find(h => h.year == year).amount - a.funding.find(h => h.year == year).amount;
    });

    tooltipLine.attr('stroke', '#515254')
        .attr('x1', x(year))
        .attr('x2', x(year))
        .attr('y1', 0)
        .attr('y2', height2)
        .attr('stroke-width', 2);

    tooltip.html('<b>' + "Year" + '</b>' + ": " + year)
        .style('color', "white")
        .style('display', 'block')
        .style('left', d3.event.pageX)
        .style('top', d3.event.pageY)
        .selectAll()
        .data(fundingData).enter()
        .append('div')
        .style('color', d => d.color)

        .html(d =>
            "<div class=\"tg-wrap\"><table class=\"tg\">\n" +
            "  <tr>\n" +
            "    <td class=\"tg-0a7q\">" + "<b>" + d.source + "</b>" +"</td>\n" +
            "    <td class=\"tg-0a7q\">" + ': $' + d.funding.find(h => h.year == year).amount + ' Bil USD' + "</td>\n" +
            "  </tr>\n" +
            "</table></div>"
        )
        .attr('stroke', d => d.color)
}