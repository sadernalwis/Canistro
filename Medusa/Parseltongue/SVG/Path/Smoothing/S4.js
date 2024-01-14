// https://codepen.io/francoisromain/pen/YxyEQL
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

const lib = {
  map(value, inMin, inMax, outMin, outMax) { return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin; },
  range(start, end, tick) {
    const s = Math.round(start / tick) * tick
    return Array.from(
		{ length: Math.floor((end - start) / tick) }, 
		function(v, k){ return k * tick + s;});
  }
};

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

const svgChartLine = {
  template: "#svg-chart-line",
  props: ["d", "o", "svg"],
  computed: {
    styles() {
		return {
			path: { fill: this.d.colors.path, stroke: this.d.colors.path, strokeWidth: 1.5, fillOpacity: 0.15, strokeOpacity: 0.8 },
			circles: { fill: this.d.colors.circles }
		};
    },
    pathD() {
      return this.pointsPositions.reduce(
        function(acc, e, i, a) {
        return i === 0 ? 
          `M ${a[a.length - 1][0]},${this.svg.h} L ${e[0]},${this.svg.h} L ${e[0]},${e[1]}` : 
            `${acc} ${this.bezierCommand(e, i, a)}`}
              , "");
    },
    pointsPositions() {
      return this.d.values.map(e => {
        const x = lib.map( e[0], this.o.xMin, this.o.xMax, 0, this.svg.w);
        const y = lib.map( e[1], this.o.yMin, this.o.yMax, this.svg.h, 0);
        return [x, y];
      });
    }
  },
  // methods: {
  //   line(pointA, pointB) {
  //     const lengthX = pointB[0] - pointA[0];
  //     const lengthY = pointB[1] - pointA[1];
  //     return {
  //       length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
  //       angle: Math.atan2(lengthY, lengthX)
  //     };
  //   },
  //   controlPoint(current, previous, next, reverse) {
  //     const p = previous || current;
  //     const n = next || current;
  //     const o = this.line(p, n);
  //     // work in progress…
  //     const flat = lib.map(Math.cos(o.angle) * this.o.line.flattening, 0, 1, 1, 0)
  //     const angle = o.angle * flat + (reverse ? Math.PI : 0);
  //     const length = o.length * this.o.line.smoothing;
  //     const x = current[0] + Math.cos(angle) * length;
  //     const y = current[1] + Math.sin(angle) * length;
  //     return [x, y];
  //   },
  //   bezierCommand(point, i, a) {
  //     const cps = this.controlPoint(a[i - 1], a[i - 2], point);
  //     const cpe = this.controlPoint(point, a[i - 1], a[i + 1], true);
  //     const close = i === a.length - 1 ? " z" : "";
  //     return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}${close}`;
  //   }
  // }
};

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
