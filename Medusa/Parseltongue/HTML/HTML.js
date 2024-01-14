// import { Editor } from "../../Medusa/ProgramController/Program/Viewer/Editor/Editor.js";
import { Terminal } from "../../Mirror/Terminal/Terminal.js"
import { Radar } from "../SVG/Radar/Radar.js";
import { ProgressRing } from "../SVG/Rings/Progress/Progress.js";
// window.customElements.define('progress-ring', ProgressRing);
// window.customElements.define('scope-radar', Radar);
// window.customElements.define('viewer-terminal', Terminal);
// window.customElements.define('viewer-editor', Editor);
export let HTML = {
    colors: [  "red", "blue", "green", "orange", "yellow", "teal", "indigo", "purple", "pink"],
    board_types : {column:'',row:'row',grid:'l-grid'},
    define:function () {
        window.customElements.define('progress-ring', ProgressRing);
        window.customElements.define('scope-radar', Radar);
        window.customElements.define('viewer-terminal', Terminal);
        window.customElements.define("svg-file", class extends HTMLElement {
            // declare default connectedCallback as sync so await can be used
            async connectedCallback(
                // call connectedCallback with parameter to *replace* SVG (of <load-file> persists)
                src = this.getAttribute("src"),
                // attach a shadowRoot if none exists (prevents displaying error when moving Nodes)
                shadowRoot = this.shadowRoot || this.attachShadow({mode:"open"})) {
                        // load SVG file from src="" async, parse to text, add to shadowRoot.innerHTML
                    shadowRoot.innerHTML = await (await fetch(src)).text()
                    // append optional <tag [shadowRoot]> Elements from inside <load-svg> after parsed <svg>
                    shadowRoot.append(...this.querySelectorAll("[shadowRoot]"))
                    // if "replaceWith" attribute 
                    // then replace <load-svg> with loaded content <load-svg>
                    // childNodes instead of children to include #textNodes also
                    this.hasAttribute("replaceWith") && this.replaceWith(...shadowRoot.childNodes)
            }
        })
    },

    is_element:function (element) {
        return element instanceof Element || element instanceof Document;  
    },
    
    clear(parent, self) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
        if(self){
            parent.parentElement.removeChild(parent);
        }
    },
    
    swap_classes(element, adds, removes, reverse) {
        [adds, removes] = reverse ? [removes, adds] : [adds, removes]
        removes.forEach(remove => { element.classList.remove(remove) });
        adds.forEach(add => { element.classList.add(add) });
    },

    byIDS(doc_root, ids){
        return ids.map(id => doc_root.getElementById(id))
    },
    
    configure: function(element, attributes) {
        for (let attr_name in attributes) {
            if (attributes.hasOwnProperty(attr_name)) {
                element.setAttribute(attr_name, attributes[attr_name]);
            }
        }
        return element;
    },
    adjust_rule:function(){ //https://alvarotrigo.com/blog/change-css-javascript/
        const stylesheet = document.styleSheets[2]; // Getting the stylesheet
        let elementRules;
        for(let i = 0; i < stylesheet.cssRules.length; i++) { // looping through all its rules and getting your rule
            if(stylesheet.cssRules[i].selectorText === '.element') {
                elementRules = stylesheet.cssRules[i];
            }
        }
        elementRules.style.setProperty('background', 'blue'); // modifying the rule in the stylesheet
    },
    style_overlay: function(overlay,width,height){
        let style = {
            position: 'absolute',
            width: `100%`,
            height: `100%`,
            left: '0%',
            display:'block',
            background: '#00000000'//'#21282C88'//'rgba(28, 105, 212, 0.95)'
        }
        HTML.style(overlay, style);
    },

    style_overlay_2: function(overlay,width,height){
        let style = {
            position: 'absolute',
            width: `${width}px`,
            height: `${height}px`,
            display:'block',
            background: '#000000FF'//'#21282C88'//'rgba(28, 105, 212, 0.95)'
        }
        HTML.style(overlay, style);
    },

    style: function(element, attributes){
        for (let [attr_name, val] of Object.entries(attributes)) {
            element.style[attr_name.replace(/[A-Z]/g, function(m, attr_name, o, s) { return "-" + m.toLowerCase(); })] = val+'';
          }
    },

    flex: function(element, attribute){
        HTML.style(element,{ display: 'flex', 'flex-direction': attribute}) 
    },

    visibility: function(shows, hides) {
        shows.forEach(show => { show.setAttribute("visibility", "visible"); });
        hides.forEach(hide => { hide.setAttribute("visibility", "hidden"); });
    },

    style_visibility: function(shows, hides) {
        shows.forEach(show => { 
            show.style.display = show.style._display ? show.style.display : 'block'
        });
        hides.forEach(hide => { 
            hide.style._display = hide.style.display
            hide.style.display = 'none'
        });
    },

    make: function(type,classnames,children,attributes,id,inner) {
        const html = document.createElement(type);
        // html.className = classname ? classname : '';   
        if (classnames){
            html.classList.add(...classnames.split(",").map(function(item) { return item.trim();}));     
        }
        html.id = id ? id : '';
        html.innerHTML = inner ? inner : '';
        // for (let attr_name in attributes) {
        //     if (attributes.hasOwnProperty(attr_name)) {
        //         html.setAttribute(attr_name, attributes[attr_name]);
        //     }
        // }
        HTML.configure(html,attributes);
        children.forEach(child => {
            html.appendChild(child);        
        });
        return html;
    },
    // put:function(parent,child, index){
    //     if (!index) {index = 0}

    //     if (parent != null && child != null) {
    //         if (index >= parent.children.length || index == -1) {
    //             parent.appendChild(child);
    //         } 
    //         else {
    //             parent.insertBefore(child, parent.children[index])
    //         }
    //     }
    // },
    put:function(parent, child, index, no_force, replace){
        if (!index) {index = 0}
        if (parent != null && child != null) {
            if (index >= parent.children.length || index == -1) {
                parent.appendChild(child);
            } 
            else {
                if(no_force && parent.children[index] != null){
                    return parent.children[index];
                }
                else if(replace && parent.children[index] != null){
                    parent.replaceChild(child, parent.children[index]);
                    return parent.children[index];
                }
                else{
                    parent.insertBefore(child, parent.children[index])
                }
                
            }
        }
        return child;
    },
    is_child:function(parent,candidate, index){
        if(index !== null && parent.children.length > index) { // child exists at index
            return parent.children[index] == candidate;
        }
        return candidate.parentNode == parent;
    },
    child_index:function(parent, candidate){
        if(parent !== null && candidate !== null && candidate.parentNode == parent) { // exists
            for(var i = 0, child = candidate; (child = child.previousSibling) != null; i++) {}
            return i;
        }
        // return Array.prototype.indexOf.call(parent.children, candidate);
        return -1;
    },
    index_exists:function(parent, index){
        return typeof parent.children[index] !== 'undefined'
    },
    
    position:function (element){ // https://usefulangle.com/post/181/jquery-position-pure-javascript
        return { top: element.offsetTop, left: element.offsetLeft,  };
    },
    translate:function (element, x, y){ // https://www.reddit.com/r/learnjavascript/comments/uy3zvd/how_to_set_the_offset_of_an_element_with_vanilla/
        element.style.transform = `translate(${x}, ${y})`
    },

    get_offset:function (element){ // https://usefulangle.com/post/179/jquery-offset-vanilla-javascript
        let rect = element.getBoundingClientRect();
        return {  top: rect.top + window.scrollY,  left: rect.left + window.scrollX,  };
    },

    set_offset:function (element, x, y ){ // https://www.reddit.com/r/learnjavascript/comments/uy3zvd/how_to_set_the_offset_of_an_element_with_vanilla/
        element.style.left = typeof(x)==='string' ? x : x+'px'
        element.style.top =  typeof(y)==='string' ? y : y+'px'
    },
    outer_height: function (el) {
        var height = el.offsetHeight;
        var style = getComputedStyle(el);
        height += parseInt(style.marginTop) + parseInt(style.marginBottom);
        return height;
    },
    computed: function (el, prop) {
        var style = getComputedStyle(el);
        return style[prop];
    },
    set_height: function (el, height)  { 
        // let width = el.offsetWidth;  // width and height in pixels, including padding and border. Corresponds to jQuery outerWidth()
        // width = el.clientWidth; // width and height in pixels, including padding, but without border. Corresponds to jQuery innerWidth()
        // el.style.height = width + 'px';
        el.style.height = height + 'px';
    },
    chain:function (root_object, path_string, force_type, last_value) {
        if (typeof path_string==="string"){
            const segments = path_string.split('/');
            return segments.reduce(function (parent_list, segment, index, array) {
                const parent = parent_list[0];
                const [type_index,css_class,innerhtml,id] = segment.split(':');
                var child;
                if(!isNaN(type_index)){
                    const child_index = parseInt(type_index);
                    if(HTML.index_exists(parent, child_index)) { // exists
                        child = parent.children[child_index];
                    }
                    else { // not exists
                        child = HTML.make('div', 'invisible-container', [], {})
                        HTML.put(parent,child,child_index);
                    }
                }
                else{
                    child = HTML.make(type_index,css_class, [], {}, (id?id:'') ,innerhtml);    
                    parent.appendChild(child);
                }
                parent_list.unshift(child);
                return parent_list;
            }, [root_object !== null? root_object : HTML.make('div', 'container', [], {})]).reverse();
        }
    },
    ladder:function (root_object, path_string, force_type, last_value) {
        root_object !== null? root_object : HTML.make('div', 'container', [], {})
        if (typeof path_string==="string"){
            const segments = path_string.split('/');
            return segments.map(function (segment, index, array) {
                const [type_index,css_class,innerhtml,id] = segment.split(':');
                var child;
                if(!isNaN(type_index)){
                    const child_index = parseInt(type_index);
                    if(HTML.index_exists(root_object, child_index)) { // exists
                        child = root_object.children[child_index];
                    }
                    else { // not exists
                        child = HTML.make('div', 'invisible-container', [], {})
                        HTML.put(root_object,child,child_index);
                    }
                }
                else{
                    child = HTML.make(type_index,css_class, [], {}, (id?id:'') ,innerhtml);    
                    root_object.appendChild(child);
                }
                return child;
            });
        }
    },
    titleCase:function(str) {
        if(typeof str==='string'){
            var splitStr = str.toLowerCase().split('_');
            for (var i = 0; i < splitStr.length; i++) {
                splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
            }
            return splitStr.join(' '); 
        }
        return str;
    },
    full_focus: function (e) {
        e.target.focus();
        // e.target.select();
        // e.target.setSelectionRange(0, e.target.value.length, 'forward')
    },
    visible:function (element,visibility) {
        element.style.display = visibility ? "block" : "none";
    },
    board:function(type,url,segments){
        const layout = HTML.make("div", HTML.board_types[type], [], {});
        segments.forEach(function(segment_count,index){
            const [segment,count] = segment_count;
            var [l,item, button] = HTML.chain(layout, "div:l-grid__item:/button:c-button:");
            var [image, span] = HTML.ladder(button, `img:c-button__icon:/span:c-button__label:${HTML.titleCase(segment)}`);
            HTML.configure(button,{"data-button" : HTML.get_color(index)});
            HTML.configure(image,{src: HTML.get_src(url+'channels/', segment)});
			button.addEventListener('click', () => { HTML.board_button(button); },true);
        });
        // var container = HTML.make("div", "invisible-container", [layout], {});
        return layout;
    },
    get_color:function(index){
        return HTML.colors[HTML.colors.length % index];
    },
    get_src:function(url, name){
        return url + name + ".svg";
    },
    board_button : function(button){
        let buttonState = button.classList.contains('c-button--active')
        let buttonType = button.dataset.button
        buttonState ? button.classList.remove(`u-text--${buttonType}`) : button.classList.add(`u-text--${buttonType}`);
        button.classList.toggle('c-button--active');
    },
    channel_submitter: function(program, agent, func, parseltongue, name, form, submitters, css_prefix, submitter_text){
        var [s, submitter, icon] = HTML.chain(submitters,`button:${css_prefix}submitter:/img:${css_prefix}button-image::`);
        HTML.configure(icon, {src:`../../../../../Environments/Base/image/svg+xml/channels/${name}.svg`});
        if(submitter_text){
            let label =  HTML.ladder(submitter, `span:${css_prefix}submitter_label:${HTML.titleCase(name.replaceAll('/',' '))}`);
        }
        else{
            HTML.configure(submitter,{title:HTML.titleCase(name.replaceAll('/',' '))});
        }
        // submitter_text ? HTML.ladder(submitter, `span:${css_prefix}submitter_label:${HTML.titleCase(name.replaceAll('/',' '))}`) : null;
        submitter.addEventListener('click', function (e) {
            program.queue(agent, func, parseltongue, form, submitter);
        }, false);
        HTML.configure(submitter, {type:'button', 'data-button':"purple"});
        // var [ring] = HTML.ladder(submitter, `progress-ring::`);
        // HTML.configure(ring, {stroke:"40", radius:"60", progress:"95", status:'in-progress'});
        return submitter;

    },
    blue_pill: function(program, command, name, form, settings){
        let css_prefix = settings.row ? 'row-' : 'col-';
        let [agent, func, parseltongue] = command.split('.');
        let icon = HTML.make('i', `icon ion-md-lock`, [], {});
        let bb = HTML.make("button", `button ${css_prefix}button ${css_prefix}blue`, [icon], {type:'button'},'',HTML.titleCase(name));
        bb.addEventListener('click', function (e) {
            program.queue(agent, func, parseltongue, form, bb);
        }, false);
        
        // var [ring] = HTML.ladder(bb, `progress-ring::`);
        // HTML.configure(ring, {stroke:"40", radius:"60", progress:"95", status:'in-progress'});
        return bb;

    },

    create_program: function(program, modules) {

        // let row = true;
        // let editable = true;
        // let header = true;
        // let submitter_text = true;

        let row = false;
        let editable = false;
        let header = true;
        let submitter_text = true;

        let css_prefix = row ? 'row-' : 'col-';
        
        const brand_logo = HTML.make("img", "brand-logo", [], {src:"../../../../../Environments/Medusa/Medallion.png"});
        var container = HTML.make("div", row?"row-container":"container", [brand_logo], {});
        container.forms = new Map();

        for (let mname in modules) {
            if (modules.hasOwnProperty(mname) && typeof modules[mname]==='object') {
                const module = modules[mname]; // option
                const form = HTML.make("form", row?"invisible-row-container":"", [], {});
                // header ?  HTML.chain(form,`div:${css_prefix}header:${mname.toLocaleUpperCase()}`) : null;
                header ?  HTML.chain(form,`div:${css_prefix}header:${location.hostname.toLocaleUpperCase()}`) : null;
                var [f, field_seperator] = HTML.chain(form,'div:line:');
                if (module.hasOwnProperty('gatepass') && typeof module['gatepass']==='object') {
                    const gatepass = module['gatepass']; //gatepass
                    
                    for (let field_name in gatepass) {
                        if (gatepass.hasOwnProperty(field_name)) {
                            var [f,label,input] = HTML.chain(form,`label:${css_prefix}label:/input:${css_prefix}input:`);
                            HTML.configure(input,{type : gatepass[field_name], placeholder : HTML.titleCase(field_name)});
                            input.addEventListener('click', HTML.full_focus, false);
                        }
                    }

                }
                
                let channels = module['channel'];
                var [f, submitters] = HTML.chain(form,`div:${css_prefix}submitters:`);

                const submitters_out = Object.keys(channels).map((key, index) => {
                    let channel = channels[key];
                    let [agent, func, parseltongue] = channel.split('.');
                    return HTML.channel_submitter(program, agent, func , parseltongue, key, form, submitters, css_prefix, submitter_text) 
                });
                container.forms.set(mname,form);
                
            }
        }

        let index = 0;
        var [f, field_seperator] = HTML.chain(container,'div:line:');
        for(const [option_name, form] of container.forms.entries()) {
            if(index===0){
                HTML.put(container, form ,1);
            }
            var [container, option_button] = HTML.chain(container, `button:button ${css_prefix}button ${css_prefix}blue:${HTML.titleCase(option_name)}/i:icon ion-md-lock:`);
            HTML.configure(option_button, {type:'button'});
            option_button.addEventListener('click', function (e) {
                let form_position = 1;
                container.replaceChild(container.forms.get(option_name), container.children[form_position]);
            }, false);
            index++;
        }
        var [f, seperator] = HTML.chain(container,'div:line:');
        return container;
    },
    create_input: function(container, name, type, value, settings) {
        let css_prefix = settings.row ? 'row-' : 'col-';
        let t_name = HTML.titleCase(name)
        if(settings.force_label){
            const field = HTML.make("div", "block-field", [], {});
            var [label,input] = HTML.ladder(field,`label:block-label:/input:${css_prefix}input:`);
            label.textContent = t_name;
            container.appendChild(field);
        }
        else{
            var [f,label,input] = HTML.chain(container,`label:${css_prefix}label:/input:${css_prefix}input:`);
        }
        HTML.configure(input,{type : type, placeholder : t_name});
        input.value = value;
        input.addEventListener('click', HTML.full_focus, false);
    },
    create_block: function(program, in_container, name, object, commands, settings) {
        if(object!=null){
            let css_prefix = settings.row ? 'row-' : 'col-';
            var container = in_container != null ? in_container:  HTML.make("div", settings.row?"row-container":"container", [], {});
            if(settings.prepend){
                container.appendChild(settings.prepend);
            }
            if(settings.logo){
                const logo = HTML.make("img", "brand-logo", [], {src:settings.logo});
                container.appendChild(logo)
            }

            const form = HTML.make("form", settings.row?"invisible-row-container":"", [], {});
            settings.header ?  HTML.chain(form,`div:${css_prefix}header:${name.toLocaleUpperCase()}`) : null;

            let channels = new Set();

            if (object != null) {
                const object_type = typeof object;
                if (Array.isArray(object) || object instanceof Set) {
                    object.forEach(function(field, index){
                        if (field != null) {
                            const field_type = typeof field;
                            if (field_type=== "object") { 
                                // channels.add(`${index}:${object instanceof Set ? 'set':'array'}`); 
                                channels.add(`${index}`); 
                            }
                            else if (field_type=== "string" || field_type=== "number") { 
                                HTML.create_input(form, index+'','text', field, settings); }
                        }
                    });
                } 
                else if (object instanceof Map) {
                    object.forEach(function(field, key){
                        if (field != null) {
                            const field_type = typeof field;
                            if (field_type=== "object") { 
                                // channels.add(`${key}:${field_type}`); 
                                channels.add(`${key}`); 
                            }
                            else if (field_type=== "string" || field_type=== "number") { 
                                HTML.create_input(form, key,'text', field, settings); }
                        }
                    });
                }
                else if (object_type === "object" || object_type === "function") {
                    for (let field_name in object) {
                        if (object.hasOwnProperty(field_name)) {
                            const field = object[field_name];
                            if (field != null) {
                                const field_type = typeof field;
                                if (field_type=== "object") { 
                                    // channels.add(`${field_name}:${field_type}`);
                                    channels.add(`${field_name}`);
                                }
                                else if (field_type=== "string" || field_type=== "number") {
                                    HTML.create_input(form, field_name,'text', field, settings); }
                            }
                        }
                    }
                }
                
                else if (["number","string"].includes(object_type) ) {
                    HTML.create_input(form, name,'text', object, settings); 
                }
            }

            var [f, submitters] = HTML.chain(form,`div:${css_prefix}submitters:`);
            const submitters_out = Object.keys(commands).map((key, index) => {
                let command = commands[key];
                let [agent, func, parseltongue] = command.split('.');
                return HTML.channel_submitter(program, agent, func , parseltongue, key, form, submitters, css_prefix, settings.submitter_text) 
            });
            //   const submitters_out = commands.map(command => {
            //       let [agent, func, parseltongue] = command.split('.');
            //       return HTML.channel_submitter(program, agent, func , parseltongue, func, form, submitters, css_prefix, settings.submitter_text) 
            //   });
            container.appendChild(form);
            return [container, channels, submitters_out];
        }
        return [];
        
    },   

    load_blocks:function(program, name, object, commands, settings){
        var all_channels = new Set();
        var all_blocks = [];
        if (object != null) {
            const object_type = typeof object;
            if (Array.isArray(object) || object instanceof Set || object instanceof Map) {
                object.forEach(function(child, index_key){
                    let setting = Object.assign({},settings);
                    if(child.hasOwnProperty('logo')){ 
                        Object.assign(setting,{logo:child['logo']}); 
                    }
                    var [block, channels, submitters] = HTML.create_block(program, null, index_key+'', child, commands , setting);
                    // let all_channels = new Set([...channels].filter(x => b.has(x)));
                    // all_channels = new Set([...all_channels, ...channels]);
                    if(Parseltongue.expandable(child)){
                        all_channels.add(index_key);
                    }
                    all_blocks.push(block);
                });
            } 
            else if (object_type === "object"  || object_type === "function") {                
                for (let field_name in object) {
                    if (object.hasOwnProperty(field_name)) {
                        const field = object[field_name];
                        let setting = Object.assign({},settings);
                        if(field_name==='logo'){ 
                            Object.assign(setting,{logo:field}); 
                        }
                        if(field!=null){
                            if(field.hasOwnProperty('logo')){ 
                                Object.assign(setting,{logo:field['logo']}); 
                            }
                            var [block, channels, submitters] = HTML.create_block(program, null, field_name, field, commands , setting);
                            // all_channels = new Set([...all_channels, ...channels]);
                            if(Parseltongue.expandable(field)){
                                all_channels.add(field_name);
                            }
                            all_blocks.push(block);
                        }
                    }
                }
            }
            else if (["number","string"].includes(object_type) ) {
                let setting = Object.assign({},settings);
                if(name==='logo'){ 
                    Object.assign(setting,{logo:object}); 
                }
                var [block, channels, submitters] = HTML.create_block(program, null, payload.attribute, object, commands , setting);
                all_blocks.push(block);                
            }
        }
        return [all_channels, all_blocks]
    },


}
window.HTML = HTML