
export let SVG = { //https://www.hongkiat.com/blog/svg-animations/
    colors: [  "red", "blue", "green", "orange", "yellow", "teal", "indigo", "purple", "pink"],
    board_types : {column:'',row:'row',grid:'l-grid'},

    configure: function(element, attributes, skip_dash) {
        for (var attr_name in attributes){ // https://www.py4u.net/discuss/975238
            if(skip_dash){
                element.setAttributeNS(null, attr_name , attributes[attr_name]);
            }else{
                element.setAttributeNS(null, attr_name.replace(/[A-Z]/g, function(m, attr_name, o, s) { return "-" + m.toLowerCase(); }), attributes[attr_name]);
            }
            
        }
        return element;
    },

    style: function(element, attributes){
        for (let [attr_name, val] of Object.entries(attributes)) {
            element.style[attr_name.replace(/[A-Z]/g, function(m, attr_name, o, s) { return "-" + m.toLowerCase(); })] = val+'';
          }
    },

    draw_line: function(element, array, offset) {
        if(array!=null && array.length){ 
            element.setAttribute("stroke-dasharray", array.join(','));}
        if(offset!=null){ 
            element.setAttribute("stroke-dashoffset", offset+""); }
    },

    make: function(type,classname,children,attributes,id,inner) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", type);
        svg.setAttribute('class', classname ? classname : '');
        // svg.className = classname ? classname : '';        
        svg.id = id ? id : '';
        svg.innerHTML = inner ? inner : '';
        SVG.configure(svg,attributes);
        children.forEach(child => { svg.appendChild(child); });
        return svg;
    },
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
    clear:function(element){
        while (element.firstChild) { element.removeChild(element.firstChild); }
    },
    chain:function (root_object, path_string, force_type, last_value) {
        if (typeof path_string==="string"){
            const segments = path_string.split('/');
            return segments.reduce(function (parent_list, segment, index, array) {
                const parent = parent_list[0];
                const [type_index,css_class,innerhtml] = segment.split(':');
                var child;
                if(!isNaN(type_index)){
                    const child_index = parseInt(type_index);
                    if(SVG.index_exists(parent, child_index)) { // exists
                        child = parent.children[child_index];
                    }
                    else { // not exists
                        child = SVG.make('svg', 'invisible-container', [], {})
                        SVG.put(parent,child,child_index);
                    }
                }
                else{
                    child = SVG.make(type_index,css_class, [], {},'',innerhtml);    
                    parent.appendChild(child);
                }
                parent_list.unshift(child);
                return parent_list;
            }, [root_object !== null? root_object : SVG.make('svg', 'container', [], {})]).reverse();
        }
    },
    ladder:function (root_object, path_string, force_type, last_value, test) {
        root_object != null ? root_object : SVG.make('svg', 'container', [], {})
        if (typeof path_string==="string"){
            const segments = path_string.split('/');
            return segments.map(function (segment, index, array) {
                const [type_index, css_class, innerhtml] = segment.split(':');
                var child = false;
                if(!isNaN(type_index)){
                    const child_index = parseInt(type_index);
                    if(SVG.index_exists(root_object, child_index)) { // exists
                        child = test ? true : root_object.children[child_index];
                    }
                    else { // not exists
                        child = test ? false : SVG.make('svg', 'invisible-container', [], {});
                        test ? false : SVG.put(root_object,child,child_index);
                    }
                }
                else{
                    child = child = test ? false : SVG.make(type_index,css_class, [], {},'',innerhtml);    
                    test ? false : root_object.appendChild(child);
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
        e.target.select();
        e.target.setSelectionRange(0, e.target.value.length, 'forward')
    },

	Init:function(evt) {
		SVGRoot = document.getElementById('bewaar_holder');
	   // SVGRoot = SVGDocument.documentElement;
	
		// these svg points hold x and y values...
		//    very handy, but they do not display on the screen (just so you know)
		TrueCoords = SVGRoot.createSVGPoint();
		GrabPoint = SVGRoot.createSVGPoint();
		// this will serve as the canvas over which items are dragged.
		//    having the drag events occur on the mousemove over a backdrop
		//    (instead of the dragged element) prevents the dragged element
		//    from being inadvertantly dropped when the mouse is moved rapidly
		BackDrop = document.getElementById('BackDrop');
	},

	Grab: function(evt) {
		// find out which element we moused down on
		var targetElement = evt.target;
	
		// you cannot drag the background itself, so ignore any attempts to mouse down on it
		if (BackDrop != targetElement) {
			//set the item moused down on as the element to be dragged
			DragTarget = targetElement;
			DragTarget.parentNode.appendChild(DragTarget);
			DragTarget.setAttributeNS(null, 'pointer-events', 'none');
			var transMatrix = DragTarget.getCTM();
			GrabPoint.x = TrueCoords.x - Number(transMatrix.e);
			GrabPoint.y = TrueCoords.y - Number(transMatrix.f);
	
		}
	},

	Drag:function(evt) {
		GetTrueCoords(evt);
		if (DragTarget) {
			var newX = TrueCoords.x - GrabPoint.x;
			var newY = TrueCoords.y - GrabPoint.y;
			DragTarget.setAttributeNS(null, 'transform', 'translate(' + newX + ',' + newY + ')');
		}
	},

	Drop:function(evt) {
		if (DragTarget) {
			var targetElement = evt.target;
			DragTarget.setAttributeNS(null, 'pointer-events', 'all');
			if ('Folder' == targetElement.parentNode.id) {
				targetElement.parentNode.appendChild(DragTarget);
				alert(DragTarget.id + ' has been dropped into a folder, and has been inserted as a child of the containing group.');
			} else {
				alert(DragTarget.id + ' has been dropped on top of ' + targetElement.id);
			}
			DragTarget = null;
		}
	},

	GetTrueCoords:function(evt) {
		var newScale = SVGRoot.currentScale;
		var translation = SVGRoot.currentTranslate;
		TrueCoords.x = (evt.clientX - translation.x) / newScale;
		TrueCoords.y = (evt.clientY - translation.y) / newScale;
	},

    visible:function (element,visibility) {
        element.style.display = visibility ? "block" : "none";
    },
    board:function(type,url,segments){
        const layout = SVG.make("svg", SVG.board_types[type], [], {});
        segments.forEach(function(segment_count,index){
            const [segment,count] = segment_count;
            var [l,item, button] = SVG.chain(layout, "svg:l-grid__item:/button:c-button:");
            var [image, span] = SVG.ladder(button, `img:c-button__icon:/span:c-button__label:${SVG.titleCase(segment)}`);
            SVG.configure(button,{"data-button" : SVG.get_color(index)});
            SVG.configure(image,{src: SVG.get_src(url+'channels/', segment)});
			button.addEventListener('click', () => { SVG.board_button(button); },true);
        });
        // var container = SVG.make("svg", "invisible-container", [layout], {});
        return layout;
    },
    get_color:function(index){
        return SVG.colors[SVG.colors.length % index];
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
        var [s, submitter, icon] = SVG.chain(submitters,`button:${css_prefix}submitter:/img:${css_prefix}button-image::`);
        SVG.configure(icon, {src:`../../../../../Environments/Base/image/svg+xml/channels/${name}.svg`});
        if(submitter_text){
            let label =  SVG.ladder(submitter, `span:${css_prefix}submitter_label:${SVG.titleCase(name.replaceAll('/',' '))}`);
        }
        else{
            SVG.configure(submitter,{title:SVG.titleCase(name.replaceAll('/',' '))});
        }
        // submitter_text ? SVG.ladder(submitter, `span:${css_prefix}submitter_label:${SVG.titleCase(name.replaceAll('/',' '))}`) : null;
        submitter.addEventListener('click', function (e) {
            program.queue(agent, func, parseltongue, form, submitter);
        }, false);
        SVG.configure(submitter, {type:'button', 'data-button':"purple"});
        // var [ring] = SVG.ladder(submitter, `progress-ring::`);
        // SVG.configure(ring, {stroke:"40", radius:"60", progress:"95", status:'in-progress'});
        return submitter;

    },
    blue_pill: function(program, command, name, form, settings){
        let css_prefix = settings.row ? 'row-' : 'col-';
        let [agent, func, parseltongue] = command.split('.');
        let icon = SVG.make('i', `icon ion-md-lock`, [], {});
        let bb = SVG.make("button", `button ${css_prefix}button ${css_prefix}blue`, [icon], {type:'button'},'',SVG.titleCase(name));
        bb.addEventListener('click', function (e) {
            program.queue(agent, func, parseltongue, form, bb);
        }, false);
        
        // var [ring] = SVG.ladder(bb, `progress-ring::`);
        // SVG.configure(ring, {stroke:"40", radius:"60", progress:"95", status:'in-progress'});
        return bb;

    },

    create_program: function(program, modules) {

        // let row = true;
        // let editable = true;
        // let header = true;
        // let submitter_text = true;

        let row = false;
        let editable = false;
        let header = false;
        let submitter_text = false;

        let css_prefix = row ? 'row-' : 'col-';
        
        const brand_logo = SVG.make("img", "brand-logo", [], {src:"../../../../../Environments/Medusa/Medallion.png"});
        var container = SVG.make("svg", row?"row-container":"container", [brand_logo], {});
        container.forms = new Map();

        for (let mname in modules) {
            if (modules.hasOwnProperty(mname) && typeof modules[mname]==='object') {
                const module = modules[mname]; // option
                const form = SVG.make("form", row?"invisible-row-container":"", [], {});
                header ?  SVG.chain(form,`svg:${css_prefix}header:${mname.toLocaleUpperCase()}`) : null;
                var [f, field_seperator] = SVG.chain(form,'svg:line:');
                if (module.hasOwnProperty('gatepass') && typeof module['gatepass']==='object') {
                    const gatepass = module['gatepass']; //gatepass
                    
                    for (let field_name in gatepass) {
                        if (gatepass.hasOwnProperty(field_name)) {
                            var [f,label,input] = SVG.chain(form,`label:${css_prefix}label:/input:${css_prefix}input:`);
                            SVG.configure(input,{type : gatepass[field_name], placeholder : SVG.titleCase(field_name)});
                            input.addEventListener('click', SVG.full_focus, false);
                        }
                    }

                }
                
                let channels = module['channel'];
                var [f, submitters] = SVG.chain(form,`svg:${css_prefix}submitters:`);

                const submitters_out = Object.keys(channels).map((key, index) => {
                    let channel = channels[key];
                    let [agent, func, parseltongue] = channel.split('.');
                    return SVG.channel_submitter(program, agent, func , parseltongue, key, form, submitters, css_prefix, submitter_text) 
                });
                container.forms.set(mname,form);
                
            }
        }

        let index = 0;
        var [f, field_seperator] = SVG.chain(container,'svg:line:');
        for(const [option_name, form] of container.forms.entries()) {
            if(index===0){
                SVG.put(container,form ,1);
            }
            var [container, option_button] = SVG.chain(container, `button:button ${css_prefix}button ${css_prefix}blue:${SVG.titleCase(option_name)}/i:icon ion-md-lock:`);
            SVG.configure(option_button, {type:'button'});
            option_button.addEventListener('click', function (e) {
                let form_position = 1;
                container.replaceChild(container.forms.get(option_name), container.children[form_position]);
            }, false);
            index++;
        }
        var [f, seperator] = SVG.chain(container,'svg:line:');
        return container;
    },
    
    create_input: function(container, name, type, value, settings) {
        let css_prefix = settings.row ? 'row-' : 'col-';
        let t_name = SVG.titleCase(name)
        if(settings.force_label){
            const field = SVG.make("svg", "block-field", [], {});
            var [label,input] = SVG.ladder(field,`label:block-label:/input:${css_prefix}input:`);
            label.textContent = t_name;
            container.appendChild(field);
        }
        else{
            var [f,label,input] = SVG.chain(container,`label:${css_prefix}label:/input:${css_prefix}input:`);
        }
        SVG.configure(input,{type : type, placeholder : t_name});
        input.value = value;
        input.addEventListener('click', SVG.full_focus, false);
    },

    create_block: function(program, in_container, name, object, commands, settings) {
        if(object!=null){
            let css_prefix = settings.row ? 'row-' : 'col-';
            var container = in_container != null ? in_container:  SVG.make("svg", settings.row?"row-container":"container", [], {});
            if(settings.prepend){
                container.appendChild(settings.prepend);
            }
            if(settings.logo){
                const logo = SVG.make("img", "brand-logo", [], {src:settings.logo});
                container.appendChild(logo)
            }

            const form = SVG.make("form", settings.row?"invisible-row-container":"", [], {});
            settings.header ?  SVG.chain(form,`svg:${css_prefix}header:${name.toLocaleUpperCase()}`) : null;

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
                                SVG.create_input(form, index+'','text', field, settings); }
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
                                SVG.create_input(form, key,'text', field, settings); }
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
                                    SVG.create_input(form, field_name,'text', field, settings); }
                            }
                        }
                    }
                }
                
                else if (["number","string"].includes(object_type) ) {
                    SVG.create_input(form, name,'text', object, settings); 
                }
            }

            var [f, submitters] = SVG.chain(form,`svg:${css_prefix}submitters:`);
            const submitters_out = Object.keys(commands).map((key, index) => {
                let command = commands[key];
                let [agent, func, parseltongue] = command.split('.');
                return SVG.channel_submitter(program, agent, func , parseltongue, key, form, submitters, css_prefix, settings.submitter_text) 
            });
            //   const submitters_out = commands.map(command => {
            //       let [agent, func, parseltongue] = command.split('.');
            //       return SVG.channel_submitter(program, agent, func , parseltongue, func, form, submitters, css_prefix, settings.submitter_text) 
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
                    var [block, channels, submitters] = SVG.create_block(program, null, index_key+'', child, commands , setting);
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
                            var [block, channels, submitters] = SVG.create_block(program, null, field_name, field, commands , setting);
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
                var [block, channels, submitters] = SVG.create_block(program, null, payload.attribute, object, commands , setting);
                all_blocks.push(block);                
            }
        }
        return [all_channels, all_blocks]
    },


}


	// https://stackoverflow.com/questions/34591863/dynamically-add-a-full-svg-shape-with-pure-javascript
	// var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	// svg.setAttribute('width','200');
	// svg.setAttribute('height','200');
	// document.body.appendChild(svg);

	// var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	// path.setAttribute('d','M100,0 L200,100 100,200 0,100Z');
	// path.setAttribute('fill','red');
	// svg.appendChild(path);

	// https://stackoverflow.com/questions/27489143/dynamic-svg-element-added-by-javascript-doesnt-work
	// function doit()
	// {
	// 	var svgdiv = document.getElementById('svg1');
	// 	for (var k = 1; k < 3; ++k)
	// 	{
	// 		var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	// 		svg.setAttribute('width',100);
	// 		svg.setAttribute('height',100);
	// 		console.log(svg);
	// 		var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	// 		c.setAttribute('cx',50);
	// 		c.setAttribute('cy',50);
	// 		c.setAttribute('r',40);
	// 		c.setAttribute('stroke','green');
	// 		c.setAttribute('stroke-width',4);
	// 		c.setAttribute('fill','yellow');
	// 		svg.appendChild(c);
	// 		svgdiv.appendChild(svg);
	// 	}
	// }

	// // https://www.py4u.net/discuss/975238
	// function getNode(n, v) {
	// 	n = document.createElementNS("http://www.w3.org/2000/svg", n);
	// 	for (var p in v)
	// 	  n.setAttributeNS(null, p.replace(/[A-Z]/g, function(m, p, o, s) { return "-" + m.toLowerCase(); }), v[p]);
	// 	return n
	//   }
	  
	//   var svg = getNode("svg");
	//   document.body.appendChild(svg);
	  
	//   var r = getNode('rect', { x: 10, y: 10, width: 100, height: 20, fill:'#ff00ff' });
	//   svg.appendChild(r);
	  
	//   var r = getNode('rect', { x: 20, y: 40, width: 100, height: 40, rx: 8, ry: 8, fill: 'pink', stroke:'purple', strokeWidth:7 });
	//   svg.appendChild(r);


	//   https://stackoverflow.com/questions/24202104/svg-drag-and-drop?rq=1
	// <svg id="bewaar_holder" xmlns="http://www.w3.org/2000/svg" width="800" height="200" onload="Init(evt)" onmousedown="Grab(evt)" onmousemove="Drag(evt)" onmouseup="Drop(evt)">
    // <rect id="rect1" x="10" y="10" width="10" height="10"/>
    // <rect id="rect2" x="100" y="100" width="100" height="100"/>div
    // </svg>
	// svg{border: 1px solid black;}

	// var SVGDocument = null;
	// var SVGRoot = null;
	
	// var TrueCoords = null;
	// var GrabPoint = null;
	// var BackDrop = null;
	// var DragTarget = null;
	
	// function Init(evt) {
	// 	SVGRoot = document.getElementById('bewaar_holder');
	//    // SVGRoot = SVGDocument.documentElement;
	
	// 	// these svg points hold x and y values...
	// 	//    very handy, but they do not display on the screen (just so you know)
	// 	TrueCoords = SVGRoot.createSVGPoint();
	// 	GrabPoint = SVGRoot.createSVGPoint();
	// 	// this will serve as the canvas over which items are dragged.
	// 	//    having the drag events occur on the mousemove over a backdrop
	// 	//    (instead of the dragged element) prevents the dragged element
	// 	//    from being inadvertantly dropped when the mouse is moved rapidly
	// 	BackDrop = document.getElementById('BackDrop');
	// }
	
	// function Grab(evt) {
	// 	// find out which element we moused down on
	// 	var targetElement = evt.target;
	
	// 	// you cannot drag the background itself, so ignore any attempts to mouse down on it
	// 	if (BackDrop != targetElement) {
	// 		//set the item moused down on as the element to be dragged
	// 		DragTarget = targetElement;
	
	// 		// move this element to the "top" of the display, so it is (almost)
	// 		//    always over other elements (exception: in this case, elements that are
	// 		//    "in the folder" (children of the folder group) with only maintain
	// 		//    hierarchy within that group
	// 		DragTarget.parentNode.appendChild(DragTarget);
	
	// 		// turn off all pointer events to the dragged element, this does 2 things:
	// 		//    1) allows us to drag text elements without selecting the text
	// 		//    2) allows us to find out where the dragged element is dropped (see Drop)
	// 		DragTarget.setAttributeNS(null, 'pointer-events', 'none');
	
	// 		// we need to find the current position and translation of the grabbed element,
	// 		//    so that we only apply the differential between the current location
	// 		//    and the new location
	// 		var transMatrix = DragTarget.getCTM();
	// 		GrabPoint.x = TrueCoords.x - Number(transMatrix.e);
	// 		GrabPoint.y = TrueCoords.y - Number(transMatrix.f);
	
	// 	}
	// };
	
	
	// function Drag(evt) {
	// 	// account for zooming and panning
	// 	GetTrueCoords(evt);
	
	// 	// if we don't currently have an element in tow, don't do anything
	// 	if (DragTarget) {
	// 		// account for the offset between the element's origin and the
	// 		//    exact place we grabbed it... this way, the drag will look more natural
	// 		var newX = TrueCoords.x - GrabPoint.x;
	// 		var newY = TrueCoords.y - GrabPoint.y;
	
	// 		// apply a new tranform translation to the dragged element, to display
	// 		//    it in its new location
	// 		DragTarget.setAttributeNS(null, 'transform', 'translate(' + newX + ',' + newY + ')');
	// 	}
	// };
	
	
	// function Drop(evt) {
	// 	// if we aren't currently dragging an element, don't do anything
	// 	if (DragTarget) {
	// 		// since the element currently being dragged has its pointer-events turned off,
	// 		//    we are afforded the opportunity to find out the element it's being dropped on
	// 		var targetElement = evt.target;
	
	// 		// turn the pointer-events back on, so we can grab this item later
	// 		DragTarget.setAttributeNS(null, 'pointer-events', 'all');
	// 		if ('Folder' == targetElement.parentNode.id) {
	// 			// if the dragged element is dropped on an element that is a child
	// 			//    of the folder group, it is inserted as a child of that group
	// 			targetElement.parentNode.appendChild(DragTarget);
	// 			alert(DragTarget.id + ' has been dropped into a folder, and has been inserted as a child of the containing group.');
	// 		} else {
	// 			// for this example, you cannot drag an item out of the folder once it's in there;
	// 			//    however, you could just as easily do so here
	// 			alert(DragTarget.id + ' has been dropped on top of ' + targetElement.id);
	// 		}
	
	// 		// set the global variable to null, so nothing will be dragged until we
	// 		//    grab the next element
	// 		DragTarget = null;
	// 	}
	// };
	
	
	// function GetTrueCoords(evt) {
	// 	// find the current zoom level and pan setting, and adjust the reported
	// 	//    mouse position accordingly
	// 	var newScale = SVGRoot.currentScale;
	// 	var translation = SVGRoot.currentTranslate;
	// 	TrueCoords.x = (evt.clientX - translation.x) / newScale;
	// 	TrueCoords.y = (evt.clientY - translation.y) / newScale;
	// };