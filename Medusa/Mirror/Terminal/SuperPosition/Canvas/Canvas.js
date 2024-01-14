import { Space } from 'Medusa/Parseltongue/Space/Space.js';
import * as THREE from 'three';
import { Colors } from './Colors/Colors.js';
import { Text } from './Text/Text.js';

export class Canvas{

    create_texture(){
        // this.texture = new THREE.CanvasTexture(this.canvas.canvas);
        this.texture = new THREE.Texture(this.canvas.canvas);
        this.texture.minFilter = THREE.LinearFilter; // because our canvas is likely not a power of 2  in both dimensions set the filtering appropriately.
        this.texture.wrapS = THREE.ClampToEdgeWrapping;
        this.texture.wrapT = THREE.ClampToEdgeWrapping;
    }

    // create_material(){
    //     this.material = new THREE.RawShaderMaterial({
    //         uniforms: {
    //             map: { type: "t", value: this.texture },
    //             grid_size: { value: this.grid_size }

    //         },
    //         vertexShader: SuperPosition.vertex_shader,
    //         fragmentShader: SuperPosition.fragment_shader,
    //         side: THREE.DoubleSide,
    //         transparent: true,
    //     })
    // }

    create_boundaries(map_size, grid_size){
        [this.width_boundary, this.height_boundary] = Boundary.get_empties([0,0]);
        this.width_boundary.add(0, map_size.x ? map_size.x : this.max_gl_texture_size)
        this.height_boundary.add(0, map_size.y ? map_size.y : this.max_gl_texture_size)
        this.width_boundary.step = 1
        this.width_boundary.fractions = grid_size.x
        this.height_boundary.step = 1
        this.height_boundary.fractions = grid_size.y
    }

    create_space(){
        const grid = this.grid_size
        this.camera_space = new Space(0,[[0,undefined]],['v', grid.y],['h', grid.x])
        // for(const i of s.generator()){ console.log(i) }
        // s.index(10,11,4,1) //1319
    }

    constructor(renderer, width, height, grid_x=1, grid_y=1, index=0){
        this.renderer = renderer
        this.canvas = document.createElement('canvas').getContext('2d');
        this.canvas.canvas.width = width;
        this.canvas.canvas.height = width;
        // this.canvas.fillStyle = '#F00';
        this.index = index
        this.canvas.fillStyle = Colors.prime_by_index(index)//'#F00';
        // console.log(index ,this.canvas.fillStyle)
        this.canvas.fillRect(0, 0, this.canvas.canvas.width, this.canvas.canvas.height);
        this.create_boundaries(new THREE.Vector2(width, height), new THREE.Vector2(grid_x, grid_y))
        this.create_space()
        this.create_texture()
        this.write_uv_grid()
        // this.fill_uvgrid()
    }


    main() { //https://webglfundamentals.org/webgl/lessons/webgl-cube-maps.html
        // Get A 2D context
        /** @type {Canvas2DRenderingContext} */
        const ctx = document.createElement("canvas").getContext("2d");
      
        ctx.canvas.width = 128;
        ctx.canvas.height = 128;
      
        const faceInfos = [
          { faceColor: '#F00', textColor: '#0FF', text: '+X' },
          { faceColor: '#FF0', textColor: '#00F', text: '-X' },
          { faceColor: '#0F0', textColor: '#F0F', text: '+Y' },
          { faceColor: '#0FF', textColor: '#F00', text: '-Y' },
          { faceColor: '#00F', textColor: '#FF0', text: '+Z' },
          { faceColor: '#F0F', textColor: '#0F0', text: '-Z' },
        ];
        faceInfos.forEach((faceInfo) => {
          const {faceColor, textColor, text} = faceInfo;
          generateFace(ctx, faceColor, textColor, text);
      
          // show the result
          ctx.canvas.toBlob((blob) => {
            const img = new Image();
            img.src = URL.createObjectURL(blob);
            document.body.appendChild(img);
          });
        });
      }
    

    generateFace(ctx, faceColor, textColor, text) {
        const {width, height} = ctx.canvas;
        ctx.fillStyle = faceColor;
        ctx.fillRect(0, 0, width, height);
        ctx.font = `${width * 0.7}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = textColor;
        ctx.fillText(text, width / 2, height / 2);
    }

    fill_image(source_image){
        const source_x = 0
        const source_y = 0
        const source_width = source_image.width
        const source_height = source_image.height
        const destin_x = 0
        const destin_y = 0
        const destin_width = this.canvas.canvas.width
        const destin_height = this.canvas.canvas.height

        this.canvas.drawImage(source_image, ...[source_x, source_y, source_width, source_height, destin_x, destin_y, destin_width, destin_height]);
        this.texture.needsUpdate = true;
        // ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    }
    

    fill_uvgrid(){
        this.imageElement = document.createElement('img');
        let canvas = this
        this.imageElement.onload = function(e) {
            canvas.fill_image(this)
        };
        this.imageElement.src = "../../../../../Environments/Medusa/uvgrid.png";
        // this.imageElement.src = "../../../../../Environments/Medusa/uvhexgrid.png";
    }

    write_uv_grid(){
        const slot_count = this.slot_count
        const grid_size = this.grid_size
        for (let slot_idx = 0; slot_idx < slot_count; slot_idx++ ){ 
            const [v_idx, h_idx] = this.get_slot_indices(slot_idx)
            const text = `${this.index+1}:${grid_size.x}x${grid_size.y} \n (${v_idx+1},${h_idx+1}) \n ${(this.index*slot_count)+slot_idx}`
            Text.fit_text_center(text, slot_idx, this)
        }
        this.texture.needsUpdate = true;
    }

    dispose(){
        this.texture.dispose()
        // this.slot.dispose()
    }

    get grid_size(){
        return new THREE.Vector2(this.width_boundary.fractions, this.height_boundary.fractions)
    }

    get slot_count(){
        return this.width_boundary.fractions * this.height_boundary.fractions
    }

    get slot_size(){
        const size_xy = new THREE.Vector2();
        size_xy.x = this.width_boundary.fraction_precise()
        size_xy.y = this.height_boundary.fraction_precise()
        return size_xy
    }

    get_slot_indices(slot_idx){
        return this.camera_space.coordinates(slot_idx) //[v_idx, h_idx]
    }

    get_slot_position(slot_idx){
        const position_xy = new THREE.Vector2();
        const [v_idx, h_idx] = this.camera_space.coordinates(slot_idx) //[10, 11, 4, 1]
        const size_xy = this.slot_size
        position_xy.x = h_idx * size_xy.x
        position_xy.y = v_idx * size_xy.y
        return position_xy
    }

    static meta_post_test(){
        fetch(  "postmaster",{ method: 'POST',}).
            then(function(response) {
                if (!response.ok) { throw new Error('Network response was not OK'); }
                // var {gatepass, parseltongue, payload} = JSON.parse(event.data);
                // if(this.receive){
                //     this.receive(gatepass, parseltongue, payload);
                // }
                return response.blob();
            }).
            then(function(blob) {
                return blob.arrayBuffer();
            }).
                then(function(buffer) {
                    // submitter.src = URL.createObjectURL(blob);
                    // const buffer = await blob.arrayBuffer();
                    let metadata = readMetadata(buffer);
                    console.log(metadata);

                }).catch(error => { console.error('There has been a problem with your fetch operation:', error); });
    }

    image(params) {  /* https://codingshiksha.com/javascript/how-to-download-image-from-url-using-fetch-api-and-upload-to-imgur-in-javascript-full-project-for-beginners/ */
        // UTILS
        function processStatus(response) {
            if (response.status === 200 || response.status === 0) {
                return Promise.resolve(response)
            } 
            else { 
                return Promise.reject(new Error(`Error loading: ${url}`))
            }
        }
        
        function parseBlob(response) { return response.blob(); }
        function parseJson(response) { return response.json(); }
        // download/upload

        function downloadFile(url) {
            return fetch(url).then(processStatus).then(parseBlob)
        }
        
        function uploadImageToImgur(blob) {
            var formData = new FormData()
            formData.append('type', 'file')
            formData.append('image', blob)
            return fetch('https://api.imgur.com/3/upload.json', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Client-ID 1bddacd2afe5039'// imgur specific
                },
                body: formData
            })
            .then(processStatus).then(parseJson);
        }
        
        
        // --- ACTION ---
        
        var sourceImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/9/98/Pet_dog_fetching_sticks_in_Wales-3April2010.jpg'
        $('#log-box').logbox()
        $('#start').on('click', function(ev) {
            // download file from one resource // upload it to another
            // $.log(`Started downloading image from <a href="${sourceImageUrl}">image url</a>`)
            downloadFile(sourceImageUrl).then(uploadImageToImgur).
                then(function(data) {
                        $.log(`Image successfully uploaded to <a href="https://imgur.com/${data.data.id}">imgur.com url</a>`);
                        $.log(`<img src="${data.data.link}"/>`);
                    }).
                    catch(
                        function(error) {
                            $.error(error.message || error);})
        
            ev.stopPropagation()
        })   

        const imageUrl = "https://picsum.photos/200/300";

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = reader.result;                
            console.log(base64data);
        }

        (async () => {
            const response = await fetch(imageUrl)
            const imageBlob = await response.blob()
            reader.readAsDataURL(imageBlob);  
        })()


        var myImage = document.querySelector('img');

        fetch('flowers.jpg').
            then(function(response) {
                    return response.blob();
                }).
                then(function(myBlob) {
                    var objectURL = URL.createObjectURL(myBlob);
                    myImage.src = objectURL;
                });

        fetch("url to an image of unknown type")
            .then(response => {
                return response.blob().then(blob => {
                    imageHandler(response.headers.get("Content-Type"), blob)
                })
            })

        // Example POST method implementation:
        async function postData(url = '', data = {}) {
            // Default options are marked with *
            const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
            });
            return response.json(); // parses JSON response into native JavaScript objects
        }
        
        postData('https://example.com/answer', { answer: 42 })
            .then(data => {
            console.log(data); // JSON data parsed by `data.json()` call
            });

        
        canvasElem.onmousemove = function(e) { 
            // https://tr.javascript.info/fetch-basics
            // https://github.github.io/fetch/
            let ctx = canvasElem.getContext('2d');
            ctx.lineTo(e.clientX, e.clientY);
            ctx.stroke();
        };
    
        async function submit() {
            let blob = await new Promise(resolve => canvasElem.toBlob(resolve, 'image/png'));
            let response = await fetch('/article/fetch-basics/post/image', {
            method: 'POST',
            body: blob
            });
            let result = await response.json();
            alert(result.message);
        }
  
    }

    // https://discoverthreejs.com/book/first-steps/textures-intro/
    // https://r105.threejsfundamentals.org/threejs/lessons/threejs-canvas-textures.html
    initialize (type, label, value, regex, style, bounds) {
        var ctx = document.getElementById("rounded-rect").getContext("2d");
        roundRect(ctx, 5, 5, 50, 50); // Draw using default border radius, stroke it but no fill (function's default values)
        ctx.strokeStyle = "rgb(255, 0, 0)"; // To change the color on the rectangle, just manipulate the context
        ctx.fillStyle = "rgba(255, 255, 0, .5)";
        roundRect(ctx, 100, 5, 100, 100, 20, true);
        ctx.strokeStyle = "#0f0"; // Manipulate it again
        ctx.fillStyle = "#ddd";
        roundRect(ctx, 300, 5, 200, 100, { tl: 50, br: 25 }, true); // Different radii for each corner, others default to 0
        // Object.assign(this, Canvas);
    }

    roundRect(ctx, x, y, width, height, radius, fill, stroke) { //https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-using-html-canvas/7592676#7592676
        /*** Draws a rounded rectangle using the current state of the canvas.
         * If you omit the last three params, it will draw a rectangle
         * outline with a 5 pixel border radius
         * @param {CanvasRenderingContext2D} ctx
         * @param {Number} x The top left x coordinate
         * @param {Number} y The top left y coordinate
         * @param {Number} width The width of the rectangle
         * @param {Number} height The height of the rectangle
         * @param {Number} [radius = 5] The corner radius; It can also be an object to specify different radii for corners
         * @param {Number} [radius.tl = 0] Top left
         * @param {Number} [radius.tr = 0] Top right
         * @param {Number} [radius.br = 0] Bottom right
         * @param {Number} [radius.bl = 0] Bottom left
         * @param {Boolean} [fill = false] Whether to fill the rectangle.
         * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
         */
        if (typeof stroke === 'undefined') { stroke = true; }
        if (typeof radius === 'undefined') { radius = 5; }
        if (typeof radius === 'number') { radius = { tl: radius, tr: radius, br: radius, bl: radius }; } 
        else {
            var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
            for (var side in defaultRadius) { radius[side] = radius[side] || defaultRadius[side]; } }
        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
        if (fill) { ctx.fill(); }
        if (stroke) { ctx.stroke(); }

    }

    draw_text_grid (Ui, text, range,style) {
        let [x_range, y_range, z_range] = range;
        let [total_columns, column_from, columns, column_to, width, x_min] = x_range;
        let [total_rows, row_from, rows, row_to, height, y_min] = y_range;
        let [total_layers, layers_from, layers, layer_to, depth, z_min]     = z_range;
        let [x,y,z,radius] = [0,0,0,0];
        let [x_draw_min,y_draw_min,z_draw_min,x_draw_max,y_draw_max,z_draw_max] = [0,0,0,0,0,0];
        let [xob,yob,zob] = Boundary.get_empties([0,0,0]);
        for (let layer = 0; layer < layers; layer++) {
            for (let row = 0; row < rows; row++) {
                for (let column = 0; column < columns; column++) {
                    let index = ((total_rows * total_columns * (layers_from + layer)) + (total_columns * (row_from + row)) + (column_from + column));
                    if (index < text.length) {
                        let [xm,ym,zm,w,h,d] = [x_min,y_min,z_min,width,height,depth].map(x => x * Ui.dpi);
                        x = xm + (w * column) + (w / 2);
                        y = ym + (h * row) + (h / 2);
                        z = zm + (d * layer) + (d / 2);
                        radius = Math.min(h / 2), (w / 2);

                        // x = (x_min + (width * column) + (width / 2)) * Ui.dpi;
                        // y = (y_min + (height * row) + (height / 2)) * Ui.dpi;
                        // z = (z_min + (depth * layer) + (height / 2)) * Ui.dpi;
                        // radius = Math.min((height / 2), (width / 2)) * Ui.dpi;
                        // Ui.ctx2.fillStyle = `rgb(${Math.floor(255 - 42.5)},0,0)`;
                        // Ui.ctx2.strokeStyle = `rgb(${Math.floor(255 - 42.5)},0,0)`;
                        switch (style) {
                            case 0:

                                Ui.ctx2.beginPath();
                                Ui.ctx2.arc(x, y, radius, 0, Math.PI * 2, true);
                                Ui.ctx2.fill();
                                break;
                            case 1:
                                Ui.ctx2.beginPath();
                                Ui.ctx2.lineWidth = radius * 0.05;
                                Ui.ctx2.arc(x, y, radius, 0, Math.PI * 2, true);
                                Ui.ctx2.stroke();
                                break;
                            case 2:
                                Ui.ctx2.fillStyle = "rgba(50, 50, 50)";
                                Ui.ctx2.strokeStyle = "rgb(50, 50, 50)";
                                Ui.ctx2.lineWidth = radius * 0.3;
                                Canvas.roundRect(Ui.ctx2,
                                    x-(width/2),
                                    y-(height/2),
                                    width*2,
                                    height,
                                    0,
                                    true,
                                    true,
                                    );
                                break;

                            case 3:
                                // Ui.ctx2.fillStyle = "rgba(27, 27, 27)";
                                // Ui.ctx2.strokeStyle = "rgb(0, 0, 0)";
                                // Canvas.roundRect(Ui.ctx2, bx.min()*Ui.dpi, by.min()*Ui.dpi, total_columns*width*Ui.dpi, height*Ui.dpi, 5*Ui.dpi ,true);
                                break;

                            case 4:

                                break;
                                            
                            default:
                                break;
                        }
                        // Ui.ctx2.font = `${radius}px mono`;
                        Ui.ctx2.font = `${radius}px serif`;
                        Ui.ctx2.fillStyle = `white`;
                        Ui.ctx2.textBaseline = 'middle';
                        Ui.ctx2.textAlign = 'center';
                        // let font_width = Ui.ctx2.measureText(text[index].toUpperCase()).width;
                        Ui.ctx2.fillText(text[index].toUpperCase(), x, y, radius);
                        // x = (x_min + (width * column)) * Ui.dpi;
                        // y = (y_min + (height * row)) * Ui.dpi;
                        // z = (z_min + (depth * layer)) * Ui.dpi;

                        x = (x_min + (width * column));
                        y = (y_min + (height * row));
                        z = (z_min + (depth * layer));

                        xob.add(x_min,x);
                        yob.add(y_min,y);
                        zob.add(z_min,z);

                        // x = (xm + (w * column));
                        // y = (ym + (h * row));
                        // z = (zm + (d * layer));
                        // x_draw_min = Math.min(x_draw_min,x);
                        // y_draw_min = Math.min(y_draw_min,y);
                        // z_draw_min = Math.min(z_draw_min,z);
                        // x_draw_max = Math.max(x_draw_max,x);
                        // y_draw_max = Math.max(y_draw_max,y);
                        // z_draw_max = Math.max(z_draw_max,z);
                    }
                    else {
                        // return;
                    }
                }
            }
        }
        return [xob,yob,zob];
        // return [x_draw_min,y_draw_min,z_draw_min,x_draw_max,y_draw_max,z_draw_max];
        // this.draw_label(Ui, x_range, y_range, z_range, 'BOTTOM-LEFT', radius, style);

    }

    draw_text(node, Ui) {

        let tmp = {};
        if (node.draw_board) {

            Ui.ctx2.fillStyle = `rgb(${0.8},${0.8},${0.8},${0.1})`;
            tmp.x = node.x - (node.width / 2);
            tmp.y = node.y - (node.height / 2);
            Ui.ctx2.fRect(tmp.x, tmp.y, node.width, node.height);
            node.draw_board.forEach(
                function(element) {
                    Container.draw(element, Ui);
                }
            );
        } else if (Ui.Icons && Ui.Icons.has(node.src)) {
            let blend = Ui.ctx2.globalCompositeOperation;
            Ui.ctx2.globalCompositeOperation = "lighter";
            tmp.icon = Ui.Icons.get(node.src);

            tmp.x = node.x - (node.width / 2);
            tmp.y = node.y - (node.height / 2);
            Ui.ctx2.drawImage(tmp.icon, tmp.x, tmp.y, node.width, node.height);
            Ui.ctx2.globalCompositeOperation = blend;

        } else if (parseInt(node.src)) {

            Ui.ctx2.textBaseline = 'middle';
            Ui.ctx2.textAlign = 'center';
            tmp.text = String.fromCharCode(parseInt(node.src));

            tmp.height = node.height
            Ui.ctx2.font = `${tmp.height}px mono`;
            tmp.width = Ui.ctx2.measureText(tmp.text).width;
            if (tmp.width > node.width) {
                Ui.ctx2.font = `${parseInt(node.width / tmp.width * tmp.height)}px mono`;
            }
            Ui.ctx2.fillText(tmp.text, node.x, node.y);

        } else if (Colors.css.includes(node.src)) {

            Ui.ctx2.fillStyle = node.src;
            tmp.x = node.x - (node.width / 2);
            tmp.y = node.y - (node.height / 2);
            Ui.ctx2.fRect(tmp.x, tmp.y, node.width, node.height);

        } else if (typeof node.src === 'string' && node.src !== "") {

            Ui.ctx2.fillStyle = `rgb(${0.0},${0.0},${1.0},${1.0})`;
            Ui.ctx2.textBaseline = 'middle';
            Ui.ctx2.textAlign = 'center';
            Ui.ctx2.font = `${node.height}px mono`;
            tmp.text = node.src;
            tmp.width = Ui.ctx2.measureText(tmp.text).width;
            if (tmp.width > node.width) {
                //tmp.text = node.src.substring(0, parseInt(node.width / (tmp.width / node.src.length)));

                let lines = Math.ceil(node.height / node.width);
                lines = (lines > tmp.text.length) ? tmp.text.length : lines;
                if (lines === 1 || tmp.text.length === 1) {
                    let h1 = node.height;
                    let w1 = tmp.width / tmp.text.length;
                    let w2 = node.width / tmp.text.length;
                    let h2 = w2 / w1 * h1;
                    Ui.ctx2.font = `${Math.floor(h2)}px mono`;
                    Ui.ctx2.fillText(tmp.text, node.x, node.y);

                } else {
                    let characters_per_line = Math.ceil(tmp.text.length / lines);
                    let pager = [];
                    for (let line = 0; line < lines; line++) {
                        let cursor_begin = line * characters_per_line;
                        let cursor_end = cursor_begin + characters_per_line;
                        if (cursor_end < tmp.text.length) {
                            pager.push(tmp.text.substring(cursor_begin, cursor_end));
                        } else {
                            pager.push(tmp.text.substring(cursor_begin, tmp.text.length));
                        }
                    }

                    let h1 = node.height;
                    let w1 = tmp.width / tmp.text.length;
                    let w2 = node.width / characters_per_line;
                    let h2 = w2 / w1 * h1;
                    Ui.ctx2.font = `${Math.floor(h2)}px mono`;

                    let page_height = h2 * pager.length;

                    if (page_height > node.height) {
                        w1 = Ui.ctx2.measureText(" ").width;
                        h1 = h2;
                        w2 = w1 / h1 * (node.height / pager.length);
                        h2 = w2 / w1 * h1;
                        Ui.ctx2.font = `${Math.floor(h2)}px mono`;
                    }
                    page_height = h2 * pager.length;
                    pager.forEach(
                        function(line, index) {
                            Ui.ctx2.fillText(
                                line,
                                node.x,
                                node.y - (page_height / 2) + (index * h2) + (h2 / 2));
                        }
                    );

                }
            } else {
                Ui.ctx2.fillText(tmp.text, node.x, node.y);
            }
        }


    }

    align ( xyz_container_bounds, xyz_last_bounds, alignment, xyz_bounds, xyz_offsets) {
        let [x_range, y_range, z_range] = range;
        let [total_rows, row_from, rows, row_to, width, x_min] = x_range;
        let [total_columns, column_from, columns, column_to, height, y_min] = y_range;
        let [total_layers, layers_from, layers, layer_to, depth, z_min] = z_range;
        
        let [x_draw_min, y_draw_min, z_draw_min, x_draw_max, y_draw_max, z_draw_max] = draw_range;
        // if (typeof (label) === 'string'){
            let bx = new Boundary.initialize(0,0, label.length*width, label.length);
            let by = new Boundary.initialize(0,0,height,1);
            let bz = new Boundary.initialize(0,0,1,1);
            let dbx = new Boundary.initialize(x_draw_min,0,x_draw_max,1);
            let dby = new Boundary.initialize(y_draw_min,0,y_draw_max,1);
            let dbz = new Boundary.initialize(z_draw_min,0,z_draw_max,1);
            let tbx = this.bounds['x'];
            let tby = this.bounds['y'];
            let tbz = this.bounds['z'];
            if (alignment === 'FRONT CENTER') {
            }
            else if (alignment === 'BACK') {
    
            }
            else if (alignment === 'TOP-LEFT') {
                bx = Boundary.align(tbx,'min',bx,'min',0); /* (anchor,alignment,in_bounds,offset) */ 
                by = Boundary.align(tby,'min',by,'min',-height); 
                bz = Boundary.align(tbz,'min',bz,'min',0); 
            }
            else if (alignment === 'BOTTOM-LEFT') {
                bx = Boundary.align(tbx,'min',bx,'min',0); /* (anchor,alignment,in_bounds,offset) */ 
                by = Boundary.align(dby,'max',by,'min',height);  // by = tby.align('max','min',by,0); 
                bz = Boundary.align(tbz,'min',bz,'min',0); 
            }
            else if (alignment === 'LEFT') {
    
            }
            else if (alignment === 'RIGHT') {
    
            }
            // this.label = new Label.initialize('label',this.label,alignment,Ui.language,0,{x:bx,y:by,z:bz});
            return new Label.initialize('label',label, alignment, Ui.language, 0, {x:bx,y:by,z:bz})
            .draw(Ui, alignment, style);
        // }
        // this.label.draw(Ui, alignment, style);

    }

    axis_order () {
        let order = { 
            R:['x',+1],
            L:['x',-1],
            D:['y',+1],
            U:['y',-1],
            F:['z',+1],
            B:['z',-1],
        }
        order = { 
            x:{L:-1,R:1},
            y:{U:-1,D:1},
            z:{F:-1,B:1},
        }
    }

    draw (Ui, text, xyz_order, xyz_container, xyz_last_bounds, xyz_bounds, alignment, range, bg_style, fg_style) {
        let [x_range, y_range, z_range] = range;
        let [total_columns, column_from, columns, column_to, width, x_min] = x_range;
        let [total_rows, row_from, rows, row_to, height, y_min] = y_range;
        let [total_layers, layers_from, layers, layer_to, depth, z_min]     = z_range;
        let [x,y,z,radius] = [0,0,0,0];
        let [x_draw_min,y_draw_min,z_draw_min,x_draw_max,y_draw_max,z_draw_max] = [0,0,0,0,0,0];
        let [xob,yob,zob] = Boundary.get_empties([0,0,0]);


        // Ui.ctx2.fillStyle = "rgba(27, 27, 27)";
        // Ui.ctx2.strokeStyle = "rgb(0, 0, 0)";
        // Canvas.roundRect(Ui.ctx2, bx.min()*Ui.dpi, by.min()*Ui.dpi, total_columns*width*Ui.dpi, height*Ui.dpi, 5*Ui.dpi ,true);
        for (let layer = 0; layer < layers; layer++) {
            for (let row = 0; row < rows; row++) {
                for (let column = 0; column < columns; column++) {
                    let index = ((total_rows * total_columns * (layers_from + layer)) + (total_columns * (row_from + row)) + (column_from + column));
                    if (index < text.length) {
                        let [xm,ym,zm,w,h,d] = [x_min,y_min,z_min,width,height,depth].map(x => x * Ui.dpi);
                        x = xm + (w * column) + (w / 2);
                        y = ym + (h * row) + (h / 2);
                        z = zm + (d * layer) + (d / 2);
                        radius = Math.min(h / 2), (w / 2);
                        switch (style) {
                            case 0: /* ARC-FILL */
                                Ui.ctx2.beginPath();
                                Ui.ctx2.arc(x, y, radius, 0, Math.PI * 2, true);
                                Ui.ctx2.fill();
                                break;
                            case 1: /* ARC-STROKE */
                                Ui.ctx2.beginPath();
                                Ui.ctx2.lineWidth = radius * 0.05;
                                Ui.ctx2.arc(x, y, radius, 0, Math.PI * 2, true);
                                Ui.ctx2.stroke();
                                break;
                            case 2: /* BACKGROUND */
                                Ui.ctx2.fillStyle = "rgba(50, 50, 50)";
                                Ui.ctx2.strokeStyle = "rgb(50, 50, 50)";
                                Ui.ctx2.lineWidth = radius * 0.3;
                                Canvas.roundRect(Ui.ctx2,
                                    x-(width/2),
                                    y-(height/2),
                                    width*2,
                                    height,
                                    0,
                                    true,
                                    true,
                                    );
                                break;

                            case 3:
                                // Ui.ctx2.fillStyle = "rgba(27, 27, 27)";
                                // Ui.ctx2.strokeStyle = "rgb(0, 0, 0)";
                                // Canvas.roundRect(Ui.ctx2, bx.min()*Ui.dpi, by.min()*Ui.dpi, total_columns*width*Ui.dpi, height*Ui.dpi, 5*Ui.dpi ,true);
                                break;

                            case 4:

                                break;
                                            
                            default:
                                break;
                        }
                        // Ui.ctx2.font = `${radius}px mono`;
                        Ui.ctx2.font = `${radius}px serif`;
                        Ui.ctx2.fillStyle = `white`;
                        Ui.ctx2.textBaseline = 'middle';
                        Ui.ctx2.textAlign = 'center';
                        // let font_width = Ui.ctx2.measureText(text[index].toUpperCase()).width;
                        Ui.ctx2.fillText(text[index].toUpperCase(), x, y, radius);
                        // x = (x_min + (width * column)) * Ui.dpi;
                        // y = (y_min + (height * row)) * Ui.dpi;
                        // z = (z_min + (depth * layer)) * Ui.dpi;

                        x = (x_min + (width * column));
                        y = (y_min + (height * row));
                        z = (z_min + (depth * layer));

                        xob.add(x_min,x);
                        yob.add(y_min,y);
                        zob.add(z_min,z);

                        // x = (xm + (w * column));
                        // y = (ym + (h * row));
                        // z = (zm + (d * layer));
                        // x_draw_min = Math.min(x_draw_min,x);
                        // y_draw_min = Math.min(y_draw_min,y);
                        // z_draw_min = Math.min(z_draw_min,z);
                        // x_draw_max = Math.max(x_draw_max,x);
                        // y_draw_max = Math.max(y_draw_max,y);
                        // z_draw_max = Math.max(z_draw_max,z);
                    }
                    else {
                        // return;
                    }
                }
            }
        }
        return [xob,yob,zob];
        // return [x_draw_min,y_draw_min,z_draw_min,x_draw_max,y_draw_max,z_draw_max];
        // this.draw_label(Ui, x_range, y_range, z_range, 'BOTTOM-LEFT', radius, style);

    }
    
    draw_label (Ui, x_range, y_range, z_range, alignment, radius, style) {
        let [total_rows, row_from, rows, row_to, width, x_min] = x_range;
        let [total_columns, column_from, columns, column_to, height, y_min] = y_range;
        let [total_layers, layers_from, layers, layer_to, depth, z_min] = z_range;
        if (typeof (this.label) === 'string'){
            let bx = new Boundary.initialize(0,0, this.label.length*width, this.label.length);
            let by = new Boundary.initialize(0,0,height,1);
            let bz = new Boundary.initialize(0,0,1,1);
            if (alignment === 'FRONT CENTER') { }
            else if (alignment === 'BACK') { }
            else if (alignment === 'TOP') { }
            else if (alignment === 'BOTTOM-LEFT') {
                bx = bx.align('min','min',bx,0); /* (anchor,alignment,in_bounds,offset) */ 
                by = by.align('max','min',by,5); 
                bz = bz.align('min','min',bz,0);  }
            else if (alignment === 'LEFT') { }
            else if (alignment === 'RIGHT') { }
            this.label = new Label.initialize('label',this.label,alignment,Ui.language,0,{x:bx,y:by,z:bz});
        }
        this.label.draw(Ui, x_range, y_range, z_range, alignment, radius, style);

    }
    
    draw_logo(){
        Ui.ctx2.fillStyle = "rgba(0,0,0,0)";
        Ui.ctx2.fillRect(0, 0, Ui.c2.width, Ui.c2.height);
    //     Ui.ctx2.drawImage(Ui.logo,
    //         Ui.c2.width - Ui.logo.width / 2,
    //         Ui.c2.height - Ui.logo.height / 2
    // );
    //     Ui.ctx2.drawImage(Ui.logo,
    //         (Ui.global.width_2 / 2) - (Ui.logo.width / 2),
    //         (Ui.global.height_2/2) - (Ui.logo.height / 2),
    //         Ui.logo.width,Ui.logo.height
    // );
        Ui.ctx2.drawImage(Ui.logo,
                (Ui.global.width_2 / 2) - (Ui.logo.width / 2),
                (Ui.global.height_2) - (Ui.logo.height),
                Ui.logo.width,Ui.logo.height
        );
        // Ui.ctx2.drawImage(Ui.logo,0,0,Ui.logo.width,Ui.logo.height);
    }
};