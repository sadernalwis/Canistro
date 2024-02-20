
import { HTML } from "Medusa/Parseltongue/HTML/HTML.js";
import { SVG } from "Medusa/Parseltongue/SVG/SVG.js";
import { CSS } from "Medusa/Parseltongue/CSS/CSS.js";
import { JS } from "Medusa/Parseltongue/JS/JS.js";
import { Vector3 as V3, MathUtils as MU } from 'three';
import { Path, PathRounder } from "../../../Connector/Path/Path";
import { Pin } from "../Pin";

export class Parameter extends Pin {
	clear_path(){
		this.points = []
	}
	pick(event){
		this.pinned = !this.pinned
		console.log('pin picked')
	}
}