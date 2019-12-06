
var forceData = {"nodes":[], "links":[]};

var time, time2, pause, pause2, toggle = false;
var stockchart, barchartMC;
var count = 0;

queue()
    .defer(d3.json, "data/states-10m.json")
    .defer(d3.csv, "data/cities-over-250k.csv")
    .defer(d3.json, "data/byYearMC.json")
    .defer(d3.json, "data/acquisitions_data/acquisitions.json")
    .defer(d3.json, "data/acquisitions_data/return.json")
    .defer(d3.csv, "data/company_reception.csv")
    .defer(d3.csv, "data/monopoly_feeling.csv")
    .defer(d3.csv, "data/pyramid.csv")
    .defer(d3.json, "data/breakupBarchart.json")
    .defer(d3.csv, "data/stockchart.csv")
    .await(function(error, mapTopoUs, citiesTopo, byYearMC, acqData, ret, comp_feel, mono_feel, pyr, breakup_barchart, stkcht) {

        citiesTopo.forEach(function(d,i){
            d.latitude = +d.latitude
            d.longitude = +d.longitude
            d.POP_2010 = +d.POP_2010

            forceData.nodes.push({"id":i+1, "name": d.NAME, "latitude": d.latitude, "longitude": d.longitude})
        })

        comp_feel.forEach(function(d){
            d.Very_positive = +d.Very_positive
            d.Rather_positive = +d.Rather_positive
            d.Neutral = +d.Neutral
            d.Rather_negative = +d.Rather_negative
            d.Very_negative = +d.Very_negative
            d.Not_answered = +d.Not_answered
        })

        mono_feel.forEach(function(d) {
            d.very_worried = +d.very_worried
            d.concerned = +d.concerned
            d.dont_feel_good = +d.dont_feel_good
            d.dont_care = +d.dont_care
            d.dont_know = +d.dont_know
        });

        stkcht.forEach(function(d){
            // Convert string to 'date object'
            d.YEAR = d3.timeParse("%m/%d/%y")(d.YEAR);

            // Convert numeric values to 'numbers'
            d.AAPL = +d.AAPL;
            d.AMZN = +d.AMZN;
            d.MSFT = +d.MSFT;
            d.FB = +d.FB;
            d.GOOG = +d.GOOG;
            d.INTC = +d.INTC;
            d.ADBE = +d.ADBE;
            d.CRM = +d.CRM;
            d.IBM = +d.IBM;
            d.CSCO = +d.CSCO;
            d.SP500 = +d.SP500;
            d.VGT = +d.VGT;
            d.ID = count;
            count += 1
        });

        var mapVis = new MapVis("map-US", mapTopoUs, citiesTopo);
        barchartMC = new BarchartMC("MC-barchart", byYearMC)
        var acquisitionForce = new AcquisitionForce("acq-force", acqData, ret)
        var perception = new Perception("perception-area", comp_feel, mono_feel)
        var pyramid = new Pyramid("pyramid-area", pyr)
        var piechart = new Piechart("pie-area", [15,22,31,14,18], [37, 45, 18])
        var breakupBarchart = new BreakupBarchart("breakup-barchart", breakup_barchart);
        stockchart = new Stockchart("stockchart-area", stkcht);


        // inspiration from https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518
        var dataTime = d3.range(0, 22).map(function(d) {
            return 1998 + d;
        });

        var dataStepTime = d3.range(0, 22, 5).map(function(d) {
            return 1998 + d;
        });

        var dataTime2 = d3.range(0, 41).map(function(d) {
            return 1979 + d;
        });

        var dataStepTime2 = d3.range(0, 41, 5).map(function(d) {
            return 1980 + d;
        });
        
        var sliderTime = d3
            .sliderBottom()
            .min(d3.min(dataTime))
            .max(d3.max(dataTime))
            // .step(1000 * 60 * 60 * 24 * 365)
            .step(1)
            .width(650)
            // .tickFormat(d3.timeFormat('%Y'))
            .tickFormat(d3.format("d"))
            // .tickValues(dataStepTime)
            .default(1979)
            .on('onchange', val => {
                clearInterval(time)
                barchartMC.onSelectionChange(val)
                d3.select('.value-time').text(val);

                if (val < 1998) {
                    val = 1998
                }

                updateLines(val)
            });

        var sliderTime2 = d3
            .sliderBottom()
            .min(d3.min(dataTime2))
            .max(d3.max(dataTime2))
            // .step(1000 * 60 * 60 * 24 * 365)
            .step(1)
            .width(650)
            // .tickFormat(d3.timeFormat('%Y'))
            .tickFormat(d3.format("d"))
            // .tickValues(dataStepTime)
            .default(1979)
            .on('onchange', val => {
                clearInterval(time2)
                acquisitionForce.onSelectionChange(val)
                d3.select('.value-time2').text(val);
            });

        var gTime = d3
            .select('.slider-time')
            .append('svg')
            .attr('width', 900)
            .attr('height', 100)
            .append('g')
            .attr('transform', 'translate(15,30)');

        var gTime2 = d3
            .select('.slider-time2')
            .append('svg')
            .attr('width', 900)
            .attr('height', 100)
            .append('g')
            .attr('transform', 'translate(15,30)');

        gTime.call(sliderTime);
        gTime2.call(sliderTime2);

        d3.select('.value-time').text(sliderTime.value());
        d3.select('.value-time2').text(sliderTime.value());


        $("#playbutton").on("click", function(){
            if (!pause) {
                var count = sliderTime.value()
                pause = !pause
                $("#playbutton").html("Stop").css("background-color", "red")
                time = setInterval(function(){
                    if (count >= 2019) {
                        clearInterval(time)
                    }
                    if (count <= 2018) {
                        count += 1
                    }
                    // year = new Date(count, 0, 1)
                    sliderTime.default(count)
                    barchartMC.onSelectionChange(count)
                    d3.select('.value-time').text(count);



                    if (count > 1997){
                        updateLines(count)
                    }
                }, 500)
            } else {
                pause = !pause
                $("#playbutton").html("Play").css("background-color", "green")
                clearInterval(time)
            }
        })

        $("#force-together").on("click", function() {
            acquisitionForce.forceTogether()
            if (!toggle) {
                $("#force-together").html("Center").css("background-color", "blue")
                toggle = !toggle
            } else {
                $("#force-together").html("Scatter").css("background-color", "green")
                toggle = !toggle
            }
        })

        $("#playbutton2").on("click", function(){
            if (!pause2) {
                var count2 = sliderTime2.value()
                pause2 = !pause2
                $("#playbutton2").html("Stop").css("background-color", "red")
                time2 = setInterval(function(){
                    count2 += 1
                    // year = new Date(count, 0, 1)
                    sliderTime.default(count2)
                    acquisitionForce.onSelectionChange(count2)
                    d3.select('.value-time2').text(count2);
                    if (count2 >= 2019) {
                        clearInterval(time2)
                    }
                }, 500)
            } else {
                pause2 = !pause2
                $("#playbutton2").html("Play").css("background-color", "green")
                clearInterval(time2)
            }
        })
    });

function updateStocks() {
    stockchart.updateVis()
}

function sortResults(data, prop, asc) {
    newData = data.sort(function(a, b) {
        if (asc) {
            return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        } else {
            return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        }
    });
    return newData
}

function updateLines(year) {
    if (tooltip) tooltip.style('display', 'none');
    if (tooltipLine) tooltipLine.attr('stroke', 'none');

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
            "    <td class=\"tg-0a7q\">" + "<b>" + industries[d.source] + "</b>" +"</td>\n" +
            "    <td class=\"tg-0a7q\">" + ': $' + d.funding.find(h => h.year == year).amount + ' Bil USD' + "</td>\n" +
            "  </tr>\n" +
            "</table></div>"
        )
        .attr('stroke', d => d.color)
}




