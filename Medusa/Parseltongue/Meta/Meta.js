import { SVG } from "Medusa/Parseltongue/SVG/SVG.js";

export class Meta {

    static search(object, name, w){
        const m_name = `${name}_${w?'w':'m'}`;
        return object[m_name];
        // return object[m_name]!=null ? object[m_name] : null;
    }

    static has(object, name){
        return Meta.search(object, name,true) && Meta.search(object, name, false);
    }

    static get(object, name){
        return {
            m:Meta.search(object, name,false),
            w:Meta.search(object, name, true)
        }
    }

    unwrap(parent, object){
        const name = object['name'];
        if (name!=null){

            new Meta(parent, name, w, collectors, {}, svgroot, realm, svg, def_ref, draggable);
        }
		


    }
    
    register(collectors_){
        if(collectors_!=null){
            let collectors =  Array.isArray(collectors_)  ? collectors_ : [collectors_]; /* temporary array wrappaer for following loop */
            for (let collector of collectors){
                if (this.collectors.has(collector)){ continue; }
                let collection_name = `${this.type}s`;
                // collector.hasOwnProperty(collection_name) ? null : collector[collection_name] = {};
                collector[collection_name]==null ? collector[collection_name] = [] : null ;
                let collection = collector[collection_name];
                let collection_type = typeof collection;
                if (collection != null) {
                    if (Array.isArray(collection))         { collection.push(this); } 
                    else if (collection_type === "object") {
                        if (collection instanceof Set)     { collection.add(this); }
                        else if (collection instanceof Map){ collection.set(this.name, this); }
                        else/*>------------------------->*/{ collection[this.name] = this; }
                    }
                    else{
                        collector[collection_name][this.name] = this;
                    }
                }
                this.collectors.add(collector); // this.collectors = new Set([...this.collectors, ...collectors]); //new Set([...channels].filter(x => b.has(x)));
            }
        }
    }

    configure(attributes){
        if(attributes!=null){
            for (let attr_name in attributes) {
                this.set(attr_name, attributes[attr_name]);
            }
        }
        return this;
    }
    set(name, value, w){
        if(w){
            this.w[name] = value;
        }
        else{
            this[name] = value;
        }
        return this;
    }

    get(name, value, w){
        if(w){
            return this.w.hasOwnProperty(name) ? this.w[name] : value;
        }
        else{
            return this.hasOwnProperty(name) ? this[name] : value;
        }
        
    }

    set W(w){
        if(this.parent!=null){
            this.parent[`${this.name}_w`] = w;
            return null;
        }
        this.w = w;
        return this;
    }

    set M(m){
        if(this.parent!=null){
            this.parent[`${this.name}_m`] = m;
            return null;
        }
        this.m = m;
        return this;
    }

    get M(){
        if(this.parent!=null){
            return this.parent[`${this.name}_m`];
        }
        return this.m;
    }


    get W(){
        if(this.parent!=null){
            return this.parent[`${this.name}_w`];
        }
        return this.w;
    }

    address(sub,seg){
        var parent  = this;
        let parents = new Set();
        let segments = []
        while(parent && parent instanceof Meta && !parents.has(parent)){
            let sub_segments = []
            sub_segments.push(parent.name ? parent.name : '');
            sub_segments.push(parent.type ? parent.type : '');
            sub_segments.push(parent.realm ? parent.realm.svg.children.length : 0);
            segments.push(sub_segments.join(sub));
            parents.add(parent);
            parent = parent.parent;
        }
        return segments.join(seg);
    }


    constructor(parent, name, w, collectors, attributes, svgroot, realm, svg, def_ref, draggable){
        this.parent = parent;
        this.name = name;
        this.type = this.constructor.name.toLocaleLowerCase();
        this.M = this;
        this.W = w;
        this.collectors = new Set();
        this.register(collectors);
        this.configure(attributes);

        this.svgroot = svgroot;
        this.realm = realm;
        // this.id = `${name}_${realm ? realm.svg.children.length : 0}`;
        this.id = this.address('_','/');
        svg ?  SVG.configure(svg,{id:this.id}) : null;
        this.svg = svg ? svg : SVG.make('circle','',[],{cx:0.0, cy:0.0, r:13, fill:"#F4AF0A", title:name}, this.id);
        this.def_ref = def_ref;
        this.draggable = draggable;
        this.realm ? this.realm.svg.appendChild(this.svg) : null;

        // delete parent.meta;
        // parent[`${this.name}_m`] = this;
        // parent[`${this.name}_w`] = w;
    }

}