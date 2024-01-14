import { HTML } from "Medusa/Parseltongue/HTML/HTML.js";
import { Button } from "../Button/Button.js";

export class Log {

    constructor(terminal){
        this.terminal = terminal
        this.node = HTML.make('input','cb_edit',[], {})
        HTML.style(this.node, { width: 'inherit', 'outline': 'none', 'text-align': 'center', 'border-color': 'limegreen', 'text-color':'red', background:'black', 'border': '0px'});
        // HTML.style(this.node, { width: 'inherit', background:'black', 'border': '0px'});
        HTML.configure(this.node, {type:'text',id:"cb1-input", role:"combobox", 'aria-autocomplete':"both", 'aria-expanded':"false", 'aria-controls':"cb1-listbox"})

        this.button = new Button(this.terminal)
        this.container =  HTML.make('div','',[],{});
        HTML.style(this.container,{ width: '100%', display: 'flex', 'flex-direction': 'row','position':'relative'});
        this.container.appendChild(this.node);
        this.container.appendChild(this.button.node);

        // this.node.addEventListener('keydown', terminal.key_down.bind(terminal));
        // this.node.addEventListener('keyup', terminal.key_up.bind(terminal));
        this.node.addEventListener('click', HTML.full_focus, false);
        // this.node.addEventListener('click', terminal.toggle_list.bind(terminal));
        // this.node.addEventListener('focus', terminal.on_focus_input.bind(terminal));
        // this.node.addEventListener('blur', terminal.focus_out.bind(terminal));
        this.focused = false
    }
    set activedescendant(value){
        this.node.setAttribute('aria-activedescendant', value)
    }
    
    set value(value){
        this.node.value = value
        HTML.style(this.node, {'color':'red', background:'black', 'border': '0px'});
    }

    focus_in() {
        // this.node.parentNode.classList.add('focus'); // set the focus class to the parent for easier styling
        this.node.classList.add('focus'); // set the focus class to the parent for easier styling
        this.focused = true;
    }

    focus_out() { 
        this.node.classList.remove('focus');
        // this.node.parentNode.classList.remove('focus');
        this.focused = false;
    }

    open() {
        this.node.setAttribute('aria-expanded', 'true');
        this.button.open()
    }

    close() {
        this.node.setAttribute('aria-expanded', 'false');
        this.button.close()
    }
    
    event_within(event){
        return this.node.contains(event.target) || this.button.node.contains(event.target)
    }
    
	start_pulse(){
		let pulse = 0;
        this._value = this.value
		let dis  = this;
		dis.interval = setInterval(() => {
            dis.value = dis._value+dis._value.padEnd(dis._value.length+(pulse%4),'.'); 
			pulse++;
		}, 1000);
	}

	stop_pulse(){
        this.value = this._value
        clearInterval(this.interval);
	}

}