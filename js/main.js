
var forceData = {"nodes":[], "links":[]};

var time, time2, pause, pause2, toggle = false;

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
    .await(function(error, mapTopoUs, citiesTopo, byYearMC, acqData, ret, comp_feel, mono_feel, pyr, breakup_barchart, stockchart) {

        var MyEventHandler = {};

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

        var mapVis = new MapVis("map-US", mapTopoUs, citiesTopo);
        var barchartMC = new BarchartMC("MC-barchart", byYearMC)
        var acquisitionForce = new AcquisitionForce("acq-force", acqData, ret)
        var perception = new Perception("perception-area", comp_feel, mono_feel)
        var pyramid = new Pyramid("pyramid-area", pyr)
        var piechart = new Piechart("pie-area", [14,31,22,15,18], [45, 37, 18])
        var breakupBarchart = new BreakupBarchart("breakup-barchart", breakup_barchart);
        // var stockchart = new stockchart("stockchart-area", stockchart);


        // inspiration from https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518
        var dataTime = d3.range(0, 41).map(function(d) {
            return 1979 + d;
        });

        var dataStepTime = d3.range(0, 41, 5).map(function(d) {
            return 1980 + d;
        });

        var sliderTime = d3
            .sliderBottom()
            .min(d3.min(dataTime))
            .max(d3.max(dataTime))
            // .step(1000 * 60 * 60 * 24 * 365)
            .step(1)
            .width(700)
            // .tickFormat(d3.timeFormat('%Y'))
            .tickFormat(d3.format("d"))
            // .tickValues(dataStepTime)
            .default(1979)
            .on('onchange', val => {
                clearInterval(time)
                barchartMC.onSelectionChange(val)
                d3.select('.value-time').text(val);
            });

        var sliderTime2 = d3
            .sliderBottom()
            .min(d3.min(dataTime))
            .max(d3.max(dataTime))
            // .step(1000 * 60 * 60 * 24 * 365)
            .step(1)
            .width(700)
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
                $("#playbutton").html("Pause").css("background-color", "red")
                time = setInterval(function(){
                    count += 1
                    // year = new Date(count, 0, 1)
                    sliderTime.default(count)
                    barchartMC.onSelectionChange(count)
                    d3.select('.value-time').text(count);
                    if (count >= 2019) {
                        clearInterval(time)
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
                $("#playbutton2").html("Pause").css("background-color", "red")
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




