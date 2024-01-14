import { SVG } from "../SVG.js";

export class Divider extends HTMLElement {

	static get observedAttributes() {
		return ['progress','status','radius'];
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

	setProgress(percent) {
		const offset = this.circumference - (percent / 100 * this.circumference);
		const circle = this.shadow_root.querySelector('circle');
		circle.style.strokeDashoffset = offset; 
		circle.previousElementSibling.textContent = `${percent}%`;
		circle.nextElementSibling.textContent = this.status;
		this.progress = parseInt(percent);
	}
	 
	divider_attributes(normalized_radius, radius, circumference, stroke){
		return {
			// r: normalized_radius,
			// cx: radius,
			// cy: radius,
			x1="0",
			y1="0",
			x2="200",
			y2="0",
			style: `stroke-dashoffset:${circumference}`,
			strokeDasharray: `${circumference} ${circumference}`,
			strokeWidth: stroke,
			fill: "transparent",
			stroke: '#e74c3c',
		}

		
	}
	divider_style(radius, circumference){
		return {
			strokeWidth     : 10,
			strokeLinecap   : 'round',
			fill            : 'none',
			strokeDashoffset: 0,
			strokeDasharray : circumference,
			strokeLinecap   : 'round',
			transformOrigin : `${radius}px ${radius}px`,
			transform       : `rotate(-90deg)`,
			animation       : `dash 2s ease-in-out infinite`,
		}
	}

	status_attributes(radius ){
		return {
			x: radius * 2,
			y: radius,
			fontSize: 18,
			textAnchor: "start",
			dominantBaseline: "middle" ,
			fill: "black",
		}
	
	}

	redraw(percent) {
		const classifier = this.getAttribute('classifier');
		const denominator = this.getAttribute('denominator');
		const progress = this.getAttribute('progress');
		const status = this.getAttribute('status');
		const stroke = radius * 0.2;
		const svg_width = radius * 5;
		const svg_height = radius * 2;
		const normalizedRadius = radius - stroke * 2;
		this.circumference = normalizedRadius * 2 * Math.PI;
	
		let svg_root = SVG.put(this.shadow_root, SVG.make("svg", "svg_root", [], {width:svg_width, height:svg_height}), 0, true);
		let progress_text = SVG.put(svg_root, SVG.make("text",   "progress_text", [], { x: radius, y: radius, fontSize:"18", textAnchor:"middle", dominantBaseline:"middle", fill:"black"}, '', progress ), 0, true);
		let divider = SVG.put(svg_root, SVG.make("line", "progress-ring", [], this.divider_attributes(normalizedRadius, radius,this.circumference, stroke) ), 1, true);
		let status_text   = SVG.put(svg_root, SVG.make("text",   "status_text",   [], this.status_attributes(radius),'', status ), 2, true);
		SVG.style(divider , this.divider_style(radius, this.circumference )); 
		
	}

	setup_pulse(){
		let pulse = 0;
		let dis  = this;
		const interval = setInterval(() => {
			if(dis.status === 'Cancelled !' || dis.status === 'Completed !'){
				dis.remove(); // dis.style.display =  'none'
				clearInterval(interval);
				return;
			}
			if(dis.progress<0){ dis.status = 'Cancelled !'; }
			else if(dis.progress==100){ dis.status = 'Completed !'; }
			else{
				const circle = dis.shadow_root.querySelector('circle');
				if(circle){ circle.nextElementSibling.textContent = dis.status.padEnd(dis.status.length+(pulse%4),'.'); }
				else{
					dis.remove();
					clearInterval(interval); } }
			pulse++;
		}, 1000);
	}

	constructor() {
		super();
		this.shadow_root = this.attachShadow({mode: 'open'});
		this.status = '';
		this.progress = 0;
		this.setup_pulse();
	}
	

}

// https://css-tricks.com/building-progress-ring-quickly/
// https://stackoverflow.com/questions/55581839/passing-values-to-constructor-of-custom-htmlelement
// https://html.spec.whatwg.org/multipage/custom-elements.html