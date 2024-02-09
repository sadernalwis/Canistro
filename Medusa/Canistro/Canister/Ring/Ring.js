
import { HTML } from "Medusa/Parseltongue/HTML/HTML.js";
import { SVG } from "Medusa/Parseltongue/SVG/SVG.js";
import { CSS } from "Medusa/Parseltongue/CSS/CSS.js";
import { JS } from "Medusa/Parseltongue/JS/JS.js";
import { Boundary } from "Medusa/Parseltongue/Boundary/Boundary.js"
export class Ring {

	get pin_range(){
		return 360/this.pin_count
	}

	get pin_radius(){
		const [stroke, fit_rad, circumference] = SVG.ring_geometry(this.radius, 0)
		return (circumference/this.pin_count/2)-1
	}

	rad_deg(angle){
		return this.rad_idx(angle)*this.pin_range
	}

	rad_idx(angle){
		return Math.floor(angle/this.pin_range)
	}

	rad_loc(angle){
		const radius = this.radius
		let n_x = radius * Math.cos(angle * Math.PI / 180);
		let n_y = radius * Math.sin(angle * Math.PI / 180);
		return [n_x, n_y] }

	pinhole(event, orientation = "north"){
		const radius = this.radius
		const [px, py] = SVG.true_coords(event, event.srcTarget)
		const a = px - this.x;
		const b = py - this.y;
		const distance = Math.sqrt( a*a + b*b );
		var angle = Math.atan2(a, b)// * 180 / Math.PI;
		const whole = Math.PI * 2
		switch(orientation) { // Change where zero is located
			case "west":
				angle -= whole / 4
				break
			case "north":
				angle += 0
				break
			case "east":
				angle += whole / 4
				break
			case "south":            
				angle += whole / 2
				break }
		angle = ((angle % whole) + whole) % whole // convert angle to range between 0 and 360 (although we’re working in radians, of course)
		const degrees =  360-(angle * 180 / Math.PI) // returns angle in degrees
		// const threhsold = this.radius-fit_rad
		if ((radius-20)<distance && distance <radius){
			const snap_deg = this.rad_deg(degrees)//JS.snap(degrees, this.pin_range)
			let n_x = radius * Math.cos(snap_deg * Math.PI / 180);
			let n_y = radius * Math.sin(snap_deg * Math.PI / 180);
            // console.log(`${this.rad_idx(degrees)} ${this.label}ring deteced @ ${snap_deg}`)
			return [this.pin_radius, n_x, n_y]
		}
	}

	display(radius=100, x=0, y=0){
		[this.radius, this.x, this.y] = [radius, x, y]
		// const [stroke, fit_rad, circumference] = SVG.ring_geometry(this.radius, this.stroke)
		const attributes = {
			r: this.radius, cx: this.x, cy: this.y,
			// style: `stroke-dashoffset:${circumference}`,
			// strokeDasharray: `${circumference} ${circumference}`,
			// strokeWidth: stroke,
			fill: "transparent", stroke: '#e74c3c', }
		SVG.configure(this.progress_ring, attributes, true)
		SVG.configure(this.path, {d:SVG.describe_arc( x, y, this.radius, 90, 270)}, true)
		return this
	}

	style(){
		const [stroke, fit_rad, circumference] = SVG.ring_geometry(this.radius, this.stroke)
		const styles = {
			strokeWidth     : 2,
			strokeLinecap   : 'round',
			fill            : 'lightgrey',
			strokeDashoffset: 0,
			// strokeDasharray : circumference,
			strokeLinecap   : 'round',
			// transformOrigin : `${radius}px ${radius}px`,
			// transform       : `rotate(180deg)`,
			animation       : `dash 2s ease-in-out infinite`,
			transition		: 'all 250ms  ease  0ms'  } 
			if(this.type==="ring"){styles['transform']=`rotate(180deg)`}
			else if(this.type==="pointer"){
				styles['transform']=`rotate(-90deg)`
				// delete styles['transition']
			}
			return styles
		}

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
		SVG.put(wrapper, this.group, -1, false);
		return this
	}


	build(){
		const tetxpath_href  = `${this.name}-textpath`
		this.path 		= SVG.make('path','',[],{d: SVG.describe_arc( 0, 0, 50, 90, 270)}, tetxpath_href)
		SVG.configure(this.path, {pathLength:"100" }, true)
		this.def 		= SVG.make('defs','',[this.path],{})
		this.textpath 	= SVG.make('textPath','',[],{"xlink:href":`#${tetxpath_href}`, "dominant-baseline":	"start"/* "start/hanging/end" */, "text-anchor":"middle"}, '', this.label)
		SVG.configure(this.textpath, {startOffset:"50" }, true)
		this.text 		= SVG.make('text','',[this.textpath],{fill:"#D54E02", "font-size":"16", "font-family":"Helvetica Neue", "font-weight":"600"}, '')
		this.circle 	= SVG.make("circle", "progress-ring", [], {} )
		// this.title 		= SVG.make("text",   "", [], { "pointer-events": 'none', fontSize:"18", textAnchor:"middle", dominantBaseline:"middle", fill:"black"}, '', this.name)
		this.progress_ring = SVG.make("circle", "progressring", [], {})
		this.progress_text = SVG.make("text",   "progress_text", [], { /* x: radius, y: radius,  */"pointer-events": 'none', fontSize:"18", textAnchor:"middle", dominantBaseline:"middle", fill:"black"}, '', 'CANISTRO' )
		// let status_text   = SVG.put(svg_root, SVG.make("text",   "status_text",   [], this.status_attributes(radius),'', status ), 2, true);
		SVG.style(this.progress_ring , this.style()); 
		this.display()
		console.log('ring.display()')
		let that = this
		this.progress_ring.code = this
		this.progress_ring.addEventListener("mousedown", (e)=>{ 
			e.preventDefault();
			that.canistro.load_canisters()
			that.canistro.login()
		})
		this.progress_ring.addEventListener("mouseenter", (e)=>{ that.progress_ring.style.fill = "white" })
		this.progress_ring.addEventListener("mouseleave", (e)=>{ that.progress_ring.style.fill = "lightgrey" })		
		this.group 		= SVG.make('g','',[this.progress_ring, this.text, this.circle,/*  this.title, */ this.progress_text],{})
		// const ss = CSS.sheet(this.canistro.terminal.shadow_root, ".progressring", "fill:lightgrey")
		// console.log(ss, ss.cssRules.length)
		
	}

	constructor(canistro, name, label, type="ring"){
		this.canistro = canistro
		this.pin_count = 64 
		this.name  = `ring-${name}`
		this.label = label
		this.type = type
		this.radius = 100
		this.stroke = 0.2
		this.html = {}
        this.node = this.build()
	}
}
