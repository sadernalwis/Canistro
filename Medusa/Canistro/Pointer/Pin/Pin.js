
import { HTML } from "Medusa/Parseltongue/HTML/HTML.js";
import { SVG } from "Medusa/Parseltongue/SVG/SVG.js";
import { CSS } from "Medusa/Parseltongue/CSS/CSS.js";
import { JS } from "Medusa/Parseltongue/JS/JS.js";
import { Vector3 as V3, MathUtils as MU } from 'three';
import { Path, PathRounder } from "../../Connector/Path/Path";

export class Pin {
	clear_path(){
		this.points = []
	}
	pick(event){
		this.pinned = !this.pinned
		console.log('pin picked')
	}
	
	clock(){
		// for (i of [1,2,3,4,5,6,7,8]){console.log([((i%8)%8)+1, i, (((i<2 ? 8-i : i-2))%8)+1])}for (i of [1,2,3,4,5,6,7,8]){console.log([((i%8)%8)+1, i, (((i<2 ? 8-i : i-2))%8)+1])}
		[(0%8)+1, 8, (6%8)+1] // [1, 8, 7]
		[(7%8)+1, 7, (5%8)+1] // [8, 7, 6]
		[(6%8)+1, 6, (4%8)+1] // [7, 6, 5]
		[(5%8)+1, 5, (3%8)+1] // [6, 5, 4]
		[(4%8)+1, 4, (2%8)+1] // [5, 4, 3]
		[(3%8)+1, 3, (1%8)+1] // [4, 3, 2]
		[(2%8)+1, 2, (0%8)+1] // [3, 2, 1]
		[(1%8)+1, 1, (7%8)+1] // [2, 1, 8]
		let i = 1
		return [((i%8)%8)+1, i, (((i<2 ? 8-i : i-2))%8)+1]
	}

	move(path){
		// if (this.pinned){ console.log('pin moved')}
        const delta = JS.slice(path, -3, -1)
        if (delta.length==2){
			let north = new V3(0,-1)
			const zaxis = new V3( 0, 0, 1 )
            const [[sx, sy], [ex, ey]] = JS.slice(path, -3, -1)
			let [fx, fy] = SVG.true_coords({target:this.svg_root, clientX:ex, clientY:ey}, undefined/* , "rotate(90deg)" */);
			let [px, py] = SVG.true_coords({target:this.svg_root, clientX:ex, clientY:ey});
			this.display(undefined, fx, fy) 
			const v3 = new V3(px, py)
			let [o_slant,m,n] = [JS.end(this.points), undefined, new V3(fx, fy)]
			if(o_slant){
				let [o, slant] = o_slant
				let distance = Math.abs(n.distanceTo(new V3(...o))) 
				if (distance>200){ 
					// this.points.push(n)
					let dir = n.clone().sub(o)
					let angle = north.angleTo(dir)
					let deg = MU.radToDeg(angle)
					if (dir.clone().normalize().x<0){ deg = 360-deg}
					let snap_deg = Math.floor(deg / 45) * 45//JS.snap(deg, 45)
					let deg_diff = deg-snap_deg
					let sector = Math.floor(deg/45)+1
					let [slant_m, slant_e] = [sector,sector+1]
					let d1 = n.clone().sub(o)
					dir = new V3(0, -d1.length()).applyAxisAngle( zaxis, MU.degToRad(deg_diff) )
					function clock(i){ return [((i%8)%8)+1, i, (((i<2 ? 8-i : i-2))%8)+1]}
					let checked = false
					if(slant){
						let slant_opp = Math.abs(slant-4)
						let clock_range = clock(slant_opp)
						if(clock_range[0]==slant_m){ 
							m = dir.clone().add(new V3(-dir.x, dir.x))
							checked = true 
						}
						else if(clock_range[1]==slant_m){ 
							m = dir.clone().add(new V3(-dir.x, dir.x))
							checked = true }
						else if(clock_range[2]==slant_m){ 
							m = new V3(dir.x, -dir.x);
							[slant_m, slant_e] = [slant_e, slant_m]
							checked = true 
						}
						// if(clock_range.indexOf(slant_m)>-1){ }
					}
					if(!checked){
						if(deg_diff>(45/2)){
							m = dir.clone().add(new V3(-dir.x, dir.x))
						}
						else{
							m = new V3(dir.x, -dir.x);
							[slant_m, slant_e] = [slant_e, slant_m]
						}
					}
					if(!m){
						console.log("m ::")
					}
					console.log(m)
					m.applyAxisAngle( zaxis, MU.degToRad(snap_deg))
					m.add(o)
					this.points.push([m, slant_m])
					this.points.push([n, slant_e])
					// o = n
					// let d = SVG.V2D( origin, m.add(o), dir.add(o))
					// let path = this.path.getAttribute('d')
					// this.path.setAttribute('d', path?(path+d): d)

				}
			}
			else{
				this.points.push([n, undefined])
				// o_slant = [n, undefined]
			}
			const d =this.points.map((p)=>p[0])
			this.path.setAttribute('d', SVG.V2D( ...d))
			this.beads.setAttribute('d', SVG.V2D( ...d))
			// this.path.setAttribute('d', PathRounder(SVG.V2D( ...this.points), 0.1, true))
			return

			if(this.points.length){
				const start_end = JS.slice(this.points, -3, -1)//JS.start_end(this.points)
				const origin = JS.end(this.points)
				let distance = Math.abs(v3.distanceTo(new V3(...origin))) 
				if (distance>200){ 
					this.points.push(v3)
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
		// defs ? SVG.put(defs, this.path,  0, false) : SVG.put(svg_root, this.def,  0, false) ;
		SVG.put(wrapper, this.path, -1, false);
		SVG.put(wrapper, this.beads, -1, false);
		SVG.put(wrapper, this.pin, -1, false);
		return this
	}


	build(){
		this.pin = SVG.make("circle", "pin", [], {})
		this.path = SVG.make("path", "path", [], {})
		this.beads = SVG.make("path", "path", [], {})
		SVG.style(this.pin , this.style()); 
		SVG.style(this.path , {stroke: 'white', fill: 'none', 'stroke-width': '5px', 'stroke-linecap': 'round', 'stroke-linejoin': 'round'}); 
		SVG.style(this.beads , {stroke: 'white', fill: 'none', 'stroke-width': '20px', 'stroke-linecap': 'round', 'stroke-linejoin': 'round'}); 
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
		this.group = SVG.make('g','',[this.pin, this.path, this.beads],{})
		// const ss = CSS.sheet(this.canistro.terminal.shadow_root, ".progressring", "fill:lightgrey")
		// console.log(ss, ss.cssRules.length)
		
	}
	tick(){
		if (this.beads.getAttribute('d')){
			const length = this.beads.getTotalLength()
			this.progress = length ? this.progress%parseInt(length) : 1
			const offset = length-this.progress
			this.beads.style.strokeDasharray = `1 ${length}`
			this.beads.style.strokeDashoffset = `${offset}`
			this.progress+=8
		}
			// this.path.style.strokeDashoffset = `${1} ${offset}`}
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
		this.ring = undefined
		// this.path = new Path()
		this.progress = 0
        this.node = this.build()
	}
}
