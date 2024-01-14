import { HTML } from "Medusa/Parseltongue/HTML/HTML.js";

export class Candidate {

    reload(text, line_no, width, height){
        this.text =  HTML.make('span','',[],{},'', text);
        this.container =  HTML.make('div','',[this.text],{});
        HTML.style(this.container,{  
            position: 'relative',
            display: 'content',
            'align-self': 'center',
            background: 'black',
            color: 'whitesmoke',
            padding: '2px 8px 2px 8px',
            margin: '1px 2px 1px 2px',
            'border-radius': '8px',

            /* 'margin-left': '45px',
            left:'50px'  *//* , 'z-index': `${(z*2)+1}`,  */})
    }

        
    // constructor(terminal, index, text){
    //     this.terminal = terminal
        // this.reload(text, index);
        // this.node = HTML.make('li','',[], {role:'option'}, `li${index}`, text)
        // this.node.addEventListener('click', terminal.option_pointer_click.bind(terminal));
        // this.node.addEventListener('pointerover', terminal.option_pointer_over.bind(terminal));
        // this.node.addEventListener('pointerout', terminal.option_pointer_out.bind(terminal));

        // this.line = new Line(terminal, text, index);
        // this.node = this.line.container;
        // this.node.addEventListener('click', terminal.option_pointer_click.bind(terminal));


        // this.container.appendChild(this.ul);
    // }

    constructor(terminal, line_no, text, width,height){
        this.terminal = terminal
        // this.node = HTML.make('input','cb_edit',[], {})
        // HTML.style(this.node, { width: 'inherit'});
        // this.button = new Button(this.terminal)

        // HTML.style(this.container,{ width: '100%', display: 'flex', 'flex-direction': 'row','position':'relative'});
        this.reload(text, line_no, width, height);
        this.node = this.container;
        // this.node.addEventListener('click', terminal.option_pointer_click.bind(terminal));

        this.focused = false
    }

    get value(){
        return this.text.textContent
    }

    get length(){
        return this.text.textContent.length
    }

    /* scroll_into_view */scroll_to(){
        this.text.scrollIntoView({ behavior: 'smooth', block: 'center',inline: "center" }); 
        HTML.style(this.text,{ background:'red', })
    }

    scroll_to2(){
        const parent = this.node.parentNode
        const opt = this.node
        if ( parent.scrollLeft + parent.offsetWidth < opt.offsetLeft + opt.offsetWidth ) { parent.scrollLeft = opt.offsetLeft + opt.offsetWidth - parent.offsetWidth; } 
        else if (parent.scrollLeft > opt.offsetLeft + 2) {  parent.scrollLeft = opt.offsetLeft;  }
    }

    set activedescendant(value){
        this.node.setAttribute('aria-activedescendant', value)
    }

    focus_in() {
        // this.node.parentNode.classList.add('focus'); // set the focus class to the parent for easier styling
        this.node.classList.add('focus'); // set the focus class to the parent for easier styling
        this.focused = true;
    }

    focus_out() { 
        this.node.classList.remove('focus');
        // this.node.parentNode.classList.remove('focus');
        this.focused = false;
    }

    open() {
        this.node.setAttribute('aria-expanded', 'true');
        this.button.open()
    }

    close() {
        this.node.setAttribute('aria-expanded', 'false');
        this.button.close()
    }
    
    event_within(event){
        return this.node.contains(event.target) || this.button.node.contains(event.target)
    }

    get value(){
        return this.text.textContent
    }

    get length(){
        return this.text.textContent.length
    }

    is_visible() {
        var bounding = this.node.getBoundingClientRect();
        return (
            bounding.top >= 0 && bounding.left >= 0 &&
            bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // scroll_into_view() {
    //     if (!this.is_visible()) { 
    //         this.node.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); 
    //         return this.node.id
    //     }
    //     return ''
    // }

    is_match(value){
        return this.node.textContent.toLowerCase().indexOf(value.toLowerCase()) === 0
    }

}