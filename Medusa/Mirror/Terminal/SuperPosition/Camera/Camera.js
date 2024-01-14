import * as THREE from 'three';
import { CinematicCamera } from '../../../../../../text/javascript/threejs//examples/jsm/cameras/CinematicCamera.js';
import { Instance } from '../Instance/Instance.js';
export class Camera{
	// 1 micrometer to 100 billion light years in one scene, with 1 unit = 1 meter?  preposterous!  and yet...

	static NEAR = 1e-6
	static FAR = 1e27

	// Generate a number of text labels, from 1µm in size up to 100,000,000 light years
	// Try to use some descriptive real-world examples of objects at each scale
	labeldata = [
		{ size: .01, scale: 0.0001, label: 'microscopic (1µm)' }, // FIXME - triangulating text fails at this size, so we scale instead
		{ size: .01, scale: 0.1, label: 'minuscule (1mm)' },
		{ size: .01, scale: 1.0, label: 'tiny (1cm)' },
		{ size: 1, scale: 1.0, label: 'child-sized (1m)' },
		{ size: 10, scale: 1.0, label: 'tree-sized (10m)' },
		{ size: 100, scale: 1.0, label: 'building-sized (100m)' },
		{ size: 1000, scale: 1.0, label: 'medium (1km)' },
		{ size: 10000, scale: 1.0, label: 'city-sized (10km)' },
		{ size: 3400000, scale: 1.0, label: 'moon-sized (3,400 Km)' },
		{ size: 12000000, scale: 1.0, label: 'planet-sized (12,000 km)' },
		{ size: 1400000000, scale: 1.0, label: 'sun-sized (1,400,000 km)' },
		{ size: 7.47e12, scale: 1.0, label: 'solar system-sized (50Au)' },
		{ size: 9.4605284e15, scale: 1.0, label: 'gargantuan (1 light year)' },
		{ size: 3.08567758e16, scale: 1.0, label: 'ludicrous (1 parsec)' },
		{ size: 1e19, scale: 1.0, label: 'mind boggling (1000 light years)' }
	];

	setup_postprocess(){
		this.effectController = {
			focalLength: 15,
			// jsDepthCalculation: true,
			// shaderFocus: false,
			fstop: 2.8,
			// maxblur: 1.0,
			showFocus: false,
			focalDepth: 3,
			// manualdof: false,
			// vignetting: false,
			// depthblur: false,
			// threshold: 0.5,
			// gain: 2.0,
			// bias: 0.5,
			// fringe: 0.7,
			// focalLength: 35,
			// noise: true,
			// pentagon: false,
			// dithering: 0.0001
		};

		this.camera.setLens( 5 );
		this.camera.position.set( 2, 1, 500 );
	}

	set focalLength(value){ //1, 135, 0.01 
		this.effectController.focalLength = value;
		this.update();
	}

	set fstop(value){ //1.8, 22, 0.01 
		this.effectController.fstop = value;
		this.update();
	}

	set focalDepth(value){ //0.1, 100, 0.001 
		this.effectController.focalDepth = value;
		this.update();
	}

	set showFocus(value){ //true 
		this.effectController.showFocus = value;
		this.update();
	}
	
	update() {
		for ( const e in this.effectController ) {
			if ( e in this.camera.postprocessing.bokeh_uniforms ) {
				this.camera.postprocessing.bokeh_uniforms[ e ].value = this.effectController[ e ];
			}
		}
		this.camera.postprocessing.bokeh_uniforms[ 'znear' ].value = this.camera.near;
		this.camera.postprocessing.bokeh_uniforms[ 'zfar' ].value = this.camera.far;
		this.camera.setLens( this.effectController.focalLength, this.camera.frameHeight, this.effectController.fstop, this.camera.coc );
		this.effectController[ 'focalDepth' ] = this.camera.postprocessing.bokeh_uniforms[ 'focalDepth' ].value;
	}

	set focus(distance){
		this.camera.focusAt( distance ); 
	}

	constructor(resolution){
        // this.camera = new THREE.PerspectiveCamera( 33, resolution.x / resolution.y, 1, 10000 );
        // this.camera = new THREE.PerspectiveCamera( 33, resolution.x / resolution.y, 1e-2, Camera.FAR);
        this.camera = new THREE.PerspectiveCamera( 33, resolution.x / resolution.y, 50, Camera.FAR);
		this.camera = new CinematicCamera( 60, resolution.x / resolution.y, 1, 1000 );
		this.setup_postprocess();
		this.zoompos = - 100
		this.minzoomspeed = .015;
		this.zoomspeed = this.minzoomspeed;
		// this.mouse = [ .5, .5 ];
		this.mouse = new THREE.Vector2( 1, 1 );
		// this.camera = new THREE.PerspectiveCamera( 50, resolution.x / resolution.y, Camera.NEAR, Camera.FAR );
        this.camera.position.x = 100;
        // this.camera.position.z = 1024;
		this.raycaster = new THREE.Raycaster();
		this.castray = false


	}

	render(renderer, scene){
		if ( this.camera.postprocessing.enabled ) {  
			this.camera.renderCinematic( scene, renderer ); 
		} 
		else {
			scene.overrideMaterial = null;
			renderer.clear();
			renderer.render( scene, this.camera );
		}
	}
	event_mouse_move( ev ) {
		// this.mouse.x= ev.clientX / window.innerWidth;
		// this.mouse.y= ev.clientY / window.innerHeight; 

		this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	}

	event_mouse_wheel( ev ) {
		const amount = ev.deltaY;
		if ( amount === 0 ) return;
		const dir = amount / Math.abs( amount );
		this.zoomspeed = dir / 10; // Slow down default zoom speed after user starts zooming, to give them more control
		this.minzoomspeed = 0.001;
	}

	event_pointer_down(ev){
		this.mouse.x= ev.clientX / window.innerWidth;
		this.mouse.y= ev.clientY / window.innerHeight;
		this.castray = true
	}

	raycast(mesh){
		if (this.castray){
			this.raycaster.setFromCamera( this.mouse, this.camera );
			const intersection = this.raycaster.intersectObject( mesh );
			console.clear()
			if ( intersection.length > 0 ) {
				
				const instanceId = intersection[ 0 ].instanceId;
				const matrix = new THREE.Matrix4(); // create one and reuse it
				const dummy = new THREE.Object3D();
				mesh.getMatrixAt(instanceId, matrix);
				matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
				var rotation = new THREE.Euler().setFromQuaternion( dummy.quaternion, 'XYZ');
				THREE.MathUtils.radToDeg(rotation.x)
				THREE.MathUtils.radToDeg(rotation.y)
				THREE.MathUtils.radToDeg(rotation.z)
				console.log(instanceId, dummy.position, rotation, dummy.scale)
				// vector.applyMatrix4( object.matrixWorld );
				Instance.change_texture(instanceId, 0)
				// TEXTURE CHANGE
				// const texture_array = mesh.geometry.attributes.texture_index.array;
				// for(const i of intersection){
				// 	texture_array[i.instanceId] = 0	
				// }
				// mesh.geometry.attributes.texture_index.needsUpdate = true;

				// mesh.getColorAt( instanceId, color );
				// if ( color.equals( white ) ) {
				// 	mesh.setColorAt( instanceId, color.setHex( Math.random() * 0xffffff ) );
				// 	mesh.instanceColor.needsUpdate = true;}
			}
			this.castray = false
			console.log('no hit raycast')

		}
	}
	initScene( font ) {
		const scene = new THREE.Scene();
		scene.add( new THREE.AmbientLight( 0x222222 ) );
		const light = new THREE.DirectionalLight( 0xffffff, 1 );
		light.position.set( 100, 100, 100 );
		scene.add( light );
		const materialargs = { color: 0xffffff, specular: 0x050505, shininess: 50, emissive: 0x000000 };
		const geometry = new THREE.SphereGeometry( 0.5, 24, 12 );
		for ( let i = 0; i < labeldata.length; i ++ ) {
			const scale = labeldata[ i ].scale || 1;
			const size = labeldata[ i ].size;
			const label = labeldata[ i ].label;
			const text_geometry = new TextGeometry( label, { font: font, size: size, height: size / 2 } );
			text_geometry.computeBoundingSphere();
			text_geometry.translate( - text_geometry.boundingSphere.radius, 0, 0 ); // center text

			materialargs.color = new THREE.Color().setHSL( Math.random(), 0.5, 0.5 );
			const material = new THREE.MeshPhongMaterial( materialargs );
			const group = new THREE.Group();

			group.position.z = - size * scale;
			scene.add( group );
			
			const textmesh = new THREE.Mesh( text_geometry, material );
			textmesh.scale.set( scale, scale, scale );
			textmesh.position.z = - size * scale;
			textmesh.position.y = size / 4 * scale;
			group.add( textmesh );

			const dotmesh = new THREE.Mesh( geometry, material );
			dotmesh.position.y = - size / 4 * scale;
			dotmesh.scale.multiplyScalar( size * scale );
			group.add( dotmesh );
		}
		return scene;
	}
	
	initView( scene, name, logDepthBuf ) {
		const framecontainer = document.getElementById( 'container_' + name );
		const camera = new THREE.PerspectiveCamera( 50, screensplit * SCREEN_WIDTH / SCREEN_HEIGHT, NEAR, FAR );
		scene.add( camera );
		const renderer = new THREE.WebGLRenderer( { antialias: true, logarithmicDepthBuffer: logDepthBuf } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( SCREEN_WIDTH / 2, SCREEN_HEIGHT );
		renderer.domElement.style.position = 'relative';
		renderer.domElement.id = 'renderer_' + name;
		framecontainer.appendChild( renderer.domElement );
		return { container: framecontainer, renderer: renderer, scene: scene, camera: camera };
	}
	get smallest(){ return this.labeldata[ 0 ].size * this.labeldata[ 0 ].scale * 1; }
	get largest(){  return this.labeldata[ this.labeldata.length - 1 ].size * this.labeldata[ this.labeldata.length - 1 ].scale * 100; }
	get damping(){  return ( Math.abs( this.zoomspeed ) > this.minzoomspeed ? .95 : 1.0 ); }
	get zoom(){  return ( Math.abs( this.zoomspeed ) > this.minzoomspeed ? .95 : 1.0 ); }
	
	set_camera(lookat){
		const minzoom = this.smallest
		const maxzoom = this.largest
		let damping = this.damping;
		const zoom = THREE.MathUtils.clamp( Math.pow( Math.E, this.zoompos ), minzoom, maxzoom ); // Zoom out faster the further out you go
		this.zoompos = Math.log( zoom );
		if ( ( zoom == minzoom && this.zoomspeed < 0 ) || ( zoom == maxzoom && this.zoomspeed > 0 ) ) {  damping = .85; }// Slow down quickly at the zoom limits
		this.zoompos += this.zoomspeed;
		this.zoomspeed *= damping;

		// this.camera.position.x = Math.sin( .5 * Math.PI * ( this.mouse.x- .5 ) ) * zoom;
		// this.camera.position.y = Math.sin( .25 * Math.PI * ( this.mouse.y- .5 ) ) * zoom;
		this.camera.position.z = Math.cos( .5 * Math.PI * ( this.mouse.x- .5 ) ) * zoom;
		// console.log(zoom, lookat, this.camera.position)
		this.camera.lookAt( lookat);
	}

	render() { // Put some limits on zooming
		const minzoom = labeldata[ 0 ].size * labeldata[ 0 ].scale * 1;
		const maxzoom = labeldata[ labeldata.length - 1 ].size * labeldata[ labeldata.length - 1 ].scale * 100;
		let damping = ( Math.abs( this.zoomspeed ) > this.minzoomspeed ? .95 : 1.0 );
		const zoom = THREE.MathUtils.clamp( Math.pow( Math.E, this.zoompos ), minzoom, maxzoom ); // Zoom out faster the further out you go
		this.zoompos = Math.log( zoom );
		if ( ( zoom == minzoom && this.zoomspeed < 0 ) || ( zoom == maxzoom && this.zoomspeed > 0 ) ) {  damping = .85; }// Slow down quickly at the zoom limits
		this.zoompos += this.zoomspeed;
		this.zoomspeed *= damping;

		objects.normal.camera.position.x = Math.sin( .5 * Math.PI * ( mouse.x- .5 ) ) * zoom;
		objects.normal.camera.position.y = Math.sin( .25 * Math.PI * ( mouse.y- .5 ) ) * zoom;
		objects.normal.camera.position.z = Math.cos( .5 * Math.PI * ( mouse.x- .5 ) ) * zoom;
		objects.normal.camera.lookAt( objects.normal.scene.position );

		objects.logzbuf.camera.position.copy( objects.normal.camera.position );
		objects.logzbuf.camera.quaternion.copy( objects.normal.camera.quaternion );// Clone camera settings across both scenes

		if ( screensplit_right != 1 - screensplit ) { updateRendererSizes(); }  // Update renderer sizes if the split has changed
		objects.normal.renderer.render( objects.normal.scene, objects.normal.camera );
		objects.logzbuf.renderer.render( objects.logzbuf.scene, objects.logzbuf.camera );
		stats.update();
	}

	init() { // init();
		container = document.getElementById( 'container' );
		const loader = new FontLoader();
		loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
			const scene = initScene( font );
			objects.normal = initView( scene, 'normal', false ); // Initialize two copies of the same scene, one with normal z-buffer and one with logarithmic z-buffer
			objects.logzbuf = initView( scene, 'logzbuf', true );
			animate();

		} );
		stats = new Stats();
		container.appendChild( stats.dom );
		border = document.getElementById( 'renderer_border' ); // Resize border allows the user to easily compare effects of logarithmic depth buffer over the whole scene
		border.addEventListener( 'pointerdown', onBorderPointerDown );
		window.addEventListener( 'mousemove', onMouseMove );
		window.addEventListener( 'resize', onWindowResize );
		window.addEventListener( 'wheel', onMouseWheel );
	}

}
