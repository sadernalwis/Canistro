import { HTML } from "Medusa/Parseltongue/HTML/HTML.js";
import { Line } from "./Line/Line.js";
import { Medusa } from "Medusa/index.js";

export class Document {

    constructor(terminal, width, height){
        this.terminal = terminal
        this.node =  HTML.make('ul',`${Medusa.scroll_hide()}`,[],{});
        // HTML.style_overlay(this.node, width,height)
        HTML.configure(this.node, {id:"cb1-listbox", role:"listbox", 'aria-label':"commands"})
        HTML.style(this.node,{   
            margin: '0px',
            padding: '0px',
            position: 'relative',//'absolute',
            'list-style': 'none',
            'background-color': 'rgba(57, 57, 57, 0.1)',
            // display: 'none',
            'box-sizing': 'border-box',
            border: '2px currentColor solid',
            'max-height': '100%',//`${height}px`,
            width: `${width}px`,
            overflow: 'scroll',
            'overflow-x': 'hidden',
            'overflow-y': 'scroll',//'hidden',
            'font-size': '87.5%',
            cursor: 'pointer',
            // display: 'flex', 
            // display: 'flex', 
            display: 'inline-flex', 
            'flex-direction': 'column',
            // 'flex-direction': 'column-reverse',
            'margin-bottom': '0px'
        });
        HTML.style(this.node,{ width: '100%',/* height: 'inherit','position':'relative', */ 'left':'0px', 'bottom':'0px'});
        // this.node.addEventListener( 'pointerover', terminal.ul_hover.bind(terminal) ); // initialize pop up menu
        // this.node.addEventListener( 'pointerout', terminal.ul_hover_out.bind(terminal) );        
        this.focused = false
        this.selected_option = null
        this.options = []
        this.option = null
        this._filter = ''
        this.showing_graphs = false
        this.lines = []
        this.script_lines = []
        this.graph_lines = []
    }

    get commands(){
        return ['show graphs', 'show script']
    }
    get script(){
        return this.script_lines
    }
    get graphs(){
        return this.graph_lines
    }

    clear(){
        this.script_lines = []
        this.graph_lines = []
        this.options = [];
        HTML.clear(this.node)
        // this.node.innerHTML = '';
    }

    show_lines(){ //https://stackoverflow.com/questions/8294400/css-animations-with-delay-for-each-child-element
        
        this.lines.forEach(function(line, index){
            line.node.style.transitionDelay = s*(1+index) + 's';
            // line.node.css({ 'transition-delay' : s*(1+index) + 's' });
            // setTimeout(function(){
            //     $(el).animateCSS("fadeIn","400");
            // },500 + ( i * 500 ));
        });
    }

    save_lines(){
        if(!this.showing_graphs){
            this.showing_graphs = false
            this.lines = this.options.slice(0);
        }
    }

    load_lines(){
        if(this.showing_graphs){
            this.clear()
            for (var i = 0; i < this.lines.length; i++) {
                const line = this.lines[i]
                this.options.push(line);
                this.node.appendChild(line.node);
                line.resize()
            }
        }
    }

    add(value, index, type='script'){
        let option = new Line(this.terminal , this.length , value, type);
        if(type==='script'){
            this.script_lines.push(value);
            this.lines.push(option);
            if(!this.showing_graphs){
                this.options.push(option);
                this.node.appendChild(option.node);
            }
        }
        else{
            this.graph_lines.push(value);
            if(this.showing_graphs){
                this.options.push(option);
                this.node.appendChild(option.node);
            }
        }
        option.resize()
    }

    load_script(script){
        this.clear()
        script = script ? script :''
        var lines = script.match(/[^\r\n]+/g);
        lines = lines ? lines : []
        for (const line of lines) { this.add(line) }
    }

    test_graph(){
        this.save_lines()
        this.showing_graphs = true
        this.clear();
        let added = 0;
        for (var i = 0; i < 2; i++) {
            this.add('word', added++, 'graph') 
        }
        return this.first_option
    }

    execute(parseltongue){
        if(parseltongue==='show graphs'){ return this.test_graph() }
        else if(parseltongue==='show script'){ return this.load_lines() }
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

    scroll_into_view() {
        if (this.option && this.focused) { return this.option.scroll_into_view()  } //id
        else { return ''}
    }

    get filter(){ return this._filter.toLowerCase() }
    set filter(value){ this._filter = value }

    populate(filter) {
        this.clear();
        filter = filter.toLowerCase()
        let added = 0;
        // for (var i = 0; i < English.length; i++) {
        //     var word = English[i];
        // const dictionary = this.terminal.superposition.poses.concat(English)
        const dictionary = this.terminal.commands
        for (var i = 0; i < dictionary.length; i++) {
            var word = dictionary[i];
            if ( filter.length === 0 || word.indexOf(filter) === 0) { 
                this.add(word, added++) 
            } }
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

    async incoming(event, data){
        switch (event) {
            case 'queued': // image.src = data? data:"../../../../../Environments/Medusa/Medallion.png";
                break;
            case 'pre-send': // image.src = data? data:"../../../../../Environments/Medusa/Medallion.png";
                break;
            case 'sent': // image.src = data? data:"../../../../../Environments/Medusa/Medallion.png";
                break;
            case 'error': // image.src = data? data:"../../../../../Environments/Medusa/Medallion.png";
                break;
            case 'received':
                let [gatepass, parseltongue, payload] = data
                let [json,blob] = payload
                if(json){ payload = json } 
                else{
                    payload = blob
                    var image = document.createElement('img');
                    let sp = this
                    const object_url = URL.createObjectURL(payload);
                    const buffer = await payload.arrayBuffer();
                    const metadata = readMetadata(buffer);
                    // console.log(metadata)                    
                    image.onload = function(e) { sp.image_hvrp(this, metadata) };
                    image.src = object_url
                    return metadata['tEXt'].asset_hash
                }
                return 1
            default:
                // submitter.src = data? data:"../../../../../Environments/Medusa/Medallion.png";
                break;
        }
    }

    submit_block(){
        var form = new FormData();
        form.append('parseltongue', 'mirror:parseltongue script');
        form.append('payload', this.value);
        this.terminal.program.queue('postmaster', 'submit block', '', form, this);
    }


}