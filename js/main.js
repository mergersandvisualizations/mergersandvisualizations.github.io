
var forceData = {"nodes":[], "links":[]};

var aaplMC, amznMC, fbMC, googlMC, msftMC, cities, aaplCircle, amznCircle, fbCircle, googlCircle, msftCircle;

var time, pause = false;

queue()
    .defer(d3.json, "data/states-10m.json")
    .defer(d3.csv, "data/cities-over-250k.csv")
    .defer(d3.json, "data/byYearMC.json")
    .await(function(error, mapTopoUs, citiesTopo, byYearMC) {

        var MyEventHandler = {};

        citiesTopo.forEach(function(d,i){
            d.latitude = +d.latitude
            d.longitude = +d.longitude
            d.POP_2010 = +d.POP_2010

            forceData.nodes.push({"id":i+1, "name": d.NAME, "latitude": d.latitude, "longitude": d.longitude})
        })

        var mapVis = new MapVis("map-US", mapTopoUs, citiesTopo);
        var barchartMC = new BarchartMC("MC-barchart", byYearMC)





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
                d3.select('p#value-time').text(val);
            });

        var gTime = d3
            .select('div#slider-time')
            .append('svg')
            .attr('width', 900)
            .attr('height', 100)
            .append('g')
            .attr('transform', 'translate(15,30)');

        gTime.call(sliderTime);

        d3.select('p#value-time').text(sliderTime.value());


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
                    d3.select('p#value-time').text(count);
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
    })




