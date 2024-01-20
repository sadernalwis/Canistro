import './assets/css/Medusa.css';
import * as T from 'three';
import TWEEN from '@tweenjs/tween.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Parseltongue } from './Parseltongue/Parseltongue.js';
import { Mirror } from './Mirror/Mirror.js';
import { Space } from './Parseltongue/Space/Space.js';
import { Terminal } from './Mirror/Terminal/Terminal.js';


// import createSettingsView from './Graph/config';
// var generate = import('./Graph/generator');
// var renderGraph = import('./Graph/pixel');
import { HTML } from "./Parseltongue/HTML/HTML.js";
export let Medusa = {
    appversion :1.01,
    programs:new Map(),
    CSS3D : [],
    controls:null,
    scene:null,
    camera:null,
    controls:null,
    selection : new Set(),
    
    browser:()=>{  
        let userAgent = navigator.userAgent;
        let browserName;
        if(userAgent.match(/chrome|chromium|crios/i)){ browserName = "chrome"; }
        else if(userAgent.match(/firefox|fxios/i)){    browserName = "firefox"; }
        else if(userAgent.match(/safari/i)){           browserName = "safari"; }
        else if(userAgent.match(/opr\//i)){            browserName = "opera"; }
        else if(userAgent.match(/edg/i)){              browserName = "edge"; }
        else{                                          browserName = "No browser detection"; }
        // document.querySelector("h1").innerText="You are using "+ browserName +" browser";         
    },
    scroll_hide:()=>{
        let browser = Medusa.browser()
        let scroll_hide = 'hide_scrollbars_CSO'
        scroll_hide = (browser!='chrome' && browser!='safari' && browser!='opera') ? 'hide_scrollbars_CSO' : 'hide_scrollbars_FIE'
        return scroll_hide
    },

    backdrop:()=>{
        Medusa.backdrop = new Mirror(Medusa.programs.get('0') );
        HTML.style_overlay(Medusa.backdrop.viewterminal)

        let style = {
            // width: `${width}px`,
            // height: `${height}px`,
            // width: `99%`,
            // height: `99%`,
            // display:'block',
            position:'static',
            top:'0%',
            background: '#00000000'//'#21282C88'//'rgba(28, 105, 212, 0.95)'
        }
        HTML.style(Medusa.backdrop.viewterminal, style);
        HTML.put(document.body, Medusa.backdrop.viewterminal, -1);
        // document.body.appendChild(Medusa.backdrop.viewterminal);
        // Medusa.backdrop.viewterminal.create_graph()

    },

    wallet:()=>{
        if (typeof window.unisat !== 'undefined') { console.info('UniSat Wallet is installed!'); }
        else{ console.error('UniSat Wallet is not installed!'); }
        function unisat_account(){ unisat.requestAccounts() }
        document.getElementById('unisat').addEventListener('click', unisat_account, false);
        // Mirror.backdrop = new Viewer(Mirror.programs.get('0') );
        // HTML.style_overlay(Mirror.backdrop.viewterminal)
        // document.body.appendChild(Mirror.backdrop.viewterminal);
    },

    initialize: (socket_address) =>{
        Medusa.backdrop();
        return
        Medusa.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
        Medusa.camera.position.z = 3000;
        Medusa.scene = new THREE.Scene();
        // Medusa.cameraViewBox = new THREE.CameraViewBox();
        // Medusa.cameraViewBox.setViewFromCamera(Medusa.camera);
        const pos = [0,100,1000,500];
        // const neo = new Neo(socket_address, Neo.option_classes); //0->LOGIN
        Medusa.programs.set('0',neo);
        Medusa.wallet();
        Medusa.renderer = new CSS3DRenderer({ antialias: true ,alpha:true});
        Medusa.renderer.setSize(window.innerWidth, window.innerHeight);
        Medusa.scene.scale.set(2.0, 2.0, 2.0);
        Medusa.scene_scalar = 2;
        // document.body.appendChild(Medusa.renderer.domElement);
        Medusa.controls = new OrbitControls( Medusa.camera, Medusa.renderer.domElement );
        Medusa.controls.screenSpacePanning = true;
        Medusa.controls.enableDamping = true;
        Medusa.controls.dampingFactor = 0.5;
        Medusa.controls.enableRotate = false;
        Medusa.lane_size = new Boundary(Medusa, 'lane_size', null, null, null, null, null, 'def_ref', false, 0,0,800,8,0);
        Medusa.lane_direction = Boundary.get_empties([1,1,1]);
        window.addEventListener('resize', Medusa.windowResized, false);
        Medusa.windowResized();
    },

    windowResized:() =>{
        Medusa.camera.aspect = window.innerWidth / window.innerHeight;
        Medusa.camera.updateProjectionMatrix();
        Medusa.renderer.setSize(window.innerWidth, window.innerHeight);
        Medusa.render();},

    onready:(fn)=>{
        if (document.readyState !== 'loading') {
            fn();
            return; }
        else{ document.addEventListener('DOMContentLoaded', fn); } },
    
    preflight:()=>{
        return
        // HTML.style_overlay(this.container)
        // try { var storage = window.localStorage; }
        // catch (e) { alert("Cookies must be enabled for this page to work."); }
        // window.onstorage = () => { // triggered when another player instance writes to storage
        //     if (storage.getItem("ab.knownIDs"))   knownIDs = JSON.parse(storage.getItem("ab.knownIDs"));
        //     if (storage.getItem("ab.knownMedia")) knownMedia = JSON.parse(storage.getItem("ab.knownMedia")); };
        Medusa.onready(function () {
            if (navigator.onLine) { //if we are online, asynchronously load YT player api
                let scripts = document.getElementsByTagName("script");
                let scriptTag1 = scripts[scripts.length - 1];
                let scriptTag2 = document.createElement("script");
                scriptTag2.src = "https://www.youtube.com/iframe_api";
                scriptTag1.parentNode.insertBefore(scriptTag2, null);
            } }); },

    render:() =>{ 
        // Mirror.renderer.render(Mirror.scene, Mirror.camera);
        medusa.backdrop.viewterminal.render()
        // Mirror.viewer.render();
        // Mirror.viewer.render();
        // console.log('rendered');
    },

    animate:() =>{
        requestAnimationFrame(Medusa.animate);
        TWEEN.update();
        // Medusa.controls.update();
        // console.log('animated');
        Medusa.render();
        Medusa.programs.forEach((program,key) => { program.update(); });
        Medusa.youtube_loaded && Medusa.backdrop.viewterminal.playlist.play() 
        if (Object.keys(terminal.canistros).length==0){
            let canistro  = terminal.show_canistro("Identity")
            canistro.canistro.redraw()
		    canistro.resizer()

        }
    },
        
    mousemove:(x,y)=>{
        // Medusa.backdrop.viewterminal.mousemove(x,y)
    },
    
}
function runner() {
    window.storage      = window.localStorage
    window.Mirror       = Mirror;
    window.Parseltongue = Parseltongue;
    window.HTML         = HTML;
    window.mirror       = Mirror;
    window.parseltongue = Parseltongue;
    window.medusa       = Medusa;
    window.Space = window.space = Space
    window.Terminal = window.Terminal = Terminal
    window.THREE = window.three = T
    Medusa.initialize();
    Medusa.animate();
    document.addEventListener('mousemove', ({ x, y }) => {Medusa.mousemove(x,y)}, false);
    Medusa.preflight()

}
window.onYouTubeIframeAPIReady  = function () {
    Mirror.youtube_loaded = true
    Mirror.backdrop.viewterminal.playlist.fetch()
    setInterval(Mirror.backdrop.viewterminal.playlist.fetch.bind(Mirror.backdrop.viewterminal.playlist), 10*1000)
    // Mirror.backdrop.viewterminal.video.queryYT(document.location.search);
}
window._purifyCSS = str => {
    if (typeof str === "undefined") return "";
    if (typeof str !== "string") {
        str = str.toString();
    }
    return str.replace(/[<]/g, "");
};

// Load UI theme
window._loadTheme = theme => {
    if (document.querySelector("style.theming")) {
        document.querySelector("style.theming").remove(); }
    // Load fonts
    let mainFont = new FontFace(theme.cssvars.font_main, `url("assets/fonts/${theme.cssvars.font_main.toLowerCase().replace(/ /g, '_')+'.woff2'.replace(/\\/g, '/')}")`);
    let lightFont = new FontFace(theme.cssvars.font_main_light, `url("assets/fonts/${theme.cssvars.font_main_light.toLowerCase().replace(/ /g, '_')+'.woff2'.replace(/\\/g, '/')}")`);
    let termFont = new FontFace(theme.terminal.fontFamily, `url("assets/fonts/${theme.terminal.fontFamily.toLowerCase().replace(/ /g, '_')+'.woff2'.replace(/\\/g, '/')}")`);
    document.fonts.add(mainFont);
    document.fonts.load("12px "+theme.cssvars.font_main);
    document.fonts.add(lightFont);
    document.fonts.load("12px "+theme.cssvars.font_main_light);
    document.fonts.add(termFont);
    document.fonts.load("12px "+theme.terminal.fontFamily);
    document.querySelector("head").innerHTML += `<style class="theming">
    :root {
        --font_main: "${window._purifyCSS(theme.cssvars.font_main)}";
        --font_main_light: "${window._purifyCSS(theme.cssvars.font_main_light)}";
        --font_mono: "${window._purifyCSS(theme.terminal.fontFamily)}";
        --color_r: ${window._purifyCSS(theme.colors.r)};
        --color_g: ${window._purifyCSS(theme.colors.g)};
        --color_b: ${window._purifyCSS(theme.colors.b)};
        --color_black: ${window._purifyCSS(theme.colors.black)};
        --color_light_black: ${window._purifyCSS(theme.colors.light_black)};
        --color_grey: ${window._purifyCSS(theme.colors.grey)};

        /* Used for error and warning modals */
        --color_red: ${window._purifyCSS(theme.colors.red) || "red"};
        --color_yellow: ${window._purifyCSS(theme.colors.yellow) || "yellow"}; }
    body {
        font-family: var(--font_main), sans-serif;
        cursor: ${(window.settings.nocursorOverride || window.settings.nocursor) ? "none" : "default"} !important; }
    * {
   	   ${(window.settings.nocursorOverride || window.settings.nocursor) ? "cursor: none !important;" : ""} }
    ${window._purifyCSS(theme.injectCSS || "")}
    </style>`;
    window.theme = theme;
    window.theme.r = theme.colors.r;
    window.theme.g = theme.colors.g;
    window.theme.b = theme.colors.b;
};


// const settingsDir         = remote.app.getPath("userData");
// const themesDir           = path.join(settingsDir, "themes");
// const keyboardsDir        = path.join(settingsDir, "keyboards");
// const fontsDir            = path.join(settingsDir, "fonts");
// const settingsFile        = path.join(settingsDir, "settings.json");
// const shortcutsFile       = path.join(settingsDir, "shortcuts.json");
// const lastWindowStateFile = path.join(settingsDir, "lastWindowState.json");
window.settings = {}
window.addEventListener('resources-loaded', () => {
    fetch('assets/themes/tron.json')
        .then((response) => response.json())
        .then((theme) => {
            // Mirror.preflight()
            if (theme !== null) {
                window.settings.theme = theme;
                window.settings.nointroOverride = true;
                _loadTheme(theme); } 
            else { _loadTheme(theme); }
            // console.log(json)
            runner() }); 
});

window.global ||= window;
document.body.onload = function(){runner() };
