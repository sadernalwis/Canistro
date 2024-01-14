import { SceneManager } from "./view/SceneManager";
import { Model } from './model/Model';

export class Main
{
	public static instance: Main;
	public static getInstance(): Main
	{
		return Main.instance || new Main();
	}

	private _model: Model;
	private _sceneManager: SceneManager;

	constructor()
	{
		Main.instance = this;

		this._model = new Model();
		this._sceneManager = new SceneManager();
	}

	public get scene()
	{
		return this._sceneManager;
	}

	public get model()
	{
		return this._model;
	}
}

const main = Main.getInstance();

//source: https://soadzoor.github.io/instanced-mesh-test/
// https://discourse.threejs.org/t/instancedmesh-can-it-be-used-to-draw-hundreds-of-planes-with-different-textures/13221/12
// https://discourse.threejs.org/t/how-to-set-different-textures-on-each-instancedmesh/29433/2