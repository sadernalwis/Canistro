
export class Range{
    constructor(start, stop, step = 1){
        this.start = start
        this.stop = stop
        this.step = step
    }

    *generator() { //[...Space.range(150,200,3)].includes(151)
        let iterationCount = 0;
        for (let i = this.start; i < this.end; i += this.step) {
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
        if (unit.length > fract >= 0){
            return unit[fract];
        }
        else{
            return unit[unit.length-1]; /* return unit[-1]; // # return unit[-2] */
        }
    }

    get length(){
        return [...this.generator()].length
    }


    static is_generator(generator){ //https://www.digitalocean.com/community/tutorials/understanding-generators-in-javascript
        // g.constructor.name
        return generator.constructor.constructor.name === 'GeneratorFunction'
        // return generator.__proto__.constructor.constructor.name === 'GeneratorFunction'
    }
    // fix_slice(unit){ /* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators */
    //     if (!unit.start){ unit.start = 0}
    //     if (!unit.stop){ unit.stop = 0}
    //     if (!unit.step){ unit.step = 1}
    //     unit.start = min(abs((unit.start)), abs(unit.stop))
    //     unit.stop = max(abs((unit.start)), abs(unit.stop))
    //     unit.step = abs(unit.step)
    // }
}