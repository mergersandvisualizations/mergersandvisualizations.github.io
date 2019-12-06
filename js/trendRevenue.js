// Source: http://bl.ocks.org/wdickerson/64535aff478e8a9fd9d9facccfef8929

var margin = {top: 50, bottom: 40, left: 115, right: 130};
var width2 = 700 - margin.left - margin.right;
var height2 = 300 - margin.top - margin.bottom;


var industries = {
    "semi": "Semiconductor",
    "consumerelectronics": "Cnsumr Electronics",
    "cybersecurity": "Cybersecurity",
    "saas": "SaaS",
    "telecom": "Telecom",
    "digitalmarket": "Digital Ads",
    "bigdata": "Big Data",
    "esports": "Esports"
};

// x y scales
var x = d3.scaleLinear()
    .domain([1998, 2020])
    .range([0, width2]);

var y = d3.scaleLinear()
    .domain([0, 475])
    .range([height2, 0]);

var line = d3.line()
    .curve(d3.curveMonotoneX)
    .x(d => x(d.year))
    .y(d => y(d.amount));

var fundingChart = d3.select('#funding-chart')
    .append('svg')
    .attr("width", width2 + margin.left + margin.right )
    .attr("height", height2 + margin.top + margin.bottom )
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var tooltip = d3.select('#tooltip');
var tooltipLine = fundingChart.append('line')
    .attr("class", "x-hover-line hover-line")
    .attr("class", "y-hover-line hover-line");

tooltipLine.append("circle")
    .attr("r", 7.5);

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
    var colors = ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#999999','#a65628','#f781bf']
    // var colors = ["#08306b", "#4292c6", "#6baed6", "#08519c", "#deebf7", "#2171b5", "#c6dbef", "#b8cad6"];
    csv.forEach(function(d, index){
        fundingjson.push(
            {
                "source": d["sector"],
                "color": colors[index],
                "2020_funding": +d["2020"],
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
                    {"year": 2020, "amount": +d["2020"]}
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
        .html(d => industries[d.source])
        .attr('fill', d => d.color)
        .attr('stroke', d => d.color)
        .attr("stroke", 1)
        .attr('alignment-baseline', 'middle')
        .attr('x', width2)
        .attr('dx', '.2em')
        .attr('y', function(d){
                if (d["source"] == "digitalmarket"){
                    return y(d["2020_funding"]) + 4;
                }
                else{
                    return y(d["2020_funding"]) ;
                }
                })
        .attr('font-size', 13);

    fundingChart.append("text")
        .attr("class", "axis-title")
        .attr("x", 0)
        .attr("y", -20)
        .attr("font-size", 15)
        .attr("dy", ".1em")
        // .style("text-anchor", "end")
        .text("Revenue of Tech Verticals")
        .attr("stroke", 1)
        .attr("font-family", "'Catamaran', 'Helvetica', 'Arial', 'sans-serif'");

    fundingChart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", 0 - (height2 / 2))
        .attr("dy", "1em")
        .style("font-size", "10px")
        .style("text-anchor", "middle")
        .text("Revenue ($ Bil USD)")
        .attr("fill", "dimgrey")
        .attr("font-family", "'Catamaran', 'Helvetica', 'Arial', 'sans-serif'");

    // fundingChart.append("text")
    //     .attr("class", "axis-title")
    //     .attr("x", 300)
    //     .attr("y", height2 + 40)
    //     .attr("font-size", 15)
    //     .attr("dy", ".1em")
    //     // .style("text-anchor", "end")
    //     .text("Year")
    //     .attr("fill", "black");

    tipBox = fundingChart.append('rect')
        .attr('width', width2)
        .attr('height', height2)
        .attr('opacity', 0)
        .on('mousemove', drawTooltip)
        .on('mouseout', removeTooltip);
})

// Source: http://bl.ocks.org/wdickerson/64535aff478e8a9fd9d9facccfef8929

function removeTooltip() {
    // if (tooltip) tooltip.style('display', 'none');
    if (tooltipLine) tooltipLine.attr('stroke', 'none');
}

function drawTooltip() {
    var year = Math.floor((x.invert(d3.mouse(tipBox.node())[0] + 10)));

    fundingData.sort((a, b) => {
        return b.funding.find(h => h.year == year).amount - a.funding.find(h => h.year == year).amount;
    });

    barchartMC.onSelectionChange(year)
    clearInterval(time)
    d3.select('.value-time').text(year);


    tooltipLine.attr('stroke', '#515254')
        .attr('x1', x(year))
        .attr('x2', x(year))
        .attr('y1', 0)
        .attr('y2', height2)
        .attr('stroke-width', 2);

    tooltip
        .html('<b>' + "Year" + '</b>' + ": " + year)
        .style('color', "white")
        .style('display', 'block')
        .style('left', d3.event.pageX)
        .style('top', d3.event.pageY)
        .selectAll()
        .data(fundingData).enter()
        .append('div')
        .style('color', d => d.color)
        .attr("stroke", 1)
        .attr("font-family", "'Catamaran', 'Helvetica', 'Arial', 'sans-serif'")
        .html(d =>
            "<div class=\"tg-wrap\"><table class=\"tg\">\n" +
            "  <tr>\n" +
            "    <td class=\"tg-0a7q\">" + "<b>" + industries[d.source] + "</b>" +"</td>\n" +
            "    <td class=\"tg-0a7q\">" + ': $' + d.funding.find(h => h.year == year).amount + ' Bil USD' + "</td>\n" +
            "  </tr>\n" +
            "</table></div>"
        )
        .attr('stroke', d => d.color)
}