
import { HTML } from "Medusa/Parseltongue/HTML/HTML.js";
import { SVG } from "Medusa/Parseltongue/SVG/SVG.js";
import { CSS } from "Medusa/Parseltongue/CSS/CSS.js";

export class Ring {

	display(radius=100, x=0, y=0){
		const [stroke, fit_rad, circumference] = SVG.ring_geometry(this.radius, this.stroke)
		const attributes = {
			r: fit_rad, cx: x, cy: y,
			style: `stroke-dashoffset:${circumference}`,
			strokeDasharray: `${circumference} ${circumference}`,
			strokeWidth: stroke,
			fill: "transparent", stroke: '#e74c3c', }
		SVG.configure(this.progress_ring, attributes, true)
		return this
	}

	style(radius){
		const [stroke, fit_rad, circumference] = SVG.ring_geometry(this.radius, this.stroke)
		return {
			strokeWidth     : 10,
			strokeLinecap   : 'round',
			fill            : 'lightgrey',
			strokeDashoffset: 0,
			strokeDasharray : circumference,
			strokeLinecap   : 'round',
			// transformOrigin : `${radius}px ${radius}px`,
			transform       : `rotate(-90deg)`,
			animation       : `dash 2s ease-in-out infinite`,
			transition		: 'all 250ms  ease  0ms' } }

	configure(radius){
		SVG.configure(circle, this.attributes(radius), true)
		SVG.style(circle , this.style(radius)); 
		var fontsize = 20;
        while ( (textpath.getComputedTextLength()*1.50) > path.getTotalLength()) {
            fontsize -= 0.01;
            textpath.setAttribute("font-size", fontsize);
        }
	}

	attach(svg_root, defs, wrapper){
		this.svg_root = svg_root || this.svg_root
		this.defs = defs || this.def
		this.wrapper = wrapper
		defs ? SVG.put(defs, this.path,  0, false) : SVG.put(svg_root, this.def,  0, false) ;
		SVG.put(wrapper, this.group, 1, false);
		return this
	}


	build(){
		const tetxpath_href  = `${this.name}-textpath`
		this.path 		= SVG.make('path','',[],{d: SVG.describe_arc( 0, 0, 50, 90, 270)}, tetxpath_href)
		SVG.configure(this.path, {pathLength:"100" }, true)
		this.def 		= SVG.make('defs','',[this.path],{})
		this.textpath 	= SVG.make('textPath','',[],{"xlink:href":`#${tetxpath_href}`, "dominant-baseline":"hanging", "text-anchor":"middle"}, '', this.label)
		SVG.configure(this.textpath, {startOffset:"50" }, true)
		this.text 		= SVG.make('text','',[this.textpath],{fill:"#D54E02", "font-size":"16", "font-family":"Helvetica Neue", "font-weight":"600"}, '')
		this.circle 	= SVG.make("circle", "progress-ring", [], {} )
		// this.title 		= SVG.make("text",   "", [], { "pointer-events": 'none', fontSize:"18", textAnchor:"middle", dominantBaseline:"middle", fill:"black"}, '', this.name)
		this.progress_ring = SVG.make("circle", "progressring", [], {})
		this.progress_text = SVG.make("text",   "progress_text", [], { /* x: radius, y: radius,  */"pointer-events": 'none', fontSize:"18", textAnchor:"middle", dominantBaseline:"middle", fill:"black"}, '', 'CANISTRO' )
		// let status_text   = SVG.put(svg_root, SVG.make("text",   "status_text",   [], this.status_attributes(radius),'', status ), 2, true);
		SVG.style(this.progress_ring , this.style(60)); 
		this.display()
		let that = this
		this.progress_ring.addEventListener("mousedown", (e)=>{ 
			that.canistro.load_canisters()
			that.canistro.login()
		})
		this.progress_ring.addEventListener("mouseenter", (e)=>{ that.progress_ring.style.fill = "white" })
		this.progress_ring.addEventListener("mouseleave", (e)=>{ that.progress_ring.style.fill = "lightgrey" })		
		this.group 		= SVG.make('g','',[this.text, this.circle,/*  this.title, */ this.progress_ring, this.progress_text],{})
		// const ss = CSS.sheet(this.canistro.terminal.shadow_root, ".progressring", "fill:lightgrey")
		// console.log(ss, ss.cssRules.length)
		
	}
	constructor(canistro, name, label){
		this.canistro = canistro
		this.name  = `ring-${name}`
		this.label = label
		this.radius = 100
		this.stroke = 0.2
		this.html = {}
        this.node = this.build()
	}
}
