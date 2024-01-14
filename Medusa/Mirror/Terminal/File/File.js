import { Block } from "Medusa/Mirror/Terminal/Block/Block.js"
import { Cell } from "Medusa/Mirror/Terminal/Grid/Cell/Cell.js";
import { HTML } from "Medusa/Parseltongue/HTML/HTML";

export class Grid {

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

    grid(wrapper){ 
		[,this.html.grid] =  HTML.chain(wrapper, 'div:medusa-darkmode-transparent::');
        HTML.style(this.html.grid, { display: 'flex', 'flex-flow': 'wrap row', 'align-content': 'flex-start',gap:'15px', width:'100%', height:'100%', padding: '0', margin: '0' })
        for (let i = 0; i < this.settings.grid.size; i++) { 
            let cell = this.cell(this.html.grid)
		    HTML.configure(cell.controller,{src: "assets/images/Robots/Robot 1.png"}); }
        this.block.display_terminal(false) 
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
        this.grid(this.block.node)
        this.node = this.block.node
        // this.block_events_on()
	}

    execute(){
        let value = this.terminal.input.value
		let v = this.terminal.addressbar.vantage/* .travel(traveller) */.load()
        // let root = 
    }
}