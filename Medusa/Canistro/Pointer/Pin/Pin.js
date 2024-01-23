import { HTML } from "Medusa/Parseltongue/HTML/HTML.js";
import { SVG } from "Medusa/Parseltongue/SVG/SVG.js";
import { CSS } from "Medusa/Parseltongue/CSS/CSS.js";

class Pin{
	configure(radius){
		[this.radius, this.x, this.y] = [radius, x, y]
		const [stroke, fit_rad, circumference] = SVG.ring_geometry(this.radius)
		const attributes = {
			r: fit_rad, cx: this.x, cy: this.y,
			style: `stroke-dashoffset:${circumference}`,
			strokeDasharray: `${circumference} ${circumference}`,
			strokeWidth: stroke,
			fill: "transparent", stroke: '#e74c3c', }
		SVG.configure(this.pin, attributes, true)
	}

    show(event){
        if(event.target.code?.type==="ring"){
            const ring = event.target.code
            this.configure(ring.radius-10)
            console.log("ring deteced")
        }
        else{

        }
    }

    build(){
		this.pin = SVG.make("circle", "pin", [], {})

    }

    constructor(svg_root){
        this.svg_root = svg_root
        this.build()
    }
}