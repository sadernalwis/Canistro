console.clear();
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.120.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.120.0/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "https://cdn.jsdelivr.net/npm/three@0.120.0/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://cdn.jsdelivr.net/npm/three@0.120.0/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "https://cdn.jsdelivr.net/npm/three@0.120.0/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "https://cdn.jsdelivr.net/npm/three@0.120.0/examples/jsm/postprocessing/UnrealBloomPass.js";
// https://discourse.threejs.org/t/modified-three-instancedmesh-dynamically-instancecount/18124/4
// https://codepen.io/prisoner849/pen/VwamWbm?editors=0010
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
	60,
	innerWidth / innerHeight,
	0.1,
	100
);
camera.position.set(0, -3, 4).setLength(4);
let renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//renderer.setClearColor(0x224488);
//renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

let controls = new OrbitControls(camera, renderer.domElement);

let light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(100, -50, 50);
light.castShadow = true;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 250;

let camSize = 10;
light.shadow.camera.left = -camSize;
light.shadow.camera.bottom = -camSize;
light.shadow.camera.right = camSize;
light.shadow.camera.top = camSize;

scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

let g = new THREE.CylinderBufferGeometry(0.5, 0.5, 0.1, 6);
g.rotateX(Math.PI * 0.5);
let m = new THREE.MeshStandardMaterial({
	color: 0x222244,
	roughness: 0.75,
	metalness: 0.25
});
let hexUniforms = {
	time: { value: 0 },
	globalBloom: { value: 0 }
};
m.onBeforeCompile = (shader) => {
	shader.uniforms.time = hexUniforms.time;
	shader.uniforms.globalBloom = hexUniforms.globalBloom;
	console.log(shader.vertexShader);
	shader.vertexShader = `
  attribute vec3 instColor;
  attribute vec2 colorPhase;
  varying vec3 vPos;
  varying vec3 vInstColor;
  varying vec2 vColorPhase;
  ${shader.vertexShader}
`.replace(
		`#include <fog_vertex>`,
		`#include <fog_vertex>
  vPos = vec3(transformed);
  vInstColor = vec3(instColor);
  vColorPhase = colorPhase;
`
	);

	console.log(shader.fragmentShader);
	shader.fragmentShader = `
  uniform float time;
  uniform float globalBloom;
  varying vec3 vPos;
  varying vec3 vInstColor;
  varying vec2 vColorPhase;
  ${shader.fragmentShader}
`.replace(
		`#include <dithering_fragment>`,
		`#include <dithering_fragment>
    
    gl_FragColor = globalBloom > 0.5 ? vec4(0, 0, 0, 1) : gl_FragColor;

    float t = sin(time * PI * vColorPhase.y + vColorPhase.x) * 0.5 + 0.5;
    vec3 c = mix(gl_FragColor.rgb, vInstColor, t);

    float a = smoothstep(0.015, 0.02 + (1. - t) * 0.03, abs(vPos.z));
    gl_FragColor.rgb = mix(c, gl_FragColor.rgb, a );
`
	);
};

let circleCount = 10;
let instCount = ((circleCount * (circleCount + 1)) / 2) * 6 + 1;
let o = new THREE.InstancedMesh(g, m, instCount);
o.userData.phases = [];
o.castShadow = true;
o.receiveShadow = true;

let colors = [
	new THREE.Color(0xffffff),
	new THREE.Color(0xff8888),
	new THREE.Color(0x88ff88),
	new THREE.Color(0x8888ff)
];
let instColor = [];

let colorPhase = [];
let dummy = new THREE.Object3D();

// hexagonal grid points ///////////////////////////////////////////////////////////////////////////
let unit = Math.sqrt(3) * 0.5 * 1.025;

let angle = Math.PI / 3;
let axis = new THREE.Vector3(0, 0, 1);

let axisVector = new THREE.Vector3(0, -unit, 0);
let sideVector = new THREE.Vector3(0, unit, 0).applyAxisAngle(axis, -angle);
let vec3 = new THREE.Vector3(); // temp vector
let counter = 0;
for (let seg = 0; seg < 6; seg++) {
	for (let ax = 1; ax <= circleCount; ax++) {
		for (let sd = 0; sd < ax; sd++) {

			vec3.copy(axisVector)
				.multiplyScalar(ax)
				.addScaledVector(sideVector, sd)
				.applyAxisAngle(axis, (angle * seg) + (Math.PI / 6));

			setHexData(o, dummy, vec3, counter);

			counter++;
		}
	}
}
setHexData(o, dummy, new THREE.Vector3(), counter); // central hex
//////////////////////////////////////////////////////////////////////////////////////////////////

g.setAttribute(
	"instColor",
	new THREE.InstancedBufferAttribute(new Float32Array(instColor), 3)
);
g.setAttribute(
	"colorPhase",
	new THREE.InstancedBufferAttribute(new Float32Array(colorPhase), 2)
);
console.log(o);

scene.add(o);

// bloom /////////////////////////////////////////////////////////////////////////////////////////
var renderScene = new RenderPass(scene, camera);
var bloomPass = new UnrealBloomPass(
	new THREE.Vector2(window.innerWidth, window.innerHeight),
	1.5,
	0.4,
	0.85
);
bloomPass.threshold = 0;
bloomPass.strength = 1.25;
bloomPass.radius = 0.125;

var bloomComposer = new EffectComposer(renderer);
bloomComposer.renderToScreen = false;
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

var finalPass = new ShaderPass(
	new THREE.ShaderMaterial({
		uniforms: {
			baseTexture: { value: null },
			bloomTexture: { value: bloomComposer.renderTarget2.texture }
		},
		vertexShader: `
			varying vec2 vUv;
			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}
`,
		fragmentShader: `
			uniform sampler2D baseTexture;
			uniform sampler2D bloomTexture;
			varying vec2 vUv;
			void main() {
				gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
			}
`,
		defines: {}
	}),
	"baseTexture"
);
finalPass.needsSwap = true;

var finalComposer = new EffectComposer(renderer);
finalComposer.addPass(renderScene);
finalComposer.addPass(finalPass);
//////////////////////////////////////////////////////////////////////////////////////////////////
window.onresize = function () {
	var width = window.innerWidth;
	var height = window.innerHeight;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setSize(width, height);

	bloomComposer.setSize(width, height);
	finalComposer.setSize(width, height);
};
/////////////////////////////////////////////////////////////////////////////////////////////////

let clock = new THREE.Clock();
let mat4 = new THREE.Matrix4();

renderer.setAnimationLoop(() => {
	let t = clock.getElapsedTime();
	hexUniforms.time.value = t;
	o.userData.phases.forEach((ph, idx) => {
		o.getMatrixAt(idx, mat4);
		mat4.decompose(dummy.position, dummy.quaternion, dummy.scale);
		dummy.position.z = Math.sin(ph.phaseDepth + t * 0.5) * 0.125;
		dummy.rotation.set(
			Math.cos(ph.phaseX + t * Math.sign(ph.phaseX)) * Math.PI * 0.0625,
			Math.sin(ph.phaseY + t * Math.sign(ph.phaseY)) * Math.PI * 0.0625,
			0
		);
		dummy.updateMatrix();
		o.setMatrixAt(idx, dummy.matrix);
	});
	o.instanceMatrix.needsUpdate = true;

	hexUniforms.globalBloom.value = 1;
	renderer.setClearColor(0x000000);
	bloomComposer.render();
	hexUniforms.globalBloom.value = 0;
	renderer.setClearColor(0x220011);
	finalComposer.render();

	//renderer.render(scene, camera);
});

function setHexData(o, dummy, pos, idx) {

	dummy.position.copy(pos);
	dummy.updateMatrix();
	o.setMatrixAt(idx, dummy.matrix);

	let c = colors[THREE.MathUtils.randInt(0, 3)];
	instColor.push(c.r, c.g, c.b);

	colorPhase.push(Math.random() * Math.PI * 2, Math.random() * 0.5 + 1); // phase, speed

	o.userData.phases.push({
		phaseX: (Math.random() - 0.5) * Math.PI * 2,
		phaseY: (Math.random() - 0.5) * Math.PI * 2,
		phaseDepth: Math.random() * Math.PI * 2
	});

}
