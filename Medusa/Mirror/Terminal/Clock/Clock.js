import { HTML } from "Medusa/Parseltongue/HTML/HTML.js";
import { Block } from "../Block/Block.js";


export class Clock {
    updateClock() {
        let time = new Date();
        let array = [time.getHours(), time.getMinutes(), time.getSeconds()];
        if (this.twelveHours) { // 12-hour mode translation
            this.ampm = (array[0] >= 12) ? "PM" : "AM";
            if (array[0] > 12) array[0] = array[0] - 12;
            if (array[0] === 0) array[0] = 12; }
        array.forEach((e, i) => { if (e.toString().length !== 2) { array[i] = "0"+e; } });
        let clockString = `${array[0]}:${array[1]}:${array[2]}`;
        array = clockString.match(/.{1}/g);
        clockString = "";
        array.forEach(e => {
            if (e === ":") clockString += "<em>"+e+"</em>";
            else clockString += "<span>"+e+"</span>"; });
        if (this.twelveHours) clockString += `<span>${this.ampm}</span>`;
        this.clock_header.innerHTML = clockString;
        this.lastTime = time;
    }
    
    clock(wrapper) {

        let [root, clock_node, clock_header] = HTML.chain(wrapper, `div:${(this.twelveHours) ? "mod_clock_twelve" : ""}:/h1::`); 
        clock_node.id = 'mod_clock'
        clock_header.id = 'mod_clock_text'
        let [h1,h2,_1,m1,m2,_2,s1,s2,] = HTML.ladder(clock_header,`span::?/span::?/span::?/span::?/span::?/span::?/span::?/span::?/`);
        this.clock_header = clock_header
        this.clock_node = clock_node
        return this.clock_node
    }

    constructor(terminal, width, height) {
        this.terminal = terminal
        this.node = this.clock(document.body)
        this.block = new Block(terminal)
        this.block.node.appendChild(this.clock_node)
        this.node = this.block.node
        // if (!parentId) throw "Missing parameters";
        // this.twelveHours = (this.clockHours === 12); // Load settings
        // this.parent = document.getElementById(parentId); // Create DOM
        // this.parent.innerHTML += `<div id="mod_clock" class="${(this.twelveHours) ? "mod_clock_twelve" : ""}"> <h1 id="mod_clock_text"><span>?</span><span>?</span><span>:</span><span>?</span><span>?</span><span>:</span><span>?</span><span>?</span></h1> </div>`;
        this.lastTime = new Date();
        this.updateClock();
        this.updater = setInterval(() => { this.updateClock(); }, 1000);
    }
}
