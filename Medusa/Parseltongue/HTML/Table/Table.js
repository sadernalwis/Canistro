import { HTML } from "../HTML.js";
import { Row } from "../Row/Row.js";

export class Table{
    constructor(tokens, settings){
        const table = this;
        table.rows = [];
        tokens.forEach(token => {
            table.rows.push(new Row(token, settings));
        });
        
    }
}