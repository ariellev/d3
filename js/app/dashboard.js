"use strict";
define(["d3"], function(d3) {
    console.log("loading dashboard..");
    var exports = function(W, H, selector, data) {

        var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 40
        };

        var width = W - margin.left - margin.right;
        var height = H - margin.top - margin.bottom;

        var xS = d3.scale.linear().range([0, width]);
        var yS = d3.scale.linear().range([height, 0]);
        var rS = d3.scale.linear().range([1, 15]);
        var cS = d3.scale.linear().range([0.3, 0.7]);

        var xAxis = d3.svg.axis()
            .scale(xS)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(yS)
            .orient("left")
            .ticks(5);

        // forward declarations
        var svg = {};
        var container = {};
        var circles = {};

        var zoom = d3.behavior.zoom().x(xS).y(yS).scaleExtent([1, 10]).on("zoom", zoomed);

        function zoomed() {
            var t = d3.event.translate;
            var s = d3.event.scale;
            svg.select("g.x.axis").call(xAxis);
            svg.select("g.y.axis").call(yAxis);
            container.attr("transform", "translate(" + t + ")scale(" + s + ")");
        };

        return {
            draw: function() {
                console.log("displaying dashboard");

                svg = d3.select(selector).append("svg")
                    .attr("width", W)
                    .attr("height", H)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .call(zoom);

                container = svg.append("g")
                    .attr("id", "container")
                  //  .attr("clip-path", "url(#chart-area)")
                    .attr("width", width)
                    .attr("height", height);

                container.append("clipPath")
                    .attr("id", "chart-area")
                    .append("rect")
                    .attr("width", width)
                    .attr("height", height);

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis);
            },

            redraw: function(data) {
                console.log("updating dashboard, data=" + data);
                var rMax = d3.max(data, d => d[2]);

                xS.domain([0, d3.max(data, d => d[0])]);
                yS.domain([0, d3.max(data, d => d[1])]);
                rS.domain([0, rMax]);
                cS.domain([0, d3.max(data, d => d[2])]);

                xAxis.scale(xS);
                yAxis.scale(yS);


                circles = container.selectAll("circle")
                    .data(data, d => d[3]);

                circles.exit()
                    .transition()
                    .duration(700)
                    .attr("cx", -100)
                    .style("opacity", 0)                     
                    .remove();

                circles.enter()
                    .append("circle")
                    .attr("class", "clickable data")
                    .attr("cx", d => W)
                    .attr("cy", d => yS(d[1]))
                    .attr("r", d => rS(d[2]))
                    .style("opacity", 0)
                    .on("mouseover", function(d) {
                        var circle = d3.select(this);
                        var radius = circle.attr("r") * 1.2;
                        circle.classed("highlight", true).transition().duration(500).attr("r", radius);
                        container.append("text")
                            .attr("fill-opacity", 0)
                            .attr("x", circle.attr("cx"))
                            .attr("y", circle.attr("cy") - radius - 5)
                            .attr("id", "tooltip")
                            .attr("text-anchor", "middle")
                            .text(d[2])
                            .transition().delay(100).duration(400)
                            .attr("fill", "#20bef7")
                            .attr("fill-opacity", 1);
                    })
                    .on("mouseout", function() {
                        var circle = d3.select(this);
                        circle.classed("highlight", false).transition().duration(500).attr("r", circle.attr("r") / 1.2);
                        d3.select("#tooltip").remove();
                    })
                    .on("click", function(d, i) {});

                circles.transition()
                    .delay(function(d, i) {
                        return i / data.length * 1000;
                    })
                    .duration(1500)
                    .ease("bounce")
                    .attr("cx", d => xS(d[0]))
                    .attr("cy", d => yS(d[1]))
                    .attr("r", d => rS(d[2]))
                    .style("opacity", d => cS(d[2]));

                    svg.select("g.x.axis").transition().duration(500).call(xAxis);
                    svg.select("g.y.axis").transition().duration(500).call(yAxis);
            },

        }
    };
    return exports;
});
