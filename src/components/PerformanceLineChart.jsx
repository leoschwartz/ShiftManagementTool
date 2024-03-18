import { useRef, useEffect } from "react";
import PropType from "prop-types";
import * as d3 from "d3";

const PerformanceLineChart = ({ data, width, height, startDate, endDate }) => {
  const svgRef = useRef();
  console.log(data);
  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Clear previous content
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 100, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = d3
      .scaleTime()
      .domain([startDate, endDate])
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .nice()
      .range([innerHeight, 0]);

    const line = d3
      .line()
      .x((d) => x(new Date(d.date)))
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(5))
      .append("Date") // Add x-axis title
      .attr("x", innerWidth / 2)
      .attr("y", margin.bottom * 0.8)
      .attr("fill", "#000")
      .attr("text-anchor", "middle")
      .text("Date");

    g.append("g")
      .call(d3.axisLeft(y))
      .append("Average") // Add y-axis title
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -margin.left * 0.8)
      .attr("fill", "#000")
      .attr("text-anchor", "middle")
      .text("Value");

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));

    g.append("g").call(d3.axisLeft(y));
  }, [data, height, width]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
};

export default PerformanceLineChart;

PerformanceLineChart.propTypes = {
  data: PropType.array.isRequired,
  width: PropType.number.isRequired,
  height: PropType.number.isRequired,
  startDate: PropType.instanceOf(Date).isRequired,
  endDate: PropType.instanceOf(Date).isRequired,
};
