import { Boundary } from "../Boundary/Boundary.js"

export class Space {

    constructor(offset, ranges, ...arrays){
        // from Utilities.Space.Space import Space
        // s = Space(0,ranges=((0,None),), h=12, v=12, r=5, x=2)
        // var s = new Space(0,[[0,undefined]],['h',12],['v',12],['r',5],['x',2])
        // for(const i of s.generator()){ console.log(i) }
        // var next;
        // while (!(next = generator.next()).done) { var job = next.value;}
        // s.index(10,11,4,1) //1319
        // s.coordinates(1319) //[10, 11, 4, 1]
        this.arrays = new Map([...arrays])/* new Map([['foo', 3], ['bar', {}], ['baz', undefined]]) */
        this.ranges = ranges
        this.offset = offset
        this.data = {}
        this.idx = 0
        this.address = this.coordinates(this.idx, '', false, false, true)
        this.stringifier = '/'
        // # this._address = []
        // # this._idx = 0
    }


    static *range(start = 0, end = 100, step = 1) { //[...Boundary.range_slice(150,200,3)].includes(151)
        let iterationCount = 0;
        if (0<step<end){
            for (let i = start; i < end; i += step) {
                iterationCount++;
                yield i;
            }
        }
        else{
            for (let i = end-1; i => start; i += step) {
                iterationCount++;
                yield i;
            }
        }
        return iterationCount;
    }

    static get_unit(unit){
        if (Array.isArray(unit)){  return unit.length }
        else if (unit instanceof Boundary){ return unit.length }
        else{ return unit; }
    }

    static get_fract(unit, fract){
        if (Array.isArray(unit)){
            if (unit.length > fract && fract >= 0){
                return unit[fract];
            }
            else{
                return unit[unit.length-1]; /* return unit[-1]; // # return unit[-2] */
            }
        }
        else if (unit instanceof Boundary){ return unit.fract(fract)}
        else{
            if (fract == -1){
                // # return unit
                return unit-1;
            }
            else if (unit > fract){
                return fract;
            }
            else{
                return unit;
            }
        }
    }

    static get_location(unit, coord){
        if (Array.isArray(unit)){
            return unit.indexOf(coord)
        }    
        else if (unit instanceof Boundary){ return unit.index(coord) }
        else
            if (unit > coord){ return coord; }
            else{ return unit; }
    }

    static is_coord(units, coord){
        if (Array.isArray(units)){
            return units.includes(coord) /* return coord in units */
        }    
        else if (units instanceof Boundary){ return units.has(coord) }
        else{ return coord < units; }
    }

    maximum(){
        let coordinates = Array.from(this.arrays).map(([key, unit], index) => ( 
            Space.get_fract(unit, -1))
            )
        // coordinates = [Space.get_fract(unit, -1) for index, unit in enumerate(list(this.arrays.values()))]
        return this.index(...coordinates)
    }

    index(...coordinates){
        // coordinates = list(coordinates)
        var coord_len = coordinates.length
        // arrays = list(this.arrays.values())
        var arrays = Array.from(this.arrays).map(([key, unit], index) => ( unit))
        if (arrays.length > coord_len){
            // coordinates = coordinates + [Space.get_fract(unit, 0) for index, unit in enumerate(arrays[coord_len:])]
            coordinates = coordinates.concat(Array.from(this.arrays).slice(coord_len).map(([key, unit], index) => ( Space.get_fract(unit, 0))))
        }

        if (arrays.length >= coordinates.length){
            var multiplier = 1
            var scale = 0
            var full = 1
            var fract = 1
            arrays.reverse()
            coordinates.reverse()
            for (let index in coordinates){
                index = parseInt(index)
                let coord = coordinates[index]
                if (Space.is_coord(arrays[index], coord)){
                    full = arrays.slice(0,index).reduce(function (accumulator, unit) { return accumulator * Space.get_unit(unit); },  multiplier); /* full = reduce( lambda x, unit: x * Space.get_unit(unit), arrays[:index], multiplier) */
                    fract = Space.get_location(arrays[index], coord);
                    scale = scale+(full*fract);
                }
                else{ return undefined; }
            }
            return this.offset + scale
        }
    }

    coordinates(index, stringify, kw, aakw, zero_index=true){
        [stringify, kw, aakw, zero_index] = [stringify?stringify:'', kw?kw:false, aakw?aakw:false, zero_index?zero_index:false]
        var base = []
        var values =  Array.from(this.arrays).map(([key, unit], index) => ( unit))/* list(this.arrays.values()) */
        var multiplier = 1
        var full = 1
        var fract = 1
        var scale = index
        // for (idx, unit in enumerate(values)){
        for (let idx in values){
            idx = parseInt(idx)
            let unit = values[idx]
            full = values.slice(idx+1).reduce(function (accumulator, unit) { return accumulator * Space.get_unit(unit); },  multiplier); /* full = reduce(lambda x, units: x * Space.get_unit(units), values[idx+1:], multiplier) */
            fract = Math.floor(scale/full)
            scale = scale-(full*fract)
            fract = Space.get_fract(unit, fract)
            if (!zero_index && !fract){
                break
            }
            else{
                base.push(fract)
            }
        }
        if (aakw){
            var kws = {};
            keys = Array.from(this.arrays).map(([key, unit], index) => (key))
            keys.forEach((key, i) => kws[key] = base[i]);
            // kws = Object.assign(...keys.map((k, i) => ({[k]: values[i]})))
            // kws = keys.reduce((o, k, i) => ({...o, [k]: values[i]}), {}) /* object spread syntax (ES2018) */
            // kws = Object.fromEntries(keys.map((_, i) => [keys[i], values[i]]))
            return [base.map(([key, value], index) => ( value.toString())).join(stringify), base, kws] /* return (stringify.join([str(si) for si in base]), base, dict(zip(this.arrays.keys(), base))) */
        }
        if (kw){
            var kws = {};
            keys = Array.from(this.arrays).map(([key, unit], index) => (key))
            keys.forEach((key, i) => kws[key] = base[i]);
            base = kws /* kw ? dict(zip(this.arrays.keys(), base)) : base     */
        }
        return stringify ? [base.map(([key, value], index) => ( value.toString())).join(stringify), base] : base /* (stringify.join([str(si) for si in base]), base) if stringify else base */
    }


    reset_address(start=0, stop=undefined, border=0){
        // var arr = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
        // var anotherArr = [ 1, 2, 3 ];
        // Array.prototype.splice.apply(arr, [0, anotherArr.length].concat(anotherArr));
        /* this.address[slice_] = [Space.get_fract(a, border) for a in list(this.arrays.values())[slice_]] */
        var replacement =  Array.from(this.arrays).slice(start,stop).map(([key, unit], index) => ( Space.get_fract(unit, border)))
        Array.prototype.splice.apply(this.address, [start, replacement.length].concat(replacement)); //https://stackoverflow.com/questions/17511273/how-to-replace-elements-in-array-with-elements-of-another-array
        this.idx = this.index(...this.address) //*
    }


    level_up(level_name, contain=false, loop=false, adjust_rest=false, test=false){
        // if (this.is_locked()) { return; }
        var keys =  Array.from(this.arrays).map(([key, unit], index) => ( key)) /* list(this.arrays.keys()) */
        const key_length = keys.length
        const level_name_type = typeof(level_name)
        if (level_name_type=='number'){
            if (level_name<key_length){ level_name = keys[level_name]; }
            else{ level_name = level_name.toString() }
        }
        var address = this.coordinates(this.idx, '', false, false, true)
        var address_length = address.length
        if (level_name && keys.includes(level_name)){
            var level = this.arrays.get(level_name)
            var level_idx = keys.indexOf(level_name)
            var address_level = address[level_idx]
            var level_length = Space.get_unit(level)  /* level[-1], len(level) */
            var address_level_idx = Space.get_location( level, address_level)  /*  level.index(address_level) */
            if (address_level_idx+1 < level_length){
                if (test){ return [true, this.idx, this.address]; }
                this.address[level_idx] = Space.get_fract( level, address_level_idx+1)  /*  level[address_level_idx+1] */
                this.idx = this.index(...this.address) //*
                if (adjust_rest){ this.reset_address(level_idx+1)}
                return [true, this.idx, this.address]
            }
            else if (!contain){
                if (level_idx < key_length){
                    if (loop){
                        if (test) { return [true, this.idx, this.address]; }
                        this.address[level_idx] = Space.get_fract( level, 0)  /*  level[0] */
                        this.idx = this.index(...this.address) //*
                        if (adjust_rest){ this.reset_address(level_idx+1); }
                        return [true, this.idx, this.address];
                    }
                    if (level_idx+1 < key_length){
                        return this.level_up(keys[level_idx+1], contain, loop, adjust_rest, test);
                    }
                }
            }
        }
        return [false, this.idx, this.address]
    }
        
    level_down(level_name, contain=false, loop=false, adjust_rest=false,test=false){
        // if (this.is_locked()) { return; }
        var keys =  Array.from(this.arrays).map(([key, unit], index) => ( key)) /* list(this.arrays.keys()) */
        const key_length = keys.length
        const level_name_type = typeof(level_name)
        if (level_name_type=='number'){
            if (level_name<key_length){ level_name = keys[level_name]; }
            else{ level_name = level_name.toString() }
        }
        var address = this.coordinates(this.idx, '', false, false, true)
        var address_length = address.length
        if (level_name && keys.includes(level_name)){
            level = this.arrays.get(level_name)
            level_idx = keys.indexOf(level_name)
            address_level = address[level_idx]
            level_length = Space.get_unit(level) /*  # level[-1], len(level) */
            address_level_idx = Space.get_location( level, address_level) /*  # level.index(address_level) */
            if (address_level_idx-1 >= 0){
                if (test) {return [true, this.idx, this.address]; }
                this.address[level_idx] = Space.get_fract( level, address_level_idx-1) /*  # level[address_level_idx+1] */
                this.idx = this.index(...this.address)//*
                if (adjust_rest){ this.reset_address(level_idx+1); }
                return [true, this.idx, this.address]
            }
            else if (!contain){
                if (level_idx >= 0){
                    if (loop){
                        if (test) { return [true, this.idx, this.address]}
                        this.address[level_idx] = Space.get_fract( level, -1) /*  # level[0] */
                        this.idx = this.index(...this.address)//*
                        if (adjust_rest){ this.reset_address(level_idx+1); }
                        return [true, this.idx, this.address];
                    }
                    if (level_idx-1 >= 0){
                        return this.level_down(keys[level_idx-1], contain, loop, adjust_rest, test);
                    }
                }
            }
        }
        return [false, this.idx, this.address]
    }

    index_level_address(){
        address = this.sanitize(this.address)
        address_length = len(address)
        level_index = address_length-1
        keys = list(this.arrays.keys())
        return this.idx, level_index, keys[level_index], address
    }

    step_up(level_idx){
        // # index, level_idx, level_name, address = this.index_level_address()
        var [y3 , index, adr] = this.level_up(level_idx-1, /* contain= */false, /* loop= */true, /* adjust_rest= */false, /* test= */true)
        var [y1 , index, adr] = this.level_up(level_idx, /* contain= */false, /* loop= */false, /* adjust_rest= */false, /* test= */true)
        var [y2 , index, adr] = this.level_up(level_idx+1, /* contain= */false, /* loop= */false, /* adjust_rest= */false, /* test= */true)
        if (y1)
            if (y2){    [y2 , index, adr] = this.level_up(level_idx+1, /* contain= */false, /* loop= */false, /* adjust_rest= */true, /* test= */false); }
            else {      [y1 , index, adr] = this.level_up(level_idx, /* contain= */false, /* loop= */true, /* adjust_rest= */true, /* test= */false); }
        else if (y3) {  [y3 , index, adr] = this.level_up(level_idx-1, /* contain= */false, /* loop= */false, /* adjust_rest= */true, /* test= */false); }
        return this.index_level_address()
    }

    scan(near=0,  far=undefined, step=-1){
        const address_length = (far != undefined) ? far : this.address.length
        const level_index = address_length-1
        for (const i of Boundary.range_slice(level_index, near-1, step)) { /* for (i in range(level_index, near-1, step)){ */
            const [y1 , index, adr] = this.level_up(i, /* contain= */true, /* loop= */false, /* adjust_rest= */false, /* test= */true)
            if (y1){ return this.level_up(i, /* contain= */true, /* loop= */false, /* adjust_rest= */true, /* test= */false)}
        }
        return [false, this.idx, this.address]
    }


    sanitize(address=undefined, near=0, far=undefined, step=undefined){
        address = address ? address : this.address
        let out_address = []
        for (const segment of Boundary.from_array(address, near, far, step)){
            if (!segment){ break; }
            else{ out_address.push(segment); }
        }
        return out_address
    }

    index_address(sanitize=true){
        if (sanitize){
            return [this.idx, this.sanitize(this.address)];
        }
        return [this.idx, this.address]
        // # return this.idx, this.coordinates(this.idx, zero_index=false)
    }

    level(index){
        coonst [adrs, base] = this.coordinates(index, '/', false, false, /* zero_index= */false)
        const keys = Array.from(this.arrays).map(([key, unit], index) => ( key)) /* list(this.arrays.keys()) */
        return keys[base.length-1]
    }

    distance(index, location=-1){
        const keys = Array.from(this.arrays).map(([key, unit], index) => ( key)) /* list(this.arrays.keys()) */
        const [adrs, base] = this.coordinates(index, this.stringifier, false, false, /* zero_index= */false)
        const unit = this.arrays.get(keys[base.length-1])
        const unit_idx = location==-1 ? unit.length-1 : location
        base[base.length-1] = unit[unit_idx]
        idx = this.index(...base)//*
        print(index, '->', idx)
        return idx-index
    }

    is_fragmented(address=undefined, level=false, near=undefined, far=undefined, step=undefined){
        address = address ? address : this.address
        var index = 0
        for (const segment of Boundary.from_array(address, near, far, step)){
            if (!segment){
                return level ? [true, near+index] : true
            }
            index++
        }
        return level ? [false, -1] : false
    }

    next(near=-1, far=undefined, step=-1, sanitize=true, counter=0){
        var y = true
        const level_names = Array.from(this.arrays).map(([key, unit], index) => ( key))// list(this.arrays.keys())
        while (y){
            var [y, idx, adr] = [null, null, null]
            if (counter==0){
                [y , idx, adr] = this.level_up(0, /* contain= */false, /* loop= */false, /* adjust_rest= */false, /* test= */true)
            }
            else{
                [y, idx, adr] = this.scan(/* near= */0, /* far= */far, /* step= */step)
            }
            // # if not this.is_fragmented(near=0, far=far):
            // #     return y, idx, this.sanitize(near=0, far=far) if sanitize else this.address
            var [fragmented, level_idx] = this.is_fragmented(/* address= */undefined, /* level= */true, /* near= */0, /* far= */far)
            var level_name = level_names[level_idx]
            if (sanitize){
                if (fragmented){ return [y, idx, this.address, level_name, level_idx]}
                else { return [y, idx, this.sanitize(/* address= */undefined, /* near= */0, /* far= */far), level_name, -1] }
            }
            else{ return [y, idx, this.address, level_name, level_idx]}
        }
        return [false, this.idx, (sanitize ? this.sanitize(/* address= */undefined, /* near= */0, /* far= */far) : this.address), level_names[level_names.length-1], -1]
    }

    *generator(sanitize=true){
        var [ir, counter] = [0,0]
        for (const r of this.ranges){
            var [last_y, y] = [true, true]
            while (y){
                var [y, idx, address, level_name, level_idx]  = this.next(/* near= */r[0], /* far= */r[1], /* step= */-1, /* sanitize= */sanitize, counter)
                counter++
                // var [y, idx, address, level_name, level_idx]  = this.next(near=r[0], far=r[1],sanitize=sanitize)
                if (y) {
                    last_y = true
                    const skip_level = yield [y, idx, address, ir, level_name, level_idx]
                    if(skip_level!==undefined){
                        /* [y1 , index, adr] =  */this.level_up(skip_level, /* contain= */true, /* loop= */false, /* adjust_rest= */true, /* test= */false); 
                    }
                }
                else if (last_y){
                    last_y = false
                    yield [y, idx, address, ir, level_name, level_idx]
                }
            }
            this.reset_address()
            ir++
        }
        return undefined
    }


    advance(){
        this.idx = this.idx+1
    }

    advance(){
        space = this
        /* 
        for (i, r in enumerate(this.ranges)){
            y = true
            while (y){
                y, idx, address = space.next(near=r[0], far=r[1],sanitize=false)
                if (y) { yield y, idx, address, i; }
            }
            space.reset_address()
        } */
        return undefined
    }


    __getitem__(key){
        key_type = typeof(key)
        if (key == undefined){
            return this.data.get(this.idx, undefined);
        }
        else if ([str, 'number'].includes(key_type))
            if (key == ''){ return this.data.get(str(this.idx)); }
            else{ return this.data.get(key, undefined); }
            
        else if ([slice].includes(key_type)){
            address = this.sanitize(this.address)
            /* address = [str(k) for k in address[key]] */
            return this.data.get(this.stringifier.join(address), undefined)
        }

        else if ([list, tuple].includes(key_type)){
            /* key = [str(k) for k in key] */
            return this.data.get(this.stringifier.join(key), undefined)
        }
        else{ return this.data.get(str(key), undefined);}
    }

    __setitem__(key, value){
        key_type = typeof(key)
        if (key == undefined){
            this.data[this.idx] = value
        }
        else if ([str, 'number'].includes(key_type)){
            if (key == ''){ this.data[str(this.idx)] = value}
            else { this.data[key] = value; }
        }
        else if ([slice].includes(key_type)){
            address = this.sanitize(this.address)
            /* address = [str(k) for k in address[key]] */
            this.data[this.stringifier.join(address)] = value

        }
        else if ([list, tuple].includes(key_type)){
            /* key = [str(k) for k in key] */
            this.data[this.stringifier.join(key)] = value
        }
        else{ this.data[str(key)] = value; }
    }

    acquire(first=undefined, second=undefined, third=undefined){
        if (this.is_locked()){
            this[undefined] = first
            this[''] = second
            /* this[:] = third */
            return true, this.idx,  this.address
        }
        return false, this.idx,  this.address
    }

    assign(first=undefined, second=undefined, third=undefined){
        state = false
        if (first != undefined){
            this[undefined] = first
            state = true
        }
        if (second != undefined){
            this[''] = second
            state = true
        }
        if (third != undefined){
            /* this[:] = third */
            state = true
        }
        return state
    }

    is_locked(){
        /* return this[undefined] != undefined && this[:] == undefined */
    }

    is_complete(){
        /* return this[undefined] != undefined && this[:] != undefined && this[''] != undefined  */
    }
    
    test(){
        scanner_types = ['', Subscription.Loss(), Subscription.Active(), Subscription.Gain(), Subscription.Volume()]
        scans_amount = [0, 3, 4]
        series_types = ['', "TRADES", "MIDPOINT", "BID", "ASK"]
        bar_types = ['1 hour', '1 day', '1 week', '1 month', ]
        space = Space(0, ranges = ((0,1),(0,2),(2,undefined)), scanner=scanner_types, rank=scans_amount, graph=series_types, candlestick=bar_types)
        // # space.next(near=2)
        for (sia in space.tester()){ print(sia)}
        // # y = true
        // # while y:
        // #     # y, idx, address = space.scan(start=2)
        // #     y, idx, address = space.next(near=0, far=1)
        // #     print(y, idx, address)
        // # space.reset_address()

        // # print(['']*10)
        // # y = true
        // # while y:
        // #     # y, idx, address = space.scan(end=1)
        // #     y, idx, address = space.next(near=0, far=2)
        // #     print(y, idx, address)
        // # space.reset_address()

        // # print(['']*10)
        // # y = true
        // # while y:
        // #     # y, idx, address = space.scan(far=1)
        // #     y, idx, address = space.next(near=2)
        // #     print(y, idx, address)

    }

    tester(){
        space = this
        for (r in this.ranges){
            y = true
            while (y){
                y, idx, address = space.next(near=r[0], far=r[1],sanitize=false)
                if (y) {
                    /* yield y, idx, address */
                }
            }
            space.reset_address()
        }
        return undefined

        // #
        // #        idx = this.index(*base)
        // #        if level in this.arrays:
        // #            keys = list(this.arrays.keys())
        // #            coords = [this.arrays.get(a)[-1] for a in this.arrays]
        // # coords.reverse()
        // #            coords = coords[0:keys.index(level)-1]
        // #            print(coords)
        // #            idx = this.index(*coords)
        // #            print(idx)
        // #            return idx-index
        // #        return undefined
        //         # address, base =  this.coordinates(this.index, this.stringifier, zero_index=true)
    }

}
// https://stackoverflow.com/questions/51314678/javascript-generators-how-to-skip-yield-when-called-using-next
// # series_types = ["TRADES", "MIDPOINT", "BID", "ASK", "BID_ASK", "ADJUSTED_LAST", "HISTORICAL_VOLATILITY", "OPTION_IMPLIED_VOLATILITY", "REBATE_RATE", "FEE_RATE", "YIELD_BID", "YIELD_ASK", "YIELD_BID_ASK", "YIELD_LAST",]
// # bar_types = [ '1 hour', '1 day', '1 week', '1 month',]
// #idx = Space(0,series_types, bar_types)
// #print(idx.index("MIDPOINT",'1 week'))
// #print(idx.index("ASK",'1 month'))
// # print(idx.index("ASK"))
// # print(idx.coordinates(55))

// # idx = Space(0,range(24),range(60), range(60))
// # print(idx.index(3,40,55))
// # print(idx.coordinates(13255))

// # idx = Space(0,range(24), 60 , range(60))
// # print(idx.index(3,40,55))
// # print(idx.coordinates(13255))


// # scanner_types = [ "Loss", "Active", "Gain", "Volume"]
// # scans_amount = 100
// # series_types = ["TRADES", "MIDPOINT", "BID", "ASK", "BID_ASK", "ADJUSTED_LAST", "HISTORICAL_VOLATILITY", "OPTION_IMPLIED_VOLATILITY", "REBATE_RATE", "FEE_RATE", "YIELD_BID", "YIELD_ASK", "YIELD_BID_ASK", "YIELD_LAST",]
// # bar_types = [ '1 hour', '1 day', '1 week', '1 month',]
// # index_space = Space(0, scanner_types, scans_amount, series_types, bar_types)
// # print( index_space.coordinates(8,'/'))

// # scanner_types = [ "Loss", "Active", "Gain", "Volume"]
// # scans_amount = [0,100]
// # series_types = ["TRADES", "MIDPOINT", "BID", "ASK", "BID_ASK", "ADJUSTED_LAST", "HISTORICAL_VOLATILITY", "OPTION_IMPLIED_VOLATILITY", "REBATE_RATE", "FEE_RATE", "YIELD_BID", "YIELD_ASK", "YIELD_BID_ASK", "YIELD_LAST",]
// # bar_types = ['1 hour', '1 day', '1 week', '1 month',]
// # index_space = Space(0, scanner=scanner_types, rank=scans_amount, graph=series_types, candlestick=bar_types)
// # # print(list(index_space.arrays.keys()))
// # # print(dict(zip(index_space.arrays.keys(), index_space.coordinates(8))))
// # print(index_space.index('Loss', 0, 'BID', '1 hour'))
// # print( index_space.coordinates(8,'/',kw=true, aakw=true))
// # print( index_space.coordinates(8,'/',kw=true, aakw=true, zero_index=false))
// # print(index_space.index('Active', 100))
// # print(index_space.distance(42, -1))
// # print('level of 449', index_space.level(449))
// # print('level of 450', index_space.level(450))
// # for r in range(10):
// #     # num = 451+r
// #     # print('level of '+str(num), index_space.level(num), 'address :', index_space.coordinates(num,'/')[0])
// #     print(index_space.level_up('graph', contain=false, loop=false))
// # from Utilities.Space.Space import Space
// # scanner_types = [ "Loss", "Active", "Gain", "Volume"]
// # scans_amount = [0,100]
// # series_types = ["TRADES", "MIDPOINT", "BID", "ASK", "BID_ASK", "ADJUSTED_LAST", "HISTORICAL_VOLATILITY", "OPTION_IMPLIED_VOLATILITY", "REBATE_RATE", "FEE_RATE", "YIELD_BID", "YIELD_ASK", "YIELD_BID_ASK", "YIELD_LAST",]
// # bar_types = ['1 hour', '1 day', '1 week', '1 month',]
// # index_space = Space(0, scanner=scanner_types, rank=scans_amount, graph=series_types, candlestick=bar_types)
// # print(index_space.level_up('graph', contain=false, loop=false))

