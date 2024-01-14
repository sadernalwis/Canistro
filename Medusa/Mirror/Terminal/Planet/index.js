// import Globe from './encom-globe.js'
// import Globe from './encom-globe.min.js'
import * as T from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

import Globe from './src/Globe.js'
import data from './data.js'
import grid from './grid.js'
import { HTML } from "Medusa/Parseltongue/HTML/HTML.js";
import { Block } from "../Block/Block.js"
import { SuperPosition } from '../SuperPosition/SuperPosition.js';

// document.getElementById("tunnel").animate([
// 	{ transform: 'translate3D(0, 0, 0)' },
// 	{ transform: 'translate3D(0, -300px, 0)' }], { duration: 1000, iterations: Infinity })

// var aliceTumbling = [
// 	{ transform: 'rotate(0) translate3D(-50%, -50%, 0', color: '#000' },
// 	{ color: '#431236', offset: 0.3 },
// 	{ transform: 'rotate(360deg) translate3D(-50%, -50%, 0)', color: '#000' } ];

// var aliceTiming = { duration: 3000, iterations: Infinity }
// document.getElementById("alice").animate( aliceTumbling, aliceTiming )
// SuperPosition
export class Panel{

	show(e, node) {
		this.graph_node = node
		function addClass(component, className) {
			var e = document.getElementById(component);
			e.removeAttribute('class');
			e.classList.add(className);
		};
		
		function setAnim(e) {
			var btn = document.getElementsByTagName('button')
			for (i = 0; i < btn.length; i++) {
				btn[i].classList.remove('active'); }
			e.classList.toggle('active');
			value = e.innerText;
			addClass('component', value);
		}
		
		// first transition by default
		// var btn = document.getElementsByTagName('button')
		// btn[0].classList.add('active')
		// value = btn[0].innerText;
		// addClass('component', value);

		this.node.style.display = 'none'
		this.html.content.shot.style.display = 'none'
		this.node.style.display = 'none'
		if (!this.no_move && e){
			this.node.style.left = e.x + 'px';
			this.node.style.top = e.y + 'px';
		}
		this.node.style.display = 'block'
		setTimeout((function () {
			this.html.content.shot.style.display = 'block'
			this.node.style.display = 'block'
		}).bind(this), 100)
		HTML.put(this.block.node, this.block.terminal,  -1)

		HTML.configure(this.controller,{src: "assets/images/dkg_logo.png"/* `assets/images/Robots/Robot ${this.graph_node.id}.png` */});
		HTML.style(this.controller,{width: "100%"});
		this.html.content.header.innerText = `DKG #${String(this.graph_node.id).padStart(4,0)}`
		// tooltipDom.innerHTML = node.id;
		// tooltipVisible = true;
	}

	content_panel(wrapper){
		this.html.content = {}
		let [, shot] = HTML.chain(wrapper, `div:shot::`); 
		[window.canistro] = HTML.ladder(shot,`medusa-canistro:::canistro`);
		HTML.configure(window.canistro, {id:'queued' , stroke:"40", stroke:"40", radius:"60", progress:"95", status:'in-progress'});
		let [card, description, title, options] = HTML.ladder(shot,`div:card:/div:description:/div:title:/div:options:`);
		let [, component, controller] = HTML.chain(card, `div:::component/img:::`); 
		window.superposition = new SuperPosition(this,null,null,{},null)
		HTML.put(component, window.superposition.html.canvas, -1)
		this.controller = controller
		HTML.style(card,{overflow: 'hidden'});
		HTML.configure(this.controller,{src: "assets/images/dkg_logo.png"/* "assets/images/Robots/Robot 1.png" */});
		HTML.style(this.controller,{width: "100%"});

		let [desc_header, desc] = HTML.ladder(description,`h1::DKG #0001/p::Description`);
		this.html.content.header = desc_header
		let [opt_header, buttons, links] = HTML.ladder(options,`p::/div:btns:/p::Links `);

		let [btn1,btn2,btn3,btn4,btn5] = HTML.ladder(buttons,`button:: GLOBE :btn-0/button::ASSET FILE:btn-1/button::CANVAS:btn-2/button::NAVIGATION:btn-3/button::FILES:btn-4/`);
		btn1.addEventListener("click", ((e)=>{this.createGlobe()}).bind(this))
		btn2.addEventListener("click", ((e)=>{this.bitcoin()}).bind(this))
		btn3.addEventListener("click", ((e)=>{this.terminal.show_tree('test_tree')}).bind(this))
		btn4.addEventListener("click", ((e)=>{this.terminal.show_branch('main')}).bind(this))
		btn5.addEventListener("click", ((e)=>{this.terminal.show_grid('main')}).bind(this))
		let [, link] = HTML.chain(links, `a::`); 
		this.html.content.shot = shot;
		this.html.content.component = component;
		HTML.configure(link, {href:"https://twitter.com"})
		// <div id="shot">
		// 	<div class="card">
		// 		<div id="component"></div> </div>
		// 	<div class="description">
		// 		<h1>Experiment's name</h1>
		// 		<p>Description</p> </div>
		// 	<div class="title"></div>
		// 	<div class="options">
		// 		<p>Type of transition</p>
		// 		<div class="btns">
		// 			<button id="btn-0" onclick="setAnim(this)">flow-1</button>
		// 			<button id="btn-1" onclick="setAnim(this)">flow-2</button>
		// 			<button id="btn-2" onclick="setAnim(this)">flow-3</button>
		// 			<button id="btn-3" onclick="setAnim(this)">flow-4</button> </div>
		// 		<p>Drawsstuff, 
		// 			<a href='https://twitter.com/Drawsstuff2'>@Drawsstuff2</a></p> </div> </div>
		// return w
	}

	panel(wrapper){
		this.html.panel = {}
		let [, container] = HTML.chain(wrapper, `div:container,grid:`); 
		this.content_panel(container)
		// container.id = "container"
		// let [globe, options, header_top, header_bot, thumbprint, header_in, header_out] = HTML.ladder(container,`div::/div::/div:header:/div:header:/div:eye:/div:header-animator:/div:header-animator:`);
		// globe.id = "globe"
		// options.id = "options"
		// header_top.id = "header-top"
		// header_bot.id = "header-bottom"
		// thumbprint.id = "thumbprint"
		// header_in.id = "header-animator-inside"
		// header_out.id = "header-animator-outside"
		// let [, content] = HTML.chain(options, `div::`);
		// content.id = "options-content"
		// let [cheader, map, attributes, sheader,members, button] = HTML.ladder(content, `h3::Add element by clicking map below/img:projection:/ul::/h3::Configure Globe/div::/div:button:Reload`);
		// HTML.configure(map, {src:"resources/point_picker.png", width:"280px"})
		// attributes.id = "add-element"
		// button.id = "apply-button"
		// let [hlst, hrst] = HTML.ladder(header_top,"div:header-left-section:CENTRAL SYSTEM DATA .../div:header-right-section:OIA | 012" )
		// let [hlsb, hrsb] = HTML.ladder(header_bot,"div:header-left-section:TOUCHPOINT KEYBOARD .../div:header-right-section:SYS | O12" )
		// let [, span_top] = HTML.chain(hlst, `span:alt-1:LAUNCH ENCOM GLOBALIZATION`);
		// let [, span_bot] = HTML.chain(hlsb, `span:alt-1:INTERACTION SEQUENCING`);
		// let [thumb, move] = HTML.ladder(thumbprint, `img:eye:/img:eye:`);
		// // HTML.configure(thumb, {src:"resources/thumbprint.png"})
		// // let [, thumb] = HTML.chain(thumbprint, `svg-file::`);
		// HTML.configure(thumb, {src:"assets/icons/svg+xml/eye.svg"}) // https://stackoverflow.com/questions/7415872/change-color-of-png-image-via-css
		// HTML.configure(move, {src:"assets/icons/svg+xml/unlock.svg"}) // https://stackoverflow.com/questions/7415872/change-color-of-png-image-via-css
		// thumb.style.filter = 'grayscale(1) invert(1);'
		// thumb.addEventListener("click", ((e)=>{this.node.style.display = 'none'}).bind(this))
		// move.addEventListener("click", ((e)=>{
		// 	this.no_move = !this.no_move
		// 	e.target.src = this.no_move? "assets/icons/svg+xml/lock.svg" : "assets/icons/svg+xml/unlock.svg"
		// }).bind(this))
		
		// this.html.panel.container = container
		// this.html.panel.globe = globe
		// this.html.panel.options = options
		// this.html.panel.content = content
		// this.html.panel.header_top = header_top
		// this.html.panel.header_bot = header_bot
		// this.html.panel.thumbprint = thumbprint
		// this.html.panel.header_in = header_in
		// this.html.panel.header_out = header_out
		return container
	}
	open() {
		var headerTopPosition = HTML.position(this.html.panel.header_top).top;
		var headerBottomPosition =  HTML.position(this.html.panel.header_bot).top;
		var headerHeight = HTML.outer_height(this.html.panel.header_top); /* margins or something, whatever */
		HTML.set_offset(this.html.panel.header_in,  25, HTML.computed(this.html.panel.container, 'height')/2)
		HTML.set_offset(this.html.panel.header_out, 25, HTML.computed(this.html.panel.container, 'height')/2)
		this.html.panel.header_in.style.height = 0
		this.html.panel.header_out.style.height = 0
		this.html.panel.options.style.left = 0
		this.html.panel.options.prev_left = HTML.computed(this.html.panel.options, 'left');
		this.html.panel.thumbprint.prev_left = HTML.computed(this.html.panel.thumbprint, 'left');
		this.html.panel.options.animate([{ left: '50px' }], {duration:500, iterations:Infinity});
		// this.html.panel.thumbprint.animate({ left: 265 }, 500);
		setTimeout((function () {
			console.log(this)
			this.html.panel.content.animate([{ opacity: 1 }], {duration:500, iterations:Infinity});
		}).bind(this), 1500)
		// $("#options-content").delay(1500).animate({ opacity: 1 }, 500);
		setTimeout((function () {
			this.html.panel.header_in.style.visibility = "visible";
			this.html.panel.header_out.style.visibility = "visible";
			this.html.panel.header_in.animate({ top: headerTopPosition+'px', 					height: (headerBottomPosition - headerTopPosition + headerHeight)+'px' }, 500);
			this.html.panel.header_out.animate({ top: (headerTopPosition + headerHeight)+'px', height: (headerBottomPosition - headerTopPosition - headerHeight)+'px' }, 500);
			// $("#header-animator-outside").animate({ top: headerTopPosition, height: headerBottomPosition - headerTopPosition + headerHeight }, 500);
			// $("#header-animator-inside").animate({ top: headerTopPosition + headerHeight, height: headerBottomPosition - headerTopPosition - headerHeight }, 500);
		}).bind(this), 500);
		setTimeout((function () {
			// this.html.panel.header_in.style.visibility = "hidden";
			// this.html.panel.header_out.style.visibility = "hidden";
			this.html.panel.header_top.style.visibility = "visible";
			this.html.panel.header_bot.style.visibility = "visible";
		}).bind(this), 1000);
	}
	close() {
		$("#options").animate({ left: $("#options").data("left") }, 500);
		$("#thumbprint").animate({ left: $("#thumbprint").data("left") }, 500);
		$("#options-content").animate({ opacity: 0 }, 500);
		$(".header").css("visibility", "hidden");
	}
	
	createGlobe() {
		debugger
		var newData = [];
		this.globeCount++;
		// $("#globe canvas").remove();
		newData = data.slice();
		let globe = new Globe(window.innerWidth, window.innerHeight, {
			font: "Inconsolata",
			data: newData, // copy the data array
			tiles: grid.tiles, });
		this.telescope = new Block(this.terminal)
		this.telescope.on("resized", (this.onWindowResize).bind(this))
		this.terminal.container.append(this.telescope.node)
		// document.body.append(this.telescope.node)
		this.telescope.node.append(globe.domElement);
		globe.init(()=>{console.log('globe callback!')});
		this.globe = globe;
		this.onWindowResize()
	}
	onWindowResize() {
		let rect = this.telescope.node.getBoundingClientRect()
		console.log('resizing', this.telescope.node.innerWidth ,this.telescope.node.innerHeight)
		// return
		this.globe.camera.aspect = rect.width / rect.height;
		this.globe.camera.updateProjectionMatrix();
		this.globe.renderer.setSize(rect.width, rect.height);
	}

	bitcoin(){
		// console.log('Loaded!', window.innerWidth, window.innerHeight);
		this.model_viewer = new Block(this.terminal)
		this.terminal.container.append(this.model_viewer.node)
		let rect = this.model_viewer.node.getBoundingClientRect()
		const scene = new T.Scene();
		const renderer = new T.WebGLRenderer();
		const environment = new RoomEnvironment();
		const pmremGenerator = new T.PMREMGenerator(renderer);
		scene.environment = pmremGenerator.fromScene(environment).texture;
		scene.background = new T.Color(0x000000);
		const camera = new T.PerspectiveCamera( 75, rect.width / rect.height, 0.1, 1000 );
		renderer.setSize(rect.width, rect.height);
		// document.body.appendChild(renderer.domElement);
		let mesh = window.bitcoin// = loaded.tank;
		console.log(mesh, mesh.position, mesh.constructor);
		mesh.scale.set( 40, 40, 40 )
		// mesh.scale.set( 0.20, 0.20, 0.20 )
		mesh.position.y = 2;
		scene.add(mesh);
		const light = new T.HemisphereLight(0xffffbb, 0x080820, 1); // fix mesh being black
		scene.add(light);
		camera.position.y = 4;
		camera.lookAt(mesh.position);
		let lastTime = 0;
		function render(time) {
			if (!lastTime) lastTime = time;
			const delta = time - lastTime;
			// mesh.rotation.x += 0.0012 * delta;
			// mesh.rotation.y += 0.0008 * delta;
			mesh.rotation.z += 0.0008 * delta;
			requestAnimationFrame(render);
			renderer.render(scene, camera);
			lastTime = time; }
		function resizer(){ // handle window resize
			let rect = this.model_viewer.node.getBoundingClientRect()
			camera.aspect = rect.width / rect.height;
			camera.updateProjectionMatrix();
			renderer.setSize(rect.width, rect.height); }
		window.requestAnimationFrame(render);
		this.model_viewer.on("resized", (resizer).bind(this))
		// document.body.append(this.model_viewer.node)
		this.model_viewer.node.append(renderer.domElement);
		resizer()
		window.requestAnimationFrame(render);
	}
    constructor(terminal, width, height) {
		this.no_move = false
        this.terminal = terminal
		this.html = {}
        this.block = new Block(terminal)
		// this.block.on("resized", this.onWindowResize)
        // this.node = this.content_panel(this.block.node)
        this.node = this.panel(this.block.node)
        // this.block.node.appendChild(this.outer)
        this.node = this.block.node
		this.node.style.display = 'none'
        
    }

    render(){ 
        // this.panel.render()
		if (this.globe) { this.globe.tick(); }
		this.lastTickTime = Date.now();
    }
}
class Planet {
	globe = undefined
	globeCount = 0;

	createGlobe() {
		var newData = [];
		globeCount++;
		$("#globe canvas").remove();
		if ($("#globe-dd:checked").length) { newData = data.slice(); }
		globe = new Globe(window.innerWidth, window.innerHeight, {
			font: "Inconsolata",
			data: newData, // copy the data array
			tiles: grid.tiles,
			baseColor: $("#globe-color").val(),
			markerColor: $("#marker-color").val(),
			pinColor: $("#pin-color").val(),
			satelliteColor: $("#satellite-color").val(),
			scale: parseFloat($("#globe-scale").val()),
			dayLength: 1000 * parseFloat($("#globe-spr").val()),
			introLinesDuration: parseFloat($("#globe-id").val()),
			maxPins: parseFloat($("#globe-mp").val()),
			maxMarkers: parseFloat($("#globe-mm").val()),
			viewAngle: parseFloat($("#globe-va").val())
		});
		$("#globe").append(globe.domElement);
		globe.init(start);
	}
	onWindowResize() {
		globe.camera.aspect = window.innerWidth / window.innerHeight;
		globe.camera.updateProjectionMatrix();
		globe.renderer.setSize(window.innerWidth, window.innerHeight);
	}
	roundNumber(num) { return Math.round(num * 100) / 100; }
	projectionToLatLng(width, height, x, y) { return { lat: 90 - 180 * (y / height), lon: 360 * (x / width) - 180, }; }

	animate() {
		if (globe) { globe.tick(); }
		lastTickTime = Date.now();
		requestAnimationFrame(animate);
	}
	start() {
		if (globeCount == 1) { // only do this for the first globe that's created. very messy
			$("#apply-button").click(function (e) { globe.destroy(function () { createGlobe(); }); });
			$(".projection").click(function (e) {
				var offset = $(this).offset();
				var latLon = projectionToLatLng($(".projection").width(), $(".projection").height(), e.clientX - offset.left, e.clientY - offset.top);
				var selectedId = $("#add-element .selected").attr("id");
				if (selectedId == "add-pin") { globe.addPin(latLon.lat, latLon.lon, "User Dropped Pin"); }
				else if (selectedId == "add-marker") { globe.addMarker(latLon.lat, latLon.lon, "User Marker", true); }
				else if (selectedId == "add-satellite") {
					var opts = { coreColor: $("#satellite-color").val(), numWaves: parseInt($("#globe-si").val()) };
					globe.addSatellite(latLon.lat, latLon.lon, parseFloat($("#globe-sa").val()), opts);
				}
			});
			$("#add-element li").click(function (e) {
				$("#add-element li").removeClass("selected");
				$(e.currentTarget).addClass("selected");
			});
			animate();
			setInterval(function () { /* add pins at random locations */
				if (!globe || !$("#globe-dd:checked").length) { return; }
				var lat = Math.random() * 180 - 90, lon = Math.random() * 360 - 180, name = "Test " + Math.floor(Math.random() * 100);
				globe.addPin(lat, lon, name);
			}, 5000);
		}
		if ($("#globe-dd:checked").length) { /* add 6 satellites in random locations */
			setTimeout(function () {
				var constellation = [];
				var opts = { coreColor: $("#satellite-color").val(), numWaves: parseInt($("#globe-si").val()) };
				var alt = parseFloat($("#globe-sa").val());
				for (var i = 0; i < 2; i++) {
					for (var j = 0; j < 3; j++) { constellation.push({ lat: 50 * i - 30 + 15 * Math.random(), lon: 120 * j - 120 + 30 * i, altitude: alt }); }
				}
				globe.addConstellation(constellation, opts);
			}, 4000);
			setTimeout(function () { /* add the connected points that are in the movie */
				globe.addMarker(49.25, -123.1, "Vancouver");
				globe.addMarker(35.6895, 129.69171, "Tokyo", true);
			}, 2000);
		}
	}

	openOptions() {
		var headerTopPosition = $("#header-top").position().top;
		var headerBottomPosition = $("#header-bottom").position().top;
		var headerHeight = $("#header-top").outerHeight(); /* margins or something, whatever */
		$(".header-animator").offset({ top: $(document).height() / 2, left: 25 });
		$(".header-animator").height(0);
		$("#options").data("left", $("#options").css("left"));
		$("#thumbprint").data("left", $("#thumbprint").css("left"));
		$("#options").animate({ left: 0 }, 500);
		$("#thumbprint").animate({ left: 265 }, 500);
		$("#options-content").delay(1500).animate({ opacity: 1 }, 500);
		setTimeout(function () {
			$(".header-animator").css("visibility", "visible");
			$("#header-animator-outside").animate({ top: headerTopPosition, height: headerBottomPosition - headerTopPosition + headerHeight }, 500);
			$("#header-animator-inside").animate({ top: headerTopPosition + headerHeight, height: headerBottomPosition - headerTopPosition - headerHeight }, 500);
		}, 500);
		setTimeout(function () {
			$(".header-animator").css("visibility", "hidden");
			$(".header").css("visibility", "visible");
		}, 1000);
	}
	closeOptions() {
		$("#options").animate({ left: $("#options").data("left") }, 500);
		$("#thumbprint").animate({ left: $("#thumbprint").data("left") }, 500);
		$("#options-content").animate({ opacity: 0 }, 500);
		$(".header").css("visibility", "hidden");
	}
	// $(function () {
	// 	var open = false;
	// 	if (!Detector.webgl) {
	// 		Detector.addGetWebGLMessage({ parent: document.getElementById("container") });
	// 		return;
	// 	}
	// 	window.addEventListener('resize', onWindowResize, false);
	// 	$("#globe-color").spectrum({
	// 		color: "#ffcc00",
	// 		showButtons: false,
	// 		showInput: false,
	// 		change: function (color) { if (globe) { globe.setBaseColor(color.toHexString()); } }
	// 	});
	// 	$("#pin-color").spectrum({
	// 		color: "#8FD8D8",
	// 		showButtons: false,
	// 		showInput: false,
	// 		change: function (color) { if (globe) { globe.setPinColor(color.toHexString()); } }
	// 	});
	// 	$("#marker-color").spectrum({
	// 		color: "#ffcc00",
	// 		showButtons: false,
	// 		showInput: false,
	// 		change: function (color) { if (globe) { globe.setMarkerColor(color.toHexString()); } }
	// 	});
	// 	$("#satellite-color").spectrum({
	// 		color: "#ff0000",
	// 		showButtons: false,
	// 		showInput: false,
	// 		change: function (color) { if (globe) { for (var x in globe.satellites) { globe.satellites[x].changeCanvas(null, null, color.toHexString()); } } }
	// 	});
	// 	$("[data-slider]")
	// 		.each(function () {
	// 			var input = $(this);
	// 			$("<span>").addClass("slider-output").insertAfter($(this)).html(input.val());
	// 		})
	// 		.bind("slider:ready slider:changed", function (event, data) { $(this).nextAll(".slider-output:first").html(data.value.toFixed(3)); });
	// 	$(":checkbox").switchButton();
	// 	$("#globe-scale").bind("slider:changed", function (event, data) { if (globe) { globe.setScale(data.value); } });
	// 	$("#globe-va").bind("slider:changed", function (event, data) { if (globe) { globe.viewAngle = data.value; } });
	// 	$("#globe-spr").bind("slider:changed", function (event, data) { if (globe) { globe.dayLength = data.value * 1000; } });
	// 	$("#globe-mp").bind("slider:changed", function (event, data) { if (globe) { globe.setMaxPins(data.value); } });
	// 	$("#globe-mm").bind("slider:changed", function (event, data) { if (globe) { globe.setMaxMarkers(data.value); } });
	// 	$("#globe-sa").bind("slider:changed", function (event, data) { if (globe) { for (var x in globe.satellites) { globe.satellites[x].changeAltitude(data.value); } } });
	// 	$("#globe-si").bind("slider:changed", function (event, data) { if (globe) { for (var x in globe.satellites) { globe.satellites[x].changeCanvas(data.value); } } });
	// 	var docHeight = $(document).height();
	WebFontConfig = {
		google: { families: ['Inconsolata'] },
		active: function () {
			/* don't start the globe until the font has been loaded */
			$("#options").css({
				"visibility": "visible",
				"top": docHeight / 2,
				"bottom": docHeight / 2
			}).animate({
				"top": 0,
				"bottom": 0,
				"padding-top": 46
			}, 800,
				function complete() {
					$("#thumbprint").animate({ opacity: 1 });
					$("#thumbprint").click(function () {
						if (!open) {
							open = true;
							openOptions();
						}
						else {
							open = false;
							closeOptions();
						}
					});
					setTimeout(function () {
						open = true;
						openOptions();
					}, 3000);
					createGlobe();
				});
		}
	};
		/* Webgl stuff */
		/* web font stuff*/
// 		var wf = document.createElement('script');
// wf.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js';
// wf.type = 'text/javascript';
// wf.async = 'true';
// var s = document.getElementsByTagName('script')[0];
// s.parentNode.insertBefore(wf, s);
	// });
}


`	<div id="container">
		<div id="globe"> </div>
		<div id="options">
			<div id="options-content">
				<h3>Add element by clicking map below</h3>
				<img class="projection" src="resources/point_picker.png" width="280px" />
				<ul id="add-element">
					<li id="add-pin" class="button selected">Drop Pin</li>
					<li id="add-marker" class="button">Marker</li>
					<li id="add-satellite" class="button">Satellite</li> </ul>
				<h3>Configure Globe</h3>
				<div>
					<label> Color Palette </label>
					<ul id="color-options">
						<li title="Globe Color"><input type="text" id="globe-color" value="#ffcc00"></li>
						<li title="Pin Color"><input type="text" id="pin-color" value="#8FD8D8"></li>
						<li title="Marker Color"><input type="text" id="marker-color" value="#ffcc00"></li>
						<li title="Satellite Core Color"><input type="text" id="satellite-color" value="#ff0000"></li> </ul>
					<label> Globe Scale </label>
					<input type="text" id="globe-scale" data-slider="true" data-slider-range=".1, 3.0" data-slider-step=".01" data-slider-highlight="true" value="1.0" />
					<label> View Angle </label>
					<input type="text" id="globe-va" data-slider="true" data-slider-range="-1.57, 1.57" data-slider-step=".01" data-slider-highlight="true" value=".1" />
					<label> Seconds per Rotation </label>
					<input type="text" id="globe-spr" data-slider="true" data-slider-range="1, 120" data-slider-step="1" data-slider-highlight="true" value="28" />
					<label> Points per Degree </label>
					<input type="text" id="globe-ppd" data-slider="true" data-slider-range=".5,4" data-slider-step=".1" data-slider-highlight="true" value="1.1"/>
					<label> Point Size </label>
					<input type="text" id="globe-ps" data-slider="true" data-slider-range=".1,1.0" data-slider-step=".1" data-slider-highlight="true" value=".6"/>
					<label> Intro Duration (ms) </label>
					<input type="text" id="globe-id" data-slider="true" data-slider-range="500,5000" data-slider-step="100" data-slider-highlight="true" value="2000" />
					<label> Max Pins </label>
					<input type="text" id="globe-mp" data-slider="true" data-slider-range="10,1000" data-slider-step="10" data-slider-highlight="true" value="500" />
					<label> Max Markers </label>
					<input type="text" id="globe-mm" data-slider="true" data-slider-range="1,10" data-slider-step="1" data-slider-highlight="true" value="4" />
					<label> Satellite Altitude </label>
					<input type="text" id="globe-sa" data-slider="true" data-slider-range="1.0,3.0" data-slider-step=".01" data-slider-highlight="true" value="1.3" />
					<label> Satellite Intensity </label>
					<input type="text" id="globe-si" data-slider="true" data-slider-range="3,12" data-slider-step="1" data-slider-highlight="true" value="8" />
					<label> Load Dummy Data </label>
					<div class="switch">
						<input type="checkbox" id="globe-dd" value="1" checked> </div> </div>
				<div id="apply-button" class="button">Reload</div> </div> </div>
		<div class="header" id="header-top">
			<div class="header-left-section">CENTRAL SYSTEM DATA ... 
				<span class="alt-1">LAUNCH ENCOM GLOBALIZATION</span></div>
			<div class="header-right-section">OIA | 012</div> </div>
		<div class="header" id="header-bottom">
			<div class="header-left-section">TOUCHPOINT KEYBOARD ... 
				<span class="alt-1">INTERACTION SEQUENCING</span> </div>
			<div class="header-right-section">SYS | O12</div> </div>
		<div id="thumbprint">
			<img src="resources/thumbprint.png" /> </div>
		<!-- probably should remove these and have them created in the script-->
		<div class="header-animator" id="header-animator-inside"></div>
		<div class="header-animator" id="header-animator-outside"></div> </div>`