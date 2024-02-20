
import { HTML } from "Medusa/Parseltongue/HTML/HTML.js";
import { SVG } from "Medusa/Parseltongue/SVG/SVG.js";
import { CSS } from "Medusa/Parseltongue/CSS/CSS.js";
import { Ring } from "../Ring/Ring.js";
import { IDL } from "@dfinity/candid";

export class Canister {
	static canisters = {}

	display(radius=100, x=0, y=0){
		this.lens.display(radius-60, x, y)
		this.functions.display(radius-40, x, y)
		this.parameters.display(radius-20, x, y)
		this.returns.display(radius, x, y)
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
		this.lens  = new Ring(this.canistro, this.name, 'lens')
		this.functions  = new Ring(this.canistro, `${this.name}-methods`, 'methods')
		this.parameters  = new Ring(this.canistro, `${this.name}-parameters`, 'parameters')
		this.returns  = new Ring(this.canistro, `${this.name}-results`, 'results')
		this.returns.attach(svg_root, defs, svg_root)
		this.parameters.attach(svg_root, defs, svg_root)
		this.functions.attach(svg_root, defs, svg_root)
		this.lens.attach(svg_root, defs, svg_root)
		if(!this.is_virtual){ this.load_functions() }
	}

	tick(){	
		this.lens.tick()
		this.functions.tick()
		this.parameters.tick()
		this.returns.tick()
	}

	load_parameters(){
		
	}

	load_functions(){
		try {
			const service = this.canistro.modules[this.name].idlFactory({ IDL: IDL })
			for (const [func_name, func_class] of service._fields){ 
				this.function = [func_name, func_class]
				// this.pin  = new Pin(this.canistro, `${this.name}-${func_name}`, 'pin', 'function')
				// this.pin.attach(svg_root, this.defs, svg_root)
				// this.pin.display(10)
				for (const ano_t of func_class.annotations)	{ console.log("-ano_t : ", func_name, ano_t) }
				for (const arg_t of func_class.argTypes)	{ console.log("-arg_t : ", func_name, arg_t) }
				for (const ret_t of func_class.retTypes)	{ console.log("-ret_t : ", func_name, ret_t) } }}
		catch (error) { console.info(`NO SERVICE for ${this.name}`)} 
// postgres:dqBZWIHO0yoSUGHC8Tzv@database-detrash.cor51ojule9a.us-east-1.rds.amazonaws.com:5432/detrash
// dqBZWIHO0yoSUGHC8Tzv
// SELECT COUNT("userId") as "Total Reports by User" ,"userId", (SELECT "profileType" FROM public."User" WHERE "userId" = Id) FROM public."Form" group by "userId" order by "Total Reports by User" DESC
	}

	constructor(canistro, name, is_virtual){
		this.canistro = canistro
		this.name  = name//`canister-${name}`
		this.html = {}
		this.method = []
		this.parameter = []
		this.function = []
		this.is_virtual = is_virtual
        this.node = this.build()
		Canister.canisters[name] = this
	}
}
