
var forceData = {"nodes":[], "links":[]};

var aaplMC, amznMC, fbMC, googlMC, msftMC, cities, aaplCircle, amznCircle, fbCircle, googlCircle, msftCircle;

queue()
    .defer(d3.json, "data/states-10m.json")
    .defer(d3.csv, "data/cities-over-250k.csv")
    .await(function(error, mapTopoUs, citiesTopo) {

        console.log(mapTopoUs)
        console.log(citiesTopo)

        citiesTopo.forEach(function(d,i){
            d.latitude = +d.latitude
            d.longitude = +d.longitude
            d.POP_2010 = +d.POP_2010

            forceData.nodes.push({"id":i+1, "name": d.NAME, "latitude": d.latitude, "longitude": d.longitude})
        })

        console.log(forceData)

        var mapVis = new MapVis("map-US", mapTopoUs, citiesTopo);





        // inspiration from https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518
        var dataTime = d3.range(0, 40).map(function(d) {
            return new Date(1980 + d, 0, 1);
        });

        var dataStepTime = d3.range(0, 40, 5).map(function(d) {
            return new Date(1980 + d, 0, 1);
        });

        var sliderTime = d3
            .sliderBottom()
            .min(d3.min(dataTime))
            .max(d3.max(dataTime))
            .step(1000 * 60 * 60 * 24 * 365)
            .width(700)
            .tickFormat(d3.timeFormat('%Y'))
            .tickValues(dataStepTime)
            .default(new Date(1980, 1, 1))
            .on('onchange', val => {
                updateMarketCap(val)
                d3.select('p#value-time').text(d3.timeFormat('%Y')(val));
            });

        var gTime = d3
            .select('div#slider-time')
            .append('svg')
            .attr('width', 900)
            .attr('height', 100)
            .append('g')
            .attr('transform', 'translate(15,30)');

        gTime.call(sliderTime);

        d3.select('p#value-time').text(d3.timeFormat('%Y')(sliderTime.value()));

    })




