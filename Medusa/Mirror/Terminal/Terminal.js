'use strict';
import { Space } from "Medusa/Parseltongue/Space/Space.js";
import { Quote } from "Medusa/Parseltongue/Jargon/Linguistic/Quote/Quote.js";
import { Document } from "./Document/Document.js";
import { AddrressBar } from "./AddrressBar/AddrressBar.js";
import { Pool } from "./Pool/Pool.js";
import { Input } from "./Input/Input.js";
import { Log } from "./Log/Log.js";
import { English } from "./Mnemonics/Mnemonics.js";
import { Panel } from "./Planet";
import { Tree } from "Medusa/Mirror/Tree/Tree.js";
import { Branch } from "Medusa/Mirror/Tree/Branch/Branch.js";
import { Grid } from "Medusa/Mirror/Terminal/Grid/Grid.js";
import { Canistro } from "Medusa/Canistro/Canistro.js";

export class Terminal extends HTMLElement {

	static maxTextureImageUnits  = 0;
	static maxTextureSize = 0;

	set_program(program){ this.program = program }	

	render(){ 
		this.panel?.render()
	}

	mousemove(x,y){
		this.carousel.mousemove(x,y)
	}

	create_superposition(width, height){
		var base_metadata = {   file_path : '', file_name : 'PRINCESS 0.5.4v.blend', collection : 'PoseAtlas/captured01', object_name : 'MBlab_sk1616213127.086241', author : '', h : '0', v : '0', r : '5.0', p : 'captured01'}
		this.superposition = new SuperPosition(this, null, 'PRINCESS 0.5.4v.blend', base_metadata, new THREE.Vector2(width, height))
	}

	//import
	image_load_test(object_hash, image_hash, value){
		let image_key = `${this.identity}:${this.action}:${this.angle[0]}:${this.angle[1]}`;
		if(this.image_map.has(image_key) && this.current_image!==image_key){
			var image = this.image_map.get(image_key)
			// this.write( image, 0, 0 );
			// this.current_image = image_key;
		}
		else{
			// var image = new Image();
			// img.onload = (function () { this.write( img, 0, 0 );}).bind(this);
			var form = new FormData();
			form.append('parseltongue', '');
			form.append('payload', { 'identity':this.identity , 'action': action, 'angle': angle,});
			this.image_map.set(image_key, new Image());
			this.program.queue('PostMaster', 'lightcast', 'request', form, this);
		}
	}
		
	load_poses(){

	}
	async incoming(event, data){
		switch (event) {
			case 'queued':
				// image.src = data? data:"../../../../../Environments/Medusa/Medallion.png";
				break;
			case 'pre-send':
				// image.src = data? data:"../../../../../Environments/Medusa/Medallion.png";
				break;
			case 'sent':
				// image.src = data? data:"../../../../../Environments/Medusa/Medallion.png";
				break;
			case 'error':
				// image.src = data? data:"../../../../../Environments/Medusa/Medallion.png";
				break;
			case 'received':
				let [gatepass, parseltongue, payload] = data
				this.imageElement.src = URL.createObjectURL(payload);


				// var img = document.createElement('img');
				// img.src = URL.createObjectURL(payload);
				// var texture = new THREE.Texture(img);
				// this.instance_mesh.material.uniforms.textures[0].image.src = texture;
				// this.instance_mesh.material.uniforms.textures[0].image.src = URL.createObjectURL(payload);
				// this.instance_mesh.material.uniforms.textures[0].needsUpdate = true
				// this.instance_mesh.material.needsUpdate = true
				// this.instance_mesh.material.uniforms.textures[0] = map
				// mesh.material.materials[0].map.image = { data: array, width: 20, height: 20 };
				// mesh.material.materials[0].map.needsUpdate = true;

				const buffer = await payload.arrayBuffer();
				const metadata = readMetadata(buffer);
				console.log(metadata)
				return 1
			default:
				// submitter.src = data? data:"../../../../../Environments/Medusa/Medallion.png";
				break;
		}
	}

	import_default_superpositions(){
		var form = new FormData();
		form.append('parseltongue', 'asset_store');
		form.append('payload', '7320677ccfb68a31538462c249cd82d8');
		// this.image_map.set(image_key, new Image());
		this.program.queue('postmaster', 'POST', '', form, this);
	}

	create_wordspace(){
		// this.word_space = [ new Space(0,[[0,undefined]],['double quote', [new Quote(2), new Quote(3),]],['function', (function(arg){alert(arg)}).bind(this)]),
		this.word_space = [ new Space(0,[[0,undefined]],['double quote', [new Quote(2), new Quote(3),]], ['numeric', 3], ['function', [(function(arg){alert(arg)}).bind(this)]]),
							]
	}

	match_wordspace(){
		for (let i = 0; i < this.word_space.length; i++) {
			const space = this.word_space[i];

			var [next, forward, skip_level] = [undefined, true, undefined];
			const generator = space.generator()
			while (forward) {
				next = generator.next(skip_level)
				const [y, idx, sequence, level_name, level_idx] = next.value
				const functions = sequence[sequence.length-1]
				for (let level = 0; level < sequence.length-1; level++) {
					// if()
					if(sequence[level].match(this.input.node.value).is_match()){
						for (let fn_idx = 0; fn_idx < functions.length; fn_idx++) {
							functions[fn_idx](sequence)
						}
						skip_level = undefined
					}
					else{
						skip_level = level
						break
					}
				}
				forward = y
			}
			// for(const s_gen of space.generator()){
			//	 const [y, idx, sequence, level_name, level_idx] = s_gen
			//	 const fn = sequence[sequence.length-1]
			//	 if(sequence[0].match(this.input.node.value).is_match()){
			//		 fn(level_idx)
			//	 }
			// }
		}
			
	}


	get commands(){
		return English.
		// concat(this.superposition.poses, this.recorder.commands).
		concat(this.document.commands)
	}

	get_commands(){
		return Parseltongue
	}

	get_paremeters(){
		return this.input.node.value.trim()
	}

	execute(){ // fetch('json/Industries.dkg.json').then((response) => response.json()).then((json) => window.industries = json);
		parseltongue = this.input.node.value.trim()
		if(parseltongue.endsWith('.')){ 
			parseltongue = parseltongue.slice(0,parseltongue.length-1)
			this.document.add(parseltongue) }
		// MD5('PRINCESS 0.5.4v.blend,PoseAtlas/captured01,MBlab_sk1616213127.086241,0,0,5.0,captured01')==='7320677ccfb68a31538462c249cd82d8'
		const args = parseltongue.split(' ')
		if (parseltongue==='test postmaster'){ this.import_default_superpositions() }
		else if(parseltongue.startsWith('load pose')){
			const [name, name_hash] = this.superposition.hvrp_hash(...args.slice(2))
			this.superposition.import_image(this.program, name_hash)
		}
		else if(parseltongue.startsWith('scroll')){ this.addressbar.scroll_into_view(args[1] ? parseInt(args[1]): 0) }
		else if(parseltongue.startsWith('candidate')){ this.pool.scroll_into_view(args[1] ? parseInt(args[1]): 0) }
		else if(parseltongue.startsWith('recorder')){ this.recorder.execute(parseltongue) }
		else { this.document.execute(parseltongue) }
		this.match_wordspace()
		// alert(parseltongue)
	}
    execute(command){
        let [pt, in_obj, parameters, out_obj] = [Parseltongue.clean(command), null, []]
        if (this.addressbar.qualifier(pt)){
			let object = this.addressbar.vantage.travel(pt).load()
			this.addressbar.set_address(address.join('/'))
            // parameters = this.pool.parameterize(pt)
            // parameters = this.log.stack(payload)
        }
        else if (this.pool.qualifier(pt)){ 
			in_obj = this.addressbar.virtualize(pt)
            pt = this.pool.populate(obj, pt)
            this.input.value = pt }
    }


    key(filter){
		const vantage = this.addressbar.vantage.load()
		const candidates = vantage.keys(0)
		console.log(candidates)
		return vantage.is_OBJECT ? candidates : this.commands
	}

	create_map(width,height){
		this.map = HTML.make("scope-radar", "", [], {}); 
		HTML.style_overlay(this.map,width,height)
		HTML.style(this.map,{ display:'none'});
		return this.map;
		
	}

	create_canvas(width,height){
		let canvas = HTML.make("canvas", "", [], {}); 
		HTML.style(canvas,{ width: '100%',height: 'inherit','position':'absolute', 'left':'0px', 'bottom':'0px'});
		const ctx_2d = canvas.getContext('2d');
		ctx_2d.fillStyle = '#F00';
		ctx_2d.fillRect(0, 0, ctx_2d.canvas.width, ctx_2d.canvas.height);

		// HTML.style_overlay(canvas,width,height)
		return canvas;
		
	}

	create_graph(){
		// var createSettingsView = import('Medusa/Mirror/Graph/Graph/config');
		// var query = import('query-string').parse(window.location.search.substring(1));
		// var graph = getGraphFromQueryString(query);
		// var renderGraph = import('../../');
		// var addCurrentNodeSettings = import('./nodeSettings.js');
		window.graph = generate.balancedBinTree(3)
		var renderer = renderGraph(window.graph, {container:this.container, terminal:this});
		window.renderer = renderer
		return
		var settingsView = createSettingsView(renderer);
		var gui = settingsView.gui();
		var nodeSettings = addCurrentNodeSettings(gui, renderer);
		renderer.on('nodeclick', showNodeDetails);
		function showNodeDetails(node) {
			var nodeUI = renderer.getNode(node.id);
			nodeSettings.setUI(nodeUI);
		}
	}
	panels = {}
	show_panel(name, e, node){
		this.panel = name in this.panels ? this.panels[name] : new Panel(this);
		this.terminal_container.appendChild(this.panel.node);
		this.panels[name] = this.panel
		this.panel.show(e, node)
	}

	trees = {}
	show_tree(name, e, node){
		const tree = name in this.trees ? this.trees[name] : new Tree(this);
		this.terminal_container.appendChild(tree.node);
		// tree.show(e, node)
	}
	branches = {}
	show_branch(name, e, node){
		const branch = name in this.branches ? this.branches[name] : new Branch(this);
		this.terminal_container.appendChild(branch.node);
		// tree.show(e, node)
	}
	grids = {}
	show_grid(name, e, node){
		const branch = name in this.grids ? this.grids[name] : new Grid(this);
		this.terminal_container.appendChild(branch.node);
		// tree.show(e, node)
	}

	create_terminal(width, height){
		this.terminal_container =  HTML.make('div','',[],{});
		HTML.style(this.terminal_container,{ width: '100%', height: 'auto'/* '100%' */, 'max-height': '100%',  display: 'flex', 'flex-direction': 'column-reverse','position':'absolute', 'left':'0px', 'bottom':'0px'});
		// this.ul = new Document(this, width, height);
		// this.block = new Block(this, width, height);
		// this.carousel = new Carousel(this, width, height);
		this.document = new Document(this, width, height);
		// this.header = new Header(this);
		this.addressbar = new AddrressBar(this);
		this.pool = new Pool(this);
		this.input = new Input(this);
		this.log = new Log(this);
		// this.panel = new Panel(this);
		// this.video = new YouTube(this, 800,400)
		// this.playlist = new Playlist(this, document.body)
		// this.clock = new Clock(this, document.body)
		// this.network = new Network(this, document.body)
		// this.explorer = new Explorer(this, document.body)
		// this.terminal_container.appendChild(this.video.container);
		// this.terminal_container.appendChild(this.create_viewbox(width,height,this.ul.node));

		// this.terminal_container.appendChild(this.carousel.node);
		// this.terminal_container.appendChild(this.header.container);
		// this.carousel.node.appendChild(this.document.node);
		// this.terminal_container.appendChild(this.carousel.node);
		this.terminal_container.appendChild(this.log.container);
		this.terminal_container.appendChild(this.input.container);
		this.terminal_container.appendChild(this.pool.container);
		this.terminal_container.appendChild(this.addressbar.container);
		this.terminal_container.appendChild(this.document.node);
		// this.terminal_container.appendChild(this.panel.node);
		// this.terminal_container.appendChild(this.block.node);
		// this.terminal_container.appendChild(this.clock.node);
		// this.terminal_container.appendChild(this.network.node);
		// this.terminal_container.appendChild(this.explorer.node);
		// this.ul = this.document
		this.ul = this.pool
		
	}
	
	create_editor(width, height){
		this.editor_container =  HTML.make('div','',[],{});
		HTML.style(this.editor_container,{ width: '100%', /* height: '100%', */ 'max-height': '100%',  display: 'flex', 'flex-direction': 'column','position':'absolute', 'left':'0px', 'bottom':'0px'});
		this.editor = CodeMirror(this.editor_container, {
		  mode: "text/html",
		  extraKeys: {"Ctrl-Space": "autocomplete"},
		  value: document.documentElement.innerHTML });
	}
	style_link(address){
		let style_link = document.createElement('link');
		style_link.setAttribute('rel', 'stylesheet');
		style_link.setAttribute('href', address);
		this.shadow_root.append(style_link); // append stylesheet to Shadow DOM
	}

	reload() {
		let [width,height] = [800,400];
		let root =  HTML.make("div", "invisible-overlay-container", [], {});
		HTML.style(root, { width: `100%`, /*  height: 'auto' *//* `100%` *//* , */ 
			display:'block', 
			position:'static'/* 'relative' */, 
			background: '#00000000'/* '#21282C88'//'rgba(28, 105, 212, 0.95)' */ });
		this.create_map(width,height);
		// this.create_superposition(width, height)
		this.create_terminal(width,height)
		this.create_wordspace()
		root.appendChild(this.map);
		// root.appendChild(this.superposition.canvas.canvas);
		root.appendChild(this.terminal_container);
		// this.recorder = new Recorder(this, this.superposition.canvas.canvas, 30)
		this.container = HTML.put(this.shadow_root, root, 0, true);
		// this.block = new Block(this)
		// this.block.node.append(root);
		// this.container = HTML.put(this.shadow_root, this.block.node, 0, true);

		// let style_link = document.createElement('link');
		// style_link.setAttribute('rel', 'stylesheet');
		// style_link.setAttribute('href', 'Parseltongue/Parseltongue.css');
		// this.shadow_root.append(style_link); // append stylesheet to Shadow DOM
		// this.style_link('dist/Main.css')
		// this.style_link('Templates/HTML/Parallax/Firewatch.css')
		// this.style_link('Templates/HTML/Carousel/Carousel.css')
		this.style_link('assets/css/Parseltongue.css')
		this.style_link('assets/css/Clock.css')
		this.style_link('assets/css/Planet.css')
		this.style_link('assets/css/Panel.css')
		this.style_link('assets/css/PickleTree.css')

	}

	constructor() { // constructor(input, button, ul) {
		super();
		this.shadow_root = this.attachShadow({mode: 'open'});
		this.reload();
		// this.setup_pulse();
		[this.input.focused, this.ul.focused, this.has_hover] = [false, false, false]
		this.filter = '';
		// document.body.addEventListener( 'pointerup', this.outside_click.bind(this), true);
		this.container.addEventListener( 'pointerup', this.fullscreen.bind(this), true);
		window.addEventListener("resize", this.resize.bind(this));
		this.ul.populate(this.filter, this.commands);
		// this.populate('')
		this.image_map = new Map();

	}
	
	resize(e){}

	record(){			
		var cStream,
		recorder,
		chunks = []; //https://stackoverflow.com/questions/38924613/how-to-convert-array-of-png-image-data-into-video-file
		rec.onclick = function() {
			this.textContent = 'stop recording'; 
			var cStream = canvas.captureStream(30); // set the framerate to 30FPS 
			recorder = new MediaRecorder(cStream); // create a recorder fed with our canvas' stream 
			recorder.start(); // start it 
			recorder.ondataavailable = saveChunks; // save the chunks

			recorder.onstop = exportStream;
			this.onclick = stopRecording; /* change our button's function */ };

		function saveChunks(e) { chunks.push(e.data); }
		function stopRecording() { recorder.stop(); }
		function exportStream(e) {
			var blob = new Blob(chunks) // combine all our chunks in one blob
			var vidURL = URL.createObjectURL(blob); // do something with this blob
			var vid = document.createElement('video');
			vid.controls = true;
			vid.src = vidURL;
			vid.onended = function() { URL.revokeObjectURL(vidURL); }
			document.body.insertBefore(vid, canvas);
		}
		var x = 0; // make something move on the canvas
		var ctx = canvas.getContext('2d');
		var anim = function() {
			x = (x + 2) % (canvas.width + 100);
			// there is no transparency in webm,
			// so we need to set a background otherwise every transparent pixel will become opaque black
			ctx.fillStyle = 'ivory';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = 'black';
			ctx.fillRect(x - 50, 20, 50, 50)
			requestAnimationFrame(anim);
		};
		anim();
	}

	fullscreen(parameter) {
		let [enterFullScreen, exitFullScreen, orient_key] = [null,null, null]
		if ('mozOrientation' in screen) { orient_key = 'mozOrientation';} 
		else if ('msOrientation' in screen) { orient_key = 'msOrientation';}
		// if (screen[orient_key]) {
		//	 let onOrientationChange = function() { /* resize(); draw(); */ };
		//	 try {
		//		 if ('onmozorientationchange' in screen) {  screen.addEventListener('onmozorientationchange', onOrientationChange);}
		//		 if ('onorientationchange' in screen)	{ screen.addEventListener('orientationchange', onOrientationChange);}
		//		 if ('onchange' in screen[orient_key]){ screen[orient_key].addEventListener('change', onOrientationChange);}} 
		//	 catch (err) { alert("Screen Orientation Error.");}}

		if ('requestFullscreen' in document.body) {
			enterFullScreen = 'requestFullscreen';
			exitFullScreen = 'exitFullscreen';} 
		else if ('mozRequestFullScreen' in document.body) {
			enterFullScreen = 'mozRequestFullScreen';
			exitFullScreen = 'mozCancelFullScreen';} 
		else if ('webkitRequestFullscreen' in document.body) {
			enterFullScreen = 'webkitRequestFullscreen';
			exitFullScreen = 'webkitExitFullscreen';} 
		else if ('msRequestFullscreen') {
			enterFullScreen = 'msRequestFullscreen';
			exitFullScreen = 'msExitFullscreen';}
		// if (this !== terminal )debugger
		this.container[enterFullScreen] && this.container[enterFullScreen]();
		// document.body[enterFullScreen] && document.body[enterFullScreen]();
		
		// if (parameter) {
		//	 // document.body[enterFullScreen] && document.body[enterFullScreen]();
		//	 this.container[enterFullScreen] && this.container[enterFullScreen]();
		//	 var promise = null;
		//	 if (screen[orient_key].lock) { promise = screen[orient_key].lock(screen[orient_key].type);} 
		//	 else if (screen.orientationLock) { promise = screen.orientationLock(screen[orient_key]);} 
		//	 else if (screen.orientation && screen.orientation.lock) { promise = screen.orientation.lock(screen[orient_key]);}
		//	 promise.then( function() { console.log('Screen lock acquired');}).
		//	 catch(function(err) {
		//		 // console.error('Cannot acquire orientation lock: ' + err);
		//		 // document[exitFullScreen] && document[exitFullScreen]();
		//	 });} 
		// else {
		//	 // document[exitFullScreen] && document[exitFullScreen]();
		//	 this.container[exitFullScreen] && this.container[exitFullScreen]();
		//	 if (screen[orient_key].unlock) { screen[orient_key].unlock();} 
		//	 else { screen.orientationUnlock();}
		// }
	}
	closeFullscreen() {
		if (document.exitFullscreen)
			document.exitFullscreen();
	}

	openFullscreen() {
		if (elem.requestFullscreen)
			elem.requestFullscreen();
	}

	onFullScreenChange() { // https://stackoverflow.com/a/36795728/10591628
		var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
		// if in fullscreen mode fullscreenElement won't be null
	}

	fullscreen_exit_listeners(callback, enable){
		if (enable){
			document.addEventListener('fullscreenchange', callback, false);
			document.addEventListener('webkitfullscreenchange', callback, false);
			document.addEventListener('mozfullscreenchange', callback, false);}
		else {
			document.removeEventListener('fullscreenchange', callback, false);
			document.removeEventListener('webkitfullscreenchange', callback, false);
			document.removeEventListener('mozfullscreenchange', callback, false);}
	}
	//################################ F O C U S ################################
	//#_________________________________________________________________________#

}
 
 // Initialize comboboxes
//  window.addEventListener('load', function () {
//	  var comboboxes = document.querySelectorAll('.combobox-list');
//	  for (var i = 0; i < comboboxes.length; i++) {
//		  var combobox = comboboxes[i];
//		  var input = combobox.querySelector('input');
//		  var button = combobox.querySelector('button');
//		  var ul = combobox.querySelector('[role="listbox"]');
//		  new ComboboxAutocomplete(input, button, ul);
//	  }
//  });
 
/* "This software or document includes material copied from or derived from 
 *	Editable Combobox (class ComboboxAutocomplete ) With Both List and Inline Autocomplete Example : https://www.w3.org/TR/wai-aria-practices-1.2/examples/combobox/combobox-autocomplete-both.html."
 *  with following license.	
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 */


window.customElements.define('viewer-terminal', Terminal);