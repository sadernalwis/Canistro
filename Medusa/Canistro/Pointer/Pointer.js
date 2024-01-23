//import console = require("console");
import { SVG } from "Medusa/Parseltongue/SVG/SVG.js";
import { JS } from "Medusa/Parseltongue/JS/JS.js";
import {Touch} from './pointer.js'
export let Pointer = {
    init: function(element) {
        this.element = element
        element.addEventListener("pointerdown", Pointer.pointerdown, false);
        element.addEventListener("pointermove", Pointer.pointermove, false);
        element.addEventListener("pointerup", Pointer.pointerup, false);
        element.addEventListener("pointercancel", Pointer.pointercancel, false);
        // Pointer.worker = new Worker('text/javascript/ui/workers/pointer.js');
        // Pointer.worker.onmessage = Pointer.onMessage;
        return Pointer;
    },
    pointerdown: function(event) {
        event.preventDefault();
        if (event.isPrimary || Pointer.map === undefined) {
            Pointer.map_clear = true;
            Pointer.map = new Map();
        }
        Pointer.map.set(event.pointerId, { s: 'o', x: event.clientX, y: event.clientX, f: event.pressure });
        Pointer.postMessage(event, 1, event.clientX, event.clientY, event.pressure);
    },
    pointermove: function(event) {
        event.preventDefault();
        if (Pointer.map) {
            // console.log("moved", SVG.true_coords(Pointer.element, event))
            Pointer.map.set(event.pointerId, { s: 'o', x: event.clientX, y: event.clientX, f: event.pressure });
            Pointer.postMessage(event, 2, event.clientX, event.clientY, event.pressure);
        }
        Pointer.pin(event)
    },
    pointerup: function(event) {
        event.preventDefault();
        Pointer.map.set(event.pointerId, { s: 'o', x: event.clientX, y: event.clientX, f: event.pressure });
        Pointer.postMessage(event, 3, event.clientX, event.clientY, event.pressure);
    },
    pointercancel: function(event) {
        event.preventDefault();
        Pointer.map.set(event.pointerId, { s: 'x', x: event.clientX, y: event.clientX });
    },
    draw: function() {
        if (Pointer.map_clear) {
            Pointer.Ui.ctx1.clearRect(0, 0, Ui.c1.width, Ui.c1.height);
            Pointer.map_clear = false;
        }
        Pointer.map.forEach(function(value, key, map) {
            Pointer.Ui.ctx1.fillStyle = `rgb(${value.f * 10},${0},${0},${1})`;
            Pointer.Ui.ctx1.font = `${100}px mono`;
            Pointer.Ui.ctx1.textBaseline = 'middle';
            Pointer.Ui.ctx1.textAlign = 'center';
            Pointer.Ui.ctx1.fillText(value.f, value.x * Pointer.Ui.dpi, value.y * Pointer.Ui.dpi);
        });

    },

    // snap: function(value, size=5) { return Math.round(value / size) * size },

    postMessage: function(event, state, x, y, f) {
        let [sx, sy] = SVG.true_coords(event);
        var exyf = { event:event, state:state, vector:[JS.snap(sx), JS.snap(sy), f] };
        if (state === 1)      { Touch.start(exyf, this); } 
        else if (state === 2) { Touch.move(exyf, this); } 
        else if (state === 3) { Touch.end(exyf, this); }
        // Pointer.worker.postMessage(exyf);
    },
    onMessage: function(message) {

        let data = message.data;
        console.log(message);
        if (data.type) {
            if (data.type == 'debug') {
                log(data.msg);
            } else {
                //var rate = Math.round(toMB(data.byteLength) / elapsed);
            }
        } else {

        }



    },
    in: function(node, coords, selection) {
        if (node.children && node.children.length) {
            node.children.forEach(
                function(child) {
                    Pointer.in(child, coords, selection);
                }
            );
        } else if (Container.hit_test(node, coords)) {
            selection.push(node);
        }
    },
    hit_test: function(node, coords) {
        coords.forEach(function(coord) {
            var a = node.x - coord.pageX;
            var b = node.y - coord.pageY;
            if ((a > node.width / 2) && (b > node.height / 2)) {
                return false;
            }

        });
        return true;
    },

    pin: function(event) {
        if(event.target.code?.type==="ring"){
            event.target.code.pinhole(event)
            // console.log("ring deteced")
        }
        
    }

};