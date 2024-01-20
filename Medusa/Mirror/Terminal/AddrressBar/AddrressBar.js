import { HTML } from "Medusa/Parseltongue/HTML/HTML.js";
import { CSS } from "Medusa/Parseltongue/CSS/CSS.js";

export class AddrressBar {

    transpose(row){
        if (row){ HTML.flex(this.html.address, 'row') }
        else { HTML.flex(this.html.address, 'column') }
    }
    
    
    get_divider(classifier, denominator, z, icon_name){
        
        const cls =  HTML.make('span','',[],{},'',classifier);
        const divider =  HTML.make('hr','',[],{});
        const denom =  HTML.make('span','',[],{},'',denominator);
        const divider_block =  HTML.make('div','',[cls, divider, denom],{});
        const icon =  HTML.make('img','row-button-image',[],{});
        HTML.style(cls,{  display:'inline-block', position: 'relative', }) // 'z-index': z, 
        HTML.style(divider,{ position: 'relative', width: `100%`, 'border-radius': '5px', }) // 'z-index': z,
        HTML.style(denom,{  display:'inline-block', position: 'relative'})
        HTML.style(divider_block,{ display:'inline-block', 'flex-direction': 'column', left: '10px', position: 'relative' })
        HTML.configure(icon, {src:`assets/icons/svg+xml/channels/${'save'}.svg`});
        HTML.style(icon,{'align-self': 'center', filter:'invert(1) sepia(1) saturate(0) hue-rotate(42deg)'})


        const arrow =  HTML.make('img','row-button-image',[],{});
        HTML.configure(arrow, {src:`assets/icons/svg+xml/${'arrow-right'}.svg`});
        HTML.style(arrow,{'align-self': 'center', left: z=="3"?'0px':'10px', position: 'relative',filter:'invert(1) sepia(1) saturate(0) hue-rotate(42deg)'})
        const segment_block =  HTML.make('div','',[icon, divider_block, arrow],{});
        HTML.style(segment_block,{
            display:'inline-flex',
            'flex-direction': 'row',
            // left: z=="3"?'0px':'10px',
            position: 'relative'
        })
        return segment_block;

    }
    set_address(address){
        address = address?address:''
        const segments = address.split('/');
        HTML.clear(this.html.address);
        for (const i in segments){
            const segment = segments[i]
            const z = parseInt(i)+1
            const [upper, lower, icon] = segment.split(':');
            // const span =  HTML.make('span','medusa-darkmode-arrow',[],{});
            const text = this.get_divider(upper, lower,`${(z*2)+1}`)
            // const li =  HTML.make('li','',[text/* ,span */ ],{},`segment${i}`);
            const li =  HTML.make('li','',[text],{},`segment${i}`);
            HTML.style(li,{
                'padding-top': '1em',
                'padding-right': '2em',
                'padding-bottom': '1em',
                'padding-left': i==0 ? '0.5em':'2em',
                position: 'relative',
                display: 'inline-block',
                'vertical-align': 'top', })
            // HTML.style(span,{ 'z-index': `${z*2}`, })
            this.html.address.appendChild(li)
        }
        this.address = address
        this.scroll_into_view()
    }

    get vantage(){
        const segments = this.address.split('/').map((s)=>{ return s.split(':')[0]})
        return new V(null, segments.join('/'))
    }
    qualifies(pt){
        return pt.startsWith('<') || pt.startsWith('>')
    }

    navigate(pt){
        let [command, address] = [new V(Parseltongue.clean(pt)), Parseltongue.clean(this.address).split('/')]
        let [b_key, segment, keys] = ['', '', ['<','>']]
        for (const a_key of command.items(0)) {
            let [a_letter, b_letter] = [!keys.includes(a_key), !keys.includes(b_key)]
            if (a_key =='<'){ 
                if(!segment){ address.pop() }
                segment = "" }
            else if( !b_letter && a_letter){ 
                if (segment){address.push(segment)}
                segment = a_key }
            else if(a_letter){ segment += a_key }
            b_key = a_key }
        if (segment){address.push(segment)}
        return address.join('/')
    }

    execute(pt){
        var pt = Parseltongue.clean(this.value)
        let obj_func = Parseltongue.get(window)
        //     segments = Parseltongue.clean(address).split('/') if address else []
        //     command = Parseltongue.clean(command)
        //     for i , (prev, curr, next) in enumerate(Python.continuum(command)):
        //         if curr =='<':
        //             if len(segments): segments.pop()
        //         elif prev =='>' and curr not in ['<','>']:
        //             if curr: segments.append(curr)
        //         elif curr not in ['<','>']:
        //             if len(segments): segments[-1] +=curr
        //             else: segments = [curr]
        //     return '/'.join([Parseltongue.clean(seg) for seg in segments])
    }

    reload(width, height){
        HTML.clear(this.container)
        this.html.address =  HTML.make('ul','medusa-darkmode-noshadow',[],{});
        HTML.style(this.html.address,{   
            margin: '0px',
            padding: '0px',
            'list-style-type': 'none',
            'overflow-y': 'hidden',
            'overflow-x': 'hidden',
            'white-space': 'nowrap',
            width: `auto`,//`100%`,
            // background:'aliceblue',
            'font-size': '0.7em',
            'margin-left': '0px',
        });
        for (let i = 0; i < 30; i++) {
            const z = i+1
            // const span =  HTML.make('span','medusa-darkmode-arrow',[],{});
            const text = this.get_divider('address-segment',`workflow-stage-depth ${z}`,`${(z*2)+1}`)
            const li =  HTML.make('li','',[text/* ,span */ ],{},`segment${i}`);
            HTML.style(li,{
                'padding-top': '1em',
                'padding-right': '2em',
                'padding-bottom': '1em',
                'padding-left': i==0 ? '0.5em':'2em',
                position: 'relative',
                display: 'inline-block',
                'vertical-align': 'top',
            })
            // HTML.style(span,{ 'z-index': `${z*2}`, })
            this.html.address.appendChild(li)
        }
        this.container.appendChild(this.html.address);

    }

    constructor(terminal,width,height){
        this.html = {}
        this.terminal = terminal
        // this.node = HTML.make('input','cb_edit',[], {})
        // HTML.style(this.node, { width: 'inherit'});

        // this.button = new Button(this.terminal)
        this.container =  HTML.make('div','',[],{});
        HTML.style(this.container,{ width: 'auto'/* '100%' */, display: 'flex', 'flex-direction': 'row','position':'relative'});
        this.address = ''
        this.reload(width,height);
        // this.container.appendChild(this.html.address);
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
    scroll_into_view(index){
        const child_count = this.html.address.children.length
        index = index!==undefined ? index : child_count-1
        let stage_idx = this.vantage.stage_idx
        for (let idx = 0; idx < child_count; idx++) {
            const segment = this.html.address.children[idx]
            const image = segment.children[0].children[0]
            const arrow = segment.children[0].children[2]
            const divider = segment.children[0].children[1].children[1]
            // HTML.style(segment,{ 'border-color':'aquamarine', })
            // HTML.style(arrow,{ 'border-color':'grey', })
            // if (idx<=index){
            HTML.style(segment, {'border-style': 'none'})
            if (idx<=stage_idx){
                // let color = idx<stage_idx?'limegreen': 'red'
                let color = 'limegreen'
                HTML.style(segment,{color:  color})
                HTML.style(divider,{ 'border-color': color, })
                HTML.style(image,{ 'filter':'invert() sepia(1) saturate(100) hue-rotate(42deg)', })
                HTML.style(arrow,{ 'filter':'invert() sepia(1) saturate(100) hue-rotate(42deg)', })
            }
            else{
                let color = 'red'
                HTML.style(segment,{color: color})
                HTML.style(divider,{ 'border-color':color, })
                HTML.style(image, CSS.filter('#ff0000'))//{ 'filter':'invert(1) sepia(1) saturate(0) hue-rotate(42deg)', })
                HTML.style(arrow, CSS.filter('#ff0000'))//{ 'filter':'invert(1) sepia(1) saturate(0) hue-rotate(42deg)', })
            }
        }

        if ( 0<=index && index<child_count){
            const segment = this.html.address.children[index]
            const image = segment.children[0].children[0]
            const arrow = segment.children[0].children[2]
            const divider = segment.children[0].children[1].children[1]
            HTML.style(segment, {'border-style': 'dotted'})
            segment.scrollIntoView({ behavior: 'smooth', block: 'nearest',inline: "center" }); 
            // // segment.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); 
            // // arrow.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); 
            // // HTML.style(segment,{ background:'red', })
            // // HTML.style(arrow,{ background:'red', })
            // // HTML.style(segment,{ 'border-color':'aquamarine', })
            // // HTML.style(arrow,{ 'border-color':'limegreen', })
            // HTML.style(divider,{ 'border-color':'limegreen', })
            // HTML.style(image,{ 'filter':'invert() sepia(1) saturate(100) hue-rotate(42deg)', })
            // HTML.style(arrow,{ 'filter':'invert() sepia(1) saturate(100) hue-rotate(42deg)', })
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