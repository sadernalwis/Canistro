
import { HTML } from "Medusa/Parseltongue/HTML/HTML.js";
import { SVG } from "Medusa/Parseltongue/SVG/SVG.js";
import { CSS } from "Medusa/Parseltongue/CSS/CSS.js";
import { Ring } from "./Ring/Ring.js";


export class Canister {
	display(radius=100, x=0, y=0){
		this.methods.display(radius, x, y)
		this.parameters.display(radius, x, y)
		this.results.display(radius, x, y)
	}

	attach(svg_root, defs, wrapper){
		this.svg_root = svg_root || this.svg_root
		this.defs = defs || this.def
		this.wrapper = wrapper
		defs ? SVG.put(defs, this.path,  0, false) : SVG.put(svg_root, this.def,  0, false) ;
		SVG.put(wrapper, this.group, 1, false);
		// SVG.put(wrapper, this.text, 1, false);
		// SVG.put(wrapper, this.circle, 2, false);
		// SVG.put(wrapper, this.title, 3, false);
		// SVG.put(wrapper, this.progress_ring , 4, true);
		// SVG.put(wrapper, this.progress_text , 5, true);
	}

	build(){
		const [svg_root, defs] = [this.canistro.svg_root, this.canistro.defs]
		this.methods  = new Ring(this.canistro, `${this.name}-methods`, 'methods')
		this.parameters  = new Ring(this.canistro, `${this.name}-parameters`, 'parameters')
		this.results  = new Ring(this.canistro, `${this.name}-results`, 'results')
		this.methods.attach(svg_root, defs, svg_root)
		this.parameters.attach(svg_root, defs, svg_root)
		this.results.attach(svg_root, defs, svg_root)
	}

	constructor(canistro, name){
		this.canistro = canistro
		this.name  = `canister-${name}`
		this.html = {}
        this.node = this.build()
	}
}
