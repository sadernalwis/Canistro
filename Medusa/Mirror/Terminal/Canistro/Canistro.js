import { Block } from "Medusa/Mirror/Terminal/Block/Block.js"
import { HTML } from "Medusa/Parseltongue/HTML/HTML.js";
import { SVG } from "Medusa/Parseltongue/SVG/SVG.js";
import { Canistro as CANISTRO } from "Medusa/Canistro/Canistro.js";

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

	resizer(){ // handle window resize
		console.log('resizer')
		let rect = this.block.node.getBoundingClientRect() //aspect = rect.width / rect.height;
		this.canistro.resize(rect.width, rect.height); }

	build(wrapper){ 
		wrapper = wrapper?wrapper:this.block.node;
		if (this.html.grid){HTML.clear(this.html.grid, true)}
		[,this.html.grid] =  HTML.chain(wrapper, 'div:grid,medusa-darkmode-transparent::');
		HTML.style(this.html.grid, { display: 'flex', 'flex-flow': 'wrap row', 'align-content': 'flex-start',gap:'15px', width:'100%', height:'100%', padding: '0', margin: '0' })
		let [, canistro] =  HTML.chain(this.html.grid, 'medusa-canistro:::');
		HTML.configure(canistro, {id:'queued' , stroke:"40", stroke:"40", radius:"60", progress:"95", status:'in-progress'});
		// const ring  = new Ring(this.terminal, "testring")
		// ring.attach(canistro.svg_root, null, canistro.svg_root)
		this.canistro = canistro 
		this.block.on("resized", (this.resizer).bind(this))
		// resizer()
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
