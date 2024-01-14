import { Meta } from "../../../Meta/Meta.js";

export class Graph extends Meta{
	reload() {
		const pointsPositions = pointsPositionsCalc(points, w, h, options)
		const bezierCommandCalc = bezierCommand(controlPoint(line, smoothing))
		const path = svgPath(pointsPositions, bezierCommandCalc, h);
		const circles = svgCircles(pointsPositions)
	}

	constructor(parent, name, collectors, path_attributes, point_attributes){
		super(parent, name, [], collectors, {});
	}
}


const svgChartAxis = {
    template: "#svg-chart-axis",
    props: ["o", "svg"],
    computed: {
      y() { return lib.map(0, this.o.yMin, this.o.yMax, this.svg.h, 0); },
      x() { return lib.map(0, this.o.xMin, this.o.xMax, 0, this.svg.w); },
      tickXs() {
        const ticks = lib.range(this.o.xMin, this.o.xMax, 10)
        return ticks.map(function(tick){ lib.map(tick, this.o.xMin, this.o.xMax, 0, this.svg.w);});},
      tickYs() {
        const ticks = lib.range(this.o.yMin, this.o.yMax, 10);
        return ticks.map(function(tick) { lib.map(tick, this.o.yMin, this.o.yMax, this.svg.h, 0);});}}};
  

const svgChart = {
    template: "#svg-chart",
    components: { svgChartLine, svgChartAxis},
    props: ["datasets", "options", "svg"],
    computed: { viewbox() { return `0 0 ${this.svg.w} ${this.svg.h}`;}}};
  
  const app = new Vue({
    el: "#app",
    components: { svgChart },
    data: { options, datasets, svg: { w: 0, h: 0 } },
    mounted() {
      window.addEventListener("resize", this.resize);
      this.resize(); },
    methods: {
      resize() {
        this.svg.w = this.$refs.container.offsetWidth;
        this.svg.h = this.$refs.container.offsetHeight;
      }
    }
  });

const options = { xMin: -53, xMax: 198, yMin: -32, yMax: 128, line: { smoothing: 0.15, flattening: 0.5 }};
const datasets = [
  { name: "one",
    colors: { path: "#B4DC7F", circles: "red" },
    values: [ [-20, 10], [0, -15], [5, 0], [10, 60], [20, 10], [30, 60], [40, 80], [50, 60], [70, 10], [80, 50], [90, 50], [120, 10], [150, 80], [160, 10]]},
  { name: "two",
    colors: { path: "rgba(55, 165, 230, 1.0)", circles: "orange" },
    values: [ [0, 10], [5, 60], [10, 20], [20, 150], [30, 40], [40, 10], [50, 30], [60, 20], [70, 110], [80, 90], [90, 120], [120, 50], [160, 50], [200, 120]]},
  { name: "three",
    colors: { path: "#FF9F1C", circles: "orange" },
    values: [ [-50, 5], [-20, -5], [0, 0], [10, 10], [20, 40], [30, -10], [40, -10], [50, 20], [60, 10], [70, 40], [80, -15], [100, -10], [110, 30], [140, -10], [180, -10]]}
];

  