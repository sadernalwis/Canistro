//https://codepen.io/francoisromain/pen/XabdZm
const smoothing = 0.15
const points = [ [0, 10], [2, 15], [5, 60], [10, -20], [20, 10], [30, 40], [40, 10], [50, 60], [60, 120], [70, 10], [80, 50], [90, 50], [120, 10], [150, 80], [190, 10]]
const options = { yMin: -10, yMax: 130, xMin: -5, xMax: 200 }
const map = (value, inMin, inMax, outMin, outMax) => { return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin; };


const pointsPositionsCalc = (points, w, h, options) => points.map(e => {
  const x = map(e[0], options.xMin, options.xMax, 0, w)
  const y = map(e[1], options.yMin, options.yMax, h, 0)
  return [x, y]
})

const svgRender = (content, w, h) => `<svg viewBox="0 0 ${w} ${h}" version="1.1" xmlns="http://www.w3.org/2000/svg"> ${content} </svg>`

const line = (pointA, pointB) => {
    const lengthX = pointB[0] - pointA[0];
    const lengthY = pointB[1] - pointA[1];
    return {
        length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
        angle: Math.atan2(lengthY, lengthX)
    }
}

const controlPoint = (line, smooth) => (current, previous, next, reverse) => {
    const p = previous || current;
    const n = next || current;
    const l = line(p, n);
    const angle = l.angle + (reverse ? Math.PI : 0);
    const length = l.length * smooth;
    const x = current[0] + Math.cos(angle) * length;
    const y = current[1] + Math.sin(angle) * length;
    return [x, y];
}

const bezierCommand = (controlPoint) => (point, i, a) => {
  const cps = controlPoint(a[i - 1], a[i - 2], point)
  const cpe = controlPoint(point, a[i - 1], a[i + 1], true)
  const close = i === a.length - 1 ? ' z':''
  return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}${close}`
}

const svgPath = (points, command, h) => {
  const d = points.reduce((acc, e, i, a) => i === 0 ? `M ${a[a.length - 1][0]},${h} L ${e[0]},${h} L ${e[0]},${e[1]}` : `${acc} ${command(e, i, a)}` , '');
  return `<path d="${d}" class="svg-path" />`}

const svgCircles = points => points.reduce((acc, point, i, a) =>  `${acc} <circle cx="${point[0]}" cy="${point[1]}" r="2.5" class="svg-circles" v-for="p in pointsPositions"/>`, '')

const container = document.querySelector('.container')
const resize = _ => {zz
  const w = container.offsetWidth;
  const h = container.offsetHeight;
  const pointsPositions = pointsPositionsCalc(points, w, h, options)
  const bezierCommandCalc = bezierCommand(controlPoint(line, smoothing))
  const path = svgPath(pointsPositions, bezierCommandCalc, h);
  const circles = svgCircles(pointsPositions)
  container.innerHTML = svgRender(path + circles, w, h)
}

window.addEventListener('resize', resize)
resize()
