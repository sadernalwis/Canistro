import { Block } from "Medusa/Mirror/Terminal/Block/Block.js"
import { AddrressBar } from "Medusa/Mirror/Terminal/AddrressBar/AddrressBar.js";
import { Pool } from "Medusa/Mirror/Terminal/Pool/Pool.js";
import { Input } from "Medusa/Mirror/Terminal/Input/Input.js";
import { HTML } from "Medusa/Parseltongue/HTML/HTML.js";
import { Medusa } from "Medusa/index.js";

export class Branch {

	render() {
		// this.carousel.render()
	}
    
    transpose(row){
        if (row){  HTML.flex(this.html.branch, 'row')  } 
        else {  HTML.flex(this.html.branch, 'column')  }
        this.address.transpose(row)
        this.paths.transpose(row)
    }
    
    branch(wrapper){ 
		this.html.branch =  HTML.make('div','medusa-darkmode-transparent',[],{});
        HTML.style(this.html.branch, {   
            background: 'linear-gradient(91deg, rgba(255, 255, 255, 0.1) 0%, rgba(17, 17, 17, 0) 100%)',
            'border-radius': '10px',
            margin: '0px',
            padding: '0px',
            'list-style-type': 'none',
            'overflow-y': 'hidden',
            'overflow-x': 'hidden',
            'white-space': 'nowrap',
            width: `100%`,
            height: `100%`,
            // background:'aliceblue',
            'font-size': '0.7em',
            'margin-left': '0px', });
        this.address = new AddrressBar(this.terminal);
        this.paths = new Pool(this.terminal);
        this.search = new Input(this.terminal, this.paths);
        // this.paths = new AddrressBar(this.terminal);
        this.address.set_address('1:1:1/1:1:1/1:1:1')
        // this.paths.set_address('2:2:2/2:2:2/2:2:2')
        // this.paths.populate("");
        let [header, main, footer] = HTML.ladder(this.html.branch, `header:::/main:${Medusa.scroll_hide()}::/footer:::`)
        this.html.header = header
        this.html.main =  main
        this.html.footer = footer
        // [this.html.header
        HTML.style(this.html.main, {flex:'1', height:'0vh', overflow: 'hidden scroll'})
        HTML.style(this.paths.container, {/* height:'100vh',  */display:'block'})
        this.html.header.appendChild(this.address.container)
        this.html.main.appendChild(this.paths.container)
        this.html.footer.appendChild(this.search.container)
        HTML.style(this.html.main.children[0].children[0], {display:'block', 'font-size':'1.2em', letterSpacing: '0.1em'})
        this.search.invert_navigation()
        // this.html.branch.appendChild(this.address.container)
        // this.html.branch.appendChild(this.paths.container)
        // this.html.branch.appendChild(this.search.container)
        wrapper.appendChild(this.html.branch)
        this.transpose()
        this.block.display_terminal(false)

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
        this.block = new Block(terminal)
        this.terminal = this.block.terminal
        this.branch(this.block.node)
        this.node = this.block.node
        // this.block_events_on()
	}
}