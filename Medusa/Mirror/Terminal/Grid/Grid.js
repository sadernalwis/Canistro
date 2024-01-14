import { Block } from "Medusa/Mirror/Terminal/Block/Block.js"
import { Cell } from "Medusa/Mirror/Terminal/Grid/Cell/Cell.js";
import { HTML } from "Medusa/Parseltongue/HTML/HTML.js";

class FileNode{
	get name()	   { return this.atrributes.name }
	get path()	   { return this.atrributes.relativePath }
	get type()	  { return this.atrributes.type}
	get extension() { return this.atrributes.extension || ""}
	get size()	   { return this.atrributes.sizeInBytes }
	within_size(size)	   { 
		let v = new V(size)
		if (v.length==1)		   { return this.size<=size }					  /*  |+++++m------M------| */
		else if (v.length==2){ 
			let [min, max] = size
			if (min && max)		{ return min <= this.size && this.size <= max}  /*  |-----m++++++M------| */
			else if (!min && max)  { return this.size >= max}					  /*  |-----m------M++++++| */
			else if (min && !max)  { return min <= this.size && this.size <= max}  /*  |+++++m------M------| */
			else if (!min && !max) { return true}								  /*  |+++++m++++++M++++++| */ }
			return true }
			
	child(name){ 
		let children = this.children.filter((child)=>{ return name===child.name }) 
		return children.length ? children[0] : undefined }

	names(prefix){ return prefix ? this.children.filter((child) => child.name.startsWith(prefix)) : this.children.map((child)=>child.name) }
			
	filter(names, paths, types, extensions, size, ){
		let children = this.children
		if(names)	  { children = children.filter((child)=>{ return names.some((filter)=>(child.name.startsWith(filter)))}) }
		if(paths)	  { children = children.filter((child)=>{ return paths.some((filter)=>(child.path.startsWith(filter)))}) }
		if(types)	  { children = children.filter((child)=>{ return types.some((filter)=>(child.type.startsWith(filter)))}) }
		if(extensions) { children = children.filter((child)=>{ return extensions.some((filter)=>(child.extension.startsWith(filter)))}) }
		if(size)	   { children = children.filter((child)=>{ return child.within_size(size)}) }
		return children  }
		
	paths(...filters){ 
		let children = this.filter(...filters)
		return children.map((child)=>child.path) }

	get(name){
		let index = this.names().indexOf(name)
		return (index>-1) ? this.children[index] : undefined
	}

	constructor(parent, self){
		this.parent = parent
		this.children = []
		this.atrributes = {}
		this.add_child = this.add_child
		for (let [key, value] of  Object.entries(self)){ 
			if (key!=="children"){ this.atrributes[key] = value } }
		if (self.children){
			for (let child of self.children){ 
				let child_node = new FileNode(this, child)
				this.children.push(child_node) } } }
}
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

	grid(wrapper, v){ 
		wrapper = wrapper?wrapper:this.block.node;
		if (this.html.grid){HTML.clear(this.html.grid, true)}
		[,this.html.grid] =  HTML.chain(wrapper, 'div:grid,medusa-darkmode-transparent::');
		HTML.style(this.html.grid, { display: 'flex', 'flex-flow': 'wrap row', 'align-content': 'flex-start',gap:'15px', width:'100%', height:'100%', padding: '0', margin: '0' })
		// let v = this.terminal.addressbar.vantage.load()
		if (v && v.is_NODE){
			// let paths = root.child('MadTesla').paths(...[,,,['png', 'jpg']])
			let paths = v.value.paths(...[,,,['png', 'jpg']])
			for (const path of paths) {
				let cell = this.cell(this.html.grid)
				HTML.configure(cell.controller, {src: `reserved/${path}`}); 
				cell.controller.addEventListener("click", ((e)=>{ 
					// window.superposition.draw_layer(cell.controller) 
					// window.superposition.canvas.drawImage(cell.controller, 0, 0);
					// window.superposition./* drawfunction */drawImageScaled(cell.controller);
                    // window.superposition.canvas.drawImage(cell.controller, 0, 0, cell.controller.width, cell.controller.height, 0, 0, 100, 100)
                    let [img, canvas] = [cell.controller, window.superposition.canvas.canvas]
                    window.superposition.canvas.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, canvas.width, canvas.height)
                    console.log(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, canvas.width, canvas.height)
                    window.img = img
				}).bind(this))
			}
		}
		for (let i = 0; i < this.settings.grid.size; i++) { 
			let cell = this.cell(this.html.grid)
			HTML.configure(cell.controller,{src: "assets/images/dkg_logo.png"}); //Robots/Robot 1.png"}); 
			cell.controller.addEventListener("click", ((e)=>{ 
				// window.superposition.draw_layer(cell.controller) 
				// window.superposition.canvas.drawImage(cell.controller, 0, 0);
                window.superposition.canvas.drawImage(cell.controller, 0, 0, cell.controller.width, cell.controller.height, 0, 0, 100, 100)
                console.log(cell.controller, 0, 0, cell.controller.width, cell.controller.height, 0, 0, 100, 100)
                window.img = cell.controller
			}).bind(this))
		}
		// this.block.display_terminal(false) 
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
		this.terminal.pool.on('populate', ((v)=>this.grid(this.block.node, v)).bind(this))
        this.terminal.input.node.value = "window/root/MadTesla/Clothes/"
		// this.block_events_on()
	}
}

window.FN = FileNode
// window.root = new FN(undefined, process.root)