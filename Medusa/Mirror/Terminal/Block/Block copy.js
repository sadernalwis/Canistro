import { HTML } from "../../../../../../../../Parseltongue/HTML/HTML.js";
import { Line } from "./Line/Line.js";

class Moveable {
    constructor(el = null) {
        this.el = el;
        this.container = this.el.parentNode.getBoundingClientRect();
        this.dragging = false;
        this._events = [event => this._mouseMove(event), event => this._mouseUp(event)];
        this.el.addEventListener("mousedown", event => {
            let bounds = this.el.getBoundingClientRect();
            this.dragging = true;
            this._start = { x: event.x, y: event.y, top: bounds.top, left: bounds.left, height: bounds.height, width: bounds.width };
            document.addEventListener("mousemove", this._events[0]);
            document.addEventListener("mouseup", this._events[1]);
        });
    }

    _mouseMove(event) {
        this.dragging = true;
        let x = event.x - this._start.x,
            y = event.y - this._start.y;

        if (x < this.container.left - this._start.left) {
            x = 0; this.dragging = false;
        } else if (x > this.container.width - this._start.width - (this._start.left - this.container.left)) {
            x = this.container.width - this._start.width - (this._start.left - this.container.left);
        }

        if (y < this.container.top - this._start.top) {
            y = 0; this.dragging = false;
        } else if (y > this.container.height - this._start.height - (this._start.top - this.container.top)) {
            y = this.container.height - this._start.height - (this._start.top - this.container.top);
        }

        if (this.dragging) {
            this.el.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
        }
    }

    _mouseUp(event) {
        this.dragging = false;
        let transform = window.getComputedStyle(this.el).transform.replace('matrix(', '').replace(')', '').split(", ").map(Number);
        let left = parseFloat(this.el.style.left);
        let top = parseFloat(this.el.style.top);

        this.el.style.left = (isNaN(left) ? 0 : left) + transform[4] + "px";
        this.el.style.top = (isNaN(top) ? 0 : top) + transform[5] + "px";
        this.el.style.removeProperty("transform");
        document.removeEventListener("mousemove", this._events[0]);
        document.removeEventListener("mouseup", this._events[1]);
    }
}

class Drag {

    constructor(box, elmnt) {
        let dis = box
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "header")) { document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown; } // if present, the header is where you move the DIV from:
        else { elmnt.onmousedown = dragMouseDown; } // otherwise, move the DIV from anywhere inside the DIV:
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX; // get the mouse cursor position at startup:
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag; // call a function whenever the cursor moves:
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX; // calculate the new cursor position:
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px"; // set the element's new position:
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}

class Scale {
    constructor(box, element) { //https://codepen.io/zhangbao/pen/gXWZRJ // https://codepen.io/ronm/pen/qmpaKJ
        this.box = box
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        var box = element, isDown = false, xResize = '', mes = null;

        function drag_down(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX; // get the mouse cursor position at startup:
            pos4 = e.clientY;
            // document.onmouseup = drag_up;
            // document.onmousemove = drag_move; // call a function whenever the cursor moves:
        }

        function drag_move(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX; // calculate the new cursor position:
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px"; // set the element's new position:
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function drag_up() {
            // stop moving when mouse button is released:
            // document.onmouseup = null;
            document.onmousemove = null;
        }
        box.onmousedown = function (ev) {
            var pos = getPos(box);
            isDown = true;
            mes = { x: ev.clientX, y: ev.clientY, w: box.offsetWidth, h: box.offsetHeight, t: pos.top, l: pos.left, r: pos.right,    b: pos.bottom };
            drag_down(ev)
        };

        document.onmouseup = function () {
            document.onmousemove = null;
            isDown = false;
            drag_up()
        };

        box.onmousemove = function (ev) {
            ev.preventDefault();
            if (!isDown) { // 鼠标未按下
                xResize = '';
                if (ev.clientY < (getPos(this).top + 10)) { xResize = 'n'; }
                if (ev.clientY > (getPos(this).bottom - 10)) { xResize = 's'; }
                if (ev.clientX < (getPos(this).left + 10)) { xResize += 'w'; }
                if (ev.clientX > (getPos(this).right - 10)) { xResize += 'e'; }
                if (xResize) { box.style.cursor = xResize + '-resize'; } 
                else { box.style.cursor = 'auto'; }
                // 鼠标已经按下，改变 .box 的大小和位置。 
            } 
            else {
                document.onmousemove = function (ev) {
                    var w, h, l, t;
                    if (xResize.indexOf('e') !== -1) { // 向右拖动 
                        w = mes.w + (ev.clientX - mes.x);
                        if (w < 100) { w = 100; }
                        box.style.width = w + 'px';
                    }
                    if (xResize.indexOf('s') !== -1) { // 向下拖动
                        h = mes.h + (ev.clientY - mes.y);
                        if (h < 100) { h = 100; }
                        box.style.height = h + 'px';
                    }
                    if (xResize.indexOf('w') !== -1) { // 向左拖动
                        w = mes.w + (mes.x - ev.clientX);
                        l = mes.l - (mes.x - ev.clientX);
                        if (w < 100) {
                            w = 100;
                            l = mes.r - 100;
                        }
                        box.style.width = w + 'px';
                        box.style.left = l + 'px';
                    }
                    if (xResize.indexOf('n') !== -1) { // 向上拖动
                        h = mes.h + (mes.y - ev.clientY);
                        t = mes.t - (mes.y - ev.clientY);
                        if (h < 100) {
                            h = 100;
                            t = mes.b - 100;
                        }
                        box.style.height = h + 'px';
                        box.style.top = t + 'px';
                    }
                    if (xResize=== '') { // 向上拖动
                        // console.log()
                        drag_move(ev)
                    }
                }
            }
        };

        function getPos(target) {
            return target.getBoundingClientRect();
        }
    }

}

export class Block {

    render() {
        // this.carousel.render()
    }

    box(wrapper) {
        let [root, box] = HTML.chain(wrapper, `div::`); 
        HTML.style(box, { background: 'black', height: '500px', position: 'absolute', width: '500px' })
        HTML.style(box, { top:  'calc(50% - 250px)', left: 'calc(50% - 250px)'})
        // HTML.style(box, { top: '50%', left: '50%', transform: 'translateX(-50%) translateY(-50%)', })
        HTML.style(box, { 'border-radius': '10px', 'border-color': 'white', 'border-width': '2px', })
        HTML.style(box, { 'white-space': 'pre-wrap', 'white-space': '-moz-pre-wrap', 'white-space': '-pre-wrap', 'white-space': '-o-pre-wrap', 'word-wrap': 'break-word', 'overflow-wrap': 'break-word', color: 'turquoise'})
        
        // new Moveable(box);
        this.dragger = new Drag(this, box)
        this.scaler = new Scale(this, box)
        return box
    }

    stage(wrapper) {
        let [root, stage] = HTML.chain(wrapper, `div::`); // stage.id = 'stage'
        HTML.style(stage, { background: 'green', height: '75vh', margin: '3rem auto', position: 'relative', width: '75vw', })
        return stage
    }

    constructor(terminal, width, height) {
        this.terminal = terminal
        // this.node = HTML.make('div', '', [], {});
        // this.stage = this.stage(this.node)
        // this.box = this.box(this.stage)
        this.node = this.box(document.body)
        // HTML.style_overlay(this.node, width, height)
        // HTML.configure(this.node, { id: "cb1-listbox", role: "listbox", 'aria-label': "commands" })
        // HTML.style(this.node, {
        //     position: 'absolute',
        //     left: '0px',
        //     right: '0px',
        //     top: '0px',
        //     bottom: '0px',
        //     margin: '0px',
        //     padding: '0px',
        //     width: `100%`,
        //     height: `100%`,
        //     // 'list-style': 'none',
        //     // 'background-color': 'rgba(57, 57, 57, 0.1)',
        //     // display: 'none',
        //     // 'box-sizing': 'border-box',
        //     // border: '2px currentColor solid',
        //     // 'max-height': `${height}px`,
        //     // width: `${width}px`,
        //     overflow: 'scroll',
        //     'overflow-x': 'hidden',
        //     'overflow-y': 'hidden',
        //     // 'font-size': '87.5%',
        //     // cursor: 'pointer',
        //     // display: 'flex', 
        //     // display: 'flex', 
        //     // display: 'inline-flex', 
        //     // 'flex-direction': 'column',
        //     // 'flex-direction': 'column-reverse',
        //     // 'margin-bottom': '0px'
        // });
        // HTML.style(this.node,{ width: '100%',height: 'inherit','position':'relative', 'left':'0px', 'bottom':'0px'});
        // this.node.addEventListener( 'pointerover', terminal.ul_hover.bind(terminal) ); // initialize pop up menu
        // this.node.addEventListener( 'pointerout', terminal.ul_hover_out.bind(terminal) );        
        this.focused = false
        this.selected_option = null
        this.options = []
        this.option = null
        this._filter = ''
        this.showing_graphs = false
        this.lines = []
        this.script_lines = []
        this.graph_lines = []
    }

    fetch (block_id){
        if (!Mirror.youtube_loaded) {return}
        let [owner, repo, path] = ['sadernalwis' || 'build0asis', '0asis', 'tests/Script.md']
        let fileSHA, fileBlob, fileContents, file
        let dis = this
        const getFileSHA = async () => {
            try {
                const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`)//"https://api.github.com/repos/hackernoon/where-startups-trend/contents/2021/"); 
                const data = await response.json(); // console.log(data);
                fileSHA = data['sha'] //data[1].sha
                console.log(fileSHA) } 
            catch (error) { console.error(error); }

            if (dis.file_sha!=fileSHA){ getFileBlob(fileSHA) }
        }
        // // define a reusable function
        // const toHexString = (bytes) => {
        //     return Array.from(bytes, (byte) => {
        //     return ('0' + (byte & 0xff).toString(16)).slice(-2);
        //     }).join('');
        // };
        
        // // try it out
        // const byteArr1 = new Uint8Array([0x00, 0xff, 0x10, 0x20]);
        // const byteArr2 = new Uint8Array([
        //     0x00, 0xff, 0x10, 0x20, 0x30, 0x40, 0x50, 0x60, 0x70, 0x80, 0x90, 0xa0, 0xb0,
        //     0xc0, 0xd0, 0xe0, 0xf0,
        // ]);
        
        // console.log(toHexString(byteArr1));
        // console.log(toHexString(byteArr2));

        // Convert a hex string to a byte array
        // const hexToBytes = (hex) => {
        //     var bytes = [];
        //     for (var c = 0; c < hex.length; c += 2) {
        //     bytes.push(parseInt(hex.substr(c, 2), 16));
        //     }
        //     return bytes;
        // };
        
        // // try it out
        // const hex1 = "48656c6c6f";
        // const hex2 = "4d7974657874";
        
        // console.log(hexToBytes(hex1));
        // console.log(hexToBytes(hex2));
        const getFileBlob = async (block_id)=> {
            try {
                const response = await fetch( `Environments/Blockchain/Block-${block_id}`);
                const text = await response.text()
                // variable   | bytes |  description
                let block = {
                    magic      :  4,   // version of the bitcoin protocol used to create the block
                    size       :  4,   // version of the bitcoin protocol used to create the block
                    version    :  4,   // version of the bitcoin protocol used to create the block
                    prevHash   :  32,  // hash of the previous block
                    merkleRoot :  32,  // root of a sha256 hash tree where the leaves are transactions
                    time       :  4,   // time of block creation in seconds since 1970-01-01T00:00 UTC
                    bits       :  4,   // difficulty of block hash in compressed form
                    nonce      :  4,}   // field used in mining
                let segments = []
                let hexed = []
                function extract(start, amount) {
                    let bytes_to_hex = ((amount)*2)
                    // start *= 2
                    console.log(start,' to ',start+bytes_to_hex+1)
                    let endian = text.slice(start, start+bytes_to_hex)
                    let decimal = parseInt('0x'+endian.match(/../g).reverse().join(''));
                    let hex = decimal.toString(16).toUpperCase()
                    segments.push(endian)
                    hexed.push(hex)
                    return start + bytes_to_hex+1
                }
                [4, 4, 4, 32, 32, 4, 4, 4].reduce(extract, 0);
                [block.magic, block.size, block.version, block.prevHash, block.merkleRoot, block.time, block.bits, block.nonce] = hexed//segments
                console.log(block)
                // let block2 = new block()
                // [block2.magic, block2.size, block2.version, block2.prevHash, block2.merkleRoot, block2.time, block2.bits, block2.nonce] = hexed
                // console.log(block2)
                return
                var endian = "12AB34CD";            
                var r = parseInt('0x'+endian.match(/../g).reverse().join(''));
                console.log(r); // Decimal
                console.log(r.toString(16).toUpperCase());  // Hex
                return
                const data = await response.blob()

                // fileBlob = data.content
                // convertBlob(fileBlob) 
                dis.data = data
                // const blb    = new Blob(["Lorem ipsum sit"], {type: "text/plain"}); //https://medium.com/programmers-developers/convert-blob-to-string-in-javascript-944c15ad7d52
                const reader = new FileReader();
                // This fires after the blob has been read/loaded.
                reader.addEventListener('loadend', (e) => {
                    const text = e.srcElement.result;
                    console.log(text);
                });
                // Start reading the blob as text.
                reader.readAsText(data);
            } 
            catch (error) {
                console.error(error);
            }
        }
        function base64EncodeUnicode(str) {
            let utf8Bytes = decodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) { return String.fromCharCode('0x' + p1); });
            return atob(utf8Bytes);
        }
        const convertBlob = async blob => { // console.log(blob)
            try {
                // const fileContents = Buffer.from(blob, "base64").toString()
                // file = JSON.parse(fileContents)
                // file = JSON.parse(fileContents)
                fileContents = base64EncodeUnicode(blob)
                dis.reset()
                dis.from_table(fileContents)
                // file = JSON.parse(fileContents)
                /* console.log(file) */ } 
            catch(error) { console.error(error) }
        }
        // getFileSHA()
        getFileBlob(block_id)
    }

    run(pt) {
        let [_, w1] = pt.split(' ')
        this.fetch(w1)
    }

}
/* 
class Rain{
    // var stage = {
    //     width: window.innerWidth,
    //     height: window.innerHeight,
    // }
    
    Demo() {
        var el = document.createElement('div')
    
        var rainBlocks = []
        _.times(20, () => {
            setTimeout(() => {
                _.times(20, () => {
                    var r = new Block(_.random(0, stage.width), 0)
                    r.mass = _.random(1, 5)
                    rainBlocks.push(r)
                    el.appendChild(r.el)
                })
            }, _.random(0, 500))
        })
    
        function Block(xInitial, yInitial) {
            var el = document.createElement('div')
            el.setAttribute('class', 'block')
    
            this.friction = 1
    
            this.mass = 1
    
            ;(this.x = xInitial), (this.y = yInitial)
    
            ;(this.vx = 0), (this.vy = 0)
    
            this.ax = 0
            this.ay = 0
    
            this.animate = function (t) {
                this.vx += this.ax / this.mass
                this.vy += this.ay / this.mass
    
                this.vx *= this.friction
                this.vy *= this.friction
                this.x += this.vx
                this.y += this.vy
    
                if (this.y > stage.height) {
                    this.y = -50
                    this.ax = 0
                    this.ay = 0
                    this.vx = 0
                    this.vy = 0
                }
    
                el.style.left = this.x - 10 + 'px'
                el.style.top = this.y - 10 + 'px'
            }
    
            this.el = el
        }
    
        this.animate = function (t) {
            rainBlocks.forEach(r => {
                r.ay += 0.1
                r.animate(t)
            })
        }
        this.dom = el
    }
    
}

// window.addEventListener('load', init)

// function init() {
//     var stats = new ServoStats()
//     document.body.appendChild(stats.dom)

//     var demo = new Demo()
//     var demoContainer = document.getElementById('demo')
//     demoContainer.appendChild(demo.dom)

//     requestAnimationFrame(animate)

//     function animate(t) {
//         requestAnimationFrame(animate)

//         stats.start()

//         demo.animate(t)

//         stats.end()
//         stats.update()
//     }
// }


//----------------------------------------------
// randomColor by David Merfield under the CC0 license
// https://github.com/davidmerfield/randomColor/

;(function (root, factory) {
    // Support AMD
    if (typeof define === 'function' && define.amd) {
        define([], factory)

        // Support CommonJS
    } else if (typeof exports === 'object') {
        var randomColor = factory()

        // Support NodeJS & Component, which allow module.exports to be a function
        if (typeof module === 'object' && module && module.exports) {
            exports = module.exports = randomColor
        }

        // Support CommonJS 1.1.1 spec
        exports.randomColor = randomColor

        // Support vanilla script loading
    } else {
        root.randomColor = factory()
    }
})(this, function () {
    // Seed to get repeatable colors
    var seed = null

    // Shared color dictionary
    var colorDictionary = {}

    // Populate the color dictionary
    loadColorBounds()

    var randomColor = function (options) {
        options = options || {}

        // Check if there is a seed and ensure it's an
        // integer. Otherwise, reset the seed value.
        if (
            options.seed !== undefined &&
            options.seed !== null &&
            options.seed === parseInt(options.seed, 10)
        ) {
            seed = options.seed

            // A string was passed as a seed
        } else if (typeof options.seed === 'string') {
            seed = stringToInteger(options.seed)

            // Something was passed as a seed but it wasn't an integer or string
        } else if (options.seed !== undefined && options.seed !== null) {
            throw new TypeError('The seed value must be an integer or string')

            // No seed, reset the value outside.
        } else {
            seed = null
        }

        var H, S, B

        // Check if we need to generate multiple colors
        if (options.count !== null && options.count !== undefined) {
            var totalColors = options.count,
                colors = []

            options.count = null

            while (totalColors > colors.length) {
                // Since we're generating multiple colors,
                // incremement the seed. Otherwise we'd just
                // generate the same color each time...
                if (seed && options.seed) options.seed += 1

                colors.push(randomColor(options))
            }

            options.count = totalColors

            return colors
        }

        // First we pick a hue (H)
        H = pickHue(options)

        // Then use H to determine saturation (S)
        S = pickSaturation(H, options)

        // Then use S and H to determine brightness (B).
        B = pickBrightness(H, S, options)

        // Then we return the HSB color in the desired format
        return setFormat([H, S, B], options)
    }

    function pickHue(options) {
        var hueRange = getHueRange(options.hue),
            hue = randomWithin(hueRange)

        // Instead of storing red as two seperate ranges,
        // we group them, using negative numbers
        if (hue < 0) {
            hue = 360 + hue
        }

        return hue
    }

    function pickSaturation(hue, options) {
        if (options.luminosity === 'random') {
            return randomWithin([0, 100])
        }

        if (options.hue === 'monochrome') {
            return 0
        }

        var saturationRange = getSaturationRange(hue)

        var sMin = saturationRange[0],
            sMax = saturationRange[1]

        switch (options.luminosity) {
            case 'bright':
                sMin = 55
                break

            case 'dark':
                sMin = sMax - 10
                break

            case 'light':
                sMax = 55
                break
        }

        return randomWithin([sMin, sMax])
    }

    function pickBrightness(H, S, options) {
        var bMin = getMinimumBrightness(H, S),
            bMax = 100

        switch (options.luminosity) {
            case 'dark':
                bMax = bMin + 20
                break

            case 'light':
                bMin = (bMax + bMin) / 2
                break

            case 'random':
                bMin = 0
                bMax = 100
                break
        }

        return randomWithin([bMin, bMax])
    }

    function setFormat(hsv, options) {
        switch (options.format) {
            case 'hsvArray':
                return hsv

            case 'hslArray':
                return HSVtoHSL(hsv)

            case 'hsl':
                var hsl = HSVtoHSL(hsv)
                return 'hsl(' + hsl[0] + ', ' + hsl[1] + '%, ' + hsl[2] + '%)'

            case 'hsla':
                var hslColor = HSVtoHSL(hsv)
                return (
                    'hsla(' +
                    hslColor[0] +
                    ', ' +
                    hslColor[1] +
                    '%, ' +
                    hslColor[2] +
                    '%, ' +
                    Math.random() +
                    ')'
                )

            case 'rgbArray':
                return HSVtoRGB(hsv)

            case 'rgb':
                var rgb = HSVtoRGB(hsv)
                return 'rgb(' + rgb.join(', ') + ')'

            case 'rgba':
                var rgbColor = HSVtoRGB(hsv)
                return (
                    'rgba(' + rgbColor.join(', ') + ', ' + Math.random() + ')'
                )

            default:
                return HSVtoHex(hsv)
        }
    }

    function getMinimumBrightness(H, S) {
        var lowerBounds = getColorInfo(H).lowerBounds

        for (var i = 0; i < lowerBounds.length - 1; i++) {
            var s1 = lowerBounds[i][0],
                v1 = lowerBounds[i][1]

            var s2 = lowerBounds[i + 1][0],
                v2 = lowerBounds[i + 1][1]

            if (S >= s1 && S <= s2) {
                var m = (v2 - v1) / (s2 - s1),
                    b = v1 - m * s1

                return m * S + b
            }
        }

        return 0
    }

    function getHueRange(colorInput) {
        if (typeof parseInt(colorInput) === 'number') {
            var number = parseInt(colorInput)

            if (number < 360 && number > 0) {
                return [number, number]
            }
        }

        if (typeof colorInput === 'string') {
            if (colorDictionary[colorInput]) {
                var color = colorDictionary[colorInput]
                if (color.hueRange) {
                    return color.hueRange
                }
            }
        }

        return [0, 360]
    }

    function getSaturationRange(hue) {
        return getColorInfo(hue).saturationRange
    }

    function getColorInfo(hue) {
        // Maps red colors to make picking hue easier
        if (hue >= 334 && hue <= 360) {
            hue -= 360
        }

        for (var colorName in colorDictionary) {
            var color = colorDictionary[colorName]
            if (
                color.hueRange &&
                hue >= color.hueRange[0] &&
                hue <= color.hueRange[1]
            ) {
                return colorDictionary[colorName]
            }
        }
        return 'Color not found'
    }

    function randomWithin(range) {
        if (seed === null) {
            return Math.floor(
                range[0] + Math.random() * (range[1] + 1 - range[0])
            )
        } else {
            //Seeded random algorithm from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
            var max = range[1] || 1
            var min = range[0] || 0
            seed = (seed * 9301 + 49297) % 233280
            var rnd = seed / 233280.0
            return Math.floor(min + rnd * (max - min))
        }
    }

    function HSVtoHex(hsv) {
        var rgb = HSVtoRGB(hsv)

        function componentToHex(c) {
            var hex = c.toString(16)
            return hex.length == 1 ? '0' + hex : hex
        }

        var hex =
            '#' +
            componentToHex(rgb[0]) +
            componentToHex(rgb[1]) +
            componentToHex(rgb[2])

        return hex
    }

    function defineColor(name, hueRange, lowerBounds) {
        var sMin = lowerBounds[0][0],
            sMax = lowerBounds[lowerBounds.length - 1][0],
            bMin = lowerBounds[lowerBounds.length - 1][1],
            bMax = lowerBounds[0][1]

        colorDictionary[name] = {
            hueRange: hueRange,
            lowerBounds: lowerBounds,
            saturationRange: [sMin, sMax],
            brightnessRange: [bMin, bMax],
        }
    }

    function loadColorBounds() {
        defineColor('monochrome', null, [
            [0, 0],
            [100, 0],
        ])

        defineColor(
            'red',
            [-26, 18],
            [
                [20, 100],
                [30, 92],
                [40, 89],
                [50, 85],
                [60, 78],
                [70, 70],
                [80, 60],
                [90, 55],
                [100, 50],
            ]
        )

        defineColor(
            'orange',
            [19, 46],
            [
                [20, 100],
                [30, 93],
                [40, 88],
                [50, 86],
                [60, 85],
                [70, 70],
                [100, 70],
            ]
        )

        defineColor(
            'yellow',
            [47, 62],
            [
                [25, 100],
                [40, 94],
                [50, 89],
                [60, 86],
                [70, 84],
                [80, 82],
                [90, 80],
                [100, 75],
            ]
        )

        defineColor(
            'green',
            [63, 178],
            [
                [30, 100],
                [40, 90],
                [50, 85],
                [60, 81],
                [70, 74],
                [80, 64],
                [90, 50],
                [100, 40],
            ]
        )

        defineColor(
            'blue',
            [179, 257],
            [
                [20, 100],
                [30, 86],
                [40, 80],
                [50, 74],
                [60, 60],
                [70, 52],
                [80, 44],
                [90, 39],
                [100, 35],
            ]
        )

        defineColor(
            'purple',
            [258, 282],
            [
                [20, 100],
                [30, 87],
                [40, 79],
                [50, 70],
                [60, 65],
                [70, 59],
                [80, 52],
                [90, 45],
                [100, 42],
            ]
        )

        defineColor(
            'pink',
            [283, 334],
            [
                [20, 100],
                [30, 90],
                [40, 86],
                [60, 84],
                [80, 80],
                [90, 75],
                [100, 73],
            ]
        )
    }

    function HSVtoRGB(hsv) {
        // this doesn't work for the values of 0 and 360
        // here's the hacky fix
        var h = hsv[0]
        if (h === 0) {
            h = 1
        }
        if (h === 360) {
            h = 359
        }

        // Rebase the h,s,v values
        h = h / 360
        var s = hsv[1] / 100,
            v = hsv[2] / 100

        var h_i = Math.floor(h * 6),
            f = h * 6 - h_i,
            p = v * (1 - s),
            q = v * (1 - f * s),
            t = v * (1 - (1 - f) * s),
            r = 256,
            g = 256,
            b = 256

        switch (h_i) {
            case 0:
                r = v
                g = t
                b = p
                break
            case 1:
                r = q
                g = v
                b = p
                break
            case 2:
                r = p
                g = v
                b = t
                break
            case 3:
                r = p
                g = q
                b = v
                break
            case 4:
                r = t
                g = p
                b = v
                break
            case 5:
                r = v
                g = p
                b = q
                break
        }

        var result = [
            Math.floor(r * 255),
            Math.floor(g * 255),
            Math.floor(b * 255),
        ]
        return result
    }

    function HSVtoHSL(hsv) {
        var h = hsv[0],
            s = hsv[1] / 100,
            v = hsv[2] / 100,
            k = (2 - s) * v

        return [
            h,
            Math.round(((s * v) / (k < 1 ? k : 2 - k)) * 10000) / 100,
            (k / 2) * 100,
        ]
    }

    function stringToInteger(string) {
        var total = 0
        for (var i = 0; i !== string.length; i++) {
            if (total >= Number.MAX_SAFE_INTEGER) break
            total += string.charCodeAt(i)
        }
        return total
    }

    return randomColor
})
// randomColor by David Merfield under the CC0 license
// https://github.com/davidmerfield/randomColor/

;(function (root, factory) {
    // Support AMD
    if (typeof define === 'function' && define.amd) {
        define([], factory)

        // Support CommonJS
    } else if (typeof exports === 'object') {
        var randomColor = factory()

        // Support NodeJS & Component, which allow module.exports to be a function
        if (typeof module === 'object' && module && module.exports) {
            exports = module.exports = randomColor
        }

        // Support CommonJS 1.1.1 spec
        exports.randomColor = randomColor

        // Support vanilla script loading
    } else {
        root.randomColor = factory()
    }
})(this, function () {
    // Seed to get repeatable colors
    var seed = null

    // Shared color dictionary
    var colorDictionary = {}

    // Populate the color dictionary
    loadColorBounds()

    var randomColor = function (options) {
        options = options || {}

        // Check if there is a seed and ensure it's an
        // integer. Otherwise, reset the seed value.
        if (
            options.seed !== undefined &&
            options.seed !== null &&
            options.seed === parseInt(options.seed, 10)
        ) {
            seed = options.seed

            // A string was passed as a seed
        } else if (typeof options.seed === 'string') {
            seed = stringToInteger(options.seed)

            // Something was passed as a seed but it wasn't an integer or string
        } else if (options.seed !== undefined && options.seed !== null) {
            throw new TypeError('The seed value must be an integer or string')

            // No seed, reset the value outside.
        } else {
            seed = null
        }

        var H, S, B

        // Check if we need to generate multiple colors
        if (options.count !== null && options.count !== undefined) {
            var totalColors = options.count,
                colors = []

            options.count = null

            while (totalColors > colors.length) {
                // Since we're generating multiple colors,
                // incremement the seed. Otherwise we'd just
                // generate the same color each time...
                if (seed && options.seed) options.seed += 1

                colors.push(randomColor(options))
            }

            options.count = totalColors

            return colors
        }

        // First we pick a hue (H)
        H = pickHue(options)

        // Then use H to determine saturation (S)
        S = pickSaturation(H, options)

        // Then use S and H to determine brightness (B).
        B = pickBrightness(H, S, options)

        // Then we return the HSB color in the desired format
        return setFormat([H, S, B], options)
    }

    function pickHue(options) {
        var hueRange = getHueRange(options.hue),
            hue = randomWithin(hueRange)

        // Instead of storing red as two seperate ranges,
        // we group them, using negative numbers
        if (hue < 0) {
            hue = 360 + hue
        }

        return hue
    }

    function pickSaturation(hue, options) {
        if (options.luminosity === 'random') {
            return randomWithin([0, 100])
        }

        if (options.hue === 'monochrome') {
            return 0
        }

        var saturationRange = getSaturationRange(hue)

        var sMin = saturationRange[0],
            sMax = saturationRange[1]

        switch (options.luminosity) {
            case 'bright':
                sMin = 55
                break

            case 'dark':
                sMin = sMax - 10
                break

            case 'light':
                sMax = 55
                break
        }

        return randomWithin([sMin, sMax])
    }

    function pickBrightness(H, S, options) {
        var bMin = getMinimumBrightness(H, S),
            bMax = 100

        switch (options.luminosity) {
            case 'dark':
                bMax = bMin + 20
                break

            case 'light':
                bMin = (bMax + bMin) / 2
                break

            case 'random':
                bMin = 0
                bMax = 100
                break
        }

        return randomWithin([bMin, bMax])
    }

    function setFormat(hsv, options) {
        switch (options.format) {
            case 'hsvArray':
                return hsv

            case 'hslArray':
                return HSVtoHSL(hsv)

            case 'hsl':
                var hsl = HSVtoHSL(hsv)
                return 'hsl(' + hsl[0] + ', ' + hsl[1] + '%, ' + hsl[2] + '%)'

            case 'hsla':
                var hslColor = HSVtoHSL(hsv)
                return (
                    'hsla(' +
                    hslColor[0] +
                    ', ' +
                    hslColor[1] +
                    '%, ' +
                    hslColor[2] +
                    '%, ' +
                    Math.random() +
                    ')'
                )

            case 'rgbArray':
                return HSVtoRGB(hsv)

            case 'rgb':
                var rgb = HSVtoRGB(hsv)
                return 'rgb(' + rgb.join(', ') + ')'

            case 'rgba':
                var rgbColor = HSVtoRGB(hsv)
                return (
                    'rgba(' + rgbColor.join(', ') + ', ' + Math.random() + ')'
                )

            default:
                return HSVtoHex(hsv)
        }
    }

    function getMinimumBrightness(H, S) {
        var lowerBounds = getColorInfo(H).lowerBounds

        for (var i = 0; i < lowerBounds.length - 1; i++) {
            var s1 = lowerBounds[i][0],
                v1 = lowerBounds[i][1]

            var s2 = lowerBounds[i + 1][0],
                v2 = lowerBounds[i + 1][1]

            if (S >= s1 && S <= s2) {
                var m = (v2 - v1) / (s2 - s1),
                    b = v1 - m * s1

                return m * S + b
            }
        }

        return 0
    }

    function getHueRange(colorInput) {
        if (typeof parseInt(colorInput) === 'number') {
            var number = parseInt(colorInput)

            if (number < 360 && number > 0) {
                return [number, number]
            }
        }

        if (typeof colorInput === 'string') {
            if (colorDictionary[colorInput]) {
                var color = colorDictionary[colorInput]
                if (color.hueRange) {
                    return color.hueRange
                }
            }
        }

        return [0, 360]
    }

    function getSaturationRange(hue) {
        return getColorInfo(hue).saturationRange
    }

    function getColorInfo(hue) {
        // Maps red colors to make picking hue easier
        if (hue >= 334 && hue <= 360) {
            hue -= 360
        }

        for (var colorName in colorDictionary) {
            var color = colorDictionary[colorName]
            if (
                color.hueRange &&
                hue >= color.hueRange[0] &&
                hue <= color.hueRange[1]
            ) {
                return colorDictionary[colorName]
            }
        }
        return 'Color not found'
    }

    function randomWithin(range) {
        if (seed === null) {
            return Math.floor(
                range[0] + Math.random() * (range[1] + 1 - range[0])
            )
        } else {
            //Seeded random algorithm from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
            var max = range[1] || 1
            var min = range[0] || 0
            seed = (seed * 9301 + 49297) % 233280
            var rnd = seed / 233280.0
            return Math.floor(min + rnd * (max - min))
        }
    }

    function HSVtoHex(hsv) {
        var rgb = HSVtoRGB(hsv)

        function componentToHex(c) {
            var hex = c.toString(16)
            return hex.length == 1 ? '0' + hex : hex
        }

        var hex =
            '#' +
            componentToHex(rgb[0]) +
            componentToHex(rgb[1]) +
            componentToHex(rgb[2])

        return hex
    }

    function defineColor(name, hueRange, lowerBounds) {
        var sMin = lowerBounds[0][0],
            sMax = lowerBounds[lowerBounds.length - 1][0],
            bMin = lowerBounds[lowerBounds.length - 1][1],
            bMax = lowerBounds[0][1]

        colorDictionary[name] = {
            hueRange: hueRange,
            lowerBounds: lowerBounds,
            saturationRange: [sMin, sMax],
            brightnessRange: [bMin, bMax],
        }
    }

    function loadColorBounds() {
        defineColor('monochrome', null, [
            [0, 0],
            [100, 0],
        ])

        defineColor(
            'red',
            [-26, 18],
            [
                [20, 100],
                [30, 92],
                [40, 89],
                [50, 85],
                [60, 78],
                [70, 70],
                [80, 60],
                [90, 55],
                [100, 50],
            ]
        )

        defineColor(
            'orange',
            [19, 46],
            [
                [20, 100],
                [30, 93],
                [40, 88],
                [50, 86],
                [60, 85],
                [70, 70],
                [100, 70],
            ]
        )

        defineColor(
            'yellow',
            [47, 62],
            [
                [25, 100],
                [40, 94],
                [50, 89],
                [60, 86],
                [70, 84],
                [80, 82],
                [90, 80],
                [100, 75],
            ]
        )

        defineColor(
            'green',
            [63, 178],
            [
                [30, 100],
                [40, 90],
                [50, 85],
                [60, 81],
                [70, 74],
                [80, 64],
                [90, 50],
                [100, 40],
            ]
        )

        defineColor(
            'blue',
            [179, 257],
            [
                [20, 100],
                [30, 86],
                [40, 80],
                [50, 74],
                [60, 60],
                [70, 52],
                [80, 44],
                [90, 39],
                [100, 35],
            ]
        )

        defineColor(
            'purple',
            [258, 282],
            [
                [20, 100],
                [30, 87],
                [40, 79],
                [50, 70],
                [60, 65],
                [70, 59],
                [80, 52],
                [90, 45],
                [100, 42],
            ]
        )

        defineColor(
            'pink',
            [283, 334],
            [
                [20, 100],
                [30, 90],
                [40, 86],
                [60, 84],
                [80, 80],
                [90, 75],
                [100, 73],
            ]
        )
    }

    function HSVtoRGB(hsv) {
        // this doesn't work for the values of 0 and 360
        // here's the hacky fix
        var h = hsv[0]
        if (h === 0) {
            h = 1
        }
        if (h === 360) {
            h = 359
        }

        // Rebase the h,s,v values
        h = h / 360
        var s = hsv[1] / 100,
            v = hsv[2] / 100

        var h_i = Math.floor(h * 6),
            f = h * 6 - h_i,
            p = v * (1 - s),
            q = v * (1 - f * s),
            t = v * (1 - (1 - f) * s),
            r = 256,
            g = 256,
            b = 256

        switch (h_i) {
            case 0:
                r = v
                g = t
                b = p
                break
            case 1:
                r = q
                g = v
                b = p
                break
            case 2:
                r = p
                g = v
                b = t
                break
            case 3:
                r = p
                g = q
                b = v
                break
            case 4:
                r = t
                g = p
                b = v
                break
            case 5:
                r = v
                g = p
                b = q
                break
        }

        var result = [
            Math.floor(r * 255),
            Math.floor(g * 255),
            Math.floor(b * 255),
        ]
        return result
    }

    function HSVtoHSL(hsv) {
        var h = hsv[0],
            s = hsv[1] / 100,
            v = hsv[2] / 100,
            k = (2 - s) * v

        return [
            h,
            Math.round(((s * v) / (k < 1 ? k : 2 - k)) * 10000) / 100,
            (k / 2) * 100,
        ]
    }

    function stringToInteger(string) {
        var total = 0
        for (var i = 0; i !== string.length; i++) {
            if (total >= Number.MAX_SAFE_INTEGER) break
            total += string.charCodeAt(i)
        }
        return total
    }

    return randomColor
})

//----------------------------------------------
function appender(parent) {
    // Creates function that appends to given element
    return function (newChild) {
        parent.appendChild(newChild)
    }
}

function applyTranslate(elem, x, y) {
    var transform = 'translateX(' + x + 'px) translateY(' + y + 'px)'
    elem.style.transform = transform
}

function addListener(elem, evt, f) {
    elem.addEventListener(evt, f)
}

function onNumberKeyPress(f) {
    return function (evt) {
        var ch = String.fromCharCode(evt.keyCode)
        if (ch >= 0 && ch <= 9) {
            f(ch)
        }
    }
}

//----------------------------------------------
//----------------------------------------------
//----------------------------------------------
//---------------------------------------------- */