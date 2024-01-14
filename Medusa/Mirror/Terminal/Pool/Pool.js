import { HTML } from "Medusa/Parseltongue/HTML/HTML.js";
// import { Button } from "../Button/Button.js";
// import { English } from "../Mnemonics/Mnemonics.js";
import { Candidate } from "./Candidate/Candidate.js";
import { Medusa } from "Medusa/index.js";
import eventify from "Medusa/Event.js";
export class Pool {

    transpose(row){
        // if (row){ HTML.flex(this.node, 'row') }
        // else { HTML.flex(this.node, 'column') }
    }
    

    constructor(terminal, width, height){
        eventify(this)
        this.terminal = terminal
        // this.node = HTML.make('input','cb_edit',[], {})
        // HTML.style(this.node, { width: 'inherit'});
        // HTML.configure(this.node, {type:'text',id:"cb1-input", role:"combobox", 'aria-autocomplete':"both", 'aria-expanded':"false", 'aria-controls':"cb1-listbox"})

        // // this.button = new Button(this.terminal)
        // this.container =  HTML.make('div','',[],{});
        // HTML.style(this.container,{ width: '100%', display: 'flex', 'flex-direction': 'row','position':'relative'});
        // this.container.appendChild(this.node);
        // // this.container.appendChild(this.button.node);

        // this.node.addEventListener('keydown', terminal.key_down.bind(terminal));
        // this.node.addEventListener('keyup', terminal.key_up.bind(terminal));
        // this.node.addEventListener('click', HTML.full_focus, false);
        // this.node.addEventListener('click', terminal.toggle_list.bind(terminal));
        // this.node.addEventListener('focus', terminal.on_focus_input.bind(terminal));
        // this.node.addEventListener('blur', terminal.focus_out.bind(terminal));
        // this.focused = false

        this.terminal = terminal
        this.node =  HTML.make('ul',`${Medusa.scroll_hide()}`,[],{});
        // HTML.style_overlay(this.node, width,height)
        // HTML.configure(this.node, {id:"cb1-listbox", role:"listbox", 'aria-label':"commands"})
        HTML.style(this.node,{   
            // margin: '0px',
            // padding: '0px',
            // 'list-style': 'none',
            // position: 'absolute',

            // position: 'relative',
            // 'background-color': 'rgba(57, 57, 57, 0.1)',
            // width: `100%`,
            // // height: `10%`,
            // overflow: 'scroll',
            // 'overflow-x': 'hidden',
            // 'overflow-y': 'hidden',
            // 'font-size': '87.5%',
            display: 'flex', 
            'flex-direction': 'row',
            'position':'relative',
            margin: '0px',
            // 'justify-content': 'center',
            
            'padding-top': '1em',
            'padding-right': '0em',
            'padding-bottom': '1em',
            'padding-left': '0.5em',

            'list-style-type': 'none',
            'overflow-y': 'hidden',
            'overflow-x': 'scroll',//'hidden',
            'white-space': 'nowrap',

            width: `100%`,
            // background:'aliceblue',
            'font-size': '0.7em',
            'margin-left': '0px',

            // display: 'none',
            // 'box-sizing': 'border-box',
            // border: '2px currentColor solid',
            // 'max-height': `${height}px`,
            // width: `${width}px`,
            // cursor: 'pointer',
            // display: 'inline-flex', 
            // 'flex-direction': 'row',
            // 'margin-bottom': '0px'
        });
        // HTML.style(this.node,{ width: '100%',height: 'inherit','position':'relative', 'left':'0px', 'bottom':'0px'});
        // this.node.addEventListener( 'pointerover', terminal.ul_hover.bind(terminal) ); // initialize pop up menu
        // this.node.addEventListener( 'pointerout', terminal.ul_hover_out.bind(terminal) );        

        this.container =  HTML.make('div','medusa-darkmode-skin',[],{});
        HTML.style(this.container,{ width: '100%', display: 'flex', 'flex-direction': 'row','position':'relative'});
        // this.reload(width,height);
        this.container.appendChild(this.node);

        this.focused = false
        this.selected_option = null
        this.options = []
        this.option = null
        this._filter = ''
        // this.populate('')
    }
    focus_in() {
        this.focused = true;
        this.node.classList.add('focus');
        // this.scroll_into_view(this.option);
    }

    focus_out() { 
        this.node.classList.remove('focus');
        this.focused = false;
        // this.scroll_into_view(false);
    }

    isOpen() { return this.node.style.display === 'block'; }
    isClosed() { return this.node.style.display !== 'block'; }

    open() {
        this.node.style.display = 'flex';
        // this.node.style.display = 'block';
        // HTML.style(this.node,{ display: 'flex',  'flex-direction': 'column-reverse', });
    }
    
    close() {
        // this.node.style.display = 'none';
    }

    get length(){return this.options.length }
    get first_option(){ return this.options[0]; }
    get last_option(){ return this.options[this.length-1]; }

    get previous_option() {
        if (this.option !== this.first_option) {
            var index = this.options.indexOf(this.option);
            // if (index==0) { return this.last_option }
            // else if (index>0) { this.options[index - 1] }
            // else if (index<0) { this.options[0] }
            return this.options[index - 1];
        }
        return this.last_option
    }

    get next_option() {
        if (this.option !== this.last_option) {
            var index = this.options.indexOf(this.option);
            return this.options[index + 1];
        }
        return this.first_option
    }

    // scroll_into_view() {
    //     if (this.option && this.focused) { return this.option.scroll_into_view()  } //id
    //     else { return ''}
    // }

    deselect_all(){
        const child_count = this.node.children.length
        for (let index = 0; index < child_count; index++) {
            const candidate = this.node.children[index]
            HTML.style(candidate,{ 'border-style': 'none', })
        }
    }

    scroll_to(segment){
        this.deselect_all()
        // segment.node.scrollIntoView({ behavior: 'smooth', block: 'center',inline: "center" });
        segment.node.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
        // segment.node.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
        HTML.style(segment.node, { 'border':'2px', 'border-style': 'solid', 'border-color':'limegreen', })
    }

    scroll_into_view(index){
        const child_count = this.node.children.length
        for (let index = 0; index < child_count; index++) {
            const candidate = this.node.children[index]
            HTML.style(candidate,{ 'border-style': 'none', })
        }

        if ( 0<=index && index<child_count){
            const segment = this.node.children[index]
            // const arrow = segment.children[1]
            segment.scrollIntoView({ behavior: 'smooth', block: 'center',inline: "center" }); 
            // segment.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); 
            // arrow.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); 
            // HTML.style(segment,{ background:'red', })
            HTML.style(segment,{ 'border':'2px', 'border-style': 'solid', 'border-color':'limegreen', })
            // HTML.style(arrow,{ background:'red', })
            console.clear()
            console.log("scroll test")}
    }

    get filter(){ return this._filter.toLowerCase() }
    set filter(value){ this._filter = value }

    qualifier(pt){
        return pt.startsWith(':') || pt.startsWith(';')
    }

    clear(){
        this.options = [];
        // this.option = undefined;
        this.node.innerHTML = '';
    }

    add(value, index){
        let option = new Candidate(this.terminal , this.length , value);
        this.options.push(option);
        this.node.appendChild(option.node);

    }
    
    execute(pt){
        if (pt.startsWith('>') || pt.startsWith('<')){ this.address.execute(pt) }
        else { this.address.execute(pt) }

    }

    populate(filter, dictionary, v) {
        this.clear();
        filter = filter.toLowerCase()
        let added = 0;
        // for (var i = 0; i < English.length; i++) {
            //     var word = English[i];
            // const dictionary = this.terminal.superposition.poses.concat(English)
        // const dictionary = this.terminal.key(filter)
        for (var i = 0; i < dictionary.length; i++) {
            var word = dictionary[i];
            if ( word && (filter.length === 0 || word.indexOf(filter) === 0)) { 
                this.add(word, added++) 
            } }
        this.fire('populate', v)
        return this.first_option
    }

    scroll() {
        if (this.option && this.focused) { return this.option.scroll_into_view() } 
        else { return '' }
    }


    setOption(option, no_highlight) {
        if (typeof no_highlight !== 'boolean') { no_highlight = false; }
        if (option) {

            this.option = option;
            this.setCurrentOptionStyle(this.option);
            this.scroll_into_view(this.option);

            this.input.node.value = this.option.textContent;
            if (no_highlight) { 
                this.input.node.setSelectionRange( this.option.textContent.length, this.option.textContent.length ); 
            } 
            else { 
                this.input.node.setSelectionRange( this.filter.length, this.option.textContent.length );
            }
        }
    }

}