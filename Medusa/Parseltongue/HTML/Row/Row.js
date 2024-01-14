import { HTML } from "../HTML.js";

export class Row {
    constructor(token, settings){
        const row = this;

        const brand_logo = HTML.make("img", "brand-logo", [], {src:"../../../../../Environments/Medusa/Medallion.png"});
        // neo.container = HTML.make("div", "container", [brand_logo], {});
        neo.container = HTML.make("div", row?"row-container":"container", [brand_logo], {});

        const form = HTML.make("form", row?"invisible-row-container":"", [], {});
        true ?  HTML.chain(form,`div:${css_prefix}header:${opt_cls.toLocaleUpperCase()}`) : null;

        Object.entries(token).forEach(entry => {
            let [name,value] = entry;
                
            var [f,label,input] = HTML.chain(form,`label:${css_prefix}label:/input:${css_prefix}input:`);
            HTML.configure(input,{type : gatepass[field_name], placeholder : HTML.titleCase(field_name)});
            input.addEventListener('click', HTML.full_focus, false);
        });
        
        let channels = option_class['channel'];
        var [f, submitters] = HTML.chain(form,`div:${css_prefix}submitters:`);
        for (let cid in channels) {
            let channel = channels[cid];
            let [agent,func] = channel.split('.');
            HTML.channel_submitter(agent, func ,option_class['parseltongue'], form, submitters, css_prefix, submitter_text);
        }
        
    }
}

