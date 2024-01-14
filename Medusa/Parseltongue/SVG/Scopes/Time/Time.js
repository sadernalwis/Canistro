
	
export class TimeScope extends HTMLElement {
	// static get observedAttributes() {
	//   return [`width`, `height`];
	// }
    static get observedAttributes() {
      return ['progress','status','radius'];
    }
  
	constructor() {
	  super();
	  this.horizontal_scale_L = [
		{
			name:'y',
			size:5,
			boundary: new Boundary(),
			y:5,
		},
		{
			name:'m',
			size:12,
			boundary: new Boundary(),
			m:12,
		},
		{
			name:'w',
			size:7,
			boundary: new Boundary(),
			w:7,
		},
		{
			name:'d',
			size:7,
			boundary: new Boundary(),
			d:7,
		},
		{
			name:'h',
			size:24,
			boundary: new Boundary(),
			h:24,
		}
		]
	  const shadow = this.attachShadow({mode: 'open'});
	  const video = this.video = document.createElement('video');
	  video.setAttribute(`controls`, `controls`);
	  video.setAttribute(`width`, this.getAttribute(`width`) || 1920);
	  video.setAttribute(`height`, this.getAttribute(`height`) || 1080);
	  shadow.appendChild(video);
	}
  
	get width() {
	  return this.video.width;
	}
  
	set width(val) {
	  this.setAttribute(`width`, val);
	}
  
	get height() {
	  return this.video.height;
	}
  
	set height(val) {
	  this.setAttribuite(`height`, val);
	}
  
    constructor() {
		super();
		
  
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
  
  