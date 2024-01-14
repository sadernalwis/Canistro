import { Path } from "../Path/Path.js";
import { SVG } from "../SVG.js";

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

    load_speaker(speaker, arcs_){}
	load_arcs(speaker, arcs_){
		var arcs = [
			`d="M72.2,64.1C81.1,59,87,49.4,87,38.5c0-10.9-5.9-20.5-14.8-25.6"`,
			`d="M59,51.3c4.4-2.6,7.4-7.4,7.4-12.8s-3-10.3-7.4-12.8"`,
		]
		arcs = [
			`d="M72.2,64.1C81.1,59,87,49.4,87,38.5c0-10.9-5.9-20.5-14.8-25.6"`,
			`d="M59,51.3c4.4-2.6,7.4-7.4,7.4-12.8s-3-10.3-7.4-12.8"`,
		]
		var arc_layers = [
			// [css_cls, x, y, radius, spread, startAngle, endAngle, stroke, strokeWidth, fill, opacity],
			['volElem', speaker.x, speaker.y, 10, 0, 45, 135, "#9E7818", 1, 'none', 0.4],
			['volElem', speaker.x, speaker.y, 20, 0, 45, 135, "#F4AF0A", 5, 'none', 1.0],
		]
		var arcs = [
			// [css_cls, x, y, radius, spread, startAngle, endAngle, stroke, strokeWidth, fill, opacity],
			['volElem', 10, 0, 45, 135],
			['volElem', 20, 0, 45, 135],
		]
		var layers = [
			// [css_cls, x, y, radius, spread, startAngle, endAngle, stroke, strokeWidth, fill, opacity],
			["#9E7818", 1, 'none', 0.4],
			["#F4AF0A", 5, 'none', 1.0],
		]
		if(bar.speakB) {
			SVG.clear(bar.speakB);
		}
		else{
			bar.speakB = SVG.make('','bar.speakB',[],{},'','')
		}
		
		if(speaker.arcs) {
			SVG.clear(speaker.arcs);
		}
		arcs.forEach((arc, index) => {
			layers.forEach((layer, index) => {
				// arc.splice(arc.length-1, 0, ...layer)
				let args = arc.concat(layer);
				let path = new Path(...args);				
				speaker.arc.appendChild(arc_e);
			})
			// let arc_e = SVG.make('path','volElem',[],{stroke:"#9E7818", opacity:"0.4"},`arc_e_${index}`,'');
			// let arc_f = SVG.make('path','volElem',[],{stroke:"#F4AF0A"},`arc_f_${index}`,'');
			// apeeaker.arc.appendChild(arc_e);
			// apeeaker.arc.appendChild(arc_f);
		});

	
		if(bar.crossLtRb) {
			SVG.clear(bar.crossLtRb);
		}
		else{
			bar.crossLtRb = SVG.make('','bar.crossLtRb',[],{},'','')
		}
		if(bar.crossLbRt) {
			SVG.clear(bar.crossLbRt);
		}
		else{
			bar.crossLbRt = SVG.make('','bar.crossLbRt',[],{},'','')
		}
	}

    load_controller(all_steps, all_blocks, all_choices){
		
		if(bar.ctrlCirce) {
			SVG.clear(bar.ctrlCirce);
		}
		else{
			bar.ctrlCirce = SVG.make('','bar.ctrlCirce',[],{},'','')
		}
		if(bar.ctrlLineF) {
			SVG.clear(bar.ctrlLineF);
		}
		else{
			bar.ctrlLineF = SVG.make('','bar.ctrlLineF',[],{},'','')
		}
		if(bar.ctrlLineB) {
			SVG.clear(bar.ctrlLineB);
		}
		else{
			bar.ctrlLineB = SVG.make('','bar.ctrlLineB',[],{},'','')
		}

        let bar = this;
        all_steps.forEach(step => {
            HTML.put(bar.staircase, step, -1);
        });
        all_blocks.forEach(block => {
            HTML.put(bar.chain, block, -1);
        });
        all_choices.forEach(choice => {
            HTML.put(bar.ladder, choice, -1);
        });


        bar.ladder.css_3d.needs_update = true
        bar.staircase.css_3d.needs_update = true
        bar.chain.css_3d.needs_update = true;
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
    var getCenter = (line = {}) => {
      return {
        x: (+line.getAttribute("x1") + +line.getAttribute("x2")) / 2,
        y: (+line.getAttribute("y1") + +line.getAttribute("y2")) / 2
      }
    };

    var getScalePoint = (obj = {}, onScene = true) => {
      if (!onScene) {
        let svgRect = obj.getBBox();
        return {
          x: svgRect.x + svgRect.width / 2,
          y: svgRect.y + svgRect.height / 2
        }
      }
      let rect = obj.getBoundingClientRect();
      return {
        x: rect.width / 2,
        y: rect.height / 2
      }
    };
  
    var volObj = {
		speakB: qs("#speakB"),
		arcBigB: qs("#arcBigB"),
		arcSmB: qs("#arcSmB"),
	
		speakF: qs("#speakF"),
		arcBigF: qs("#arcBigF"),
		arcSmF: qs("#arcSmF"),
	
		crossLtRb: qs("#crossLtRb"),
		crossLbRt: qs("#crossLbRt"),
	
		ctrlCirce: qs("#ctrlCirce"),
		ctrlLineF: qs("#ctrlLineF"),
		ctrlLineB: qs("#ctrlLineB")
	  };

	// let mainsvg = document.getElementById('speakersvg');
	// let testpath = new Path('speakB','','volElem', 45, 0, 0, 359, "#9E7818", 1, 'none', 0.4);
	// let testpath = new Path('speakF','','volElem', 45, 0, 0, 359, "#9E7818", 1, 'none', 0.4);
	// let testpath = new Path('arcBigB','','volElem', 45, 0, 0, 359, "#9E7818", 1, 'none', 0.4);
	// let testpath = new Path('arcBigF','','volElem', 45, 0, 0, 359, "#9E7818", 1, 'none', 0.4);
	// let testpath = new Path('arcSmB','','volElem', 45, 0, 0, 359, "#9E7818", 1, 'none', 0.4);
	// let testpath = new Path('arcSmF','','volElem', 45, 0, 0, 359, "#9E7818", 1, 'none', 0.4);
	// let testpath = new Path('crossLtRb','','volElem', 45, 0, 0, 359, "#9E7818", 1, 'none', 0.4);
	// let testpath = new Path('crossLbRt','','volElem', 45, 0, 0, 359, "#9E7818", 1, 'none', 0.4);

	  var volObj = {
		speakB: qs("#speakB"),
		arcBigB: qs("#arcBigB"),
		arcSmB: qs("#arcSmB"),
	
		speakF: qs("#speakF"),
		arcBigF: qs("#arcBigF"),
		arcSmF: qs("#arcSmF"),
	
		crossLtRb: qs("#crossLtRb"),
		crossLbRt: qs("#crossLbRt"),
	
		ctrlCirce: qs("#ctrlCirce"),
		ctrlLineF: qs("#ctrlLineF"),
		ctrlLineB: qs("#ctrlLineB")
	  };
  
    var pathLen = {
      arcBigLen: volObj.arcBigF.getTotalLength(),
      arcSmLen: volObj.arcSmF.getTotalLength(),
      speakLen: volObj.speakF.getTotalLength()
    };
  
    var transforms = {
      translate3D: function (x = 0, y = 0, z = 0, el = "px") {
        return `translate3D(${x}${el}, ${y}${el}, ${z}${el})`;
      },
  
      translate: function (x = 0, y = 0, el = "px") {
        return `translate(${x}${el}, ${y}${el})`;
      },
  
      rotate3d: function (x = 0, y = 0, z = 0, deg = 0) {
        return `rotate3d(${x}, ${y}, ${z}, ${deg}deg)`;
      },
  
      rotate: function (deg = 0) {
        return `rotate(${deg}deg)`;
      },
  
      scale: function (x = 1, y = 1) {
        return `scale(${x}, ${y})`;
      },
  
      perspective: function (val = 0, el = "px") {
        return `perspective(${val}${el})`;
      }
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
  
    var play = {
      dx: 1 / 5,
      ds: 0.03,
      flag: true,
      step: 0,
      speed: 5,
  
      curPosBig: {
        x: 0,
        y: 0,
        scale: 1
      },
  
      curPosSm: {
        x: 0,
        y: 0,
        scale: 1
      },
  
      curPos: 1,
  
      off: false,
      offCurStep: 100,
      offMaxStep: 100,
      offSpeed: 2,
      offRefresh: function () {
        this.offCurStep = this.offMaxStep;
        this.off = true;
      },
  
      on: false,
      onCurStep: 0,
      onMaxStep: 20,
      onSpeed: 2,
      onRefresh: function () {
        this.off = false;
        this.onCurStep = 0;
        this.on = true;
      },
  
      pointLbRt: getCenter(volObj.crossLbRt),
      pointLtRb: getCenter(volObj.crossLtRb),
  
      animation: function () {
        if (this.off) { // animation when volume became 0
          [volObj.arcBigB, volObj.arcBigF, volObj.arcSmB, volObj.arcSmF].forEach((el) => {
            el.setAttribute("visibility", "hidden");
          });
          [volObj.crossLbRt, volObj.crossLtRb].forEach((el) => {
            el.setAttribute("visibility", "visible");
          });
  
          let len = pathLen.speakLen;
          let step1 = 20;
          let step2 = this.offMaxStep - step1;
          let backLen = 0.7;
  
          if (this.offCurStep >= this.offMaxStep - step1) {
            let progress = (step1 + this.offCurStep - this.offMaxStep) / step1;
            let progressB = fromTo(1, backLen, 1 - progress);
            volObj.speakF.setAttribute("stroke-dasharray", len * progress + "," + len * 1.05);
            volObj.speakF.setAttribute("stroke-dashoffset", -len * (1 - progress) / 2 + "");
            volObj.speakB.setAttribute("stroke-dasharray", len * progressB + "," + len * 1.05);
            volObj.speakB.setAttribute("stroke-dashoffset", -len * (1 - progressB) / 2 + "");
          }
  
          if (this.offCurStep < step2 && this.offCurStep >= step2 - step1) {
            let progress = 1 - (this.offCurStep - step2 + step1) / step1;
            let progressB = fromTo(backLen, 1, progress);
            volObj.speakB.setAttribute("stroke-dasharray", len * progressB + "," + len * 1.05);
            volObj.speakB.setAttribute("stroke-dashoffset", -len * (1 - progressB) / 2 + "");
          }
  
          if (this.offCurStep < step2 && this.offCurStep >= 0) {
            volObj.speakF.setAttribute("visibility", "hidden");
            let progress = this.offCurStep / step2;
            [volObj.crossLbRt, volObj.crossLtRb].forEach((el, index) => {
              let scale = easing.outElastic(1 - progress, 0, 1, 1);
              let dx = index == 0 ?
                easing.customSin(1 - progress, -3, 3, 1) :
                easing.customSin(1 - progress, -2, 2, 1);
              let dy = index == 0 ?
                easing.customSin(1 - progress, -2, 2, 1) :
                easing.customSin(1 - progress, 2, -2, 1);
              let x = -this.pointLbRt.x * (scale - 1) + dx;
              let y = -this.pointLbRt.y * (scale - 1) + dy;
              el.setAttribute("transform",
                transforms.translate(x, y, "") +
                transforms.scale(scale, scale));
            });
          }
          this.offCurStep += -this.offSpeed;
        }
  
        else {
          if (this.on) {
            [volObj.speakF, volObj.arcBigB, volObj.arcSmB, volObj.arcSmF].forEach((el) => {
              el.setAttribute("visibility", "visible");
            });
            [volObj.crossLbRt, volObj.crossLtRb].forEach((el) => {
              el.setAttribute("visibility", "hidden");
              el.setAttribute("transform", "scale(0)");
            });
            let len = pathLen.speakLen;
            let progress = this.onCurStep / this.onMaxStep;
            volObj.speakF.setAttribute("stroke-dasharray", len * progress + "," + len * 1.05);
            volObj.speakF.setAttribute("stroke-dashoffset", -len * (1 - progress) / 2 + "");
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
  
          [volObj.arcBigF, volObj.arcBigB].forEach((el) => {
            let scale = this.curPosBig.scale + sclFactB * amplitudeB;
            let y = -drag.pointBig.y * (scale - 1) * 1.5;
            el.setAttribute("transform",
              transforms.translate(this.curPosBig.x + dxBig * amplitudeB, y, "")
              + transforms.scale(scale, scale)
            );
          });
  
          [volObj.arcSmF, volObj.arcSmB].forEach((el) => {
            let scale = this.curPosSm.scale + sclFactSm * amplitudeS;
            let y = -drag.pointSm.y * (scale - 1) * 3;
            el.setAttribute("transform",
              transforms.translate(this.curPosSm.x + dxSm * amplitudeS, y, "")
              + transforms.scale(scale, scale)
            );
          });
          this.step++;
        }
        requestAnimationFrame(this.animation.bind(play));
      }
    };
  
    requestAnimationFrame(play.animation.bind(play));
  
    var drag = {
      dx: 0,
      maxX: +volObj.ctrlCirce.getAttribute("cx"),
      minX: +volObj.ctrlLineF.getAttribute("x1"),
      curCx: +volObj.ctrlCirce.getAttribute("cx"),
  
      pointBig: getScalePoint(volObj.arcBigF),
      pointSm: getScalePoint(volObj.arcSmF),
  
      interact: false,
  
      animateDrag: function () {
        this.curCx += this.dx;
        let cx = this.curCx;
  
        let smLen = pathLen.arcSmLen;
        let bgLen = pathLen.arcBigLen;
  
        if (cx > this.maxX) { cx = this.maxX; }
        if (cx < this.minX) { cx = this.minX; }
  
        let progress = (cx - this.minX) / (this.maxX - this.minX);
        play.curPos = progress;
  
        volObj.ctrlCirce.setAttribute("cx", cx);
        volObj.ctrlLineF.setAttribute("x2", cx);
  
        let scaleFactor = fromTo(1, 0.85, 1 - progress);
        let scaleDxBig = fromTo(0, -3, 1 - progress);
        let scaleDxSm = fromTo(0, -1, 1 - progress);
  
        [volObj.arcBigF, volObj.arcBigB].forEach((el) => {
          play.curPosBig.x = -this.pointBig.x * (scaleFactor - 1) + scaleDxBig;
          play.curPosBig.y = -this.pointBig.y * (scaleFactor - 1) * 1.5;
          play.curPosBig.scale = scaleFactor;
          el.setAttribute("transform",
            transforms.translate(play.curPosBig.x, play.curPosBig.y, "")
            + transforms.scale(scaleFactor, scaleFactor)
          );
        });
  
        [volObj.arcSmF, volObj.arcSmB].forEach((el) => {
          play.curPosSm.x = -this.pointSm.x * (scaleFactor - 1) + scaleDxSm;
          play.curPosSm.y = -this.pointSm.y * (scaleFactor - 1) * 3;
          play.curPosSm.scale = scaleFactor;
          el.setAttribute("transform",
            transforms.translate(play.curPosSm.x, play.curPosSm.y, "")
            + transforms.scale(scaleFactor, scaleFactor)
          );
        });
  
        if (progress > 0.5) {
          if (play.off) { play.onRefresh(); }
          let prgForBig = fromTo(1, -1, 1 - progress);
          volObj.arcBigF.setAttribute("visibility", "visible");
          volObj.arcSmF.setAttribute("visibility", "visible");
          volObj.arcBigF.setAttribute("stroke-dasharray", bgLen * prgForBig + "," + bgLen * 1.05);
          volObj.arcBigF.setAttribute("stroke-dashoffset", -bgLen * (1 - prgForBig) / 2 + "");
          volObj.arcSmF.setAttribute("stroke-dasharray", smLen + "");
          volObj.arcSmF.setAttribute("stroke-dashoffset", "0");
        }
  
        if (progress <= 0.5 && progress > 0) {
          if (play.off) { play.onRefresh(); }
          let prgForSm = fromTo(1, 0, 1 - progress * 2);
          volObj.arcBigF.setAttribute("visibility", "hidden");
          volObj.arcSmF.setAttribute("visibility", "visible");
          volObj.arcSmF.setAttribute("stroke-dasharray", smLen * prgForSm + "," + smLen * 1.05);
          volObj.arcSmF.setAttribute("stroke-dashoffset", -smLen * (1 - prgForSm) / 2 + "");
        }
  
        if (progress <= 0) {
          volObj.arcSmF.setAttribute("visibility", "hidden");
          if (play.off == false) { play.offRefresh(); }
        }
      }
    };
  

    document.getElementById('ctrlCirce').addEventListener("pointerdown", function (e) {
        let startX = e.pageX || e.originalEvent.touches[0].pageX;
        e.preventDefault();
        drag.interact = true;
    
        if (this == volObj.ctrlLineB || this == volObj.ctrlLineF) {
            let rect = volObj.ctrlCirce.getBoundingClientRect();
            let center = (rect.left + rect.right) / 2.0;
            drag.dx = startX - center;
            drag.animateDrag();
        }
        function pointermove (e) {
            e.preventDefault();
            let curX = e.pageX || e.originalEvent.touches[0].pageX;
            drag.dx = curX - startX;
            startX = curX;
            drag.animateDrag();
        }
        function pointerup (e) {
            if (drag.curCx < drag.minX) drag.curCx = drag.minX;
            if (drag.curCx > drag.maxX) drag.curCx = drag.maxX;
            // $(document).off("mousemove touchmove mouseup touchend");
            document.removeEventListener("pointermove",pointermove);
            document.removeEventListener("pointerup", pointerup);
        }
    //   $(document).on("mousemove touchmove", function (e) {
        document.addEventListener("pointermove",pointermove);
    
        //   $(document).on("mouseup touchend", function (e) {
        document.addEventListener("pointerup", pointerup);
    });
  
    let memory = {
      flag: true,
      last: 0
    };
  
    // $(document).on("mousedown touchstart", ".speaker", function (e) {
    document.getElementById("speaker").addEventListener("pointerdown", function (e) {
      e.preventDefault();
      drag.interact = true;
      drag.dx = 0;
      if (memory.flag) {
        memory.flag = false;
        memory.last = drag.curCx;
        drag.curCx = 0;
        drag.animateDrag();
      }
      else {
        memory.flag = true;
        drag.curCx = memory.last;
        drag.animateDrag();
      }
    });
    
    // 2much animations in feed to do this ↓ smooth
    // (function pevAnimation() {
    //   for (let i = drag.maxX; i > -1; i -= 5) {
    //     setTimeout(() => {
    //       if (!drag.interact) {
    //         drag.curCx = i;
    //         drag.animateDrag();
    //       }
    //     }, 300 + drag.maxX - i);
    //   }
    //   for (let i = 50; i <= drag.maxX; i += 3) {
    //     setTimeout(() => {
    //       if (!drag.interact) {
    //         drag.curCx = i;
    //         drag.animateDrag();
    //       }
    //     }, 1400 + i);
    //   }
    // })();

	let mainsvg = document.getElementById('speakersvg');
	let testpath = new Path('testpath','','volElem', 45, 0, 0, 359, "#9E7818", 1, 'none', 0.4);
	mainsvg.insertBefore(testpath.path, mainsvg.firstChild);
