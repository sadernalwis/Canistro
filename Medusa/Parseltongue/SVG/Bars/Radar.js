import { Meta } from "../../../Meta/Meta.js";
import { HTML } from "../../HTML/HTML.js";
import { DataSet } from "../DataSet/DataSet.js";
import { Path } from "../Path/Path.js";
import { SVG } from "../SVG.js";
import { Traveller } from "../Traveller/Traveller.js";

var skillsdata = {
  "Skills": {
    "Server & WinForm": {
      "Protocol": {
        "Propose": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 30, 50, 50, 50],
        "USSD": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 60, 60, 50, 40, 30],
        "UAP": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 60, 70, 50, 30],
        "Socket Raw": [0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 50, 50, 50, 70, 80]
      },
      "Optimization": {
        "Performance": [0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 40, 40, 50, 50, 50],
        "Distribute": [0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 40, 50, 50],
        "Stability": [0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 50, 60, 70, 80, 90]
      },
      "UI": {
        "WinForm": [0, 0, 20, 40, 50, 50, 50, 50, 60, 80, 90, 95, 95, 95, 95],
        "WPF": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 50],
        "GDI": [0, 0, 0, 0, 0, 40, 50, 40, 40, 30, 30, 20, 20, 10, 5],
        "DX": [0, 0, 0, 0, 0, 10, 50, 50, 40, 40, 30, 20, 10, 10, 5],
        "Flash": [0, 0, 10, 30, 40, 50, 50, 40, 30, 20, 10, 5, 5, 5, 5]
      },
      "Algorithm": {
        "Image Processing": [0, 0, 0, 0, 0, 0, 0, 10, 30, 50, 50, 50, 45, 45, 40],
        "Face recognition": [0, 0, 0, 0, 0, 0, 0, 10, 40, 70, 60, 50, 40, 40, 40]
      }
    },
    "Web Development": {
      "Server Side": {
        "Active Page": {
          "ASP": [0, 0, 10, 30, 60, 60, 40, 20, 20, 20, 20, 20, 20, 20, 20],
          "ASP.Net": [0, 0, 0, 0, 0, 0, 10, 30, 70, 80, 90, 90, 90, 90, 90]
        },
        "Node.js": {
          "express": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 30],
          "npm": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 40]
        },
        "DB": {
          "SqlServer": [0, 0, 0, 0, 0, 10, 20, 40, 40, 40, 60, 90, 90, 90, 80],
          "Sqlite": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 30, 20],
          "Mongo": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 30]
        },
        "Server": {
          "IIS": [0, 10, 10, 30, 40, 40, 40, 60, 70, 70, 80, 80, 80, 80, 80],
          "Apache": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 20, 40]
        },
        "API": {
          "OAuth2.0": [0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 40, 40, 40, 30, 30],
          "WeChat": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 30],
          "Propose": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 40, 30]
        }
      },
      "Front Side": {
        "HTML": [0, 0, 10, 30, 50, 50, 60, 80, 90, 60, 50, 30, 30, 30, 40],
        "CSS": {
          "CSS": [0, 0, 10, 30, 50, 50, 60, 80, 85, 60, 50, 30, 20, 20, 30],
          "LESS": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30],
          "Responsive": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20]
        },
        "JSFramework": {
          "jQuery": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 30, 30, 25, 30],
          "ExtJs": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 30],
          "BackboneJs": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10],
          "D3.js": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20],
          "Rapheal": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20],
          "kinetic": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20]
        },
        "Template": {
          "Jade": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20],
          "Razor": [0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 50, 60, 80, 80, 80]
        }
      }
    },
    "Language": {
      "Dotnet": {
        "C#": [0, 0, 0, 0, 0, 0, 20, 50, 70, 80, 90, 95, 95, 95, 95],
        "Xaml": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 50],
        "F#": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 30, 30]
      },
      "Script": {
        "Javascript": [0, 0, 10, 30, 50, 50, 60, 60, 60, 80, 80, 60, 50, 50, 60],
        "VBScript": [0, 0, 0, 0, 20, 20, 30, 30, 40, 30, 20, 20, 20, 20, 20],
        "CoffeeScript": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 50],
        "Python": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20]
      },
      "Java": {
        "Android": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30]
      },
      "Embedded": {
        "X86 Asm": [0, 0, 0, 0, 0, 0, 0, 0, 10, 40, 40, 30, 25, 20, 20],
        "C": [0, 0, 0, 0, 0, 0, 0, 20, 25, 30, 50, 50, 45, 40, 40]
      },
      "Other": {
        "T-SQL": [0, 0, 0, 0, 0, 10, 20, 40, 40, 40, 60, 90, 90, 90, 80],
        "(E)BNF": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 30],
        "XSD/XSLT": [0, 0, 0, 0, 0, 0, 20, 40, 40, 40, 40, 40, 50, 50, 60],
        "QB": [40, 50, 40, 30, 20, 10, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        "VB": [0, 10, 20, 50, 60, 80, 90, 80, 70, 60, 60, 60, 60, 50, 50],
        "Pascal": [0, 0, 0, 30, 50, 60, 40, 20, 10, 5, 5, 5, 5, 5, 5],
        "IEC61131": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 40]
      }
    },
    "Other": {
      "HW&FW": {
        "Protues": [0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 30, 25, 20, 20, 25],
        "Keil": [0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 30, 25, 20, 20, 25],
        "Code Warrior": [0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 15, 15, 10, 10, 20],
        "Protel": [0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 20, 15, 10, 10, 5],
        "Multisim": [0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 30, 30, 25, 20, 15],
        "Lego": [0, 0, 0, 0, 10, 40, 50, 45, 40, 35, 30, 25, 20, 15, 10]
      },
      "Productivity": {
        "Vim": [0, 0, 0, 0, 0, 0, 0, 0, 10, 20, 30, 40, 45, 50, 55],
        "AHK": [0, 0, 0, 0, 0, 0, 0, 0, 10, 20, 30, 30, 30, 35, 40],
        "Office": [0, 10, 20, 50, 60, 60, 70, 70, 80, 90, 90, 90, 90, 90, 90],
        "Photoshop": [0, 10, 20, 30, 35, 40, 45, 50, 60, 65, 60, 60, 55, 60, 60],
        "Batch": [40, 45, 50, 50, 50, 60, 65, 70, 75, 75, 80, 80, 80, 80, 80],
        "Shell": [0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 30, 35, 40],
        "Linux": [0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 40, 50, 55],
        "Marked Text": [10, 20, 20, 30, 40, 40, 40, 40, 40, 50, 60, 70, 80, 80, 80]
      },
      "Project": {
        "Agile": [0, 0, 0, 0, 0, 0, 0, 0, 10, 30, 40, 50, 60, 70, 80],
        "CI": [0, 0, 0, 0, 0, 0, 0, 0, 10, 30, 50, 70, 70, 80, 80],
        "Repos": {
          "Git": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 50],
          "SVN": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 30, 50, 50, 50],
          "Clearcase": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 30]
        },
        "Track": {
          "Redmine": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 30],
          "Trello": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 20]
        },
        "Wiki": [0, 0, 0, 0, 0, 0, 0, 0, 10, 40, 50, 40, 40, 40, 40],
        "Quality Assurance": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 30, 50, 60, 60]
      },
      "Cloud": {
        "IaaS": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 15],
        "PaaS": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 30, 30],
        "SaaS": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10]
      },
      "Test": {
        "TDD": [0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 5, 5, 15, 5, 5],
        "cucumber": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 10, 30],
        "Load test": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 30, 25, 20, 15]
      }
    }
  }
};

 export class TimeScope extends HTMLElement {
	// static get observedAttributes() {
	//   return [`width`, `height`];
	// }
    static get observedAttributes() {
      return [`width`, `height`,'progress','status','radius'];
    }
  
    reload_objects (path, agent, func, step_objects, name, object, commands, settings){
		   
    }
	constructor() {
	  super();
	  const shadow = this.attachShadow({mode: 'open'});
	  const video = this.video = document.createElement('video');
	  video.setAttribute(`controls`, `controls`);
	  video.setAttribute(`width`, this.getAttribute(`width`) || 1920);
	  video.setAttribute(`height`, this.getAttribute(`height`) || 1080);
	  shadow.appendChild(video);

		this._root = this.attachShadow({mode: 'open'});
		// Apply external styles to the shadow dom
		const linkElem = document.createElement('link');
		linkElem.setAttribute('rel', 'stylesheet');
		linkElem.setAttribute('href', 'assets/css/Medusa.css');
		this._root.appendChild(linkElem); // Attach the created elements to the shadow dom
		this.status = '';
		this.progress = 0;

		let dis  = this;
		let pulse = 0;
		const interval = setInterval(() => {
		if(dis.status === 'Cancelled !' || dis.status === 'Completed !'){
			// dis.style.display =  'none'
			dis.remove();
			clearInterval(interval);
			return;
		}

		if(dis.progress<0){
			dis.status = 'Cancelled !';
		}
		else if(dis.progress==100){
			dis.status = 'Completed !';
		}
		else{
			const circle = dis._root.querySelector('circle');
			if(circle){
				circle.nextElementSibling.textContent = dis.status.padEnd(dis.status.length+(pulse%4),'.');    
			}
			else{
				
				dis.remove();
				clearInterval(interval);
			}
		}
		pulse++;
		}, 1000);
  
	  }
    create_group(){
		`#my-rect {
			transform-origin: left top;
			transform: translate(var(--posX, 0), var(--posY, 0)) scaleX(var(--scale, 1));
		}
		
		<svg height="1000" width="1000">
		  <defs>
			<g id="my-group">
			  <g>
				<circle r="100" fill="#0000BF" stroke="black" stroke-width="2" fill-opacity="0.8"></circle>
			  </g>
			  <svg x="-50" y="-50" overflow="visible">
				<rect id="my-rect" height="100" width="50">
				</rect>
			  </svg>
			</g>
		  </defs>
		  <use xlink:href="#my-group" x="110" y="110" style="--scale:1"/>
		  <use xlink:href="#my-group" x="340" y="110" style="--scale:2; --posX:20px; --posY:-10px"/>
		</svg>`

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


	get width() { return this.video.width; }
	set width(val) { this.setAttribute(`width`, val); }
	get height() { return this.video.height; }
	set height(val) { this.setAttribuite(`height`, val); }
  
    setProgress(percent) {
      const offset = this._circumference - (percent / 100 * this._circumference);
      const circle = this._root.querySelector('circle');
      circle.style.strokeDashoffset = offset; 
      circle.previousElementSibling.textContent = `${percent}%`;

      
      circle.nextElementSibling.textContent = this.status;
      this.progress = parseInt(percent);
      // circle.nextElementSibling.textContent = this.status.padEnd(this.status.length+(percent%4),'.');
      // if(percent==='100'){
      //   this.status = 'Completed !';
      //   let dis  = this;
      //   circle.nextElementSibling.textContent = this.status;
      //   const interval = setInterval(() => {
      //       dis.style.display =  'none'
      //       clearInterval(interval);
      //   }, 1000);
      // }
    }

    redraw(percent) {
      const radius = this.getAttribute('radius');
      const progress = this.getAttribute('progress');
      const status = this.getAttribute('status');
      const stroke = radius * 0.2;
      const svg_width = radius * 5;
      const svg_height = radius * 2;
      const normalizedRadius = radius - stroke * 2;
      this._circumference = normalizedRadius * 2 * Math.PI;
      
      this._root.innerHTML = `
        <svg height="${svg_height}" width="${svg_width}">
            <text 
                x="${radius}"
                y="${radius}"
                font-size="18"
                text-anchor="middle"
                dominant-baseline="middle" 
                fill="black">${progress}</text>
            <circle class='time-scope'
                r="${normalizedRadius}"
                cx="${radius}"
                cy="${radius}"
                stroke="black"
                stroke-dasharray="${this._circumference} ${this._circumference}"
                style="stroke-dashoffset:${this._circumference}"
                stroke-width="${stroke}"
                fill="transparent" />
      
            <text 
                x="${radius * 2}"
                y="${radius}"
                font-size="18"
                text-anchor="start"
                dominant-baseline="middle" 
                fill="black">${status}</text>
        </svg>
        <style>
          .time-scope {
            stroke: #e74c3c;
            stroke-width: 10;
            stroke-linecap: round;
            fill: none;
            stroke-dashoffset: 0;
            stroke-dasharray: ${this._circumference}; // pi*2*circle_radius, the length of the "path"
            stroke-linecap: round;
            animation: dash 2s ease-in-out infinite;
            transform-origin: ${radius}px ${radius}px;
            transform: rotate(-90deg);
            
          }
        </style>
      `;

      `
      circle {
        stroke: #e74c3c;
        stroke-width: 10;
        fill: none;
        stroke-dashoffset: 0;
        stroke-dasharray: 504; // pi*2*circle_radius, the length of the "path"
        stroke-linecap: round;
        animation: dash 2s ease-in-out infinite;
      }`
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'progress') {
        this.setProgress(newValue);
      }
      else{
        this[name] = newValue;
        this.redraw();
      }
    }
  }
  
  	var qs = (el = "") => document.querySelector(el);

    var fromTo = (from, to, prgrs = 0) => from + (to - from) * prgrs;
	
    var transforms = {
		translate3D: function (x = 0, y = 0, z = 0, el = "px") { return `translate3D(${x}${el}, ${y}${el}, ${z}${el})`; },
		translate:   function (x = 0, y = 0, el = "px")        { return `translate(${x}${el}, ${y}${el})`; },
		rotate3d:    function (x = 0, y = 0, z = 0, deg = 0)   { return `rotate3d(${x}, ${y}, ${z}, ${deg}deg)`; },
		rotate:      function (deg = 0)                        { return `rotate(${deg}deg)`; },
		scale:       function (x = 1, y = 1)                   { return `scale(${x}, ${y})`; },
		perspective: function (val = 0, el = "px")             { return `perspective(${val}${el})`; }
	};
	
	var easing = {
		inCubic: function (t, b, c, d) {
		  var ts = (t /= d) * t;
		  var tc = ts * t;
		  return b + c * (1.7 * tc * ts - 2.05 * ts * ts + 1.5 * tc - 0.2 * ts + 0.05 * t);
		},
		outElastic: function (t, b, c, d) {
		  var ts = (t /= d) * t;
		  var tc = ts * t;
		  return b + c * (33 * tc * ts + -106 * ts * ts + 126 * tc + -67 * ts + 15 * t);
		},
		customSin: function (t, b, c, d) {
		  var ts = (t /= d) * t;
		  var tc = ts * t;
		  return b + c * (81 * tc * ts + -210 * ts * ts + 190 * tc + -70 * ts + 10 * t);
		}
	};
	
    var getCenter = (line = {}) => {
		return {
			x: (+line.getAttribute("x1") + +line.getAttribute("x2")) / 2,
			y: (+line.getAttribute("y1") + +line.getAttribute("y2")) / 2
		}
    };

    var getScalePoint = (obj = {}, onScene = true) => {
		if (!onScene) {
			let svgRect = obj.getBBox();
			return { x: svgRect.x + svgRect.width / 2, y: svgRect.y + svgRect.height / 2 } }
		let rect = obj.getBoundingClientRect();
		return { x: rect.width / 2, y: rect.height / 2 }
    };
  
	//https://codepen.io/francoisromain/pen/XabdZm
	// https://www.sitepoint.com/html5-svg-cubic-curves/
	// https://codepen.io/SitePoint/pen/mdrdpVr
const smoothing = 0.15
const options = { yMin: -10, yMax: 130, xMin: -5, xMax: 200 }
const points = [ [0, 10], [2, 15], [5, 60], [10, -20], [20, 10], [30, 40], [40, 10], [50, 60], [60, 120], [70, 10], [80, 50], [90, 50], [120, 10], [150, 80], [190, 10]]

const options2 = { xMin: -53, xMax: 198, yMin: -32, yMax: 128, line: { smoothing: 0.15, flattening: 0.5 }};
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

// const map = (value, inMin, inMax, outMin, outMax) => { return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin; };
// const lib = {
// 	map(value, inMin, inMax, outMin, outMax) { return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin; },
// 	range(start, end, tick) {
// 	  const s = Math.round(start / tick) * tick
// 	  return Array.from(
// 		  { length: Math.floor((end - start) / tick) }, 
// 		  function(v, k){ return k * tick + s;});
// 	}
//   };
  

// const line = (pointA, pointB) => {
//     const lengthX = pointB[0] - pointA[0];
//     const lengthY = pointB[1] - pointA[1];
//     return {
//         length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
//         angle: Math.atan2(lengthY, lengthX)
//     }
// }

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


const pointsPositionsCalc = (points, w, h, options) => points.map(e => {
	const x = map(e[0], options.xMin, options.xMax, 0, w)
	const y = map(e[1], options.yMin, options.yMax, h, 0)
	return [x, y]
})

const svgRender = (content, w, h) => `<svg viewBox="0 0 ${w} ${h}" version="1.1" xmlns="http://www.w3.org/2000/svg"> ${content} </svg>`

const svgPath = (points, command, h) => {
  const d = points.reduce((acc, e, i, a) => i === 0 ? `M ${a[a.length - 1][0]},${h} L ${e[0]},${h} L ${e[0]},${e[1]}` : `${acc} ${command(e, i, a)}` , '');
  return `<path d="${d}" class="svg-path" />`}

const svgCircles = points => points.reduce((acc, point, i, a) =>  `${acc} <circle cx="${point[0]}" cy="${point[1]}" r="2.5" class="svg-circles" v-for="p in pointsPositions"/>`, '')

	let maindiv = document.getElementById('speaker');
	let mainsvg = document.getElementById('speakersvg');
	let parent = {};
	const speaker_m   = new Path(parent, '', null, mainsvg, {svg:mainsvg}, null, 'def_ref', false,'speakB','','volElem', 10, 0, 0, 359, "#9E7818", 1, 'none', 0.4);
	const speaker_w   = new Path(parent, '', null, mainsvg, {svg:mainsvg}, null, 'def_ref', false,'speakF','','volElem', 25, 0, 0, 359, "#9E7818", 1, 'none', 0.4);
	const big_arc_m   = new Path(parent, '', null, mainsvg, {svg:mainsvg}, null, 'def_ref', false,'arcBigB','','volElem', 85, 0, 0, 359, "#9E7818", 1, 'none', 0.4);
	const big_arc_w   = new Path(parent, '', null, mainsvg, {svg:mainsvg}, null, 'def_ref', false,'arcBigF','','volElem', 85, 0, 0, 359, "#F4AF0A", 1, 'none', 1.0);
	const small_arc_m = new Path(parent, '', null, mainsvg, {svg:mainsvg}, null, 'def_ref', false,'arcSmB','','volElem', 55, 0, 0, 359, "#9E7818", 1, 'none', 0.4);
	const small_arc_w = new Path(parent, '', null, mainsvg, {svg:mainsvg}, null, 'def_ref', false,'arcSmF','','volElem', 55, 0, 0, 359, "#F4AF0A", 1, 'none', 1.0);
	const cross_l 	  = new Path(parent, '', null, mainsvg, {svg:mainsvg}, null, 'def_ref', false,'crossLtRb','','volElem', 100, 0, 0, 359, "#9E7818", 1, 'none', 0.4);
	const cross_r 	  = new Path(parent, '', null, mainsvg, {svg:mainsvg}, null, 'def_ref', false,'crossLbRt','','volElem', 115, 0, 0, 359, "#9E7818", 1, 'none', 0.4);
	let traveller = new Traveller(parent, 'traveller_1', null, mainsvg, {svg:mainsvg}, null, null, true);
	let dataset = new DataSet(parent, 'dataset_1', null, mainsvg, {svg:mainsvg}, null, null, false);
	

	let radar = HTML.make("scope-radar", "", [], {width:400, height:400}); 
	HTML.style(radar,{width:'400px', height:'400px'})
	HTML.put(maindiv,radar,0);


	var [ring] = HTML.ladder(maindiv, `progress-ring::`);
	HTML.configure(ring, {id:'queued' , stroke:"40", stroke:"40", radius:"60", progress:"95", status:'in-progress'});
	ring.setAttribute('status', 'queued');
	ring.setAttribute('progress', 10);


const container = document.querySelector('.container')
const resize = _ => {
  const w = container.offsetWidth;
  const h = container.offsetHeight;
  const pointsPositions = pointsPositionsCalc(points, w, h, options)
  const bezierCommandCalc = bezierCommand(controlPoint(line, smoothing))
  const path = svgPath(pointsPositions, bezierCommandCalc, h);
  const circles = svgCircles(pointsPositions)
  container.innerHTML = svgRender(path + circles, w, h)
}

// window.addEventListener('resize', resize)
// resize()


//   <line id="ctrlLineB" class="volElem" stroke="#9E7818" x1="13" y1="13.5" x2="261.2" y2="13.5" opacity="0.3"/>
//   <line id="ctrlLineF" class="volElem" stroke="#F4AF0A" x1="13" y1="13.5" x2="261.2" y2="13.5"/>
//   <circle id="ctrlCirce" cx="261.2" cy="13.5" r="13" fill="#F4AF0A"/>
	// mainsvg.appendChild(new Path('ctrlLineB','','volElem', 140, 0, 0, 359, "#9E7818", 1, 'none', 0.4).path);
	// mainsvg.appendChild(new Path('ctrlLineF','','volElem', 140, 0, 0, 359, "#F4AF0A", 1, 'none', 1.0).path);
	// mainsvg.appendChild(new Path('ctrlCirce','','', 5, 0, 0, 359, "#F4AF0A", 1, 'none', 1.0).path);

	const speakB = qs("#speakB");
	const arcBigB = qs("#arcBigB");
	const arcSmB = qs("#arcSmB");

	const speakF = qs("#speakF");
	const arcBigF = qs("#arcBigF");
	const arcSmF = qs("#arcSmF");

	const crossLtRb = qs("#crossLtRb");
	const crossLbRt = qs("#crossLbRt");

	const ctrlCirce = qs("#ctrlCirce");
	const ctrlLineF = qs("#ctrlLineF");
	const ctrlLineB = qs("#ctrlLineB");
  

    var play = {
		dx: 1 / 5,
		ds: 0.03,
		flag: true,
		step: 0, speed: 5,
		curPosBig: { x: 0, y: 0, scale: 1 },
		curPosSm: { x: 0, y: 0, scale: 1 },
		curPos: 1,
		
		on: false, 	   off: false,
		onCurStep: 0,  offCurStep: 100,
		onMaxStep: 20, offMaxStep: 100,
		onSpeed: 2,	   offSpeed: 2,

		memory: true, 
		memory_value: 0,

		ddx: 0,
		interact: false,
		maxX: +ctrlCirce.getAttribute("cx"),
		minX: +ctrlLineF.getAttribute("x1"),
		curCx: +ctrlCirce.getAttribute("cx"),
		pointBig: getScalePoint(arcBigF),
		pointSm: getScalePoint(arcSmF),

		pointLbRt: getCenter(crossLbRt),
		pointLtRb: getCenter(crossLtRb),
  
		Init:function(evt) {
			SVGRoot = document.getElementById('bewaar_holder');
			TrueCoords = SVGRoot.createSVGPoint();
			GrabPoint = SVGRoot.createSVGPoint();
			// this will serve as the canvas over which items are dragged.
			//    having the drag events occur on the mousemove over a backdrop
			//    (instead of the dragged element) prevents the dragged element
			//    from being inadvertantly dropped when the mouse is moved rapidly
			BackDrop = document.getElementById('BackDrop');
		},

		Grab: function(evt) {
			// find out which element we moused down on
			var targetElement = evt.target;
		
			// you cannot drag the background itself, so ignore any attempts to mouse down on it
			if (BackDrop != targetElement) {
				//set the item moused down on as the element to be dragged
				DragTarget = targetElement;
				DragTarget.parentNode.appendChild(DragTarget);
				DragTarget.setAttributeNS(null, 'pointer-events', 'none');
				var transMatrix = DragTarget.getCTM();
				GrabPoint.x = TrueCoords.x - Number(transMatrix.e);
				GrabPoint.y = TrueCoords.y - Number(transMatrix.f);
		
			}
		},

		Drag:function(evt) {
			GetTrueCoords(evt);
			if (DragTarget) {
				var newX = TrueCoords.x - GrabPoint.x;
				var newY = TrueCoords.y - GrabPoint.y;
				DragTarget.setAttributeNS(null, 'transform', 'translate(' + newX + ',' + newY + ')');
			}
		},

		Drop:function(evt) {
			if (DragTarget) {
				var targetElement = evt.target;
				DragTarget.setAttributeNS(null, 'pointer-events', 'all');
				if ('Folder' == targetElement.parentNode.id) {
					targetElement.parentNode.appendChild(DragTarget);
					alert(DragTarget.id + ' has been dropped into a folder, and has been inserted as a child of the containing group.');
				} else {
					alert(DragTarget.id + ' has been dropped on top of ' + targetElement.id);
				}
				DragTarget = null;
			}
		},

		GetTrueCoords:function(evt) {
			var newScale = SVGRoot.currentScale;
			var translation = SVGRoot.currentTranslate;
			TrueCoords.x = (evt.clientX - translation.x) / newScale;
			TrueCoords.y = (evt.clientY - translation.y) / newScale;
		},

		turn_off: function () {
			HTML.visibility([crossLbRt, crossLtRb], [arcBigB, arcBigF, arcSmB, arcSmF]);
			let len = speakF.getTotalLength();
			let step1 = 20;
			let step2 = this.offMaxStep - step1;
			let backLen = 0.7;
			if (this.offCurStep >= this.offMaxStep - step1) {
				let progress = (step1 + this.offCurStep - this.offMaxStep) / step1;
				let progressB = fromTo(1, backLen, 1 - progress);
				SVG.draw_line(speakF,[len * progress, len * 1.05], -len * (1 - progress) / 2);
				SVG.draw_line(speakB,[len * progressB, len * 1.05], -len * (1 - progressB) / 2);
			}
	
			if (this.offCurStep < step2 && this.offCurStep >= step2 - step1) {
				let progress = 1 - (this.offCurStep - step2 + step1) / step1;
				let progressB = fromTo(backLen, 1, progress);
				speakB.setAttribute("stroke-dasharray", len * progressB + "," + len * 1.05);
				speakB.setAttribute("stroke-dashoffset", -len * (1 - progressB) / 2 + "");
			}
	
			if (this.offCurStep < step2 && this.offCurStep >= 0) {
				speakF.setAttribute("visibility", "hidden");
				let progress = this.offCurStep / step2;
				[crossLbRt, crossLtRb].forEach((el, index) => {
					let scale = easing.outElastic(1 - progress, 0, 1, 1);
					let dx = index == 0 ? easing.customSin(1 - progress, -3, 3, 1) : easing.customSin(1 - progress, -2, 2, 1);
					let dy = index == 0 ? easing.customSin(1 - progress, -2, 2, 1) : easing.customSin(1 - progress, 2, -2, 1);
					let x = -this.pointLbRt.x * (scale - 1) + dx;
					let y = -this.pointLbRt.y * (scale - 1) + dy;
					el.setAttribute("transform", transforms.translate(x, y, "") + transforms.scale(scale, scale));
				});
			}
			this.offCurStep += -this.offSpeed;
		},
		draw: function () {
			if (this.off) { // draw when volume became 0
				this.turn_off();
			}
			else {
				if (this.on) {
					[speakF, arcBigB, arcSmB, arcSmF].forEach((el) => { 
						el.setAttribute("visibility", "visible"); });
					[crossLbRt, crossLtRb].forEach((el) => {
					el.setAttribute("visibility", "hidden");
					el.setAttribute("transform", "scale(0)"); });
					let len = speakF.getTotalLength();
					let progress = this.onCurStep / this.onMaxStep;
					speakF.setAttribute("stroke-dasharray", len * progress + "," + len * 1.05);
					speakF.setAttribute("stroke-dashoffset", -len * (1 - progress) / 2 + "");
					this.onCurStep += this.onSpeed;
				}
		
				let dxBig, dxSm, sclFactB, sclFactSm;
				if (this.step >= this.speed) {
					this.flag = !this.flag;
					this.step = 0;
				}
				let progress = this.step / this.speed;
				let amplitudeB = 1 - easing.inCubic(1 - this.curPos, 0, 1, 0.5);
				let amplitudeS = 1 - easing.inCubic(1 - this.curPos, 0, 1, 1);
		
				if (this.curPos < 0.5) amplitudeB = 0;
				if (amplitudeS <= 0 || !amplitudeS) amplitudeS = 0;
		
				if (this.flag) {
					dxBig = fromTo(0, this.dx * 3, progress);
					dxSm = fromTo(0, -this.dx * 2, progress);
					sclFactB = fromTo(0, this.ds, progress);
					sclFactSm = fromTo(0, -this.ds, progress);
				}
				else {
					dxBig = fromTo(this.dx * 3, 0, progress);
					dxSm = fromTo(-this.dx * 2, 0, progress);
					sclFactB = fromTo(this.ds, 0, progress);
					sclFactSm = fromTo(-this.ds, 0, progress);
				}
		
				[arcBigF, arcBigB].forEach((el) => {
					let scale = this.curPosBig.scale + sclFactB * amplitudeB;
					let y = -play.pointBig.y * (scale - 1) * 1.5;
					el.setAttribute("transform", transforms.translate(this.curPosBig.x + dxBig * amplitudeB, y, "") + transforms.scale(scale, scale));
				});
		
				[arcSmF, arcSmB].forEach((el) => {
					let scale = this.curPosSm.scale + sclFactSm * amplitudeS;
					let y = -play.pointSm.y * (scale - 1) * 3;
					el.setAttribute("transform", transforms.translate(this.curPosSm.x + dxSm * amplitudeS, y, "") + transforms.scale(scale, scale));
				});
				this.step++;
			}
			requestAnimationFrame(this.draw.bind(play));
		},

		update: function () {
			this.curCx += this.ddx;
			let cx = this.curCx;
			if (cx > this.maxX) { cx = this.maxX; }
			if (cx < this.minX) { cx = this.minX; }
			let progress = (cx - this.minX) / (this.maxX - this.minX);
			play.curPos = progress;
			ctrlCirce.setAttribute("cx", cx);
			ctrlLineF.setAttribute("x2", cx);
			let scaleFactor = fromTo(1, 0.85, 1 - progress);
			let scaleDxBig = fromTo(0, -3, 1 - progress);
			let scaleDxSm = fromTo(0, -1, 1 - progress);

			[arcBigF, arcBigB].forEach((el) => {
				play.curPosBig.x = -this.pointBig.x * (scaleFactor - 1) + scaleDxBig;
				play.curPosBig.y = -this.pointBig.y * (scaleFactor - 1) * 1.5;
				play.curPosBig.scale = scaleFactor;
				el.setAttribute("transform", transforms.translate(play.curPosBig.x, play.curPosBig.y, "") + transforms.scale(scaleFactor, scaleFactor));
			});
	
			[arcSmF, arcSmB].forEach((el) => {
				play.curPosSm.x = -this.pointSm.x * (scaleFactor - 1) + scaleDxSm;
				play.curPosSm.y = -this.pointSm.y * (scaleFactor - 1) * 3;
				play.curPosSm.scale = scaleFactor;
				el.setAttribute("transform", transforms.translate(play.curPosSm.x, play.curPosSm.y, "") + transforms.scale(scaleFactor, scaleFactor));
			});
	
			let smLen = arcSmF.getTotalLength();
			let bgLen = arcBigF.getTotalLength();

			if (progress > 0.5) {
				if (play.off) { 
					// play.onRefresh(); 

					play.off = false;
					play.onCurStep = 0;
					play.on = true;
				}
				let prgForBig = fromTo(1, -1, 1 - progress);
				arcBigF.setAttribute("visibility", "visible");
				arcBigF.setAttribute("stroke-dasharray", bgLen * prgForBig + "," + bgLen * 1.05);
				arcBigF.setAttribute("stroke-dashoffset", -bgLen * (1 - prgForBig) / 2 + "");

				arcSmF.setAttribute("visibility", "visible");
				arcSmF.setAttribute("stroke-dasharray", smLen + "");
				arcSmF.setAttribute("stroke-dashoffset", "0");
			}
	
			if (progress <= 0.5 && progress > 0) {
				if (play.off) { 
					play.off = false;
					play.onCurStep = 0;
					play.on = true;
				}
				let prgForSm = fromTo(1, 0, 1 - progress * 2);
				arcBigF.setAttribute("visibility", "hidden");

				arcSmF.setAttribute("visibility", "visible");
				arcSmF.setAttribute("stroke-dasharray", smLen * prgForSm + "," + smLen * 1.05);
				arcSmF.setAttribute("stroke-dashoffset", -smLen * (1 - prgForSm) / 2 + "");
			}
	
			if (progress <= 0) {
				arcSmF.setAttribute("visibility", "hidden");
				if (play.off == false) { 
					play.offCurStep = play.offMaxStep;
					play.off = true;
				}
			}
		}
    };  

	function press (e) {
        let startX = e.pageX || e.originalEvent.touches[0].pageX;
        e.preventDefault();
        play.interact = true;
    
        if (this == ctrlLineB || this == ctrlLineF) {
            let rect = ctrlCirce.getBoundingClientRect();
            let center = (rect.left + rect.right) / 2.0;
            play.ddx = startX - center;
            play.update();
        }
        function slide (e) {
            e.preventDefault();
            let curX = e.pageX || e.originalEvent.touches[0].pageX;
            play.ddx = curX - startX;
            startX = curX;
            play.update();
        }
        function release (e) {
            if (play.curCx < play.minX) { play.curCx = play.minX; }
            if (play.curCx > play.maxX) { play.curCx = play.maxX; }
            document.removeEventListener("pointermove",slide);
            document.removeEventListener("pointerup", release);
        }
        document.addEventListener("pointermove",slide);
        document.addEventListener("pointerup", release);
    }
	function mute (e) {
		e.preventDefault();
		play.interact = true;
		play.ddx = 0;
		if (play.memory) {
		  play.memory = false;
		  play.memory_value = play.curCx;
		  play.curCx = 0;
		}
		else {
		  play.memory = true;
		  play.curCx = play.memory_value;
		}
		play.update();
	}

    document.getElementById('ctrlCirce').addEventListener("pointerdown", press);
    document.getElementById("speaker").addEventListener("pointerdown", mute);
    requestAnimationFrame(play.draw.bind(play));

    // 2much animations in feed to do this ↓ smooth
    // (function pevAnimation() {
    //   for (let i = play.maxX; i > -1; i -= 5) {
    //     setTimeout(() => {
    //       if (!play.interact) {
    //         play.curCx = i;
    //         play.update();
    //       }
    //     }, 300 + play.maxX - i);
    //   }
    //   for (let i = 50; i <= play.maxX; i += 3) {
    //     setTimeout(() => {
    //       if (!play.interact) {
    //         play.curCx = i;
    //         play.update();
    //       }
    //     }, 1400 + i);
    //   }
    // })();

	// let mainsvg = document.getElementById('speakersvg');
	// let testpath = new Path('testpath','','volElem', 45, 0, 0, 359, "#9E7818", 1, 'none', 0.4);
	// mainsvg.insertBefore(testpath.path, mainsvg.firstChild);

	
