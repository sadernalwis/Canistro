import { Meta } from "../../../Meta/Meta.js";
import { SVG } from "../SVG.js";

export class Path extends Meta{
    static get observedAttributes() { //https://alligator.io/svg/textpath/
    //   return [`width`, `height`,'progress','status','radius'];
	  `<svg viewBox="0 0 1160 262" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
	  <defs>
		<path id="path-1" d="M0.05078125,107.609375 L237.603724,72.0980293 C257.310784,69.1520578 277.448615,72.1606986 295.434067,80.7380223 L440.117791,149.73819 C461.666904,160.015036 486.181718,162.243221 509.230549,156.019944 L856.599391,62.2289545 C883.145646,55.0613586 911.471983,59.140881 934.916817,73.508129 L1160.05078,211.472656 L1160.05078,211.472656"></path>
	  </defs>
	
	  <text text-anchor="middle" style="fill: var(--text-color); font-size: 3rem;">
		<textPath xlink:href="#path-1" startOffset="50%">
		  See you later, <a xlink:href="https://alligator.io/">Alligator</a>! 🐊 No so soon, Baboon! 🐵
		</textPath>
	  </text>
	</svg>
	`
    }
	
	static polarToCartesian(centerX, centerY, radius, angleInDegrees) { // https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
		var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;  
		return {
		  x: centerX + (radius * Math.cos(angleInRadians)),
		  y: centerY + (radius * Math.sin(angleInRadians))
		};
	}  
	static describeArc(x, y, radius, startAngle, endAngle){
		  var start = polarToCartesian(x, y, radius, endAngle);
		  var end = polarToCartesian(x, y, radius, startAngle);
		  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
		  var d = [
			  "M", start.x, start.y, 
			  "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
		  ].join(" ");
		  return d;       
	}
	static describeArc(x, y, radius, spread, startAngle, endAngle){
		var innerStart = Path.polarToCartesian(x, y, radius, endAngle);
		var innerEnd = Path.polarToCartesian(x, y, radius, startAngle);
		var outerStart = Path.polarToCartesian(x, y, radius + spread, endAngle);
		var outerEnd = Path.polarToCartesian(x, y, radius + spread, startAngle);
	
		var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
	
		var d = [
			"M", outerStart.x, outerStart.y,
			"A", radius + spread, radius + spread, 0, largeArcFlag, 0, outerEnd.x, outerEnd.y,
			"L", innerEnd.x, innerEnd.y, 
			"A", radius, radius, 0, largeArcFlag, 1, innerStart.x, innerStart.y, 
			"L", outerStart.x, outerStart.y, "Z"
		].join(" ");
	
		return d;
	}
	myArc(cx, cy, radius, max){       
		var circle = document.getElementById("arc");
		 var e = circle.getAttribute("d");
		 var d = " M "+ (cx + radius) + " " + cy;
		 var angle=0;
		 window.timer = window.setInterval(
			function() {
				var radians= angle * (Math.PI / 180);  // convert degree to radians
				var x = cx + Math.cos(radians) * radius;  
				var y = cy + Math.sin(radians) * radius;
				
				d += " L "+x + " " + y;
				circle.setAttribute("d", d)
				if(angle==max)window.clearInterval(window.timer);
				angle++;
			}
	   ,5)
	}

	gridLines(svg){ //https://github.com/CodeDrome/svg-bezier-curves
		if(SVG.defs.has('grid')){
			const grid = this.defs.get('grid');
			grid.remove();
			svg.appendChild(grid);
		}
		this.grid ? this.grid.remove() : null;
		const width = width ? width : 800;
		const height = height ? height : 600;
		const spacing = spacing ? spacing : 100;

		this.configuration = {
			stroke: stroke ? stroke : "#D0D0D0", 
			strokeWidth: strokeWidth ? strokeWidth : 1,
			fill: fill ? fill:"none",
			opacity: opacity ? opacity : 1.0,
		}

		for(let x = 0; x <= width; x += spacing){
			const config = {x1:x, y1:0, x2:x, y2:height}
			const line = SVG.make('line', css_cls,[], config);
			svg.appendChild(line);
		}
		for(let y = 0; y <= height; y += spacing){
			const config = {x1:0, y1:y, x2:width, y2:y}
			const line = SVG.make('line', css_cls,[], config);
			svg.appendChild(line);
		}


		
	}

	drawPoints(points, colour){
		for(const point of points){
			const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
			circle.setAttributeNS(null, "cx", point[0]);
			circle.setAttributeNS(null, "cy", point[1]);
			circle.setAttributeNS(null, "r", 2);
			circle.setAttributeNS(null, "fill", colour);
			APP.svgelement.appendChild(circle); }
	}

	drawBezier(pathString, stroke){
		const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		path.setAttributeNS(null, "d", pathString);
		path.setAttributeNS(null, "stroke", stroke);
		path.setAttributeNS(null, "fill", "transparent");
		path.setAttributeNS(null, "stroke-width", "1px");
		document.getElementById("svg").appendChild(path);
	}

	generatePath(points, relative){
		let type = null;
		if(points.length === 3) { type = "Q";}
		else if(points.length === 4) { type = "C";}
		else if(points.length % 2 === 0) { type = "C";}
		else { throw 'Number of points must be 3 or an even number more than 3'; }
		const pathPoints = ["M ", points[0][0], ",", points[0][1], type];
		for(let p = 1, l = points.length; p < l; p++){
			if(p >= 4 && p % 2 === 0){ pathPoints.push("S");}
			pathPoints.push(points[p][0]);
			pathPoints.push(",");
			pathPoints.push(points[p][1]); }
		return pathPoints.join(" ");
	}

	threePoint(){
		const points = [[50,50],[150,550],[750,50]];
		drawPoints(points, "#FF0000");
		const pathString = generatePath(points, false);
		drawBezier(pathString, "#FF0000"); }

	fourPoint(){
		const points = [[50,50],[50,550],[750,550],[750,150]];
		drawPoints(points, "#00C000");
		const pathString = generatePath(points, false);
		drawBezier(pathString, "#00C000");}

	sixPoint(){
		const points = [[50,50],[150,500],[500,400],[400,200],[650,150],[750,50]];
		drawPoints(points, "#0000FF");
		const pathString = generatePath(points, false);
		drawBezier(pathString, "#0000FF");}
		
	eightPoint(){
		const points = [[50,50],[50,350],[250,200],[400,300],[200,450],[500,500],[650,200],[750,550]];
		drawPoints(points, "#FF8000");
		const pathString = generatePath(points, false);
		drawBezier(pathString, "#FF8000");}

	moveAlong(path, obj){
		var pathLength = Math.floor( path.getTotalLength() ); // Length of path
		function moveObj(prcnt) { // Move obj element along path based on percentage of total length
			prcnt = (prcnt*pathLength) / 100;
			pt = path.getPointAtLength(prcnt); // Get x and y values at a certain point in the line
			pt.x = Math.round(pt.x);
			pt.y = Math.round(pt.y);
			obj.style.webkitTransform = 'translate3d('+pt.x+'px,'+pt.y+'px, 0)';
		}
	}

	static distance(p, point) {
		var dx = p.x - point[0], dy = p.y - point[1];
		return dx * dx + dy * dy; }

	closestPoint(point){ //https://stackoverflow.com/questions/44427394/how-to-know-if-any-x-or-y-point-is-on-svg-path?noredirect=1#comment75885167_44427394 // https://developer.mozilla.org/en-US/docs/Web/API/SVGGeometryElement
		const pathNode = this.path;
		var pathLength = pathNode.getTotalLength(), precision = 8, best, bestLength, bestDistance = Infinity;
		
		for (var scan, scanLength = 0, scanDistance; scanLength <= pathLength; scanLength += precision) { // linear scan for coarse approximation
			if ((scanDistance = Path.distance(scan = pathNode.getPointAtLength(scanLength), point)) < bestDistance) {
				best = scan, bestLength = scanLength, bestDistance = scanDistance;
			}
		}
		precision /= 2; 
		while (precision > 0.5) { // binary search for precise estimate
			var before, after, beforeLength, afterLength, beforeDistance, afterDistance;
			if ((beforeLength = bestLength - precision) >= 0 && (beforeDistance = Path.distance(before = pathNode.getPointAtLength(beforeLength), point)) < bestDistance) {
				best = before, bestLength = beforeLength, bestDistance = beforeDistance;
			} 
			else if ((afterLength = bestLength + precision) <= pathLength && (afterDistance = Path.distance(after = pathNode.getPointAtLength(afterLength), point)) < bestDistance) {
				best = after, bestLength = afterLength, bestDistance = afterDistance;
			} 
			else {
				precision /= 2;
			}
		}
		best = [best.x, best.y];
		best.distance = Math.sqrt(bestDistance);
		return best;
		
	}

	describeLine(points){
		let type = null;
		if(points.length === 3) { type = "Q";}
		else if(points.length === 4) { type = "C";}
		else if(points.length % 2 === 0) { type = "C";}
		else { throw 'Number of points must be 3 or an even number more than 3'; }
		const pathPoints = ["M ", points[0][0], ",", points[0][1], type];
		for(let p = 1, l = points.length; p < l; p++){
			if(p >= 4 && p % 2 === 0){ pathPoints.push("S");}
			pathPoints.push(points[p][0]);
			pathPoints.push(",");
			pathPoints.push(points[p][1]); }
		return pathPoints.join(" ");
	}

	describeLine(points, command, h){
		return points.reduce(function(acc, e, i, a){
			return i === 0 ? 
				`M ${a[a.length - 1][0]},${h} L ${e[0]},${h} L ${e[0]},${e[1]}` : 
					`${acc} ${command(e, i, a)}`} , '');
	}
  
	constructor(parent, name, collectors, svgroot, realm, svg, def_ref, draggable, id, text, css_cls, point_radius, spread, start, end, stroke, strokeWidth, fill, opacity){
		super(parent, name, null, collectors, {}, svgroot, null, null, def_ref, draggable);
        this.realm = realm; //#//
		this.configuration = {
			stroke: stroke ? stroke : "#000000", 
			strokeWidth: strokeWidth ? strokeWidth : 1,
			fill: fill ? fill:"none",
			opacity: opacity ? opacity : 1.0,
			title:name
		}
		let ptype = typeof(point_radius);
		if(point_radius==null)               { this.configuration.d = Path.describeLine([[start, end]]); }
		else if(Array.isArray(point_radius)) { this.configuration.d = Path.describeLine(point_radius); }
		else if(ptype=="number")             { this.configuration.d = Path.describeArc(0, 0, point_radius, spread, start, end); }
		else if(ptype=="string")             { }
		this.path = SVG.make('path', css_cls,[], this.configuration, id, '');
        this.realm ? this.realm.svg.appendChild(this.path) : null;
		
	}
 }