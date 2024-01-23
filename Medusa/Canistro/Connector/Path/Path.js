
import { HTML } from "Medusa/Parseltongue/HTML/HTML.js";
import { SVG } from "Medusa/Parseltongue/SVG/SVG.js";

export class Path {
	N(amount){ this.endpoint = `v ${-amount} ` }
	S(amount){ this.endpoint = `v ${amount} ` }
	E(amount){ this.endpoint = `h ${amount} ` }
	W(amount){ this.endpoint = `h ${-amount} ` }
	NE(amount){ this.endpoint = `l ${amount}, ${amount} ` }
	SE(amount){ this.endpoint = `l ${amount}, ${amount} ` }
	SW(amount){ this.endpoint = `l ${amount}, ${amount} ` }
	NW(amount){ this.endpoint = `l ${amount}, ${amount} ` }

	constructor(terminal, name){
		this.d = ""
		this.endpoint = ""
	}
}
