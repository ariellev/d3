"use strict";

require.config({
    paths: {
        d3: "http://d3js.org/d3.v3.min"
    }
});

require(['dashboard', 'd3'], function(dashboard, d3) {
    var data = [];

    var random = function(total, max, start) {
        var random = [];
        for (var i = 0; i < total; i++) {
            var num = Math.floor(Math.random() * max);
            random.push({
                "key": start + i,
                "value": num
            });
        }
        return random;
    };

    var randomSP = function(total, max, start) {
        var arr = [];
        var maxV = random(1, 300, 1)[0].value + 1;

        for (var i = 0; i < total; i++) {
            var x = Math.floor(Math.random() * max);
            var y = Math.floor(Math.random() * max);
            var v = Math.floor(Math.random() * 100);
            var key = start + i;
            arr.push([x, y, v, key]);
        }
        return arr;
    };

    console.log("main app, modules were successfully loaded..");
    var plot = dashboard(900, 600, "#plot", []);
    plot.draw();

    d3.select("#add")
        .on("click", function() {
            var elements = (random(1, 5, 1)[0].value + 1) * 10;
            var max = (random(1, 10, 1)[0].value + 1) * 100;
            console.log("add clicked, max=" + max);
            data = data.concat(randomSP(elements, max, data.length));
            plot.redraw(data);
        });

    d3.select("#remove")
        .on("click", function() {
            console.log("remove clicked!");
            var elements = (random(1, 5, 1)[0].value + 1) * 10;
            data = data.slice(elements);
            plot.redraw(data);
        });

    d3.select("#reset")
        .on("click", function() {
            console.log("reset clicked!");
            data = [];
            plot.redraw(data);
        });
});
