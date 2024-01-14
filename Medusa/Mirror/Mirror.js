import { HTML } from "Medusa/Parseltongue/HTML/HTML.js";

export class Mirror{
    modules = {
        'top':{
            'rows':{
                'screen':'svg',
                'toolbar':{'button_1':['button','alert','alerts','bell']},
                'terminal':{'terminal_9':['text','focus','type here',''],'process_1':['button','alert','alerts','bell']},
                'history':[5,{'terminal_9':['text','focus','type here',''],'process_1':['button','alert','alerts','bell']}],
            },
        },
        'bottom':{},
        'left':{},
        'right':{},
        'front':{},
        'back':{},
        'camera':{},
        'script':{},
    }
    
    style_overlay(overlay,width,height){
        let style = {
            width: `${width}px`,
            height: `${height}px`,
            display:'block',
            background: '#000000FF'//'#21282C88'//'rgba(28, 105, 212, 0.95)'
        }
        HTML.style(overlay, style);
    }

    create_world(width,height) {
        let world = {};
        world.scene = new THREE.Scene();
        world.scene.background = new THREE.Color(0xffffff);
        // world.scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);
        // world.cameras = [new THREE.PerspectiveCamera(45, width / height, 0.001, 10)];
        // world.cameras = [new THREE.PerspectiveCamera( 40, width / height, 1, 10000 )];
        // world.cameras[0].z = 3000;
        world.cameras = [new THREE.PerspectiveCamera( 33, width / height, 1, 10000 )];
        world.cameras[0].position.z = 1024;
        // world.cameras[0].position.set(0.0, 0.0, -0.02);
        // world.cameras[0].position.set(0.2050682233931717, 1.1663507799900064, -0.48179537459518473);
        // world.cameras[0].rotation.set(-1.570797326764811, -7.75694065707419e-9, -3.1338356351402967);
        // world.cameras[0].lookAt(0, 1, 0);
        world.clock = new THREE.Clock();
        world.ground = new THREE.Mesh( new THREE.PlaneBufferGeometry(40, 40), new THREE.MeshPhongMaterial({color: 0x999999, depthWrite: false}));
        world.ground.rotation.x = -Math.PI / 2;
        world.ground.receiveShadow = true;
        world.illumination = new THREE.HemisphereLight(0xffffff, 0x444444);
        world.illumination.position.set(0, 20, 0);
        world.key_light = new THREE.DirectionalLight(0xffffff);
        world.key_light.position.set(-3, 10, -10);
        world.key_light.castShadow = true;
        world.key_light.shadow.camera.top = 2;
        world.key_light.shadow.camera.bottom = -2;
        world.key_light.shadow.camera.left = -2;
        world.key_light.shadow.camera.right = 2;
        world.key_light.shadow.camera.near = 0.1;
        world.key_light.shadow.camera.far = 40;
        world.scene.add(world.illumination);
        world.scene.add(world.key_light);
        world.scene.add(world.ground);
        world.renderer = new THREE.WebGLRenderer({ antialias: true });
        world.renderer.setPixelRatio(window.devicePixelRatio);
        world.renderer.setSize(width, height);
        world.renderer.gammaOutput = true;
        world.renderer.gammaFactor = 2.2;
        world.renderer.shadowMap.enabled = true;
        world.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        window.addEventListener('resize',
            function() {
                world.cameras[0].aspect = width / height;
                world.cameras[0].updateProjectionMatrix();
                world.renderer.setPixelRatio(window.devicePixelRatio);
                world.renderer.setSize(width, height);}, false);
        // document.body.prepend(world.renderer.domElement);
        world.domElement = world.renderer.domElement
        this.style_overlay(world.domElement,width,height)
        // world.controls = new OrbitControls( world.cameras[0], world.domElement);
        return world;
    }

    create_map(width,height){
        let map = HTML.make("scope-radar", "", [], {}); 
        this.style_overlay(map,width,height)
        return map;
        
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
                var [gatepass, parseltongue, payload] = data
                let [json,blob] = payload
                if(json){ 
                    const t = this.terminal
                    payload = json
                    var {gatepass, parseltongue, payload} = payload
                    var {address, script} = payload
                    t.addressbar.set_address(address)
                    t.document.load_script(script)
                    t.log.value = parseltongue
                    return [gatepass, parseltongue, payload]
                } 
                else{
                    payload = blob
                    var image = document.createElement('img');
                    let sp = this.terminal.superposition
                    const object_url = URL.createObjectURL(payload);
                    const buffer = await payload.arrayBuffer();
                    const metadata = readMetadata(buffer);
                    // console.log(metadata)                    
                    image.onload = function(e) { sp.image_hvrp(this, metadata, this.draw_scale) };
                    image.src = object_url
                    var {gatepass, parseltongue, payload} = JSON.parse(metadata['tEXt'].data)
                    return [gatepass, parseltongue, payload]
                    // return [JSON.parse(metadata['tEXt'].gatepass), JSON.parse(metadata['tEXt'].parseltongue), JSON.parse(metadata['tEXt'].payload)]
                    // return metadata['tEXt'].asset_hash
                }
        }
    }


    refresh(...args){
        this.viewterminal.input.draw_script()
        // const t = this.terminal
        // const form = {}
        // form['parseltongue'] =  'mirror:parseltongue script'
        // form['payload'] = {address:t.addressbar.address, task_id:1}
        // this.program.queue('TaskMaster', 'retrieve render', '', form, this);
    }

    create_superposition(){
        var tile = new Tile();
        tile.setRenderer( this.world.renderer );
        tile.minFilter = tile.magFilter = THREE.NearestFilter;
        tile.generateMipmaps = false;
        var width = 512;
        var height = 512;
        var plane = new THREE.Mesh(
            new THREE.PlaneBufferGeometry( width, height ),
            new THREE.MeshBasicMaterial({ map: tile, side: THREE.DoubleSide, transparent: true,}));
        this.world.scene.add( plane );
        // renderer.render( scene, camera );
        var s = 32;
        tile.setSize( width, height );
        // tile.update_test();
        return tile;
    }

    constructor(program, width, height) {
        let [row, editable, header, submitter_text, css_prefix] = [false, true, false, false, 'col-'];
        // var container = HTML.make("div", row?"row-container":"container", [], {});
        var container = HTML.make("div","viewer-terminal", [], {});
        // HTML.style(container, {'width':'fit-content'});
        // HTML.style(container, {'width':'800px','height':'400px'});
        HTML.style(container, {'width':`${width}px`,'height':`${height}px`});
        // var [f, submitters] = HTML.chain(container,`div:${css_prefix}submitters:`);
        // container.tabs = new Map();
        // this.map = this.create_map(800,400);
        // this.world = this.create_world(800,400);
        // this.superpositions = {'test':this.create_superposition()}
        // container.tabs.set('world',this.world.domElement);
        // container.tabs.set('map',this.map);
        // var [f, field_seperator] = HTML.chain(tab,'div:line:');
        let index = 0;
        // var [f, field_seperator] = HTML.chain(container,'div:line:');
        // for(const [option_name, tab] of container.tabs.entries()) {
        //     if(index===0){ 
        //         HTML.put(container, tab ,1);}
        //     var [container, option_button] = HTML.chain(container, `button:button ${css_prefix}button ${css_prefix}blue:${HTML.titleCase(option_name)}/i:icon ion-md-lock:`);
        //     HTML.configure(option_button, {type:'button'});
        //     option_button.addEventListener('click', function (e) {
        //         let tab_position = 1;
        //         container.replaceChild(container.tabs.get(option_name), container.children[tab_position]);
        //     }, false);
        //     index++;
        // }
        var [viewterminal, seperator] = HTML.ladder(container,'viewer-terminal::/div:line:');
        let style = {
            // width: `${width}px`,
            // height: `${height}px`,
            width: `99%`,
            height: `99%`,
            display:'block',
            background: '#00000000'//'#21282C88'//'rgba(28, 105, 212, 0.95)'
        }
        HTML.style(viewterminal, style);
        this.html = container;
        this.program = program;
        this.viewterminal = viewterminal;
        // this.viewterminal.set_program(program)
        window.terminal = this.viewterminal 
    }
    // constructor(){
    //     this.html = HTML.make('viewer-terminal','',[],{});
    // }
    render(){
        // this.world.controls.update();
        // this.world.renderer.render(this.world.scene, this.world.cameras[0]);
        this.viewterminal.render()
    }

}


// var mouseX = 0, mouseY = 0,
// windowHalfX = window.innerWidth / 2,
// windowHalfY = window.innerHeight / 2,
// camera, scene, renderer, controls;
// init();
// animate();

function init() {

    var container = document.createElement( 'div' );
    document.body.appendChild( container );
    camera = new THREE.PerspectiveCamera( 33, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1024;
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    controls = new THREE.OrbitControls( camera );

    var texture = new Tile();
    texture.setRenderer( renderer );
    texture.minFilter = texture.magFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    var width = 512;
    var height = 512;
    var plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry( width, height ),
        new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide}));
    scene.add( plane );
    renderer.render( scene, camera );
    var s = 32;
    texture.setSize( width, height );
    
    fade();
    window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
    requestAnimationFrame( animate );
    render();
}
function render() {
    controls.update();
    renderer.render( scene, camera );
}