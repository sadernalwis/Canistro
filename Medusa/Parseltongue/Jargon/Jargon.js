import { Parseltongue } from "../Parseltongue.js";

export class Jargon{

    constructor(regex, magic_number){
        this.regex = regex
        this.magic_number = magic_number
        this.synonyms = []
        this.antonyms = []
        this.text = ''
    }

    getFirstGroup(regexp, str) {
        // return Array.from(str.matchAll(regexp), m => m[1]); //https://stackoverflow.com/questions/432493/how-do-you-access-the-matched-groups-in-a-javascript-regular-expression
        return [...str.matchAll(regexp)].map(m => m[1]);
    }

    match_all(){
        const string = "something format_abc";
        const regexp = /(?:^|\s)format_(.*?)(?:\s|$)/g;
        const matches = string.matchAll(regexp);
        for (const match of matches) {
            console.log(match);
            console.log(match.index)
        }
    }

    match(text){
        this.text = Parseltongue.clean(text)
        this.matches = Array.from(this.text.matchAll(this.regex), m => m);/* this.text.match(this.regex) */
        this.matches = this.matches? this.matches : []
        // this.matches = this.unwrap ? this.matches.map(this.unwrap.bind(this)) : this.matches
        // this.matches = this.post_match ? this.matches.filter(this.post_match.bind(this)) : this.matches        
        return this
    }

    is_match(){
        return this.magic_number==this.match_count
    }
    
    no_match(){
        return this.match_count==0 && this.magic_number!=this.match_count
    }

    is_partial(){
        return this.magic_number>this.match_count
    }

    is_excess(){
        return this.magic_number<this.match_count
    }
    
    get match_count(){
        return this.matches.length;
    }

    get locations(){

    }

    get_location(index){

    }

    recognize(){

    }

    identify(){

    }

    is_within(){

    }


}