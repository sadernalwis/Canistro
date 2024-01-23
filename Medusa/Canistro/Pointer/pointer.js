//import console = require("console");

//importScripts('shared.js');
const STAGNANT = 0,
    UP = 1,
    DOWN = 2;

self.onmessage = function(message) {

    let touch = message.data;
    if (touch.state === 1) {
        Touch.start(touch);
    } else if (touch.state === 2) {
        Touch.move(touch);
    } else if (touch.state === 3) {
        Touch.end(touch);
    }
    // self.postMessage("hello");
};


self.onerror = function(message) {

};

export let Touch = {
    map: new Map(),
    scans: [1, 2, 4, 8],
    start: function(touch, pointer) {
        const id =  touch.event.pointerId
        if (touch.event.isPrimary) { Touch.map = new Map(); }
        let result = { length: 0, data: [], targets: [] };
        touch.vector.forEach(function() {
            let scans = [];
            Touch.scans.forEach(function(scan) { scans[scan] = { accumulator: [], average: Math.log2(0), direction: UP, signature: [ [0, 0] ] }; });
            result.data.push({ stroke:[], minimum: Infinity, maximum: -Infinity, scans: scans }); });
        Touch.map.set(id, result); 
        Touch.process(id, touch.event, touch.vector); },
    move: function(touch, pointer) {
        const id =  touch.event.pointerId
        Touch.process(id, touch.event, touch.vector);
    },
    end: function(touch, pointer) {
        const id =  touch.event.pointerId
        Touch.process(id, touch.event, touch.vector);
        pointer.onMessage/* self.postMessage */(Touch.map.get(id));
        Touch.map.delete(id);
    },
    process: function(id, event, vectors) {
        let result = Touch.map.get(id);
        if (result) {
            result.length++;
            result.targets.push(event.target)
            vectors.forEach(function(vector, index) {
                let data_block = result.data[index]
                data_block.stroke.push(vector)
                data_block.minimum = Math.min(data_block.minimum, vector)
                data_block.maximum = Math.max(data_block.maximum, vector)
                Touch.scans.forEach(function(scan, pass) {
                    let index_pass = data_block.scans[scan];
                    index_pass.accumulator.push(vector);
                    if (result.length % scan === 0) {
                        let average = index_pass.accumulator.reduce(function(accumulator, currentValue) { return accumulator + currentValue; }, 0.0) / index_pass.accumulator.length;
                        index_pass.accumulator = [];
                        let difference = average - index_pass.average;
                        if (difference > 0) {
                            if (index_pass.direction === UP) {
                                index_pass.signature[0][0] += difference;
                                index_pass.signature[0][1]++; } 
                            else if (index_pass.direction === DOWN) {
                                index_pass.direction = UP;
                                index_pass.signature.unshift([difference, 1]); } } 
                        else if (difference === 0) { index_pass.signature[0][1]++; } 
                        else if (difference < 0) {
                            if (index_pass.direction === UP) {
                                index_pass.direction = DOWN;
                                index_pass.signature.unshift([difference, 1]); } 
                            else if (index_pass.direction === DOWN) {
                                index_pass.signature[0][0] += difference;
                                index_pass.signature[0][1]++; } }
                        index_pass.average = average; } 
                    else {
    
                    }
                })
    
            });   
        }
    }
};