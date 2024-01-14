// import { Log } from './log.js';
export let Boundary = {
    initialize: function(minimum,current,maximum,fractions,anchor) {
        this.name = "Boundary";
        this.type = "boundary";
        this.minimum = minimum;
        this.current = current;
        this.maximum = maximum;
        this.fractions = fractions;
        this.anchor = anchor;
        this.weights = {};
        Object.assign(this,Boundary);
    },
    min: function() { return this.minimum;},
    max: function() { return this.maximum;},
    midsize: function() { return (this.maximum-this.minimum)/2;},
    range: function() { return this.max()-this.min();},
    midpoint: function() { 
        let [min,max,midsize] = [this.min(),this.max(),this.midsize()];
        return min+midsize;},
    domain: function(in_bounds) {
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
    },
    union_size: function(in_bounds) { 
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
    },
    align: function(B1,A1,B2,A2,offset) { /* MIN-PRE/MID/POST | MID-PRE/MID/POST | MAX-PRE/MID/POST  */ 
        let [L1,M1,R1, L2,M2,R2] = [B1.min(),B1.midpoint(),B1.max(), B2.min(),B2.midpoint(),B2.max()] ;
        A1 = A1.toUpperCase();
        A2 = A2.toUpperCase();
        let first = L1, second = L2;
        let Ls = [0,'MIN','MINIMUM','START','STARTING','BEGIN','BEGINNING','PRE','BEFORE','LEFT'];
        let Ms = [1,'MID','MIDDLE','CENTER','MIDPOINT','ON','AT'];
        let Rs = [2,'MAX','MAXIMUM','FINISH','FINISHING','END','ENDING','POST','AFTER','RIGHT'];

        if(Ls.includes(A1)){ first = L1;}
        else if(Ms.includes(A1)){ first = M1;}
        else if(Rs.includes(A1)){ first = R1; }

        if(Ls.includes(A2)){ second = L2;}
        else if(Ms.includes(A2)){ second = M2;}
        else if(Rs.includes(A2)){ second = R2;}
        
        offset = offset ? offset+first-second : first-second;
        let out_bounds = Object.assign({}, B2);
        out_bounds.minimum += offset;
        out_bounds.current += offset;
        out_bounds.maximum += offset;
        return out_bounds;
    },

    view_range: function (main_bounds, dimension, in_bounds) {
        if (dimension in in_bounds && dimension in main_bounds) {
            let b1 = main_bounds[dimension];
            let b2 = in_bounds[dimension];
            let [union_range, union_ratio, fraction_start_index, union_fractions] = b1.union_size(b2);
            let unit_size = b2.range() / union_fractions; // b1.range()/union_fractions;
            let minimum = b1.midpoint() - (unit_size * union_fractions / 2);
            let index_to = fraction_start_index + union_fractions;
            return [b1.fractions, fraction_start_index, union_fractions, index_to, unit_size, minimum];
        }
    },
    draw_range: function (main_bounds,dimension) {
        if (dimension in main_bounds) {
            let b1 = main_bounds[dimension];
            let [fractions, minimum, midpoint, maximum, unit_size] = [b1.fractions, b1.min(),b1.midpoint(),b1.max(),b1.range() / b1.fractions] // b1.range()/union_fractions;
            return [fractions, 0, fractions, fractions-1, unit_size, minimum];
            // return [fractions, minimum, midpoint, maximum, unit_size];
        }
    },
    add:function (...in_bounds){
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
    },
    collect:function (...box){
        var D = new Map();
        boxes.forEach(function(box){ // [].forEach.call(arguments, function (el) { console.log(el);});
            box.forEach(function(boundary,dimension){
                if (D.has(dimension)){ 
                        D.get(dimension).add(boundary); }
                else {  D.set(dimension, boundary); }
            });
        });
        return D;
    },
    get_empties(maxes){
        return maxes.map(function(max){
            return new Boundary.initialize(Infinity,0,-Infinity,0,0);
        });
    },
};