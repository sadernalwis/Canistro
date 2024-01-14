import { Actor, Identity } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { html, render } from "lit-html";
import { canisterId, createActor } from "../declarations/whoami";
import { defaultOptions } from "..";
import { _SERVICE } from "../../declarations/whoami/whoami.did";
// import { renderLoggedIn } from "./loggedIn";


const content = () => html`<div class="container">
  <style>
    #whoami {
      border: 1px solid #1a1a1a;
      margin-bottom: 1rem; }
  </style>
  <h1>Internet Identity Client</h1>
  <h2>You are authenticated!</h2>
  <p>To see how a canister views you, click this button!</p>
  <button type="button" id="whoamiButton" class="primary">Who am I?</button>
  <input type="text" readonly id="whoami" placeholder="your Identity" />
  <button id="logout">log out</button>
</div>`;

export const renderLoggedIn = ( actor, authClient ) => {
	render(content(), document.getElementById("pageContent") as HTMLElement);
	(document.getElementById("whoamiButton") as HTMLButtonElement).onclick =
		async () => {
			try {
				const response = await actor.whoami();
				(document.getElementById("whoami") as HTMLInputElement).value = response.toString(); } 
			catch (error) { console.error(error); } };
	(document.getElementById("logout") as HTMLButtonElement).onclick =
		async () => {
			await authClient.logout();
			renderIndex(authClient); }; };


const content = html`<div class="container">
  <h1>Internet Identity Client</h1>
  <h2>You are not authenticated</h2>
  <p>To log in, click this button!</p>
  <button type="button" id="loginButton">Log in</button>
</div>`;

export const renderIndex = async ( client?: AuthClient, statusMessage?: string ) => {
	const authClient = client ?? (await AuthClient.create(defaultOptions.createOptions));
	const pageContent = document.getElementById("pageContent");
	if (pageContent) { render(content, pageContent); 	}
	const status = document.getElementById("status");
	const statusContent = document.getElementById("content");
	if (statusMessage && statusContent) {
		render(statusMessage, statusContent);
		status?.classList.remove("hidden"); } 
	else { status?.classList.add("hidden"); }

	const loginButton = document.getElementById( "loginButton" ) as HTMLButtonElement;

	loginButton.onclick = () => {
		authClient.login({ ...defaultOptions.loginOptions,
			onSuccess: async () => { handleAuthenticated(authClient); }, }); }; };

export async function handleAuthenticated(authClient: AuthClient) {
	const identity = (await authClient.getIdentity()) as unknown as Identity;
	const whoami_actor = createActor(canisterId as string, { agentOptions: { identity, }, });
	authClient.idleManager?.registerCallback(() => { // Invalidate identity then render login when user goes idle
		Actor.agentOf(whoami_actor)?.invalidateIdentity?.();
		renderIndex(authClient); });

	renderLoggedIn(whoami_actor, authClient); }
