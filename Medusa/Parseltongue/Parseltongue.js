
import { HTML } from "./HTML/HTML.js";
import { SVG } from "./SVG/SVG.js";
import { Codex as X } from "./Codex/Codex.js";

export let Parseltongue = {
	clean:(text)=>{
		// return text.replace(/\s+/g,' ').trim(); /* " this contains   spaces ".replace(/\s+/g,' ').trim(); */
        text = text.replace(new RegExp('\\s+'), ' ').trim()
        text = text.replace(new RegExp('\\s*:\\s*'), ':').trim()
        text = text.replace(new RegExp('\\s*/\\s*'), '/').trim()
        text = text.replace(new RegExp('\\s*>\\s*'), '>').trim()
        text = text.replace(new RegExp('\\s*<\\s*'), '<').trim()
        text = text.replace(new RegExp('\\s*,\\s*'), ',').trim()
        // text = text.replace(new RegExp('\\s*|\\s*'), '|').trim()
        text = text.replace(new RegExp('^,+'), '').trim()
        return text
	},
	// dialect: { HTML, SVG },
	is_float(value, number_only){
		const val_type = typeof value
		if(val_type==='number'){
			return Number(value) === value && value % 1 !== 0;
		}
		else if(val_type==='string' && !number_only){
			/[\.]/.test(value)// /[\.]/.test(String(120.5))
		}
		return false
	},
	script_rules:["follow page rules"],
	key_rules:["post tokens,keyboard on enter key",'draw tokens, keyboard on every key'],
	underscore_rgx : new RegExp('_', 'i'),
	on_key_rgx :	 new RegExp(/\bon(.*)key$/, 'i'),
	arg_splitter : ',',
	initialize: function(Ui, element) {
		Parseltongue.Ui = Ui;
		return Parseltongue;
	},
	alert:(script)=>{
		alert(script);
		return 'alerted';
	},
	is_subobject:(object, name)=>{
		return object.hasOwnProperty(name) && typeof object[name]==='object'
	},
	key_rules_filter:(rule)=>{
		return Parseltongue.on_key_rgx.test(rule);
	},
	key_rules_map:(rule)=>{
		var phrase_rgx = Parseltongue.on_key_rgx; /* var cmd_rgx = new RegExp(' key$', 'i'); /* cow(.*)milk || // var key_rgx = new RegExp('\$(\w+)\$\s*$', 'i'); */ 
		if(phrase_rgx.test(rule)){
			var key = rule.match(phrase_rgx)[1].trim().toLowerCase();
			rule = rule.replace(phrase_rgx,(str) => ``); 
			return [key, rule];
		}
	},
	key: function(e) {
		var callee = arguments.callee.toString();
		var log = Parseltongue.key_rules.
					filter(Parseltongue.key_rules_filter).
						map(Parseltongue.key_rules_map).
							map((key_rule)=>{
								var [key, rule] = key_rule;
								var e_key = e.key.toLowerCase();
								if( key==='every' || key===e_key){ return Parseltongue.execute(rule); }}).
								join(' , ');
		console.log(log);},
	'check execute': (gatepass, script, payload)=>{ // Object.values( imgs ).filter( s => typeof s === 'function' ).forEach( s => s() ); //filter out values which are function
		script=script.trim();
		return Object.values(Parseltongue).filter(Parseltongue.function_filter).
				/* map(Parseltongue.function_map).map(name_function => { */
					map(funktion => {
						let [name,fn] = [funktion.name, funktion] //var [name,fn]=name_function;
						name = name.replace(Parseltongue.underscore_rgx, (str) => ` `).trim();
						var fn_rgx = new RegExp('^' + name+' ', 'i');
						if (fn_rgx.test(script)) {
							try {
								script=script.replace(fn_rgx, (str) => ` `).trim();
								return fn.apply(null,[gatepass, script, payload]); /* return fn.call(script); */
							}
							catch (e) { /* work in case there is an error */
								// throw e;
								return 'exception '+e;
							}
						}
					});
	},
	
	sort: (array, ...attrs)=>{ // https://stackoverflow.com/questions/6913512/how-to-sort-an-array-of-objects-by-multiple-fields
		let predicates = attrs.map(pred => { // generate an array of predicate-objects contains property getter, and descending indicator
			let descending = pred.charAt(0) === '-' ? -1 : 1;
			pred = pred.replace(/^-/, '');
			return { getter: o => o[pred], descend: descending };
		});
		// Object.entries(animals).forEach(([key, value]) => {
		//	 console.log(`${key}: ${value}`)
		// });
		return array.map(item => { // schwartzian transform idiom implementation. aka: "decorate-sort-undecorate"
			return {
				src: item,
				compareValues: predicates.map(predicate => predicate.getter(item))
			};
		})
		.sort((o1, o2) => {
			let i = -1, result = 0;
			while (++i < predicates.length) {
			if (o1.compareValues[i] < o2.compareValues[i]) result = -1;
			if (o1.compareValues[i] > o2.compareValues[i]) result = 1;
			if (result *= predicates[i].descend) break;
			}
			return result;
		})
		.map(item => item.src);
		// let games = [
		//	 { name: 'Pako',			  rating: 4.21 },
		//	 { name: 'Hill Climb Racing', rating: 3.88 },
		//	 { name: 'Angry Birds Space', rating: 3.88 },
		//	 { name: 'Badland',		   rating: 4.33 }];
		//   console.log(sortByAttribute(games, 'name')); //   // sort by one attribute
		//   console.log(sortByAttribute(games, '-rating', 'name')); //   // sort by mupltiple attributes
		  
	},
	'request process': (neo, parseltongue, payload)=>{
		// alert(parseltongue);
	},
	'notify result': (neo, parseltongue, payload)=>{
		// alert(parseltongue);
	},
	'request process': (neo, parseltongue, payload)=>{
		// alert(parseltongue);
	},
	evaluate: (neo, parseltongue, payload)=>{
		parseltongue = parseltongue.trim();
		// let script_name = parseltongue.replace(' ','_').trim();
		let script_name = parseltongue.trim();
		if (Parseltongue.hasOwnProperty(script_name) && typeof Parseltongue[script_name] === 'function') {

			try {
				return Parseltongue[script_name].apply(null,[neo, parseltongue, payload]); /* return fn.call(script); */
			}
			catch (e) { /* work in case there is an error */
				
				return 'exception '+e; // throw e;
			}
		}
	},
	function_filter: (property)=>{return typeof property === 'function'},
	// function_map:	(funktion)=>{return [funktion.name, funktion]},
	object_filter:   (property)=>{return typeof property === 'object'},
	string_filter:   (property)=>{return typeof property === 'string'},
	numeric_filter:  (property)=>{return typeof property === 'number'},
	array_filter:	(property)=>{return Array.isArray(property)},
	postable_filter: (property)=>{return Parseltongue[property]? typeof(Parseltongue[property])=='object' : false;},
	postable_map:	(property)=>{return [property, Parseltongue[property]]},
	set_property : function(script){ // prop,val
		prop = (prop + "").toLowerCase();
		for(var p in obj){
		   if(obj.hasOwnProperty(p) && prop == (p+ "").toLowerCase()){
				 obj[p] = val;
				 break;
			}
		 }
	},
	get_property : function(property_obj){ // prop,val
		var prop,obj=obj_property;
		prop = (prop + "").toLowerCase();
		for(var p in obj){
		   if(obj.hasOwnProperty(p) && prop == (p+ "").toLowerCase()){
			   return [p,obj[p]];
			}
		}
		return [false,null]
	},
	break_args:	  (script)=>{return script.split(Parseltongue.arg_splitter)},
	replace: (script)=>{
		script=script.split(' with ');
		// script[0].replace(/_(.*?)_/, function(a, b){return '<div>' + b + '</div>';});
	},
	query: function(current, prefix, objects) {
		var key;
		if (Array.isArray(current)) {
			//key = prefix ?  "is " + p + " a " + prefix : p;
			current.forEach(function(element) {
				key = (prefix) ? prefix + " " + element : element + "?";
				Dottie.query(element, prefix, objects);});
		} 
		else if (typeof current === "object") {
			if (current instanceof Set) {}
			else if (current instanceof Map) { current.forEach(function(element,key){ Dottie.query(element, key, objects); }); }
			else if (current.hasOwnProperty("type")) {
				if(current.type==="directory"){

				}
			}
			else{
				for (let property_name in current) {
					if (current.hasOwnProperty(property_name)) {  Dottie.query(current[property_name], property_name, objects);}}} }
		else if (typeof current === "string") {
			key = (prefix) ? prefix + " " + current : current;
			objects[key] = prompt(key + "?"); /* string */ }

	},
	expandable: function(object){
		const object_type = typeof object;
		return Array.isArray(object) || object instanceof Set || object instanceof Map || object_type === "object"  || object_type === "function";
	},
	get_type: function(root_object) {
		let type = typeof root_object;
		if (Array.isArray(root_object)){ type = 'array'} 
		else if (type === "object") {
			if (root_object instanceof Set) { return "set"}
			else if (root_object instanceof Map) { return "map"}
			else if (root_object instanceof Date) { return "date"}
		}
		return type;
	},
	retrieve:function(root_object, segment){
		if(!segment){ return root_object;}
		const v = new V(root_object)
		if (root_object != null) {
			if (v.is_ARRAY){
				if(!isNaN(segment)) 						{ return root_object[parseInt(segment)]; }
				else{
					const [index,amount] = segment.split(':');
					if(!isNaN(index) && !isNaN(amount))		{ return root_object.slice(parseInt(index), parseInt(amount)); }
					if(['pop','shift'].includes(segment))	{ return root_object[segment](); }
					else if(segment==='last')		 		{ return root_object[root_object.length-1]; } } } 
			else if (typeof root_object === "object") {
				if (v.is_NODE) 						 		{ return v.value.get(segment)}
				else if (root_object instanceof Set) 		{ if(!isNaN(segment)) { return [...root_object][parseInt(segment)]; } }
				else if (root_object instanceof Map) 		{ if(root_object.has(segment)) { return root_object.get(segment); } }
				else 								 		{ return root_object[segment]; } }
			else{ return root_object[segment]; } } },

	assign:function(root_object, segment, value_object){
		if (root_object != null) {
			if (Array.isArray(root_object)){
				if(!isNaN(segment)) {
					const index = parseInt(segment);
					root_object[index]=value_object;
					if(index<0){						root_object[root_object.length-1] = value_object; }
				else {									root_object[index]				= value_object; } }
				else{
					const [start,end] = segment.split(':');
					if(!isNaN(start) && !isNaN(end) && Array.isArray(value_object)){ 
						Array.prototype.splice.apply(root_object, [parseInt(start), parseInt(end)].concat(value_object)); }
					else{
						if(segment==='front'){		  root_object.unshift(value_object);	 }
						else if(segment==='last'){	  root_object[root_object.length-1] = value_object; }
						else{						   root_object.push(value_object); } } } } 
			else if (typeof root_object === "object") {
				if (root_object instanceof Set) {	   root_object.add(value_object); }
				else if (root_object instanceof Map) {  root_object.set(segment, value_object); }
				else {								  root_object[segment] = value_object; } }
			else{									   root_object[segment]=value_object; }
		}
	},

	get: function(root_object, path_string) {
		if (typeof path_string==="string" && path_string){
			let ps = path_string.replace(/^\//, '').replace(/\/$/, '');
			const segments = ps.split('/');
			return segments.reduce(function (root, segment, index, array) {
				if (root != null) { return Parseltongue.retrieve(root, segment); }
				return root;
				// if (root != null) { return X.type(Parseltongue.retrieve(root, segment)); }
				// return X.type(root);
			}, root_object);
		}
		// return root_object;
	},
	set: function (root_object, path_string, force_type, last_value) {
		if (typeof path_string==="string" && path_string){
			let ps = path_string.replace(/^\//, '').replace(/\/$/, '');
			const segments = ps.split('/');
			return segments.reduce(function (root, segment, index, array) {
				if (root_object != null) {
					const [identifier,type,value] = segment.split(':');
					let [object,p_type] = X.get_default(type);
					if(!root.hasOwnProperty(identifier) || (p_type!==Parseltongue.get_type(root) && force_type)){ // assign default or reset type value
						Parseltongue.assign(root, identifier, object); }

					if (index == (segments.length - 1)) {  Parseltongue.assign(root, identifier, last_value);} // assign final value
					return Parseltongue.get(root,identifier);
				}
			}, root_object);
		}
		return root_object;
	},
	remove:function(root_object, segment){
		if (root_object != null) {
			if (Array.isArray(root_object)){
				if(!isNaN(segment)) {
					const index = parseInt(segment);
					root_object.splice(index,1);
				}
				else{
					const [index,amount] = segment.split(':');
					if(!isNaN(index) && !isNaN(amount)){
						root_object.splice(parseInt(index), parseInt(amount));
					}
				}
			} 
			else if (typeof root_object === "object") {
				if (root_object instanceof Set) {
					root_object.delete(Parseltongue.get(root_object, segment));
				}
				else if (root_object instanceof Map) {
					root_object.delete(segment);
				}
				else {
					delete root_object[segment];
				}
			}
			else{
				delete root_object[segment];
			}
		}
	},
	execute:function(...args){
		let [agent, func, parseltongue, form, submitter] = args;
		func = Parseltongue.get(window, `${agent}/${func}`);
		if(typeof func === 'function'){
			return func.apply(this, args.splice(2)); /* return fn.call(script); */
		}
		else{
			func = Parseltongue.get(window, `${func}/${agent}`);
			if(typeof func === 'function'){
				return func.apply(this, args.splice(2)); /* return fn.call(script); */
			}
			else{
				throw 'function not available!';
			}
		}
		
	},
	get_alignment:function(a1,a2){
		let literals = [['L','B'],['M','C'],['R','T','F']];
		let mapping = ['min','mid','max'];
		let [a1_name, a2_name] = [a1.toLocaleUpperCase(), a2.toLocaleUpperCase()];
		let [a1_out, a2_out] = [null,null];
		for (let literal_set = 0; literal_set < literals.length; literal_set++) {
			const l = literals[literal_set];
			if(a1_out === null && l.includes(a1_name)){
				a1_out = mapping[literal_set];
			}
			if(a2_out === null && l.includes(a2_name)){
				a2_out = mapping[literal_set];
			}
		}
		return [a1_out, a2_out];
	},
	payload_to_bboxfield: function(gatepass, script, payload) {
		let [center_x,center_y] = payload.center ? payload.center : Ui.screen_center();
		let width = payload.width ? payload.width : center_x;
		let height = payload.height ? payload.height : center_y;
		let horz_offset = width/4;
		let vert_offset = height/4;
		let bbox = new BBox.initialize( Ui.center/* offset */, 1.0 /* bounds */)
		bbox.add_boundary('x',new Boundary.initialize(center_x-horz_offset, 0, center_x+horz_offset,15));
		bbox.add_boundary('y',new Boundary.initialize(center_y-vert_offset, 0, center_y+vert_offset,4));
		bbox.add_boundary('z',new Boundary.initialize(0,0,10,1));
		let field = new Field.initialize( //(type, label, value, regex, style, bounds)
			payload.type ? payload.type :"symbol",
			payload.label ? payload.label :"prompt field label",
			payload.value ? payload.value :"prompt field value",
			payload.regex ? payload.regex :"prompt field regex",
			payload.style ? payload.style :"prompt field style",
			bbox.bounds)
		bbox.add_field(field)
		return bbox;
	},
	query_gatepass: function(gatepass,script, payload) {
		let knot = new Knot.initialize( Ui.forward /* direction */, 1.0 /* length */);
		payload.forEach(function(NRS) {
			let [name,regex,state] = NRS;
			let payload_2 = {  type:"symbol",  label:name,  value:"",  regex:regex,};
			knot.add_bbox(Parseltongue.payload_to_bboxfield(null,null,payload_2)); });
		knot.container = 'GATEPASS';
		knot.gatepass_set_index = gatepass.set_index;
		Tunnel.add_knot(Tunnel.tunnel, knot);
		Tunnel.set_parent(Tunnel.tunnel);
	},
	query_script: function(gatepass,script, payload) {
		let knot = new Knot.initialize( Ui.forward /* direction */, 1.0 /* length */);
		payload.forEach(function(NRS) {
			let [name,regex,state] = NRS;
			let payload_2 = { type:"symbol", label:name, value:"", regex:regex,};
			knot.add_bbox(Parseltongue.payload_to_bboxfield(null,null,payload_2)); });
		knot.container = 'SCRIPT';
		knot.gatepass_set_index = gatepass.set_index;
		Tunnel.add_knot(Tunnel.tunnel,knot);
	},
	query_payload: function(gatepass,script, payload) {
		let knot = new Knot.initialize( Ui.forward /* direction */, 1.0 /* length */);
		payload.forEach(function(NRS) {
			let [name,regex,state] = NRS;
			let payload_2 = { type:"symbol", label:name, value:"", regex:regex,};
			knot.add_bbox(Parseltongue.payload_to_bboxfield(null,null,payload_2)); });
		knot.container = 'PAYLOAD';
		knot.gatepass_set_index = gatepass.set_index;
		Tunnel.add_knot(Tunnel.tunnel,knot);
	},
	process_result: function (result) {
		let neo = this;
		if (Array.isArray(result)) {
			result.forEach(function(element) {
			});
		} 
		else if (typeof result === "object") {
			if (result instanceof Set) {}
			else if (result instanceof Map) {
				result.forEach(function(element,key){});
			}
			else if (result.hasOwnProperty("type")) {}
			else{
				for (let property_name in result) {
					if (result.hasOwnProperty(property_name)) { }}} 
		}
		else if (typeof result === "string") {
			if(result.startsWith('exception')){
				neo.gatepasses[neo.gatepasses.length - 1].state = 'ERROR';}
			else{
				neo.gatepasses[neo.gatepasses.length - 1].state = 'COMPLETE';}
		}
	},
	add_knot: function(knot) {
		this.knots.push(knot);
	},
	// get_list:function(parent,childname){
	//	 name_comp = childname.split(':')
	//	 if (len(name_comp)>2){
	//		 start,start_valid = name_comp[0], name_comp[0].isdigit()
	//		 end,end_valid = name_comp[1], name_comp[1].isdigit()
	//		 step,step_valid = name_comp[2], name_comp[2].isdigit()
	//		 if (start_valid && end_valid && step_valid ){return parent[int(start),int(end),int(step)]}
	//		 else if (start_valid && end_valid && !step_valid ){return parent[int(start),int(end),0]}
	//		 else if (start_valid && !end_valid && step_valid ){return parent[int(start),0,int(step)]}
	//		 else if (!start_valid && end_valid && step_valid ){return parent[0,int(end),int(step)]}
	//		 else if (!start_valid && !end_valid && step_valid ){return parent[0,0,int(step)]}
	//		 else if (!start_valid && end_valid && !step_valid ){return parent[0,int(end),0]}
	//		 else if (!start_valid && !end_valid && !step_valid ){return parent[0,0,0]}}
	//	 else if (len(name_comp)==1){
	//		 childindex,childindex_valid = name_comp[0], name_comp[0].isdigit()
	//		 if (childindex_valid){
	//			 childindex = int(childindex)
	//			 if (childindex<len(parent)) { return parent[childindex]}}}
	// },
	get_cube: (script)=>{
		let cube =
			'o' +
			'\nv -0.500000 -0.500000 0.500000' +
			'\nv 0.500000 -0.500000 0.500000' +
			'\nv -0.500000 0.500000 0.500000' +
			'\nvt 0.000000 0.000000' +
			'\nvt 1.000000 0.000000' +
			'\nvt 0.000000 1.000000' +
			'\nvn 0.000000 0.000000 1.000000' +
			'\nf 1/1/1 2/2/1 3/3/1';
		return ['cube',new Blob([cube])];
	},
	post: (script)=> {
		script=script.trim();
		Parseltongue.break_args(script).
			filter(Parseltongue.postable_filter).
				map(name_postable => {
					var name,postable=name_postable;
					var uri,url=Parseltongue.get_property(postable,'url');
					url = uri ? url : './postmaster';
					// const fileField = document.querySelector('input[type="file"]');
					const formData = new FormData();
					formData.append('username', 'PulseUser_000');
					formData.append('space','text');
					formData.append('basetype','csv');
					formData.append('base','CrunchBase');
					formData.append('query', keyboard_write);
					fetch(url, {method: 'POST',body: formData}).
						then((response) => response.json()).
							then((data_in) => {
								name = name.replace(Parseltongue.underscore_rgx, (str) => ` `).trim();
								var fn_rgx = new RegExp('^' + name+' ', 'i');
								if (fn_rgx.test(script)) {
									try {
										script=script.replace(fn_rgx, (str) => ` `).trim();
										return postable.call(script);}
									catch (e) { return 'exception '+e; /*  throw e; */}
								}})
				});
	},
	test1:(code_block)=>{
		var [fn, ln] = ['sadern','alwis'];
		let { firstName, lastName } = { firstName, lastName};
	},
	test: (script)=>{
		var callee = arguments.callee.toString();
		var underscore = new RegExp('_', 'i');
		callee = callee.replace(underscore, (str) => ` `).trim();
		var callee_regex = new RegExp('^' + callee+' ', 'i');
		if (callee.test(script)) {

		}
	},
	next_table_ID:()=>{ return Parseltongue.table_id+1;},
	onload: function() {
		Parseltongue.table_id=0;
		// //device.start_camera();
		// //document.getElementById("c2").addEventListener("click", device.start_camera);
		// //Ui.initialize();
		// world.create();
		// // Babylon.create(document.getElementById("c3"));
		// script.loop_count = 0;
		// script.loop();
		// Sensors.start_sensors();
		// Models.queue();
		// //Socket.write({ link: 0, data: "hello" });
		// //uploadObj();
		// processor.encode({ hello: "encoder" });
		// document.addEventListener('keydown', Keyboard.keydown);
		// script.console = Console.initialize();
		// window.addEventListener("gamepadconnected", Gamepad.connected);
		// window.addEventListener("gamepaddisconnected", Gamepad.disconnected);
		// Credentials.get_all();
	},
	loop: function() {
		script.loop_count++;
		const loop = script.loop_count;
		requestAnimationFrame(script.loop);
		if (loop % 1 === 0) {
			world.render();
			CSS.TWEEN.update();}
		if (loop % 2 === 0) {Gamepad.update();}
		if (loop % 3 === 0) {}
		if (loop % 30 === 0) {Models.queue();}//world.renderer.render(world.scene, world.cameras[0]);
		if (loop % 60 === 0) {Gamepad.connect();}
		if (loop % 200 === 0) {}},
	fullscreen: function() {
		let container = document.body;
		if (container.requestFullscreen) {container.requestFullscreen();} 
		else if (container.mozRequestFullScreen) {container.mozRequestFullScreen();}/* Firefox */ 
		else if (container.webkitRequestFullscreen) { container.webkitRequestFullscreen();}/* Chrome, Safari and Opera */ 
		else if (container.msRequestFullscreen) { container.msRequestFullscreen();}},/* IE/Edge */
	export: function(data, filename) {
		if (!data) {console.error('Console.save: No data');return;}
		if (!filename) { filename = 'console.json'; }
		if (typeof data === "object") {data = JSON.stringify(data, undefined, 4);}
		let blob = new Blob([data], { type: 'text/json' });
		let e = document.createEvent('MouseEvents');
		if (script.a) {window.URL.revokeObjectURL(script.a.href);}
		script.a = document.createElement('a');
		script.a.download = filename;
		script.a.href = window.URL.createObjectURL(blob);
		script.a.dataset.downloadurl = ['text/json', script.a.download, script.a.href].join(':');
		e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		script.a.dispatchEvent(e);}};


// var o = {p: 42, q: true}; // Object destructuring
// var {p, q} = o;
// console.log(p); // 42
// console.log(q); // true 
// var {p: foo, q: bar} = o; // Assign new variable names
// console.log(foo); // 42
// console.log(bar); // true

// var foo = ["one", "two", "three"]; // Array destructuring
// var [one, two, three] = foo;

// let p1 = {...person}; // using spread ...
// let p2 = Object.assign({}, person); // using  Object.assign() method
// let p3 = JSON.parse(JSON.stringify(person)); // using JSON

