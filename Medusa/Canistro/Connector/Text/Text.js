
import { HTML } from "Medusa/Parseltongue/HTML/HTML.js";
import { SVG } from "Medusa/Parseltongue/SVG/SVG.js";

export class Text {
	geometry(radius){
		const stroke = radius * 0.2;
		const fit_rad = radius - stroke * 2;
		const circumference = fit_rad * 2 * Math.PI;
		return [stroke, fit_rad, circumference]
	}
	attributes(radius=100, x=0, y=0){
		const [stroke, fit_rad, circumference] = this.geometry(radius)
		return {
			r: fit_rad, cx: x, cy: y,
			style: `stroke-dashoffset:${circumference}`,
			strokeDasharray: `${circumference} ${circumference}`,
			strokeWidth: stroke,
			fill: "transparent", stroke: '#e74c3c', }}

	style(radius){
		const [stroke, fit_rad, circumference] = this.geometry(radius)
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
		SVG.put(wrapper, this.text, 1, false);
		SVG.put(wrapper, this.circle, 2, false);
		SVG.put(wrapper, this.title, 3, false);
	}


	build(){
		const tetxpath_href  = `${this.name}-textpath`
		this.path 		= SVG.make('path','',[],{d: SVG.describe_arc( 0, 0, 100, 0, 190) }, tetxpath_href)
		this.def 		= SVG.make('defs','',[this.path],{})
		this.textpath 	= SVG.make('textPath','',[],{"xlink:href":`#${tetxpath_href}`}, '', `sample text. sample text. sample text. sample text. sample text. `)
		this.text 		= SVG.make('text','',[this.textpath],{fill:"#D54E02", "font-size":"25.5", "font-family":"Helvetica Neue", "font-weight":"600"}, '')
		this.circle 	= SVG.make("circle", "progress-ring", [], {} )
		this.title 		= SVG.make("text",   "", [], { "pointer-events": 'none', fontSize:"18", textAnchor:"middle", dominantBaseline:"middle", fill:"black"}, '', this.name)
	}
	constructor(terminal, name){
		this.terminal = terminal
		this.name  = `ring-${name}`
		this.html = {}
        this.node = this.build()
	}
}
