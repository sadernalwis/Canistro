
import { HTML } from "Medusa/Parseltongue/HTML/HTML.js";
import { SVG } from "Medusa/Parseltongue/SVG/SVG.js";
import { CSS } from "Medusa/Parseltongue/CSS/CSS.js";
import { JS } from "Medusa/Parseltongue/JS/JS.js";
import { Vector3 as V3, MathUtils as MU } from 'three';
import { Path } from "../../Connector/Path/Path";

export class Pin {
	clear_path(){
		this.points = []
	}
	pick(event){
		this.pinned = !this.pinned
		console.log('pin picked')
	}

	move(path){
		// if (this.pinned){ console.log('pin moved')}
        const delta = JS.slice(path, -3, -1)
        if (delta.length==2){
			let north = new V3(0,-1)
            const [[sx, sy], [ex, ey]] = JS.slice(path, -3, -1)
			let [fx, fy] = SVG.true_coords({target:this.svg_root, clientX:ex, clientY:ey}, undefined/* , "rotate(90deg)" */);
			let [px, py] = SVG.true_coords({target:this.svg_root, clientX:ex, clientY:ey});
			this.display(undefined, fx, fy) 
			const v3 = new V3(px, py)
			if(this.points.length){
				const start_end = JS.slice(this.points, -3, -1)//JS.start_end(this.points)
				const origin = JS.end(this.points)
				let distance = Math.abs(v3.distanceTo(new V3(...origin))) 
				if (distance>200){ 
					this.points.push(v3)
					const zaxis = new V3( 0, 0, 1 )
					let dir = v3.clone().sub(origin)
					let angle = north.angleTo(dir)
					let deg = MU.radToDeg(angle)
					if (dir.clone().normalize().x<0){ deg = 360-deg}
					let snap_deg = Math.floor(deg / 45) * 45//JS.snap(deg, 45)
					let deg_diff = deg-snap_deg
					let o = origin
					let e = v3
					let d1 = e.clone().sub(o)
					let nord = new V3(0, -d1.length())
					dir = nord.applyAxisAngle( zaxis, MU.degToRad(deg_diff) )
					let left_point = (deg_diff>(45/2)) ? dir.clone().add(new V3(-dir.x, dir.x)) : new V3(dir.x, -dir.x)
					dir.applyAxisAngle( zaxis, MU.degToRad(snap_deg))
					left_point.applyAxisAngle( zaxis, MU.degToRad(snap_deg))
					let d = SVG.V2D( origin, left_point.add(o), dir.add(o))
					let path = this.path.getAttribute('d')
					this.path.setAttribute('d', path?(path+d): d) } 
				// if(start_end.length){
				// 	const [s, e] = start_end
				// 	distance = v3.distanceTo(new V3(...e)) 
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


	display(radius=10, x=0, y=0){
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
