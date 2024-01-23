
export let JS = {
    def_float:function (value, def_val) {
        def_val = def_val === undefined ? 0 : def_val
        return parseFloat(value === undefined ? def_val : value)
    },
    snap: function(value, size=5) { return Math.round(value / size) * size },
    start_end: function(array) { 
        const a_len = array.length
        if (a_len>1){ return [array[0], array[a_len-1]] }},
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

window.JS = JS