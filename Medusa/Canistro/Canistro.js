import { AuthClient } from "@dfinity/auth-client";
import { Actor } from "@dfinity/agent";
import eventify from "Medusa/Event.js";
import { SVG } from "Medusa/Parseltongue/SVG/SVG.js";


const days = BigInt(1); // One day in nanoseconds
const hours = BigInt(24);
const nanoseconds = BigInt(3600000000000);
export class Canistro extends HTMLElement {
	static options = { 	create: { idleOptions: { disableIdle: true /* Set to true if you do not want idle functionality */ , }, },
						login : { identityProvider: process.env.DFX_NETWORK === "ic" ? "https://identity.ic0.app/#authorize" : `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943/`, maxTimeToLive: days * hours * nanoseconds /* Maximum authorization expiration is 8 days */ , } , };

	async client(){
		this.auth_client = this.auth_client || await AuthClient.create(Canistro.options.create)
		return this.auth_client
	}
	async login(onSuccess, onError){
		let that = this;
		authClient.login({ ...Canistro.options.login,
			onSuccess: async () => { that.fire('login', 0, 	 that); },
			onError  : async () => { that.fire('login', 255, that); }, 
		})
	}						

	async load_canisters(dec_path="Canistro/Declarations"){
		for (const key in process.env){ 
			if(key.startsWith("CANISTER_ID_")){
				const ckey = key.replace("CANISTER_ID_",'').toLowerCase()
				this.canisters[ckey] = process.env[key] } }
		for (const cname in this.canisters){ 
			const candid = await import(`/${dec_path}/${cname}/${cname}.did`)
			const { canisterId, createActor} = candid
			const identity = (await this.client.getIdentity())
			this.canisters[cname] = createActor(canisterId, { agentOptions: { identity, }, }); } }
			
	async call(canister_id, method){
		let actor = canister_id in this.canisters ? this.canister_id[canister_id] : new Panel(this);
		return await actor[method](); 
	}

	static get observedAttributes() {
		return ['progress','status','radius'];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'progress') {
			this.setProgress(newValue);
			this.redraw();

		}
		else{
			this[name] = newValue;
			this.redraw();
		}
	}

	setProgress(percent) {
		const offset = this.circumference - (percent / 100 * this.circumference);
		const circle = this.shadow_root.querySelector('circle');
		circle.style.strokeDashoffset = offset; 
		this.progress_text.textContent = `${percent}%`.padStart(4,' ');
		// circle.nextElementSibling.textContent = this.status;
		this.progress = parseInt(percent);
	}
	 
	ring_attributes(normalized_radius, radius, circumference, stroke){
		return {
			r: normalized_radius,
			// cx: radius,
			// cy: radius,
			style: `stroke-dashoffset:${circumference}`,
			strokeDasharray: `${circumference} ${circumference}`,
			strokeWidth: stroke,
			fill: "transparent",
			stroke: '#e74c3c',
		}

		
	}
	ring_style(radius, circumference){
		return {
			strokeWidth     : 10,
			strokeLinecap   : 'round',
			fill            : 'lightgrey',
			strokeDashoffset: 0,
			strokeDasharray : circumference,
			strokeLinecap   : 'round',
			// transformOrigin : `${radius}px ${radius}px`,
			transform       : `rotate(-90deg)`,
			animation       : `dash 2s ease-in-out infinite`,
			transition		: 'all 250ms  ease  0ms'
		}
	}

	status_attributes(radius ){
		return {
			x: radius * 2,
			y: radius,
			fontSize: 18,
			textAnchor: "start",
			dominantBaseline: "middle" ,
			fill: "black",
		}
	
	}

	redraw(percent) {
		const radius = this.getAttribute('radius');
		const progress = this.getAttribute('progress');
		const status = this.getAttribute('status');
		const stroke = radius * 0.2;
		const svg_width = radius * 2;
		const svg_height = radius * 2;
		const normalizedRadius = radius - stroke * 2;
		this.circumference = normalizedRadius * 2 * Math.PI;
	
		let svg_root = SVG.put(this.shadow_root, SVG.make("svg", "svg_root", [], {}), 0, true);
		SVG.configure(svg_root, {width:svg_width, height:svg_height, viewBox:`-${svg_width/2} -${svg_height/2} ${svg_width} ${svg_height}`, preserveAspectRatio:"xMidYMid meet"}, true)
		this.progress_ring = SVG.put(svg_root, SVG.make("circle", "progress-ring", [], this.ring_attributes(normalizedRadius, radius,this.circumference, stroke) ), 0, true);
		this.progress_text = SVG.put(svg_root, SVG.make("text",   "progress_text", [], { /* x: radius, y: radius,  */"pointer-events": 'none', fontSize:"18", textAnchor:"middle", dominantBaseline:"middle", fill:"black"}, '', progress ), 1, true);
		// let status_text   = SVG.put(svg_root, SVG.make("text",   "status_text",   [], this.status_attributes(radius),'', status ), 2, true);
		SVG.style(this.progress_ring , this.ring_style(radius, this.circumference )); 
		let that = this
		this.progress_ring.addEventListener("mousedown", (e)=>{ console.log(e) })
		this.progress_ring.addEventListener("mouseenter", (e)=>{ that.progress_ring.style.fill = "white" })
		this.progress_ring.addEventListener("mouseleave", (e)=>{ that.progress_ring.style.fill = "lightgrey" })
		
	}

	setup_pulse(){
		let pulse = 0;
		let dis  = this;
		const interval = setInterval(() => {
			if(dis.status === 'Cancelled !' || dis.status === 'Completed !'){
				dis.remove(); // dis.style.display =  'none'
				clearInterval(interval);
				return;
			}
			if(dis.progress<0){ dis.status = 'Cancelled !'; }
			else if(dis.progress==100){ dis.status = 'Completed !'; }
			// else{
			// 	const circle = dis.shadow_root.querySelector('circle');
			// 	if(circle){ dis.status_text.textContent = dis.status.padEnd(dis.status.length+(pulse%4),'.'); }
			// 	else{
			// 		dis.remove();
			// 		clearInterval(interval); } }
			pulse++;
		}, 1000);
	}

	constructor() {
		super();
        eventify(this)
		this.canisters = {}
		this.shadow_root = this.attachShadow({mode: 'open'});
		this.status = '';
		this.progress = 0;
		this.setup_pulse();
	}
	
}
const renderLoggedIn = ( actor, authClient ) => {
	(document.getElementById("whoamiButton")).onclick =
		async () => {
			try {
				const response = await actor.whoami();
				(document.getElementById("whoami")).value = response.toString(); } 
			catch (error) { console.error(error); } };
	(document.getElementById("logout")).onclick =
		async () => {
			await authClient.logout();
			renderIndex(authClient); }; };

const renderIndex = async ( client, statusMessage ) => {
	const authClient = client ?? (await AuthClient.create(defaultOptions.createOptions));
	const loginButton = document.getElementById( "loginButton" );
	loginButton.onclick = () => {
		authClient.login({ ...defaultOptions.loginOptions,
			onSuccess: async () => { handleAuthenticated(authClient); }, }); }; };

async function handleAuthenticated(authClient) {
	const identity = (await authClient.getIdentity())
	const whoami_actor = createActor(canisterId, { agentOptions: { identity, }, });
	authClient.idleManager?.registerCallback(() => { // Invalidate identity then render login when user goes idle
		Actor.agentOf(whoami_actor)?.invalidateIdentity?.();
		renderIndex(authClient); });
	renderLoggedIn(whoami_actor, authClient); }

async function setupToast() {
	const status = document.getElementById("status");
	const closeButton = status?.querySelector("button");
	closeButton?.addEventListener("click", () => { status?.classList.add("hidden"); }); }

const init = async () => {
	const authClient = await AuthClient.create(defaultOptions.createOptions);
	if (await authClient.isAuthenticated()) { handleAuthenticated(authClient); }
	renderIndex();
	setupToast(); };

window.customElements.define('medusa-canistro', Canistro);