import { HTML } from "Medusa/Parseltongue/HTML/HTML.js";

export class Cell {

	render() {
		// this.carousel.render()
	}
    
    transpose(row){
        if (row){  HTML.flex(this.html.branch, 'row')  } 
        else {  HTML.flex(this.html.branch, 'column')  }
        this.address.transpose(row)
        this.paths.transpose(row)
    }
    
    cell(){ 
		this.html.content = {}
		this.html.cell =  HTML.make('div','shot',[],{});
		let [card, description, title, options] = HTML.ladder(this.html.cell,`div:card:/div:description:/div:title:/div:options:`);
		let [, component, controller] = HTML.chain(card, `div:::component/img:::`); 
		this.controller = controller
		HTML.style(this.html.cell,{overflow: 'hidden', 'margin-top': '0px', 'margin-left': '0px'});
		HTML.style(card,{overflow: 'hidden', height:'100%', width:"auto"});
		HTML.configure(this.controller,{src: "assets/images/dkg_logo.png"});
		// HTML.configure(this.controller,{src: "assets/images/Robots/Robot 1.png"});
		HTML.style(this.controller,{width: "100%"});
		let [desc_header, desc] = HTML.ladder(description,`h1::CONTROLLER #0001/p::Description`);
		this.html.content.header = desc_header
		let [opt_header, buttons, links] = HTML.ladder(options,`p::/div:btns:/p::Links `);
		let [btn1,btn2,btn3,btn4,btn5] = HTML.ladder(buttons,`button::LOCATION:btn-0/button::OPERATOR:btn-1/button::COMPONENTS:btn-2/button::DIRECTIVES:btn-3/button::GRID:btn-4/`);
		btn1.addEventListener("click", ((e)=>{this.createGlobe()}).bind(this))
		btn2.addEventListener("click", ((e)=>{this.bitcoin()}).bind(this))
		btn3.addEventListener("click", ((e)=>{this.terminal.show_tree('test_tree')}).bind(this))
		btn4.addEventListener("click", ((e)=>{this.terminal.show_branch('main')}).bind(this))
		btn5.addEventListener("click", ((e)=>{this.terminal.show_grid('main')}).bind(this))
		let [, link] = HTML.chain(links, `a::`); 
		this.html.content.component = component;
		HTML.configure(link, {href:"https://twitter.com"})
        return this.html.cell
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
        this.container = this.cell()
        // this.block_events_on()
	}
}