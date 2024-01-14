import { DataSet } from "../DataSet/DataSet.js";
import { SVG } from "../SVG.js";


export class Radar extends HTMLElement {

	static get observedAttributes() {
		return ['progress','status','radius','width', 'height'];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'progress') {
			// this.setProgress(newValue);
		}
		else{
			// this[name] = newValue;
			// this.redraw();
		}
	}

	redraw() {
		// const svg_width = this.clientWidth | 400;
		// const svg_height = this.clientHeight | 400;
		const svg_width =  this.getAttribute('width') | 800;
		const svg_height = this.getAttribute('height') | 400;
	
		// let svg_root = SVG.put(this.shadow_root, SVG.make("svg", "svg_root", [], {width:svg_width, height:svg_height}), 0, true);
		let svg_root = SVG.put(this.shadow_root, SVG.make("svg", "svg_root", [], {}), 0, true);
		// SVG.configure(svg_root, {width:'100%', height:'100%', viewBox:`${-svg_width/2} ${-svg_height/2} ${svg_width} ${svg_height}`}, true);
		SVG.configure(svg_root, {width:`${svg_width}px`, height:`${svg_height}px`, viewBox:`${-svg_width/2} ${-svg_height/2} ${svg_width} ${svg_height}`,preserveAspectRatio:"xMidYMid meet"}, true);
		new DataSet(this, 'dataset_1', null, svg_root, {svg:svg_root}, null, null, false);
		
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
		this.redraw();
		// this.setup_pulse();
	}
	

}

window.customElements.define('scope-radar', Radar);