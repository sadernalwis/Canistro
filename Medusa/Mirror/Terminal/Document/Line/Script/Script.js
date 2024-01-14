// import { * } from "../../../../../../Parseltongue/HTML/HTML.js";

import { HTML } from "Medusa/Parseltongue/HTML/HTML.js";

export class Script {

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
            const span =  HTML.make('span','',[],{}); //medusa-darkmode-skin
            
            this.gutter =  HTML.make('span','',[],{},'', line_no.toString()/* .padEnd(4, ' ') */);
            HTML.style(this.gutter,{  position: 'relative', 'z-index': `${(z*2)+1}`, 'align-self': 'center', left:'1px' })
            this.text =  HTML.make('span','',[],{},'', text);
            HTML.style(this.text,{  position: 'absolute', display: 'content', 'align-self': 'center',left:'50px' /* 'margin-left': '45px' *//* , 'z-index': `${(z*2)+1}`,  */})
            // const div =  HTML.make('span','',[li,span],{},`segment${i}`, 'segment');
            const li =  HTML.make('li','',[this.gutter, span, this.text ],{},`segment${i}`);
            // const gutter =  HTML.make('div','',[this.gutter, span],{});
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

    resize(e){
		// console.log(e)
		// const svg_width =  this.svg_root.clientWidth;
		// const svg_height = this.svg_root.clientHeight;
		// // SVG.configure(this.svg_root, {viewBox:`${-svg_width/2} ${-svg_height/2} ${svg_width} ${svg_height}`}, true);
        // this.channel.resize()
        // this.paper()
    }

    constructor(terminal, text, line_no, width,height){
        this.terminal = terminal
        this.container =  HTML.make('div','',[],{});
        HTML.style(this.container,{ width: '100%', display: 'flex', 'flex-direction': 'row','position':'relative'});
        this.reload(text, line_no, width,height);
        this.container.appendChild(this.ul);
        this.focused = false
    }

    time_ago(time_d) { //https://stackoverflow.com/questions/3177836/how-to-format-time_d-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site/23259289#23259289

        switch (typeof time_d) {
          case 'number':
            break;
          case 'string':
            time_d = +new Date(time_d);
            break;
          case 'object':
            if (time_d.constructor === Date) time_d = time_d.getTime();
            break;
          default:
            time_d = +new Date();
        }
        var time_formats = [
          [60, 'seconds', 1], // 60
          [120, '1 minute ago', '1 minute from now'], // 60*2
          [3600, 'minutes', 60], // 60*60, 60
          [7200, '1 hour ago', '1 hour from now'], // 60*60*2
          [86400, 'hours', 3600], // 60*60*24, 60*60
          [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
          [604800, 'days', 86400], // 60*60*24*7, 60*60*24
          [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
          [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
          [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
          [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
          [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
          [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
          [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
          [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
        ];
        var seconds = (+new Date() - time_d) / 1000,
          token = 'ago',
          list_choice = 1;
      
        if (seconds == 0) {
          return 'Just now'
        }
        if (seconds < 0) {
          seconds = Math.abs(seconds);
          token = 'from now';
          list_choice = 2;
        }
        var i = 0,
          format;
        while (format = time_formats[i++])
          if (seconds < format[0]) {
            if (typeof format[2] == 'string')
              return format[list_choice];
            else
              return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
          }
        return time_d;    
        //   var aDay = 24 * 60 * 60 * 1000;
        //   console.log(time_ago(new Date(Date.now() - aDay)));
        //   console.log(time_ago(new Date(Date.now() - aDay * 2)));
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

    submit_line(){
        var form = new FormData();
        form.append('parseltongue', 'mirror:parseltongue script');
        form.append('payload', this.value);
        this.terminal.program.queue('postmaster', 'POST', '', form, this);
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