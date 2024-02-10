
import { HTML } from "Medusa/Parseltongue/HTML/HTML.js";
import { SVG } from "Medusa/Parseltongue/SVG/SVG.js";
import { CSS } from "Medusa/Parseltongue/CSS/CSS.js";
import { JS } from "Medusa/Parseltongue/JS/JS.js";
import * as THREE from 'three';
import { Path } from "../../Connector/Path/Path";

export class Pin {
	pick(event){
		this.pinned = !this.pinned
		console.log('pin picked')
	}

	move(path){
		// if (this.pinned){ console.log('pin moved')}
        const delta = JS.slice(path, -3, -1)
        if (delta.length==2){
            const [[sx, sy], [ex, ey]] = JS.slice(path, -3, -1)
			let [fx, fy] = SVG.true_coords({target:this.svg_root, clientX:ex, clientY:ey}, undefined/* , "rotate(90deg)" */);
			let [px, py] = SVG.true_coords({target:this.svg_root, clientX:ex, clientY:ey});
			this.display(undefined, fx, fy) 
			const v3 = new THREE.Vector3(px, py)
			if(this.points.length){
				const start_end = JS.slice(this.points, -3, -1)//JS.start_end(this.points)
				const end = JS.end(this.points)
				let distance = Math.abs(v3.distanceTo(new THREE.Vector3(...end))) 
				if (distance>100){ 
					this.points.push(v3)
					// let d = this.path.getAttribute('d')
					// d+=`M${end[0]} ${end[1]} L${v3.x} ${v3.y}`
					this.path.setAttribute('d', `M${end.x} ${end.y} L${v3.x} ${v3.y}`);
				}
				else{

				}
				// if(start_end.length){
				// 	const [s, e] = start_end
				// 	distance = v3.distanceTo(new THREE.Vector3(...e)) 
				// 	if (distance>10){
				// 		const d = this.path.getAttribute('d')
				// 		d+=`M${s[0]} ${s[1]} L${e[0]} ${e[1]}`
				// 		this.path.setAttribute('d', d); } }
		}
			else{
				this.points.push(v3) }
		} }

	drop(event){
		this.pinned = true
		console.log('pin dropped')
	}


	display(radius=100, x=0, y=0){
		[this.radius, this.x, this.y] = [radius || this.radius, x, y]
		// const [stroke, fit_rad, circumference] = SVG.ring_geometry(this.radius, this.stroke)
		const attributes = {
			r: this.radius, cx: this.x, cy: this.y,
			// style: `stroke-dashoffset:${circumference}`,
			// strokeDasharray: `${circumference} ${circumference}`,
			// strokeWidth: stroke,
			fill: "transparent", stroke: '#e74c3c', }
		SVG.configure(this.pin, attributes, true)
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
			// if(this.type==="ring"){styles['transform']=`rotate(180deg)`}
			// else if(this.type==="pin"){
			// 	styles['transform']=`rotate(-90deg)`
				delete styles['transition']
			// }
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
		this.pin = SVG.make("circle", "pin", [], {})
		this.path = SVG.make("path", "path", [], {})
		SVG.style(this.pin , this.style()); 
		SVG.style(this.path , {stroke: 'white', 'stroke-width': '5px', 'stroke-linecap': 'round'}); 
		this.display()
		let that = this
		this.pin.code = this
		this.pin.addEventListener("mousedown", (e)=>{ 
			e.preventDefault();
			console.log(e)
			// that.canistro.load_canisters()
			// that.canistro.login() 
		})
		this.pin.addEventListener("mouseenter", (e)=>{ that.pin.style.fill = "white" })
		this.pin.addEventListener("mouseleave", (e)=>{ that.pin.style.fill = "lightgrey" })		
		this.group = SVG.make('g','',[this.pin, this.path],{})
		// const ss = CSS.sheet(this.canistro.terminal.shadow_root, ".progressring", "fill:lightgrey")
		// console.log(ss, ss.cssRules.length)
		
	}

	constructor(canistro, name, label, type="pin"){
		this.canistro = canistro
		this.name  = `pin-${name}`
		this.label = label
		this.type = type
		this.radius = 100
		this.stroke = 0.2
		this.html = {}
		this.pinned = false
		this.points = []
		// this.path = new Path()
        this.node = this.build()
	}
}
