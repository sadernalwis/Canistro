import { Linguistic } from "../Linguistic.js";

export class Sequence extends Linguistic{

    constructor(magic_number, serial=false, components){
        var regex;
        if (serial) { regex = components.reduce((l,w,i,a)=>{ return l+(i<a.length-1 ? `(${w})[\\s,.!:\\-()?]+`: `(${w})`)},'') /* 'lOrEm ipsum, sit amet'.match(new RegExp(regex,'gi')) */ }
        else        { regex = components.reduce((l,w,i,a)=>{ return l+(i<a.length-1 ? `${w}|`: `${w})`)},'(') }
        super(new RegExp(regex,'gi'), magic_number)
    }

    unwrap(match, idx){
        return match.replaceAll('"','');
    }

    post_match(match, idx){
        return match.length>0
    }

    wrap(match, idx){
        return `"${match}"`
    }
}

// Array.prototype.subarray = function(i, j){
//     var self = this, arr = [];
//     for(var n = 0;i <= j; i++, n++){
//         (function(i){
//             Object.defineProperty(arr, n, {       //Array is an Object
//                 get: function(){
//                     return self[i];
//                 },
//                 set: function(value){
//                     self[i] = value;
//                     return value;
//                 }
//             });   
//         })(i);
//     }
//     return arr;
// }
