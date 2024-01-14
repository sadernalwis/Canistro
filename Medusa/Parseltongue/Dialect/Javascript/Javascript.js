// https://stackoverflow.com/questions/24065411/javascript-subarray-without-copying
Array.prototype.subarray = function(i, j){
    var self = this, arr = [];
    for(var n = 0;i <= j; i++, n++){
        (function(i){
            Object.defineProperty(arr, n, {       //Array is an Object
                get: function(){
                    return self[i];
                },
                set: function(value){
                    self[i] = value;
                    return value;
                }
            });   
        })(i);
    }
    return arr;
}


//This is the exact code you have in your question
var foo = [1, 2, 3, 4, 5];
var bar = foo.subarray(2, 4);
console.log(bar);                    // [3, 4, 5]
bar[0] = 'hello, world';             // some magic happens here
console.log(bar);                    // ['hello, world', 4, 5]
console.log(foo);                    // [1, 2, 'hello, world', 4, 5]
