import * as THREE from 'three';
// import TWEEN from '@tweenjs/tween.js'
var 
    // THREE = import('three'),
    utils = import('./utils');

var vertexShader = [
    "#define PI 3.141592653589793238462643",
    "#define DISTANCE 500.0",
    "attribute float myStartTime;",
    "attribute float myStartLat;",
    "attribute float myStartLon;",
    "attribute float altitude;",
    "attribute float aactive;",
    "uniform float currentTime;",
    "uniform vec3 color;",
    "varying vec4 vColor;",
    "",
    "vec3 getPos(float lat, float lon)",
    "{",
    "   if (lon < -180.0){",
    "      lon = lon + 360.0;",
    "   }",
    "   float phi = (90.0 - lat) * PI / 180.0;",
    "   float theta = (180.0 - lon) * PI / 180.0;",
    "   float x = DISTANCE * sin(phi) * cos(theta) * altitude;",
    "   float y = DISTANCE * cos(phi) * altitude;",
    "   float z = DISTANCE * sin(phi) * sin(theta) * altitude;",
    "   return vec3(x, y, z);",
    "}",
    "",
    "void main()",
    "{",
    "   float dt = currentTime - myStartTime;",
    "   if (dt < 0.0){",
    "      dt = 0.0;",
    "   }",
    "   if (dt > 0.0 && aactive > 0.0) {",
    "      dt = mod(dt,1500.0);",
    "   }",
    "   float opacity = 1.0 - dt/ 1500.0;",
    "   if (dt == 0.0 || aactive == 0.0){",
    "      opacity = 0.0;",
    "   }",
    "   vec3 newPos = getPos(myStartLat, myStartLon - ( dt / 50.0));",
    "   vColor = vec4( color, opacity );", //     set color associated to vertex; use later in fragment shader.
    "   vec4 mvPosition = modelViewMatrix * vec4( newPos, 1.0 );",
    "   gl_PointSize = 2.5 - (dt / 1500.0);",
    "   gl_Position = projectionMatrix * mvPosition;",
    "}"
].join("\n");

var fragmentShader = [
    "varying vec4 vColor;",     
    "void main()", 
    "{",
    "   gl_FragColor = vColor;", 
    "   float depth = gl_FragCoord.z / gl_FragCoord.w;",
    "   float fogFactor = smoothstep(1500.0, 1800.0, depth );",
    "   vec3 fogColor = vec3(0.0);",
    "   gl_FragColor = mix( vColor, vec4( fogColor, gl_FragColor.w), fogFactor );",

    "}"
].join("\n");

var SmokeProvider = function(scene, _opts){

    var opts = { smokeCount: 5000, smokePerPin: 30, smokePerSecond: 20 } /* options that can be passed in */
    if(_opts){
        for(var i in opts){
            if(_opts[i] !== undefined){ opts[i] = _opts[i]; } } }
    this.opts = opts;
    // this.geometry = new THREE.Geometry();
    this.geometry = new THREE.BufferGeometry();
    this.geometry.name = 'smoke'
    const positions = [];
    const myStartTime_v = [];
    const myStartLat_v = [];
    const myStartLon_v = [];
    const altitude_v = [];
    const active_v = [];
    this.attributes = {}
    // this.attributes = {
    //     myStartTime: {type: 'f', value: []},
    //     myStartLat: {type: 'f', value: []},
    //     myStartLon: {type: 'f', value: []},
    //     altitude: {type: 'f', value: []},
    //     aactive: {type: 'f', value: []} };
    // this.uniforms = { currentTime: { type: 'f', value: 0.0}, color: { type: 'c', value: new THREE.Color("#aaa")}, }
    this.uniforms = { currentTime: { type: 'f', value: 0.0}, color: { type: 'c', value: new THREE.Color("#aaa")}, }
    var material = new THREE.ShaderMaterial( {
        uniforms:       this.uniforms,
        // attributes:     this.attributes,
        vertexShader:   vertexShader,
        fragmentShader: fragmentShader,
        transparent:    true });
    for(var i = 0; i< opts.smokeCount; i++){
        // var vertex = new THREE.Vector3();
        // vertex.set(0,0,0);
        // positions.push( vertex );
        positions.push( 0.0 );
        positions.push( 0.0 );
        positions.push( 0.0 );
        // this.geometry.vertices.push( vertex );
        myStartTime_v.push(0.0);
        myStartLat_v.push(0.0);
        myStartLon_v.push(0.0);
        altitude_v.push(0.0);
        active_v.push(0.0);
        // this.attributes.myStartTime.value[i] = 0.0;
        // this.attributes.myStartLat.value[i] = 0.0;
        // this.attributes.myStartLon.value[i] = 0.0;
        // this.attributes.altitude.value[i] = 0.0;
        // this.attributes.aactive.value[i] = 0.0;
    }
    this.geometry.setAttribute( 'position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    this.geometry.setAttribute( 'myStartTime', new THREE.BufferAttribute(new Float32Array(myStartTime_v), 1));
    this.geometry.setAttribute( 'myStartLat', new THREE.BufferAttribute(new Float32Array(myStartLat_v), 1));
    this.geometry.setAttribute( 'myStartLon', new THREE.BufferAttribute(new Float32Array(myStartLon_v), 1));
    this.geometry.setAttribute( 'altitude', new THREE.BufferAttribute(new Float32Array(altitude_v), 1));
    this.geometry.setAttribute( 'aactive', new THREE.BufferAttribute(new Float32Array(active_v), 1));
    this.attributes.myStartTime = this.geometry.getAttribute( 'myStartTime' );
    this.attributes.myStartLat = this.geometry.getAttribute( 'myStartLat' );
    this.attributes.myStartLon = this.geometry.getAttribute( 'myStartLon' );
    this.attributes.altitude = this.geometry.getAttribute( 'altitude' );
    this.attributes.aactive = this.geometry.getAttribute( 'aactive' );
    // myStartTime.needsUpdate = true;
    // myStartLat.needsUpdate = true;
    // myStartLon.needsUpdate = true;
    // altitude.needsUpdate = true;
    // aactive.needsUpdate = true;
    this.attributes.myStartTime.needsUpdate = true;
    this.attributes.myStartLat.needsUpdate = true;
    this.attributes.myStartLon.needsUpdate = true;
    this.attributes.altitude.needsUpdate = true;
    this.attributes.aactive.needsUpdate = true;

    this.smokeIndex = 0;
    this.totalRunTime = 0;

    // scene.add( new THREE.ParticleSystem( this.geometry, material));
    scene.add( new THREE.Points( this.geometry, material));

};

SmokeProvider.prototype.setFire = function(lat, lon, altitude){

    var point = utils.mapPoint(lat, lon);

    /* add the smoke */
    var startSmokeIndex = this.smokeIndex;

    for(var i = 0; i< this.opts.smokePerPin; i++){
        this.geometry.vertices[this.smokeIndex].set(point.x * altitude, point.y * altitude, point.z * altitude);
        this.geometry.verticesNeedUpdate = true;
        this.attributes.myStartTime.value[this.smokeIndex] = this.totalRunTime + (1000*i/this.opts.smokePerSecond + 1500);
        this.attributes.myStartLat.value[this.smokeIndex] = lat;
        this.attributes.myStartLon.value[this.smokeIndex] = lon;
        this.attributes.altitude.value[this.smokeIndex] = altitude;
        this.attributes.aactive.value[this.smokeIndex] = 1.0;

        this.attributes.myStartTime.needsUpdate = true;
        this.attributes.myStartLat.needsUpdate = true;
        this.attributes.myStartLon.needsUpdate = true;
        this.attributes.altitude.needsUpdate = true;
        this.attributes.aactive.needsUpdate = true;

        this.smokeIndex++;
        this.smokeIndex = this.smokeIndex % this.geometry.vertices.length;
    }


    return startSmokeIndex;

};

SmokeProvider.prototype.extinguish = function(index){
    for(var i = 0; i< this.opts.smokePerPin; i++){
        this.attributes.aactive.value[(i + index) % this.opts.smokeCount] = 0.0;
        this.attributes.aactive.needsUpdate = true;
    }
};

SmokeProvider.prototype.changeAltitude = function(altitude, index){
    for(var i = 0; i< this.opts.smokePerPin; i++){
        this.attributes.altitude.value[(i + index) % this.opts.smokeCount] = altitude;
        this.attributes.altitude.needsUpdate = true;
    }

};

SmokeProvider.prototype.tick = function(totalRunTime){
    this.totalRunTime = totalRunTime;
    this.uniforms.currentTime.value = this.totalRunTime;
};

export default  SmokeProvider;
