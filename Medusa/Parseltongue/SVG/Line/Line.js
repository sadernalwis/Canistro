import { SVG } from "../SVG.js";

export class Path{
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
		var innerStart = polarToCartesian(x, y, radius, endAngle);
		var innerEnd = polarToCartesian(x, y, radius, startAngle);
		var outerStart = polarToCartesian(x, y, radius + spread, endAngle);
		var outerEnd = polarToCartesian(x, y, radius + spread, startAngle);
	
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
	
	constructor(id, text, css_cls, x, y, radius, spread, startAngle, endAngle, stroke, strokeWidth, fill, opacity){
		this.configuration = {
			d: describeArc(x, y, radius, spread, startAngle, endAngle),
			stroke: stroke ? stroke : "#000000", 
			strokeWidth: strokeWidth ? strokeWidth : 1,
			fill: fill ? fill:"none",
			opacity: opacity ? opacity : 1.0,
		}
		this.path = SVG.make('path', css_cls,[], this.configuration,id,'');
		
	}
 }