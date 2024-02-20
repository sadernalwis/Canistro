
export let JS = {
    def_float:function (value, def_val) {
        def_val = def_val === undefined ? 0 : def_val
        return parseFloat(value === undefined ? def_val : value)
    },
    pair:function* (iterable) {// https://stackoverflow.com/a/54458643/10591628
        const iterator = iterable[Symbol.iterator]();
        let a = iterator.next();
        if (a.done) return;
        let b = iterator.next();
        while (!b.done) {
            yield [a.value, b.value];
            a = b;
            b = iterator.next();
        }
    },
    snap: function(value, size=5) { return Math.round(value / size) * size },
    start_end: function(array) { 
        const a_len = array.length
        if (a_len>1){ return [array[0], array[a_len-1]] }},
    end: function(array) { 
        const a_len = array.length
        if (a_len>0){ return array[a_len-1] }},
    slice: function(array, start, end=-1) { 
        const a_len = array.length
        if (end<0){  end+=a_len }
        if (start<0){  start+=a_len }
        return array.slice(start, end)
    },
    
    character_regex:function(charset){
        return new RegExp(`(?:[${charset}])`)
    },
    multi_split:function (string, splitters, filter_empty) {
        const split = re => str => filter_empty? str.split(re).filter(Boolean): str.split(re);
        const delimiter_split = split(new RegExp(`(?:[${splitters}])`));//split(/(?:[,\/s]+)/);
        return delimiter_split(string)

    },
    was_refreshed:function(){// https://stackoverflow.com/questions/5004978/check-if-page-gets-reloaded-or-refreshed-in-javascript
        const pageAccessedByReload = (
            (window.performance.navigation && window.performance.navigation.type === 1) || window.performance
                .getEntriesByType('navigation')
                .map((nav) => nav.type)
                .includes('reload')
          );          
          return pageAccessedByReload
    },
}
// function pairwise(arr, func, skips){ // https://stackoverflow.com/a/31973533/10591628
//     skips = skips || 1;
//     for(var i=0; i < arr.length - skips; i++){
//         func(arr[i], arr[i + skips])
//     }
// }

// pairwise([1, 2, 3, 4, 5, 6, 7], function(current,next){
//     console.log(current, next) // displays (1, 3), (2, 4), (3, 5) , (4, 6), (5, 7)
// }, 2)
// function* pairwise(iterable) {// https://stackoverflow.com/a/54458643/10591628
//     const iterator = iterable[Symbol.iterator]();
//     let a = iterator.next();
//     if (a.done) return;
//     let b = iterator.next();
//     while (!b.done) {
//       yield [a.value, b.value];
//       a = b;
//       b = iterator.next();
//     }
//   }
  
//   console.log("array (0):", ...pairwise([]));
//   console.log("array (1):", ...pairwise(["apple"]));
//   console.log("array (4):", ...pairwise(["apple", "orange", "kiwi", "banana"]));
//   console.log("set (4):", ...pairwise(new Set(["apple", "orange", "kiwi", "banana"])));

window.JS = JS