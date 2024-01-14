import { Linguistic } from "../Linguistic.js";

export class Quote extends Linguistic{

    constructor(magic_number){
        super(/".*?"/gd , magic_number)
    }

    unwrap(match, idx){
        match[0] = match[0].replaceAll('"','');
        return match
    }

    post_match(match, idx){
        return match.length>0
    }

    wrap(match, idx){
        return `"${match[0]}"`
    }
}