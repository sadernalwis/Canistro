import { HTML } from "Medusa/Parseltongue/HTML/HTML.js";
import { SVG } from "Medusa/Parseltongue/SVG/SVG.js";

export class Button {

    constructor(terminal){
        this.terminal = terminal
        this.node = HTML.make('button','cb1-button',[], {})
        HTML.style(this.node, {display:'none'})
        HTML.configure(this.node,{type:'button', id:"cb1-button", 'aria-label':"commands", 'aria-expanded':"false", 'aria-controls':"cb1-listbox",  tabindex:"-1"})

        var [svg, polygon] = SVG.chain(null,'polygon:arrow:');
        SVG.configure(svg, {width:18, height:16,'aria-hidden':"true" ,focusable:"false", style:"forced-color-adjust: auto"}, true);
        SVG.configure(polygon,{'stroke-width':"0", 'fill-opacity':"0.75", fill:"currentColor", points:"3,6 15,6 9,14"}, true);
		this.node.appendChild(svg);
        
        // this.node.addEventListener('keydown', terminal.key_down.bind(terminal));
        // this.node.addEventListener('click', terminal.button_pointer_click.bind(terminal));
    }

    focus_in() {
        this.node.parentNode.classList.add('focus'); // set the focus class to the parent for easier styling
        this.focused = true;
    }

    focus_out() { 
        this.node.parentNode.classList.remove('focus');
        this.focused = false;
    }

    open() {
        this.node.setAttribute('aria-expanded', 'true');
    }

    close() {
        this.node.setAttribute('aria-expanded', 'false');
    }


// doesOptionHaveFocus() { return this.node.getAttribute('aria-activedescendant') !== ''; }
}