// https://stackoverflow.com/questions/65974267/instancedmesh-with-unique-texture-per-instance
var camera, scene, renderer, stats;

    var mesh;
    var amount = parseInt( window.location.search.substr( 1 ) ) || 10;
    var count = Math.pow( amount, 3 );
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2( 1, 1 );

    var rotationTheta = 0.1;
    var rotationMatrix = new THREE.Matrix4().makeRotationY( rotationTheta );
    var instanceMatrix = new THREE.Matrix4();
    var matrix = new THREE.Matrix4();

    init();
    animate();

    function init() {

        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.set( amount, amount, amount );
        camera.lookAt( 0, 0, 0 );

        scene = new THREE.Scene();

        var light = new THREE.HemisphereLight( 0xffffff, 0x000088 );
        light.position.set( - 1, 1.5, 1 );
        scene.add( light );

        var light = new THREE.HemisphereLight( 0xffffff, 0x880000, 0.5 );
        light.position.set( - 1, - 1.5, - 1 );
        scene.add( light );

        var geometry = new THREE.BoxBufferGeometry( .5, .5, .5, 1, 1, 1 );
        var material = [
            new THREE.MeshStandardMaterial( { map: new THREE.TextureLoader().load( 'https://threejs.org/examples/textures/square-outline-textured.png' ) } ),
            new THREE.MeshStandardMaterial( { map: new THREE.TextureLoader().load( 'https://threejs.org/examples/textures/golfball.jpg' ) } ),
            new THREE.MeshStandardMaterial( { map: new THREE.TextureLoader().load( 'https://threejs.org/examples/textures/metal.jpg' ) } ),
            new THREE.MeshStandardMaterial( { map: new THREE.TextureLoader().load( 'https://threejs.org/examples/textures/roughness_map.jpg' ) } ),
            new THREE.MeshStandardMaterial( { map: new THREE.TextureLoader().load( 'https://threejs.org/examples/textures/tri_pattern.jpg' ) } ),
            new THREE.MeshStandardMaterial( { map: new THREE.TextureLoader().load( 'https://threejs.org/examples/textures/water.jpg' ) } ),
        ];

        material.forEach((m,side)=>{
            if ( side!=2 ) return;
            m.onBeforeCompile = ( shader ) => {
                shader.uniforms.textures = { 'type': 'tv', value: [
                    new THREE.TextureLoader().load( 'https://threejs.org/examples/textures/crate.gif' ),
                    new THREE.TextureLoader().load( 'https://threejs.org/examples/textures/equirectangular.png' ),
                    new THREE.TextureLoader().load( 'https://threejs.org/examples/textures/colors.png' )
                 ] };
                shader.vertexShader = shader.vertexShader.replace(
                        '#define STANDARD',
                        `#define STANDARD
                        varying vec3 vTint;
                        varying float vTextureIndex;`
                ).replace(
                    '#include <common>',
                    `#include <common>
                    attribute vec3 tint;
                    attribute float textureIndex;`
                ).replace(
                    '#include <project_vertex>',
                    `#include <project_vertex>
                    vTint = tint;
                    vTextureIndex=textureIndex;`
                );

                shader.fragmentShader = shader.fragmentShader.replace(
                        '#define STANDARD',
                        `#define STANDARD
                        uniform sampler2D textures[3];
                        varying vec3 vTint;
                        varying float vTextureIndex;`
                )
                .replace(
                    '#include <fog_fragment>',
                    `#include <fog_fragment>
                    float x = vTextureIndex;
                    vec4 col;
                    col = texture2D(textures[0], vUv ) * step(-0.1, x) * step(x, 0.1);
                    col += texture2D(textures[1], vUv ) * step(0.9, x) * step(x, 1.1);
                    col += texture2D(textures[2], vUv ) * step(1.9, x) * step(x, 2.1);

                    gl_FragColor = col;
                    `
                )
                ;
            }
        });

        mesh = new THREE.InstancedMesh( geometry, material, count );

        var i = 0;
        var offset = ( amount - 1 ) / 2;
        var transform = new THREE.Object3D();
        var textures = [];
        for ( var x = 0; x < amount; x ++ ) {
            for ( var y = 0; y < amount; y ++ ) {
                for ( var z = 0; z < amount; z ++ ) {
                    transform.position.set( offset - x, offset - y, offset - z );
                    transform.updateMatrix();
                    mesh.setMatrixAt( i ++, transform.matrix );
                    textures.push(Math.random()<0.3 ? 0 : (Math.random()<0.5 ? 1 : 2));
                }
            }
        }

        geometry.setAttribute( 'textureIndex', new THREE.InstancedBufferAttribute( new Float32Array(textures), 1 ) );
        scene.add( mesh );

        renderer = new THREE.WebGLRenderer( { antialias: false } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
        new THREE.OrbitControls( camera, renderer.domElement );
        stats = new Stats();
        document.body.appendChild( stats.dom );
        window.addEventListener( 'resize', onWindowResize, false );
        document.addEventListener( 'mousemove', onMouseMove, false );

    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    function onMouseMove( event ) {
        event.preventDefault();
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }

    function animate() {
        requestAnimationFrame( animate );
        render();
    }

    function render() {
        raycaster.setFromCamera( mouse, camera );
        var intersection = raycaster.intersectObject( mesh );
        // console.log('intersection', intersection.length);
        if ( intersection.length > 0 ) {
            mesh.getMatrixAt( intersection[ 0 ].instanceId, instanceMatrix );
            matrix.multiplyMatrices( instanceMatrix, rotationMatrix );
            mesh.setMatrixAt( intersection[ 0 ].instanceId, matrix );
            mesh.instanceMatrix.needsUpdate = true;
        }
        renderer.render( scene, camera );
        stats.update();
    }


///https://stackoverflow.com/questions/55116131/how-can-we-change-the-rotation-origin-pivot-point-of-a-three-js-object-without
let renderer;
let camera;
let controls;

let scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(54, window.innerWidth / window.innerHeight, 0.1, 1000);

renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color(0xfefefe));
document.body.appendChild(renderer.domElement);

camera.position.x = 5;
camera.position.y = 15.5;
camera.position.z = 5.5;
camera.lookAt(0, 0, 0);

controls = new THREE.OrbitControls(camera);

// white spotlight shining from the side, casting a shadow
let spotLight = new THREE.SpotLight(0xffffff, 2.5, 25, Math.PI / 6);
spotLight.position.set(9, 10, 1);
scene.add(spotLight);
var light = new THREE.AmbientLight(0x202020); // soft white light
scene.add(light);

// example starts here
let gridHelper = new THREE.GridHelper(4, 4);
scene.add(gridHelper);
var axesHelper = new THREE.AxesHelper(1);
axesHelper.applyMatrix(new THREE.Matrix4().makeTranslation(1.5, 0, -1.5));
scene.add(axesHelper);

const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const material = new THREE.MeshStandardMaterial({
    color: 0xff0000
});
const topBox = new THREE.Mesh(geometry, material);
topBox.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 8));
topBox.applyMatrix(new THREE.Matrix4().makeTranslation(0.5, 1, -0.5));
scene.add(topBox);

let animate = function() {
    requestAnimationFrame(animate);

    // get world transforms from desired pivot
    axesHelper.updateMatrixWorld(true);
    var pivot_matrix = axesHelper.matrixWorld.clone();
    // inverse it to know how to move pivot to [0,0,0]
    let pivot_inv = new THREE.Matrix4().getInverse(pivot_matrix, false);

    // place pivot to [0,0,0]
    // apply same transforms to object
    axesHelper.applyMatrix(pivot_inv);
    topBox.applyMatrix(pivot_inv);

    // say, we want to rotate 0.1deg around Y axis of pivot
    var desiredTransform = new THREE.Matrix4().makeRotationY(Math.PI / 180);
    axesHelper.applyMatrix(desiredTransform);
    topBox.applyMatrix(desiredTransform);

    // and put things back, i.e. apply pivot initial transformation
    axesHelper.applyMatrix(pivot_matrix);
    topBox.applyMatrix(pivot_matrix);

    controls.update();
    renderer.render(scene, camera);
};

animate();