import { AuthClient } from "@dfinity/auth-client";
import { Actor } from "@dfinity/agent";
import { IDL } from "@dfinity/candid";
import eventify from "Medusa/Event.js";
import { SVG } from "Medusa/Parseltongue/SVG/SVG.js";
import { Canister } from "./Canister/Canister.js";
// import {Worker} from './Pointer/pointer.js?worker'
import { Pin } from "./Pointer/Pin/Pin.js";
import { Pointer } from "./Pointer/Pointer.js";
const days = BigInt(1); // One day in nanoseconds
const hours = BigInt(24);
const nanoseconds = BigInt(3600000000000);
export class Canistro/*  extends HTMLElement  */{
	static options = { 	create: { idleOptions: { disableIdle: true /* Set to true if you do not want idle functionality */ , }, },
						login : { identityProvider: process.env.DFX_NETWORK === "ic" ? "https://identity.ic0.app/#authorize" : `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943/`, maxTimeToLive: days * hours * nanoseconds /* Maximum authorization expiration is 8 days */ , } , };

	static get observedAttributes() {
		return ['progress','status','radius'];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		// if (name === 'progress') {
		// 	this.setProgress(newValue);
		// 	this.redraw();

		// }
		// else{
		// 	this[name] = newValue;
		// 	this.redraw();
		// }
	}

	setProgress(percent) {
		try {
			
			const offset = this.circumference - (percent / 100 * this.circumference);
			// const circle = this.shadow_root.querySelector('circle');
			this.ring.circle.style.strokeDashoffset = offset; 
			this.ring.progress_text.textContent = `${percent}%`.padStart(4,' ');
			// circle.nextElementSibling.textContent = this.status;
			this.progress = parseInt(percent);
		} catch (error) {
			
		}
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

	resize(svg_width, svg_height) {
		SVG.configure(this.svg_root, {width:svg_width, height:svg_height, viewBox:`-${svg_width/2} -${svg_height/2} ${svg_width} ${svg_height}`, preserveAspectRatio:"xMidYMid meet"}, true)
		
	}
	build(wrapper,svg_width=500, svg_height=500) {
		// const radius = this.getAttribute('radius');
		// const progress = this.getAttribute('progress');
		// const status = this.getAttribute('status');
		// const stroke = radius * 0.2;
		// const svg_width = radius * 2;
		// const svg_height = radius * 2;
		// const normalizedRadius = radius - stroke * 2;
		// this.circumference = normalizedRadius * 2 * Math.PI;
	
		this.def 		= SVG.make('defs','',[],{})
		let svg_root = SVG.put(wrapper/* this.shadow_root */, SVG.make("svg", "svg_root", [this.def], {}), 0, true);
		SVG.configure(svg_root, {width:svg_width, height:svg_height, viewBox:`-${svg_width/2} -${svg_height/2} ${svg_width} ${svg_height}`, preserveAspectRatio:"xMidYMid meet"}, true)
		HTML.configure( svg_root, {'xmlns':'http://www.w3.org/2000/svg', 'xmlns:xlink':'http://www.w3.org/1999/xlink'}); // SVG.configure(svg_root, {"xmlns:xlink":"http://www.w3.org/1999/xlink", version:"1.1" }, true)		
		// this.progress_ring = SVG.put(svg_root, SVG.make("circle", "progress-ring", [], this.ring_attributes(normalizedRadius, radius,this.circumference, stroke) ), 0, true);
		// this.progress_text = SVG.put(svg_root, SVG.make("text",   "progress_text", [], { /* x: radius, y: radius,  */"pointer-events": 'none', fontSize:"18", textAnchor:"middle", dominantBaseline:"middle", fill:"black"}, '', progress ), 1, true);
		// // let status_text   = SVG.put(svg_root, SVG.make("text",   "status_text",   [], this.status_attributes(radius),'', status ), 2, true);
		// SVG.style(this.progress_ring , this.ring_style(radius, this.circumference )); 

		this.svg_root = svg_root
		Pointer.init(this, this.svg_root)
		// this.ring  = new Ring(this, "pointer")
		// this.ring.attach(svg_root, null, svg_root)
		this.ring  = new Canister(this, "canister")
		this.ring.display(180)
		this.pin  = new Pin(this.canistro, `canistro-pointer`, 'pin', 'pin')
		this.pin.attach(svg_root, this.defs, svg_root)
		this.pin.display(10)
		console.log('caniister.display()')
		// this.ring.attach(svg_root, null, svg_root)

		// let that = this
		// this.progress_ring.addEventListener("mousedown", (e)=>{ 
		// 	that.load_canisters()
		// 	that.login()
		//  })
		// this.progress_ring.addEventListener("mouseenter", (e)=>{ that.progress_ring.style.fill = "white" })
		// this.progress_ring.addEventListener("mouseleave", (e)=>{ that.progress_ring.style.fill = "lightgrey" })
		
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

	constructor(terminal) {
		// super();
		this.terminal = terminal
        eventify(this)
		// this.shadow_root = this.attachShadow({mode: 'open'});
		this.status = '';
		this.progress = 0;
		this.setup_pulse();
		// this.redraw()
		this.canisters = {} 
		this.modules = {} 
		this.actors = {} 
		this.load_canisters()
		this.load_modules()
	}

	async client(){
		this.auth_client = this.auth_client || await AuthClient.create(Canistro.options.create)
		return this.auth_client
	}
	async load_canisters(){
		for (const key in process.env){ 
			if(key.startsWith("CANISTER_ID_")){
				const cid = process.env[key]
				if (cid !== process.env.CANISTER_ID){
					const ckey = key.replace("CANISTER_ID_",'').toLowerCase()
					this.canisters[ckey] = cid  } } } }

	async load_modules(){
		window.IDL = IDL
		for (const canister_name in this.canisters){ 
			try {
				// const module = await import(`/${"Canistro/Declarations"}/${canister_name}`/* @vite-ignore */)
				const module = await import(`/${"Canistro/Declarations"}/${canister_name}`/* @vite-ignore */)
				// modules['whoami'].idlFactory({ IDL: IDL })._fields[0][1].accept
				this.modules[canister_name] = module } 
			catch (error) { console.info(`NO CANDID for ${canister_name}`)} } } 
				
	async actor(caller_ident, canister_name){
		if (canister_name in this.actors){ 
			let [actor_ident, actor] = this.actors[canister_name]
			if (!caller_ident || actor_ident.toString() === caller_ident.toString()){ return actor }}
		const { canisterId, createActor} = this.modules[canister_name]//await import(`/${"Canistro/Declarations"}/${canister_name}`/* @vite-ignore */)
		const client = await this.client()
		const identity = await client.getIdentity()
		const authenticated = await client.isAuthenticated()
		const actor = createActor(canisterId, { agentOptions: { identity, }, })
		this.actors[canister_name] = [identity, actor];
		return actor
	} 

	async login(){
		let that = this;
		const client = await this.client()
		client.login({ ...Canistro.options.login,
			onSuccess: async () => { 
				console.log("Login Successful")
				handleAuthenticated(client);
				// that.fire('login', 0, 	 that);
				client.idleManager?.registerCallback(() => { // Invalidate identity then render login when user goes idle
					for (const actor_name in that.actors){ 
						const actor =  that.actors[actor_name]
						console.log(`invalidating canister ${actor_name}!`)
						Actor.agentOf(actor)?.invalidateIdentity?.(); }}); },
			onError  : async () => { 
				console.log("Login Error")
				that.fire('login', 255, that); }, 
		})
	}						

	async logout(){
		const client = await this.client()
		await client.logout();
	}
	async is_authenitcated(){
		const client = await this.client()
		return await client.isAuthenticated()
	}

	async identity(){
		const client = await this.client()
		return await client.getIdentity()
	}
			
	async call(canister_name, method){
		const actor = await this.actor(null ,canister_name)
		return await actor[method]();
		// index.js:155 AgentHTTPResponseError: Server returned an error:
		// Code: 400 (Bad Request)
		// Body: Specified sender delegation has expired:
	}

	async invalidate(caller_ident, canister_name){
		const canister_actor = await this.actor(caller_ident, canister_name)
		Actor.agentOf(canister_actor)?.invalidateIdentity?.();
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