import { HTML } from "../../../../../../Parseltongue/HTML/HTML.js";

export class Stream {

    stylize(){

    }

    reload(text, line_no, width, height){
        this.ul =  HTML.make('ul','medusa-darkmode-code',[],{});
        HTML.style(this.ul,{   
            margin: '0px',
            padding: '0px',
            'list-style-type': 'none',
            'overflow-y': 'hidden',
            'overflow-x': 'hidden',
            'white-space': 'nowrap',

            width: `100%`,
            // height: '5%',
            height: '2em',

            // background:'aliceblue',
            'font-size': '0.7em',
            'margin-left': '0px',

            display: 'flex',
            // display: 'inline-flex',
            'align-self': 'center'
            // margin: '0px',
            // padding: '0px',
            // position: 'absolute',
            // 'list-style': 'none',
            // 'background-color': 'rgba(57, 57, 57, 0.1)',
            // // display: 'none',
            // 'box-sizing': 'border-box',
            // border: '2px currentColor solid',
            // // 'max-height': `${height}px`,
            // width: `${width}px`,
            // overflow: 'scroll',
            // 'overflow-x': 'hidden',
            // 'font-size': '87.5%',
            // cursor: 'pointer',
            // display: 'flex', 
            // 'flex-direction': 'column-reverse',
            // 'margin-bottom': '1px'
        });
        for (let i = 0; i < 1; i++) {

            const z = i+1
            const span =  HTML.make('span','medusa-darkmode-skin',[],{});
            
            this.line_no =  HTML.make('span','',[],{},'', line_no.toString()/* .padEnd(4, ' ') */);
            HTML.style(this.line_no,{  position: 'relative', 'z-index': `${(z*2)+1}`, 'align-self': 'center', left:'1px' })
            this.text =  HTML.make('span','',[],{},'', text);
            HTML.style(this.text,{  position: 'absolute', display: 'content', 'align-self': 'center',left:'50px' /* 'margin-left': '45px' *//* , 'z-index': `${(z*2)+1}`,  */})
            // const div =  HTML.make('span','',[li,span],{},`segment${i}`, 'segment');
            const li =  HTML.make('li','',[this.line_no, span, this.text ],{},`segment${i}`);
            // const gutter =  HTML.make('div','',[this.line_no, span],{});
            // const li =  HTML.make('li','',[gutter, this.text ],{},`segment${i}`);
            HTML.style(li,{   
                // content: '',
                // position: 'absolute',
                // top: '-0.2em',
                // bottom: '0',
                // width: '3em',
                // transform: 'rotate(30deg) skewy(30deg)',

                // padding: '1em 2em',

                'padding-top': '1em',
                'padding-right': '2em',
                'padding-bottom': '1em',
                'padding-left': '0.5em',

                position: 'relative',
                // display: 'inline-block',
                display: 'inline-flex',
                'align-self': 'center',

                'vertical-align': 'top',
                // background:'aliceblue',
                
                // display: 'flex',
                // 'flex-direction': 'row-reverse'
                // 'border-right': 'solid',
                // 'border-top': 'solid',
                // 'pointer-events': 'none',
                // 'box-sizing': 'border-box',
                // 'box-shadow': '3px -3px 6px -3px gray',/* a shadow effect can be added too */
                // 'z-index': '1',

            })
            HTML.style(span,{   
                // background:'aliceblue',
                content: '',
                position: 'absolute',
                // top: '-0.2em',
                // bottom: '0',

                // position: 'relative',
                'align-self': 'center',
                top: 'auto',
                bottom: 'auto',

                width: '3em',
                height: '3em',
                left:'10px',
                display: 'inline-block', 
                // position: 'relative',
                // transform: 'rotate(30deg) skewy(30deg)',
                transform: 'rotate(45deg) skewY(0deg)',
                'border-right': 'solid',
                'border-top': 'solid',
                'pointer-events': 'none',
                'box-sizing': 'border-box',
                'box-shadow': '3px -3px 6px -3px gray',/* a shadow effect can be added too */
                'border-radius': '4px',
                'z-index': `${z*2}`,
            })
            this.ul.appendChild(li)
            // this.ul.appendChild(div)
        }
    }

    constructor(terminal, text, line_no, width,height){
        this.terminal = terminal
        // this.node = HTML.make('input','cb_edit',[], {})
        // HTML.style(this.node, { width: 'inherit'});

        // this.button = new Button(this.terminal)
        this.container =  HTML.make('div','',[],{});
        HTML.style(this.container,{ width: '100%', display: 'flex', 'flex-direction': 'row','position':'relative'});
        this.reload(text, line_no, width,height);
        this.container.appendChild(this.ul);
        // this.container.appendChild(this.node);
        // this.container.appendChild(this.button.node);

        // this.node.addEventListener('keydown', terminal.key_down.bind(terminal));
        // this.node.addEventListener('keyup', terminal.key_up.bind(terminal));
        // this.node.addEventListener('click', HTML.full_focus, false);
        // this.node.addEventListener('click', terminal.toggle_list.bind(terminal));
        // this.node.addEventListener('focus', terminal.on_focus_input.bind(terminal));
        // this.node.addEventListener('blur', terminal.focus_out.bind(terminal));
        this.focused = false
    }

    get value(){
        return this.text.textContent
    }

    get length(){
        return this.text.textContent.length
    }

    scroll_into_view(index){
        const child_count = this.ul.children.length
        if ( 0<=index && index<child_count){
            const segment = this.ul.children[index]
            const arrow = segment.children[1]
            segment.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); 
            // arrow.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); 
            HTML.style(segment,{ background:'red', })
            HTML.style(arrow,{ background:'red', })
            console.clear()
            console.log("scroll test")}
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
// doesOptionHaveFocus() { return this.node.getAttribute('aria-activedescendant') !== ''; }
}