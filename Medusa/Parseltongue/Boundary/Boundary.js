import { Meta } from "../Meta/Meta.js";

export class Boundary extends Meta {

    static Ls = [0,'L','MIN','MINIMUM','START','STARTING','BEGIN','BEGINNING','PRE','BEFORE','LEFT'];
    static Ms = [1,'M','MID','MIDDLE','CENTER','MIDPOINT','ON','AT'];
    static Cs = [3,'V','VAL','VALUE','CURRENT','POINT'];
    static Rs = [4,'R','MAX','MAXIMUM','FINISH','FINISHING','END','ENDING','POST','AFTER','RIGHT'];
    static Zs = [5,'Z','ZERO'];

    distance(A1, A2){
        let first = 0, second = 0;
        A1 = A1.toUpperCase();
        A2 = A2.toUpperCase();
        if(Boundary.Ls.includes(A1)){ first = this.min(); }
        else if(Boundary.Ms.includes(A1)){ first = this.midpoint(); }
        else if(Boundary.Cs.includes(A1)){ first = this.current;  }
        else if(Boundary.Rs.includes(A1)){ first = this.max();  }
        else if(Boundary.Zs.includes(A1)){ first = 0;  }

        if(Boundary.Ls.includes(A2)){ second = this.min(); }
        else if(Boundary.Ms.includes(A2)){ second = this.midpoint(); }
        else if(Boundary.Cs.includes(A2)){ second = this.current;  }
        else if(Boundary.Rs.includes(A2)){ second = this.max();  }
        else if(Boundary.Zs.includes(A2)){ second = 0;  }
        return first - second;
    }

    scale1(A1, A2, X1, X2, ratio){
        let d1 = Math.abs(this.distance(A1, A2));
        let d2 = Math.abs(X1-X2);

        let zero = 0;
        let minimum = this.minimum;
        let midpoint = this.midpoint();
        let current = this.current;
        let maximum = this.maximum;

        A1 = A1.toUpperCase();
        A2 = A2.toUpperCase();
        if(Boundary.Ls.includes(A1)){ 
            minimum = this.minimum;
            current = this.minimum+((this.current -this.minimum)/d1 *d2 *ratio);
            maximum = this.minimum+(this.range()/d1 *d2);
        }
        else if(Boundary.Ms.includes(A1)){ 
            minimum = this.midpoint()+((this.minimum-this.midpoint())/d1 *d2 *ratio);
            current = this.midpoint()+((this.current-this.midpoint())/d1 *d2 *ratio);
            maximum = this.midpoint()+((this.maximum-this.midpoint())/d1 *d2 *ratio);
        }
        else if(Boundary.Cs.includes(A1)){ 
            minimum = this.current+((this.minimum-this.current)/d1 *d2 *ratio);
            current = this.current;
            maximum = this.current+((this.maximum-this.current)/d1 *d2 *ratio);
        }
        else if(Boundary.Rs.includes(A1)){ 
            minimum = this.maximum+((this.minimum-this.maximum)/d1 *d2 *ratio);
            current = this.maximum+((this.current-this.maximum)/d1 *d2 *ratio);
            maximum = this.maximum;
        }
        else if(Boundary.Zs.includes(A1)){ 
            minimum = 0+((this.minimum -0)/d1 *d2 *ratio);
            current = 0+((this.current -0)/d1 *d2 *ratio);
            maximum = 0+((this.maximum -0)/d1 *d2 *ratio);
        }
        this.minimum = minimum;
        this.current = current;
        this.maximum = maximum;
    }


    static map (B1, As, B2, out_ratio) { /* MIN-PRE/MID/POST | MID-PRE/MID/POST | MAX-PRE/MID/POST  */ 
        let [a1s,a1e, a2s,a2e] = As.split(':');
        let d1 = B1.distance(a1s, a1e);
        let d2 = B2.distance(a2s, a2e);
        let in_ratio = d1/d2;

        let out_bounds = Object.assign(Object.create(Object.getPrototypeOf(B2)), B2);
        let [r1,r2] = [B1.range(), B2.range()];

        out_bounds
        return out_bounds;
    }


    static align (B1, A1, B2, A2, offset, scale) { /* MIN-PRE/MID/POST | MID-PRE/MID/POST | MAX-PRE/MID/POST  */ 
        let [L1,M1,R1, L2,M2,R2] = [B1.min(),B1.midpoint(),B1.max(), B2.min(),B2.midpoint(),B2.max()] ;
        A1 = A1.toUpperCase();
        A2 = A2.toUpperCase();
        let first = L1, second = L2;

        if(Boundary.Ls.includes(A1)){ first = L1;}
        else if(Boundary.Ms.includes(A1)){ first = M1;}
        else if(Boundary.Rs.includes(A1)){ first = R1; }

        if(Boundary.Ls.includes(A2)){ second = L2;}
        else if(Boundary.Ms.includes(A2)){ second = M2;}
        else if(Boundary.Rs.includes(A2)){ second = R2;}

        if(scale){

        }
        offset = offset ? offset+first-second : first-second;
        // let out_bounds = Object.assign({}, B2);
        let out_bounds = Object.assign(Object.create(Object.getPrototypeOf(B2)), B2);
        out_bounds.minimum += offset;
        out_bounds.current += offset;
        out_bounds.maximum += offset;
        return out_bounds;
    }

    static view_range (main_bounds, dimension, in_bounds) {
        if (dimension in in_bounds && dimension in main_bounds) {
            let b1 = main_bounds[dimension];
            let b2 = in_bounds[dimension];
            let [union_range, union_ratio, fraction_start_index, union_fractions] = b1.union_size(b2);
            let unit_size = b2.range() / union_fractions; // b1.range()/union_fractions;
            let minimum = b1.midpoint() - (unit_size * union_fractions / 2);
            let index_to = fraction_start_index + union_fractions;
            return [b1.fractions, fraction_start_index, union_fractions, index_to, unit_size, minimum];
        }
    }

    static draw_range (main_bounds,dimension) {
        if (dimension in main_bounds) {
            let b1 = main_bounds[dimension];
            let [fractions, minimum, midpoint, maximum, unit_size] = [b1.fractions, b1.min(),b1.midpoint(),b1.max(),b1.range() / b1.fractions] // b1.range()/union_fractions;
            return [fractions, 0, fractions, fractions-1, unit_size, minimum];
            // return [fractions, minimum, midpoint, maximum, unit_size];
        }
    }


    static collect (...boxes){
        var D = new Map();
        boxes.forEach(function(box){ // [].forEach.call(arguments, function (el) { console.log(el);});
            box.forEach(function(boundary,dimension){
                if (D.has(dimension)){ 
                        D.get(dimension).add(boundary); }
                else {  D.set(dimension, boundary); }
            });
        });
        return D;
    }

    static get_empties(signs, max_min){
        return signs.map(function(sign){
            if (max_min=='min') return new Boundary(null, '', null, null, null, null, null, 'def_ref', false, sign, 0, Infinity, 0, 0, 1);
            if (max_min=='max') return new Boundary(null, '', null, null, null, null, null, 'def_ref', false, 0, 0, sign, 0, 0, 1);
            return new Boundary(null, '', null, null, null, null, null, 'def_ref', false, Infinity, 0, -Infinity, 0, 0, sign);
        });
    }

    min() { return this.minimum; }

    max() { return this.maximum; }

    midsize () { return (this.maximum-this.minimum)/2;}

    range() { return this.max()-this.min();}

    midpoint() { 
        let [min,max,midsize] = [this.min(),this.max(),this.midsize()];
        return min+midsize;}

    fraction_precise(){
        return this.range()/this.fractions
    }
    fraction_size(){
        return Math.floor(this.range()/this.fractions)
    }
    to_current(){
        return this.current-this.minimum
    }    

    domain(in_bounds) {
        let L1 = this.min();
        let R1 = this.max();
        let L2 = in_bounds.min();
        let R2 = in_bounds.max();
        if((L1 < R1) && (L2 < R2)){
            if      ((L1===L2)&&(R1===R2)){ return ['SAME',L1,R1];}         /* L2=L1-R1=R2 */
            else    {
                if ((L1===L2)){ L2++;}                                            /* L2=L1 */
                if ((R1===R2)){ R2++;}                                            /* R1=R2 */
                if      ((L2 > L1)&&(R1 > R2)){ return ['SUPERSET',L1,R1,L2,R2];} /* L1\L2-R2/R1 */
                else if ((L2 < L1)&&(R1 < R2)){ return ['SUBSET',L1,R1,L2,R2];}   /* L2\L1-R1/R2 */
                else if ((L2 < L1)&&(L1 < R2)){ return ['UNION_LEFT',L1,R1,L2,R2];}      /* L2\L1/R2 */
                else if ((L2 < R1)&&(R1 < R2)){ return ['UNION_RIGHT',L1,R1,L2,R2];}     /* L2\R1/R2 */
                else if ((L2 < L1)&&(R2 < L1)){ return ['SEPERATE_LEFT',L1,R1,L2,R2];}  /* L2-R2\L1-R1 */
                else if ((L2 > R1)&&(R2 > R1)){ return ['SEPERATE_RIGHT',L1,R1,L2,R2];} /* L1-R1/L2-R2 */
            }}
    }

    union_size (in_bounds) { 
        let [result,L1,R1,L2,R2] =  this.domain(in_bounds);
        if(['SAME','SUBSET'].includes(result)){
            let union_range = this.range();
            let union_ratio = union_range/this.range();
            let union_fractions = Math.round(union_ratio*this.fractions);
            let fraction_start_index = 0;
            return [union_range, union_ratio, fraction_start_index,union_fractions];
        }
        else if(result==='SUPERSET'){
            let union_range = in_bounds.range();
            let union_ratio = union_range/this.range();
            let union_fractions = Math.round(union_ratio*this.fractions);
            let fraction_start_index = Math.round((L2-L1)/this.range()*this.fractions);
            return [union_range, union_ratio, fraction_start_index,union_fractions];
        }
        else if(result==='UNION_LEFT'){
            let union_range = R2-L1;
            let union_ratio = union_range/this.range();
            let union_fractions = Math.round(union_ratio*this.fractions);
            let fraction_start_index = 0;
            return [union_range, union_ratio, fraction_start_index,union_fractions];
        }
        else if(result==='UNION_RIGHT'){
            let union_range = R1-L2;
            let union_ratio = union_range/this.range();
            let union_fractions = Math.round(union_ratio*this.fractions);
            let fraction_start_index = this.fractions-union_fractions-1;
            return [union_range, union_ratio, fraction_start_index, union_fractions];
        }
        else if(['SEPERATE_LEFT','SEPERATE_RIGHT'].includes(result)){
            return [0, 0, 0, 0];
        }
    }

    add (...in_bounds){
        let dis = this;
        in_bounds.forEach(function(in_bound){ // [].forEach.call(arguments, function (el) { console.log(el);});
            if (Array.isArray(in_bound)) {
                in_bound.forEach(function(element) {
                    dis.add(element);
                });
            } 
            else if (typeof in_bound === 'number'){
                dis.minimum = Math.min(dis.minimum, in_bound);
                dis.maximum = Math.max(dis.maximum, in_bound);
            }
            else if (typeof in_bound === "object") {
                if (in_bound.hasOwnProperty("type") && in_bound.type==='boundary') {
                    dis.minimum = Math.min(dis.minimum, in_bound.minimum);
                    dis.maximum = Math.max(dis.maximum, in_bound.maximum);
                }
            }
        });
    }
    symmetrize(){
        this.add([this.minimum*(-1), this.maximum*(-1)]);
    }

    print(){
        console.log(`MIN:${this.minimum} MID:${this.midpoint()} CUR:${this.current} MAX:${this.maximum}`);
    }

    clone(){
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }

    normalize(){
        const clone = this.clone()
        clone.minimum -= this.minimum;
        clone.current -= this.minimum;
        clone.maximum -= this.minimum;
        return clone
    }

    denormalize(normalized){
        this.minimum = this.minimum + normalized.minimum;
        this.current = this.minimum + normalized.current;
        this.maximum = this.minimum + normalized.maximum;
    }

    flip(){
        this.minimum = this.maximum - this.minimum;
        this.current = this.maximum - this.current;
        this.maximum = this.maximum - this.maximum;
    }

    constructor(parent, name, w, collectors, svgroot, realm, svg, def_ref, draggable, minimum, current, maximum, fractions, anchor, sign, step ) {
		super(parent, name, w, collectors, {}, svgroot, realm, svg, def_ref, draggable);
        w == null ? this.W = this : null;
        this.minimum = minimum;
        this.current = current;
        this.maximum = maximum;
        this.fractions = fractions;
        this.anchor = anchor;
        this.sign = sign ? sign : 1;
        this.step =  step ? step : 1;
        this.weights = {};
        
    }

    shrink(...bounds){
        const sorted = bounds.sort((a,b) => (a.range() > b.range()) ? 1 : ((b.range() > a.range()) ? -1 : 0)) //https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
        const largest = sorted[sorted.length-1] //https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
        const reduction_ratio = largest.range()/this.range()
        for (let b = 0; b < bounds.length; b++) {
            const bound = bounds[b];
            const n_bound = bound.normalize();
            n_bound.current /= reduction_ratio
            n_bound.maximum /= reduction_ratio
            bound.denormalize(n_bound)
        }
        return bounds
        // var [main_x, sprite_x,sprite_y] = Boundary.get_empties([10,100,100],'max');
        // var [hd_x,hd_y] = Boundary.get_empties([1920,1080], 'max');
        // main_x.shrink(sprite_x,sprite_y,hd_x,hd_y).forEach((b)=>{b.print()})

    }

    *generator() { //[...Space.range(150,200,3)].includes(151)
        let iterationCount = 0;
        for (let i = this.minimum; i < this.maximum; i += this.step) {
            iterationCount++;
            yield i;
        }
        return iterationCount;
    }

    has(value){
        return [...this.generator()].includes(value)
    }

    index(value){
        return [...this.generator()].indexOf(value)
    }

    fract(index){
        const unit = [...this.generator()]
        if (unit.length > index && index >= 0){
            return unit[index];
        }
        else{
            return unit[unit.length-1]; /* return unit[-1]; // # return unit[-2] */
        }
    }

    get length(){
        return [...this.generator()].length
    }

    static from_array(array, start=0, stop=undefined, step=undefined){
        if (stop<1){ stop = array.length+stop }
        else if (stop==undefined){ stop = array.length }
        if (1< step){
            var n=[];
            for (var i=start; i<stop; i+=step) {
                n.push(this[i]);
            }
            return n;
        }
        else{
            return array.slice(start,stop)
        }
        
    }

    static *range_slice(start=0, stop=undefined, step=undefined){
        /* list(range(10-1,0-1,-1)) -> [9, 8, 7, 6, 5, 4, 3, 2, 1, 0] */
        // var g = Boundary.range_slice(10-1, 0-1, -1)
        // for(const i of g){console.log(i)}
        let reverse = false;
        let iterationCount = 0;
        if ([undefined,0].includes==step){
            step = 1
        }
        else if(step<0){
            reverse = true
            step = Math.abs(step)
        }
        if(stop<start){ 
            if(reverse){
                for (let START = start; stop < START ; START -= step) { //stop---------start<-
                    iterationCount++;
                    yield START;
                }
            }
            else{
                for (let STOP = stop+1; STOP <= start; STOP += step) {//+>stop---------start
                    iterationCount++;
                    yield STOP;
                }
            }
        }
        else if(start<stop){
            if(reverse){
                for (let STOP = stop+1; STOP >= start; STOP -= step) { //start---------stop<-
                    iterationCount++;
                    yield STOP;
                }
            }
            else{
                for (let START = start; START < stop; START += step) { //+>start---------stop<-
                    iterationCount++;
                    yield START;
                }
            }
        }
        return iterationCount;
    }


}