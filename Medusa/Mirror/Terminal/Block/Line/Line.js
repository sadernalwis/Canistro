import { Graph } from "./Graph/Graph.js";
import { Script } from "./Script/Script.js";

export class Line {
    
    constructor(terminal, index, text, type='script'){
        this.terminal = terminal
        // this.reload(text, index);
        // this.node = HTML.make('li','',[], {role:'option'}, `li${index}`, text)
        // this.node.addEventListener('click', terminal.option_pointer_click.bind(terminal));
        // this.node.addEventListener('pointerover', terminal.option_pointer_over.bind(terminal));
        // this.node.addEventListener('pointerout', terminal.option_pointer_out.bind(terminal));
        // this.line = 
        this.line = type==='script' ? new Script(terminal, text, index) : new Graph(terminal, text, index);
        this.node = this.line.container;
        // this.node.addEventListener('click', terminal.option_pointer_click.bind(terminal));
        // this.node.addEventListener('pointerover', terminal.option_pointer_over.bind(terminal));
        // this.node.addEventListener('pointerout', terminal.option_pointer_out.bind(terminal));
        // this.container.appendChild(this.ul);
    }

    resize(){
        this.line.resize()
    }

    get value(){
        return this.line.value
    }

    get length(){
        return this.line.length
    }

    is_visible() {
        var bounding = this.node.getBoundingClientRect();
        return (
            bounding.top >= 0 && bounding.left >= 0 &&
            bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    scroll_into_view() {
        if (!this.is_visible()) { 
            this.node.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); 
            return this.node.id
        }
        return ''
    }

    scroll_to(){
        const parent = this.node.parentNode
        const opt = this.node
        if ( parent.scrollTop + parent.offsetHeight < opt.offsetTop + opt.offsetHeight ) { parent.scrollTop = opt.offsetTop + opt.offsetHeight - parent.offsetHeight; } 
        else if (parent.scrollTop > opt.offsetTop + 2) {  parent.scrollTop = opt.offsetTop;  }
    }

    is_match(value){
        return this.value.toLowerCase().indexOf(value.toLowerCase()) === 0
    }

}