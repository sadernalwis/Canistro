import { Boundary } from "Medusa/Parseltongue/Boundary/Boundary.js";
import { Meta } from "Medusa/Parseltongue/Meta/Meta.js";
import { SVG } from "Medusa/Parseltongue/SVG/SVG.js";

export class Scope extends Meta{


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
        points.forEach(e => {
            xspread.add(e[0]);
            yspread.add(e[1]);
        });
        return [xspread,yspread];
    }
    

    // static calculate_positions(points, width, height, xbox, ybox){
    //     return points.map(e => {
    //         const x = Scope.map(e[0], xbox.minimum, xbox.maximum , 0, width.range())
    //         const y = Scope.map(e[1], ybox.minimum, ybox.maximum , height.range(), 0)
    //         return [x, y]
    //     });
    // }

    static calculate_positions(points, xbox, ybox, xspread, yspread){
        return points.map(e => {
            xspread.current = e[0];
            yspread.current = e[1]
            const x = Scope.project(xbox, 'max', xspread, 'max');
            const y = Scope.project(ybox, 'mid', yspread, 'mid');
            return [x, -y]
        });
    }

    static control_point(current, previous, next, reverse, flatness, smoothness) {
        const p = previous || current;
        const n = next || current;
        const la = Scope.length_angle(p, n);
        // work in progress…
        // const flat = Scope.map(Math.cos(la.angle) * this.flattening_w.current, 0, 1, 1, 0)
        const flat = Scope.map(Math.cos(la.angle) * flatness, 0, 1, 1, 0)
        const angle = la.angle * flat + (reverse ? Math.PI : 0);
        // const length = la.length * this.smoothing_w.current;
        const length = la.length * smoothness;
        const x = current[0] + Math.cos(angle) * length;
        const y = current[1] + Math.sin(angle) * length;
        return [x, y];
    }

    static bezier_command(point, i, a, flatness, smoothness) {
        const cps = Scope.control_point(a[i - 1], a[i - 2], point, false, flatness, smoothness);
        const cpe = Scope.control_point(point, a[i - 1], a[i + 1], true, flatness, smoothness);
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
                            `${acc} ${ Scope.bezier_command(e, i, a, flatness, smoothness)}`} 
                                    , "");
    }

    styles() {
        return {
            path: { fill: this.path_color, stroke: this.path_color, strokeWidth: 0.5, fillOpacity: 0.15, strokeOpacity: 0.8 },
            flags: { fill: this.flag_color }
        };
    }

    push(value, unshift, reverse){
        
        let values = null;
        if(Array.isArray(value)){
            reverse ? value.reverse() : null;
            values = value;
        }
        else if(typeof(value)  === "number"){ values = [value]; }

        for (let idx in values) {
            if(unshift){
                this.W.unshift(value);
                this.start_index = (this.start_index+1)%this.units;
                this.needs_update = true;
            }
            else{
                this.W.push(value);
                this.needs_update = true;
            }
        }
    }

    reload(){

        let [xspread,yspread] = this.spread;
        let [xbox, ybox] = this.box;
        // yspread.symmetrize();
        this.positions = Scope.calculate_positions(this.W, xbox, ybox, xspread, yspread);
        
        if(this.set_root==null) { this.set_root = SVG.make("g", "set_root", [], {}); }
        if(this.W.length){
            let set_count = Math.floor(( this.start_index+1 + this.W.length) / this.units)+1; //https://stackoverflow.com/questions/3895478/does-javascript-have-a-method-like-range-to-generate-a-range-within-the-supp //https://2ality.com/2014/05/es6-array-methods.html
            // if(SVG.ladder(null, Array.from(new Array(set_count), (x, i) => i + 0 ).join('/'), false, null, true).every(x => x==true)){}
            let scope = this;
            Array.from(new Array(set_count), (x, i) => i + 0 ).forEach(set_index => {

                // scope.scope, scope.units, scope.start_index, scope.path_smoothing, scope.path_flattening, scope.path_color, scope.flag_color
                let positions = [];
                let [units,start_index] = [12,5];
                if(set_index==0){
                    positions = scope.positions.slice(0, scope.units - scope.start_index);
                }
                else{
                    let slice_start = [(scope.units - scope.start_index) + ((set_index-1) * scope.units)]
                    positions = scope.positions.slice(slice_start, slice_start + scope.units); //console.log(`total: ${scope.positions.length} extract: ${positions.length} from ${slice_start} `);
                }

                let set_container = SVG.put(scope.set_root, SVG.make("g", "set_container", [], {}), set_index, true);
                let path_data =  Scope.path_d(positions, scope.path_flattening, scope.path_smoothing)
                
                let path = SVG.put(set_container, SVG.make('path', 'path_set', [], {}), 0, true);
                SVG.configure(path , Object.assign({d:path_data}, scope.styles().path ));
                window.ppath = path;

                let set_flags = SVG.put(set_container, SVG.make("g", "set_flags", [], {}) , 1, true);

                for (let index in positions) {
                    let position = positions[index];
                    let flag = SVG.put(set_flags, SVG.make('circle', '', [], {}), index, true);
                    SVG.configure(flag , Object.assign({cx:position[0], cy:position[1], r:2.5, title:scope.name}, scope.styles().flags ));

                    flag.positionx = position[0];
                    flag.positiony = position[1];
                    flag.valuex = scope.W[index][0];
                    flag.valuey = scope.W[index][1];
                    flag.addEventListener("mouseover", Scope.showPopup);
                    flag.addEventListener("mouseout", Scope.hidePopup);
                }
            });

        }
        
    }


    constructor(parent, name, values, collectors, attributes, svg_root, scope_root, svg, def_ref, draggable, scope, units, start_index, path_smoothing, path_flattening, path_color, flag_color){
        super(parent, name, values, collectors, attributes, svg_root, scope_root, svg, def_ref, draggable);
        this.scope = scope;
        this.units = units;
        this.start_index = start_index;
        this.path_smoothing = path_smoothing;
        this.path_flattening = path_flattening;
        this.path_color = path_color;
        this.flag_color = flag_color;
    }
}

