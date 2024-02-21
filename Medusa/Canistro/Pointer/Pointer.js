//import console = require("console");
import { SVG } from "Medusa/Parseltongue/SVG/SVG.js";
import { JS } from "Medusa/Parseltongue/JS/JS.js";
import {Touch} from './pointer.js'
export let Pointer = {
    init: function(canistro, element) {
        this.canistro = canistro
        this.element = element
        element.addEventListener("pointerdown", Pointer.pointerdown, false);
        element.addEventListener("pointermove", Pointer.pointermove, false);
        element.addEventListener("pointerup", Pointer.pointerup, false);
        element.addEventListener("pointercancel", Pointer.pointercancel, false);
        element.addEventListener("wheel", Pointer.wheel, false);
        // Pointer.worker = new Worker('text/javascript/ui/workers/pointer.js');
        // Pointer.worker.onmessage = Pointer.process;
        return Pointer; },

    pointerdown: function(event) {
        event.preventDefault();
        if (event.isPrimary || Pointer.map === undefined) {
            Pointer.map_clear = true;
            Pointer.map = new Map(); }
        // Pointer.map.set(event.pointerId, { s: 'o', x: event.clientX, y: event.clientX, f: event.pressure });
        Pointer.postMessage(event, 1, event.clientX, event.clientY, event.pressure); },

    pointermove: function(event) {
        event.preventDefault();
        if (Pointer.map) {
            // console.log("moved", SVG.true_coords(Pointer.element, event))
            // Pointer.map.set(event.pointerId, { s: 'o', x: event.clientX, y: event.clientX, f: event.pressure });
            Pointer.postMessage(event, 2, event.clientX, event.clientY, event.pressure);
        }
        Pointer.pinhole(event)
        // if(this.pin){ this.pin.move(event)}

     },

    pointerup: function(event) {
        event.preventDefault();
        // Pointer.map.set(event.pointerId, { s: 'o', x: event.clientX, y: event.clientX, f: event.pressure });
        // Pointer.map.delete(event.pointerId);
        Pointer.postMessage(event, 3, event.clientX, event.clientY, event.pressure); },

    pointercancel: function(event) {
        event.preventDefault();
        // Pointer.map.delete(event.pointerId); 
        Pointer.postMessage(event, 4, event.clientX, event.clientY, event.pressure); },

    wheel: function(event) { // https://stackoverflow.com/questions/76150884/how-to-use-the-mouse-wheel-to-zoom-on-an-svg-using-the-viewbox
            // event.preventDefault();
            let scale = event.deltaY / 1000; // set the scaling factor (and make sure it's at least 10%)
            scale = Math.abs(scale) < .1 ? .1 * event.deltaY / Math.abs(event.deltaY) : scale;
            let svg = Pointer.element
            // Pointer.element.currentScale += scale
            let pt = new DOMPoint(event.clientX, event.clientY); // get point in SVG space
            pt = pt.matrixTransform(svg.getScreenCTM().inverse());
            let [x, y, width, height] = svg.getAttribute('viewBox').split(' ').map(Number); // get viewbox transform
            let [xPropW, yPropH] = [(pt.x - x) / width, (pt.y - y) / height]; // get pt.x as a proportion of width and pt.y as proportion of height
            let [width2, height2] = [width + width * scale, height + height * scale]; // calc new width and height, new x2, y2 (using proportions and new width and height)
            let x2 = pt.x - xPropW * width2;
            let y2 = pt.y - yPropH * height2;        
            svg.setAttribute('viewBox', `${x2} ${y2} ${width2} ${height2}`);
    },
        
    navigate: function(path) {
        const svg = Pointer.element
        const delta = JS.slice(path, -3, -1)
        if (delta.length==2){
            const [[sx, sy], [ex, ey]] = JS.slice(path, -3, -1)
            let [w,h] = [svg.clientWidth, svg.clientHeight]
            let [ox, oy, vx, vy] = svg.getAttribute('viewBox').split(' ').map(c => +c)
            let [dx, dy] = [(sx-ex)*vx/w, (sy-ey)*vy/h] 
            let [nox, noy] = [ox+dx, oy+dy]
            svg.setAttribute('viewBox', [nox, noy, vx, vy].join(' ')) } },

    postMessage: function(event, state, x, y, f) {
        let [sx, sy] = SVG.true_coords(event);
        var exyf = { event:event, state:state, vector:[JS.snap(sx), JS.snap(sy), f] };
        const p_id = event.pointerId
        const p_data = Pointer.map.get(p_id)
        const cexy = [event.clientX, event.clientY]
        let touch, touchpoints;
        if (state === 1) { 
            Pointer.map.set(p_id, [[event.clientX, event.clientY]])
            touch = Touch.start(exyf, this); } 
        else if (state === 2) { 
            if (p_data){ 
                p_data.push(cexy) 
                // Pointer.navigate(p_data)
            }
            touch = Touch.move(exyf, this);  } 
        else if (state === 3) { 
            Pointer.map.delete(p_id)
            touch = Touch.end(exyf, this); 
        }
        else if (state === 4) { 
            Pointer.map.delete(p_id)
            touch = Touch.end(exyf, this); }
        // Pointer.worker.postMessage(exyf);
    },
    
    pinhole: function(event) {
        if(event.target.code?.type==="ring"){
            let ring = event.target.code
            let pin_geo = ring.pinhole(event)
            if(pin_geo){
                ring.pin.display(...pin_geo)
                // Pointer.canistro.pin.display(...pin_geo)
            }
            /* console.log("ring deteced") */ } },

    touchpoints:function(result){
        let target;
        return result.targets.filter((x)=>{
            let state = target!==x
            target=x
            return state }) 
        return []
    },
    process: function(message) {
        let [state, p_id, data] = message;
        const p_data = Pointer.map.get(p_id)
        let touchpoints = Pointer.touchpoints(data)
        let touchpoints_length = touchpoints.length
        let origin = touchpoints_length ? touchpoints[0].code : this.canistro
        let destin = JS.end(touchpoints)
        if(touchpoints.length){
            // console.log(touchpoints) 
        }
        if (p_data || state === 3){
            if(origin?.type==="pin"){
                if (state === 1) {} 
                else if (state === 2) { origin.move(p_data, (destin.code?.type==='ring')? destin.code : undefined) } 
                else if (state === 3) { origin.clear_path()}
                else if (state === 4) { origin.clear_path()} }
            // else if (p_data){
            //     Pointer.navigate(p_data)
            // }
        }
        if (p_data && !origin){
            Pointer.navigate(p_data)
        }
        // if (state === 1) {} 
        // else if (state === 2) { 
        //     //  Pointer.navigate(p_data)
        //     if (touchpoints_length==1){
        //         // console.log(touchpoints)
        //         // touchpoints[0].code?.move?.()
        //         Pointer.navigate(p_data)
        //     }
        // } 
        // else if (state === 3) { 
        //     if (touchpoints_length==1){
        //         console.log(touchpoints)
        //         // this.pin = touchpoints[0].code
        //         touchpoints[0].code?.pick?.() }
        //     else{ 
        //         // this.pin.drop()
        //         this.pin = undefined }
        //  }
    },
        
    in: function(node, coords, selection) {
        if (node.children && node.children.length) {
            node.children.forEach(
                function(child) { Pointer.in(child, coords, selection); } ); } 
        else if (Container.hit_test(node, coords)) { selection.push(node); } },

    hit_test: function(node, coords) {
        coords.forEach(function(coord) {
            var a = node.x - coord.pageX;
            var b = node.y - coord.pageY;
            if ((a > node.width / 2) && (b > node.height / 2)) { return false; }});
        return true; },


};