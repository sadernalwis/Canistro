import { Block } from "Medusa/Mirror/Terminal/Block/Block.js"
import { HTML } from "Medusa/Parseltongue/HTML/HTML.js";
import { SVG } from "Medusa/Parseltongue/SVG/SVG.js";


export class Canister {
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
		SVG.configure(this.svg_root, {}, true)
		SVG.style(circle , this.style(radius)); 
	}

	canister(radius){
		const svg_root = this.svg_root
		const id = `canister-textpath-${this.name}`
		const path 		= SVG.make('path','',[],{d:"M0, 200a200, 200 0 1, 0 400, 0a200, 200 0 1, 0 -400, 0"}, id)
		const def 		= SVG.make('def','',[path],{})
		const textpath 	= SVG.make('textPath','',[],{})
		const text 		= SVG.make('text','',[textpath],{d}, '', `sample text. sample text. sample text. sample text. sample text. `)
		const circle 	= SVG.make("circle", "progress-ring", [], {} )
		const name 		= SVG.make("text",   "", [], { "pointer-events": 'none', fontSize:"18", textAnchor:"middle", dominantBaseline:"middle", fill:"black"}, '', this.name)
		SVG.put(svg_root, def,  0, true);
		SVG.put(svg_root, text, 1, true);
		SVG.put(svg_root, circle, 2, true);
		SVG.put(svg_root, name, 3, true);
	}

	constructor(terminal, name){
		this.terminal = terminal
		this.id = id
		this.html = {}
        this.node = this.canister()
	}
}
export class Canistro {

	render() {
		// this.carousel.render()
	}
	
	transpose(row){
		if (row){  HTML.flex(this.html.branch, 'row')  } 
		else {  HTML.flex(this.html.branch, 'column')  }
		this.address.transpose(row)
		this.paths.transpose(row)
	}
	
	cell(wrapper){ 
		let [, card] =  HTML.chain(wrapper, 'div:card,bordered::');
		const cell = new Cell(this.terminal)
		HTML.style(card, { padding: '5px', width: `${this.settings.item.width}px`, height: `${this.settings.item.height}px` }) 
		HTML.style(cell.container, { padding: '5px', width: `${this.settings.item.width}px`, height: `${this.settings.item.height}px` }) 
		card.appendChild(cell.container)
		return cell
	}

	configure(){
		const canistro = this.canistro
	}

	build(wrapper){ 
		wrapper = wrapper?wrapper:this.block.node;
		if (this.html.grid){HTML.clear(this.html.grid, true)}
		[,this.html.grid] =  HTML.chain(wrapper, 'div:grid,medusa-darkmode-transparent::');
		HTML.style(this.html.grid, { display: 'flex', 'flex-flow': 'wrap row', 'align-content': 'flex-start',gap:'15px', width:'100%', height:'100%', padding: '0', margin: '0' })
		let [, canistro] =  HTML.chain(this.html.grid, 'medusa-canistro:::');
		HTML.configure(canistro, {id:'queued' , stroke:"40", stroke:"40", radius:"60", progress:"95", status:'in-progress'});
		this.canistro = canistro 
		let that = this
		function resizer(){ // handle window resize
			console.log('resizer')
			let rect = that.block.node.getBoundingClientRect() //aspect = rect.width / rect.height;
			canistro.resize(rect.width, rect.height); }
		this.block.on("resized", (resizer).bind(this))
		resizer()
	}

	reload(){
		
	}

	block_events_on(){
		this.block.on("resized", ((box)=>{
			this.transpose(this.block.flags.transposed_row)
			// alert(`reiszed ${this}`)
		}).bind(this))
	}
	block_events_pff(){
		this.block.off("resized", (box)=>{
			alert(`reiszed ${this}`)
		})
	}

	constructor(terminal) {
		// eventify(this)
		this.terminal = terminal
		this.html = {}
		this.settings = {item:{width:100, height:100,}, grid:{size:10}, }
		this.block = new Block(terminal)
		this.terminal = this.block.terminal
		this.build(this.block.node)
		this.node = this.block.node
		// this.block_events_on()
	}
}
