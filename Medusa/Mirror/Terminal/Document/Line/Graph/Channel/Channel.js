import { Boundary } from "Medusa/Parseltongue/Boundary/Boundary.js";
import { SVG } from "Medusa/Parseltongue/SVG/SVG.js";
import { Meta } from "Medusa/Parseltongue/Meta/Meta.js";
import { Scope } from "./Scope/Scope.js";

export class Channel extends Meta{

    static showPopup(evt) {

        var mypopup = document.getElementById("mypopup");
        var myicon = evt.target;
        var iconPos = myicon.getBoundingClientRect();
        mypopup.style.left = (iconPos.right + 20) + "px";
        mypopup.style.top = (window.scrollY + iconPos.top - 60) + "px";
        mypopup.style.display = "block";
        mypopup.innerHTML = `Position: ${myicon.positionx},${myicon.positiony}<br/>Value: ${myicon.valuex},${myicon.valuey}`;
    }

    static hidePopup(evt) {

        var mypopup = document.getElementById("mypopup");
        mypopup.style.display = "none";
    }

	static map(value, inMin, inMax, outMin, outMax) { 
		return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin; 
	}

	static project(b1, a1, b2, a2) { 
        let b3 = Boundary.align(b1, a1, b2, a2, 0, 1.0);
        // b3.scale('l', 'r', b2.minimum, b2.maximum, 1,0)
		return b3.current; 
	}

	static range(start, end, tick) {
		const s = Math.round(start / tick) * tick
		return Array.from( { length: Math.floor((end - start) / tick) }, function(v, k){ return k * tick + s;});
	}
	
    static length_angle(pointA, pointB) {
        const lengthX = pointB[0] - pointA[0];
        const lengthY = pointB[1] - pointA[1];
        return {
          length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
          angle: Math.atan2(lengthY, lengthX)
        };
    }

    static calculate_spread(points, xspread, yspread){
    // static calculate_spread(points){
        // let [xspread,yspread] = Boundary.get_empties([1,1]);
        points.forEach(e => {
            xspread.add(e[0]);
            yspread.add(e[1]);
        });
        return [xspread,yspread];
    }

    static calculate_positions(points, width, height, xbox, ybox){
        return points.map(e => {
            const x = Channel.map(e[0], xbox.minimum, xbox.maximum , 0, width.range())
            const y = Channel.map(e[1], ybox.minimum, ybox.maximum , height.range(), 0)
            return [x, y]
        });
    }

    static calculate_positions(points, xbox, ybox, xspread, yspread){
        return points.map(e => {
            xspread.current = e[0];
            yspread.current = e[1]
            const x = Channel.project(xbox, 'max', xspread, 'max');
            const y = Channel.project(ybox, 'mid', yspread, 'mid');
            // return [x, -y]
            return [x, y]
        });
    }

    static control_point(current, previous, next, reverse, flatness, smoothness) {
        const p = previous || current;
        const n = next || current;
        const la = Channel.length_angle(p, n);
        // work in progress…
        // const flat = Channel.map(Math.cos(la.angle) * this.flattening_w.current, 0, 1, 1, 0)
        const flat = Channel.map(Math.cos(la.angle) * flatness, 0, 1, 1, 0)
        const angle = la.angle * flat + (reverse ? Math.PI : 0);
        // const length = la.length * this.smoothing_w.current;
        const length = la.length * smoothness;
        const x = current[0] + Math.cos(angle) * length;
        const y = current[1] + Math.sin(angle) * length;
        return [x, y];
    }

    static bezier_command(point, i, a, flatness, smoothness) {
        const cps = Channel.control_point(a[i - 1], a[i - 2], point, false, flatness, smoothness);
        const cpe = Channel.control_point(point, a[i - 1], a[i + 1], true, flatness, smoothness);
        const close = i === a.length - 1 ? " z" : "";
        return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}${close}`;
    }

    static path_d(positions, flatness, smoothness) {
        return positions.
            reduce(
                function(acc, e, i, a) {
                    return i === 0 ? 
                        // `M ${a[a.length - 1][0]},${dataset.width_w.range()} L ${e[0]},${dataset.height_w.range()} L ${e[0]},${e[1]}` : 
                        // `M ${a[a.length - 1][0]},${dataset.xbox_w.range()} L ${e[0]},${dataset.ybox_w.range()} L ${e[0]},${e[1]}` : 
                        `M ${0},${0} L ${e[0]},${0} L ${e[0]},${e[1]}` : 
                            `${acc} ${ Channel.bezier_command(e, i, a, flatness, smoothness)}`} 
                                    , "");
    }

    // styles() {
    //     return {
    //         path: { /* fill: this.colors.path, */ stroke: this.colors.path, strokeWidth: 0.5, fillOpacity: 0.15, strokeOpacity: 0.8 },
    //         flags: { fill: this.colors.flags }
    //     };
    // }
    add_scope(name, scope, units, start_index, path_smoothing, path_flattening, path_color, flag_color, values){
        new Scope(null, name, values, this /* [collction] this.scopes */,{}, this.svgroot,  null, null, null, false, scope, units, start_index, path_smoothing, path_flattening, path_color, flag_color);

    }


    resize(){
        this.xbox_w.maximum =  this.svgroot.clientWidth;
		// this.ybox_w.minimum = -this.svgroot.clientHeight/2;
		this.ybox_w.maximum = this.svgroot.clientHeight*0.8;
        this.reload()
        // this.ybox_w.minimum = 
        // this.xbox_w.maximum = 
        // this.ybox_w.maximum = 
    }

    reload(){
        if(this.scope_root==null) { 
            this.scope_root = SVG.put(this.svgroot, SVG.make("g", "scope_root", [], {}) , 0);
        }

        [this.xspread, this.yspread] = Boundary.get_empties([1,1]);
        for (let index in this.scopes) {
            let scope = this.scopes[index];
            [this.xspread, this.yspread] = Channel.calculate_spread(scope.W, this.xspread, this.yspread);
        }
        this.yspread.symmetrize();
        let child_idx = 0;
        for (let index in this.scopes) {
            let scope = this.scopes[index];
            scope.spread = [this.xspread, this.yspread];
            scope.box = [this.xbox_w, this.ybox_w,];
            scope.reload();
            SVG.put(this.scope_root, scope.set_root , child_idx);
            child_idx++
        }

        // this.positions = Channel.calculate_positions(this.W, this.xbox_w, this.ybox_w, this.xspread, this.yspread);
        // let path_data =  Channel.path_d(this.positions, this.flattening_w.current, this.smoothing_w.current);
        // if(this.path) {
        //     SVG.configure(this.path, {d:path_data});
        // }
        // else{ 
        //     this.path = SVG.make('path', '', [], Object.assign({d:path_data}, this.styles().path ));
        // }

        // if(this.flags) {
        //     while (this.flags.firstChild) { this.flags.removeChild(this.flags.firstChild); }}
        // else{ 
        //     this.flags = SVG.make("g", "flags-container", [], {});
        // }

        // for (let index in this.positions) {
        //     let position = this.positions[index];
        //     let flag = SVG.make('circle', '', [], Object.assign({cx:position[0], cy:position[1], r:2.5, title:this.name}, this.styles().flags ));
        //     flag.positionx = position[0];
        //     flag.positiony = position[1];
        //     flag.valuex = this.W[index][0];
        //     flag.valuey = this.W[index][1];
        //     flag.addEventListener("mouseover", Channel.showPopup);
        //     flag.addEventListener("mouseout", Channel.hidePopup);

        //     SVG.put(this.flags, flag, -1);
        // }
        
        // if(this.container) {
        //     // while (this.container.firstChild) { this.container.removeChild(this.container.firstChild); }
        // }
        // else{ 
        //     this.container = SVG.make("g", "dataset-container", [this.path, this.flags], {});
        //     SVG.put(this.svgroot, this.container, -1);
        // }
        
    }

	constructor(parent, name, collectors, svgroot, realm, svg, def_ref, draggable, smoothing, flattening){
        const scopes = [
            // {   name: "one",
            //     scope: 'monthly',
            //     units: 12,
            //     start_index: 0,
            //     attributes: { line:   { smoothing: 0.15, flattening: 0.5 }, colors: { path: "#B4DC7F", flags: "red" },},
            //     values: [ [-20, 10], [0, -15], [5, 0], [10, 60], [20, 10], [30, 60], [40, 80], [50, 60], [70, 10], [80, 50], [90, 50], [120, 10], [150, 80], [160, 10], [170, 0]]},
            {   name: "two",
                scope: 'daily',
                units: 7,
                start_index: 0,
                attributes: { line:   { smoothing: 0.15, flattening: 0.5 }, colors: { path: "rgba(150, 150, 150, 1.0)", flags: "white" },},
                values: [ [0, 10], [5, 60], [10, 20], [20, 150], [30, 40], [40, 10], [50, 30], [60, 20], [70, 110], [80, 90], [90, 120], [120, 50], [160, 50], [200, 120]]},
            // {   name: "three",
            //     scope: 'hourly',
            //     units: 4/* 24 */,
            //     start_index: 0,
            //     attributes: { line:   { smoothing: 0.15, flattening: 0.5 }, colors: { path: "#FF9F1C", flags: "orange" },},
            //     values: [ [-50, 5], [-20, -5], [0, 0], [10, 10], [20, 40], [30, -10], [40, -10], [50, 20], [60, 10], [70, 40], [80, -15], [100, -10], [110, 30], [140, -10], [180, -10]]}
            ];
		// super(parent, name, [], collectors, {});
		super(parent, name, scopes[0].values, collectors, scopes[0].attributes, svgroot, null, svg, def_ref, draggable);
        this.realm = realm;

        new Boundary(this, 'xbox',       null, null,svgroot, null, svg, def_ref, false,  0, 0, 200, 8, 0);
        new Boundary(this, 'ybox',       null, null,svgroot, null, svg, def_ref, false, 0, 0, 10, 8, 0);
        // new Boundary(this, 'ybox',       null, null,svgroot, null, svg, def_ref, false, -10, 0, 10, 8, 0);
        new Boundary(this, 'smoothing',  null, null,svgroot, null, svg, def_ref, false, 0, 0.15/* 0.15 */,  0.25, 1, 0, 0, 0.1); //minimum, current, maximum, fractions, anchor, sign, step 
        new Boundary(this, 'flattening', null, null,svgroot, null, svg, def_ref, false, 0, 0.50,   1.0, 1, 0, 0, 0.1);

        this.meta = new Meta(this, 'svg', svg ? svg : SVG.make('g','',[],{}, this.id), [], {});
        const [xbox, ybox] = Boundary.get_empties([1,1]);
        this.meta.configure({selected:false, confined:false, transform:false, offset:false, xbox:xbox, ybox:ybox});
        this.realm ? this.realm.svg.appendChild(this.svg_w) : null;

        // let { scope, units, start_index, values} = scopes[0];
        // let [scope_name, path_smoothing,  path_flattening, path_color, flag_color] = [scopes[0].name, scopes[0].attributes.line.smoothing, scopes[0].attributes.line.flattening, scopes[0].attributes.colors.path, scopes[0].attributes.colors.flags ];
        // this.add_scope(scope_name, scope, units, start_index, path_smoothing, path_flattening, path_color, flag_color, values);
        for (let scope_index in scopes) {
            let scope = scopes[scope_index];
            let { scope_type, units, start_index, values} = scope;
            let [scope_name, path_smoothing,  path_flattening, path_color, flag_color] = [scope.name, scope.attributes.line.smoothing, scope.attributes.line.flattening, scope.attributes.colors.path, scope.attributes.colors.flags ];
            this.add_scope(scope_name, scope_type, units, start_index, path_smoothing, path_flattening, path_color, flag_color, values);
        }

        // this.reload();
	}

}
window.Boundary = Boundary;

