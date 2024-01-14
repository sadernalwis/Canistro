import * as THREE from 'three';
import { Boundary } from 'Medusa/Parseltongue/Boundary/Boundary.js';
import { Meta } from 'Medusa/Parseltongue/Meta/Meta.js';
import { Canvas } from "./Canvas/Canvas.js";
import { Space } from 'Medusa/Parseltongue/Space/Space.js';
import { MD5 } from '../TextureSpace/Image/MD5/MD5.js';
// import { Camera } from './Camera/Camera.js';
import { readMetadata } from '../TextureSpace/Image/PNG/Metadata/Metadata.js';
import { HTML } from 'Medusa/Parseltongue/HTML/HTML.js';


export class SuperPosition extends Meta{
    static scale = [
        { size: .01, scale: 0.0001, label: 'microscopic (1µm)' }, // FIXME - triangulating text fails at this size, so we scale instead
        { size: .01, scale: 0.1, label: 'minuscule (1mm)' },
        { size: .01, scale: 1.0, label: 'tiny (1cm)' },
        { size: 1, scale: 1.0, label: 'child-sized (1m)' },
        { size: 10, scale: 1.0, label: 'tree-sized (10m)' },
        { size: 100, scale: 1.0, label: 'building-sized (100m)' },
        { size: 1000, scale: 1.0, label: 'medium (1km)' },
        { size: 10000, scale: 1.0, label: 'city-sized (10km)' },
        { size: 3400000, scale: 1.0, label: 'moon-sized (3,400 Km)' },
        { size: 12000000, scale: 1.0, label: 'planet-sized (12,000 km)' },
        { size: 1400000000, scale: 1.0, label: 'sun-sized (1,400,000 km)' },
        { size: 7.47e12, scale: 1.0, label: 'solar system-sized (50Au)' },
        { size: 9.4605284e15, scale: 1.0, label: 'gargantuan (1 light year)' },
        { size: 3.08567758e16, scale: 1.0, label: 'ludicrous (1 parsec)' },
        { size: 1e19, scale: 1.0, label: 'mind boggling (1000 light years)' }
    ]
    static grid_space = new Space(0,[[0,undefined]], ['scales',SuperPosition.scale],['z', 16],['y', 16],['x', 16])
    
    setup_boundaries(map_size, grid_size){
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

    create_canvas(width,height){
        const canvas = HTML.make("canvas", "card", [], {}); 
        HTML.style(canvas,{ /* width: '100%', */height: 'inherit','position':'absolute', 'left':'0px', 'top':'0px'});
        this.canvas = canvas.getContext('2d');
        this.canvas.fillStyle = '#F00';
        this.canvas.fillRect(0, 0, this.canvas.canvas.width, this.canvas.canvas.height);
        this.canvas.clearRect(0, 0, this.canvas.canvas.width, this.canvas.canvas.height);
        // HTML.style_overlay(canvas,width,height)
        function setDPI() {
            // Set up CSS size.

            canvas.width  = 1000//this.html.canvas.innerWidth//window.innerWidth;
            canvas.height = 1000//this.html.canvas.innerHeight//window.innerHeight;
            const ctx = canvas.getContext('2d');
            // ctx.globalAlpha = 0.0;
            ctx.fillStyle = '#111';
            // ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return
            const dpi = 96 //window.devicePixelRatio;
            canvas.style.width = canvas.style.width || canvas.width + 'px';
            canvas.style.height = canvas.style.height || canvas.height + 'px';
        
            // Get size information.
            var scaleFactor = dpi / 96;
            var width = parseFloat(canvas.style.width);
            var height = parseFloat(canvas.style.height);
        
            // Backup the canvas contents.
            var oldScale = canvas.width / width;
            var backupScale = scaleFactor / oldScale;
            var backup = canvas.cloneNode(false);
            backup.getContext('2d').drawImage(canvas, 0, 0);
        
            // Resize the canvas.
            // var ctx = canvas.getContext('2d');
            canvas.width = Math.ceil(width * scaleFactor);
            canvas.height = Math.ceil(height * scaleFactor);
        
            // Redraw the canvas image and scale future draws.
            ctx.setTransform(backupScale, 0, 0, backupScale, 0, 0);
            ctx.drawImage(backup, 0, 0);
            ctx.setTransform(scaleFactor, 0, 0, scaleFactor, 0, 0);
        }
        window.addEventListener("resize", setDPI.bind(this));
        this.html.canvas = canvas
        return canvas;
        
    }

    canvas_obj(ele) {
        let returnable = { canvas: ele, ctx: ele.getContext("2d"), dpi: window.devicePixelRatio };
        returnable.get = {
          style: {
            height() { return +getComputedStyle(ele).getPropertyValue("height").slice(0, -2); },
            width() { return +getComputedStyle(ele).getPropertyValue("width").slice(0, -2); } },
          attr: {
            height() { return returnable.ele.getAttribute("height"); },
            width() { return returnable.ele.getAttribute("height"); } } };
    
        returnable.set = {
          style: {
            height(ht) { ele.style.height = ht + "px"; },
            width(wth) { ele.style.width = wth + "px"; } },
          attr: {
            height(ht) { ele.setAttribute("height", ht); },
            width(wth) { ele.setAttribute("width", wth); } } };
        return returnable; }

    dpi_adjust(set, get, dpi) {
        set.attr.height(get.style.height() * dpi);
        set.attr.width(get.style.width() * dpi);
    }

    animate() {
        let canvas = this.canvas_obj(this.html.canvas);
        let { ctx, dpi, set, get } = canvas;
        this.dpi_adjust(set, get, dpi);
        ctx.beginPath();
        ctx.fillRect(25, 50, 25, 25);
        ctx.beginPath();
        ctx.arc(500, 50, 300, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.font = "30px Arial";
        ctx.fillText("Hello World", 10, 50);
        // requestAnimationFrame(animate);
    }

    setDPI(width, height, dpi=96) {
        let canvas = this.html.canvas
        canvas.width  = width//this.html.canvas.innerWidth//window.innerWidth;
        canvas.height = height//this.html.canvas.innerHeight//window.innerHeight;
        const ctx = this.canvas
        dpi = dpi || window.devicePixelRatio;
        canvas.style.width = canvas.style.width || canvas.width + 'px';
        canvas.style.height = canvas.style.height || canvas.height + 'px';
        // Get size information.
        var scaleFactor = dpi / 96;
        var width = parseFloat(canvas.style.width);
        var height = parseFloat(canvas.style.height);
    
        // Backup the canvas contents.
        var oldScale = canvas.width / width;
        var backupScale = scaleFactor / oldScale;
        var backup = canvas.cloneNode(false);
        backup.getContext('2d').drawImage(canvas, 0, 0);
    
        // Resize the canvas.
        // var ctx = canvas.getContext('2d');
        canvas.width = Math.ceil(width * scaleFactor);
        canvas.height = Math.ceil(height * scaleFactor);
    
        // Redraw the canvas image and scale future draws.
        ctx.setTransform(backupScale, 0, 0, backupScale, 0, 0);
        ctx.drawImage(backup, 0, 0);
        ctx.setTransform(scaleFactor, 0, 0, scaleFactor, 0, 0); }

    pose_space(){
        const grid = this.grid_size
        this.camera_space = new Space(0,[[0,undefined]],['v', grid.y],['h', grid.x])
        // for(const i of s.generator()){ console.log(i) }
        // s.index(10,11,4,1) //1319
    }

    get max_action_maps(){
        // return 32
        return 3
    }
    
    
    // constructor(parent, world, object_hash, metadata_dict, resolution, map_size=new THREE.Vector2(512, 512), grid_size=new THREE.Vector2(3.0, 3.0), max_instances=27){
    // constructor(parent, world, object_hash, metadata_dict, resolution, map_size=new THREE.Vector2(512, 512), grid_size=new THREE.Vector2(8.0, 8.0), max_instances=8*8*32){
    // constructor(parent, world, object_hash, metadata_dict, resolution, map_size=new THREE.Vector2(1024, 1024), grid_size=new THREE.Vector2(16.0, 16.0), max_instances=16*16*32){
    // constructor(parent, world, object_hash, metadata_dict, resolution, map_size=new THREE.Vector2(2048, 2048), grid_size=new THREE.Vector2(32.0, 32.0), max_instances=32*32*32){
    // constructor(parent, world, object_hash, metadata_dict, resolution, map_size=new THREE.Vector2(1024, 1024), grid_size=new THREE.Vector2(32.0, 32.0), max_instances=32*32*32){
    // constructor(parent, world, object_hash, metadata_dict, resolution, map_size=new THREE.Vector2(2048, 2048), grid_size=new THREE.Vector2(12.0, 12.0), max_instances=1){
    constructor(parent, world, object_hash, metadata_dict, resolution, map_size=new THREE.Vector2(2048, 2048), grid_size=new THREE.Vector2(1.0, 1.0), max_instances=1){
		super(null, object_hash, null, parent);
        this.html = {}
        this.M = metadata_dict;
        this.W = this;
        this.poses = ["captured01", "glamour02", "glamour06", "gym02", "shojo_classic03", "sit_sexy", "standing03", "standing_basic", "standing_old_people",
        "flying01", "glamour03", "glamour07", "pinup01", "shojo_classic04", "sorceress", "standing04", "standing_fitness_competition", "standing_symmetric", "flying02", "glamour04", "glamour08", "shojo_classic01",
        "sit_basic", "standing01", "standing05", "standing_fitness_competition02", "glamour01", "glamour05",
        "gym01", "shojo_classic02", "sit_meditation", "standing02", "standing06", "standing_in_lab"]
        this.world = world;
        this.object_hash = object_hash
        // this.instances = []
        this.setup_boundaries(map_size, grid_size)
        this.create_space()
        this.create_canvas()
        this.image_map = new Map()
        this.image_scene_scales = [];
        this.image_scene_scale = 0
        if(this.world){
            this.max_instances = max_instances
            this.camera = new Camera(resolution)
            this.setup_renderer()
            this.setup_geometry()}
    }

    get_drawbox(source_image, slot_position_xy, slot_size_xy, alignment){
        const source_x = 0
        const source_y = 0
        const source_width = source_image.width
        const source_height = source_image.height
        const destin_x = slot_position_xy.x
        // const destin_x = 469
        const destin_y = slot_position_xy.y
        const destin_width = slot_size_xy.x
        const destin_height = slot_size_xy.y
        return [source_x, source_y, source_width, source_height, destin_x, destin_y, destin_width, destin_height]
        // ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    }
    image_to_slot(image, slot_idx, fill=/* "rgb(255,0,0)" */"rgba(0,0,0,0)",alignment){
        // job['origin_coords']
        const position_xy = this.get_slot_position(slot_idx)
        // const position_xy = new THREE.Vector2(0,0)
        const size_xy = this.get_slot_size()
        const canvas = this.canvas
        const draw_rect = this.get_drawbox(image, position_xy, size_xy, alignment);
        const [sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight] = draw_rect
        if(fill){
            // const fill_style = this.slot.canvas.fillStyle
            // this.slot.canvas.fillStyle = fill;
            // this.slot.canvas.fillRect(0, 0, size_xy.x, size_xy.y);
            // this.slot.canvas.fillStyle = fill_style
            const fill_style = canvas.fillStyle
            canvas.fillStyle = "rgb(255,0,0)";//fill;
            canvas.globalAlpha = 0.0;
            canvas.fillRect(dx, dy, dWidth, dHeight); //canvas.canvas.fillRect(50,50,75,50);
            canvas.globalAlpha = 1.0;
            // canvas.canvas.fillRect(0, 0, size_xy.x, size_xy.y);
            canvas.fillStyle = fill_style

            var imgdata = canvas.getImageData(dx, dy, dWidth, dHeight);
            var imgdatalen = imgdata.data.length;
            for(var i=0;i<imgdatalen/4;i++){  //iterate over every pixel in the canvas
                imgdata.data[4*i] = 0;    // RED (0-255)
                imgdata.data[4*i+1] = 0;    // GREEN (0-255)
                imgdata.data[4*i+2] = 0;    // BLUE (0-255)
                imgdata.data[4*i+3] = 0;  // APLHA (0-255)
            }
            // canvas.putImageData(imgdata,dx, dy);
        }
        canvas.drawImage(image, ...draw_rect);
    }

    upload_slot(texture_idx, slot_idx){
        const position_xy = this.get_slot_position(slot_idx)
        this.renderer.copyTextureToTexture( position_xy, this.slot.texture, this.mesh.material.uniforms.textures.value[texture_idx]);
        this.mesh.material.uniforms.textures.value[texture_idx].needsUpdate = true;
        this.mesh.material.needsUpdate  = true;
    }

    async incoming(event, data){
        switch (event) {
            case 'queued':
                // image.src = data? data:"../../../../../Environments/Medusa/Medallion.png";
                break;
            case 'pre-send':
                // image.src = data? data:"../../../../../Environments/Medusa/Medallion.png";
                break;
            case 'sent':
                // image.src = data? data:"../../../../../Environments/Medusa/Medallion.png";
                break;
            case 'error':
                // image.src = data? data:"../../../../../Environments/Medusa/Medallion.png";
                break;
            case 'received':
                let [gatepass, parseltongue, payload] = data
                let [json,blob] = payload
                if(json){
                    payload = json
                } 
                else{
                    payload = blob
                    var image = document.createElement('img');
                    let sp = this
                    const object_url = URL.createObjectURL(payload);
                    const buffer = await payload.arrayBuffer();
                    const metadata = readMetadata(buffer);
                    // console.log(metadata)                    
                    image.onload = function(e) { sp.image_hvrp(this, metadata) };
                    image.src = object_url
                    return metadata['tEXt'].asset_hash
                }
                return 1
            default:
                // submitter.src = data? data:"../../../../../Environments/Medusa/Medallion.png";
                break;
        }
    }

    store_hash(image_hash, hvrp){
        // let image_key = `${this.identity}:${this.action}:${this.angle[0]}:${this.angle[1]}`;
        if(!this.image_map.has(image_hash)){
            this.image_map.set(image_hash, hvrp);
            // var image = this.image_map.get(image_key)
        }
    }
    
    layer_interpolate(image, metadata){
        const image_hash = metadata['tEXt'].asset_hash
        console.log(metadata['tEXt'].pose_name)
        if(this.image_map.has(image_hash)){
            const hvrp = this.image_map.get(image_hash);
            const slot = this.camera_space.index(hvrp['v'],hvrp['h'])
            this.image_to_slot(image, 132)
            // var image = this.image_map.get(image_key)
        }
    }

    get_drawbox(source_image, slot_position_xy, slot_size_xy, alignment){
        const scale = 1.0
        const canvas = this.canvas.canvas
        const ranges = [source_image.width*scale, source_image.height*scale, canvas.width, canvas.height]
        // const ranges = [source_image.width, source_image.height, slot_size_xy.x*scale, slot_size_xy.y*scale]
        var [source_x, source_y, destin_x, destin_y] = Boundary.get_empties(ranges,'max');
        // destin_x.minimum = slot_position_xy.x*scale
        // destin_y.minimum = slot_position_xy.y*scale
        // destin_x.shrink(source_x, source_y, destin_x, destin_y).forEach((b)=>{b.print()})
        destin_x = Boundary.align(destin_x, 'M', source_x, 'M', 10);
        destin_y = Boundary.align(destin_y, 'M', source_y, 'M', 0);
        return [source_x.minimum, 
                source_y.minimum, 
                source_x.maximum, 
                source_y.maximum, 
                destin_x.minimum, 
                destin_y.minimum, 
                source_x.maximum, 
                source_y.maximum, ]
        // ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    }

    draw_rect(source_image, scene, scale = 1.0){
        const canvas = this.canvas.canvas
        // const [resolution_x,resolution_y] = scene.resolution ? scene.resolution : [1920, 1080]
        // const offset = scene.origin_coords ? scene.origin_coords : [0,0,0]
        const offset = [0,0,0]
        const ranges = [source_image.width, source_image.height, canvas.width,canvas.height, canvas.width*scale,canvas.height*scale]
        // const ranges = [source_image.width*scale, source_image.height*scale, canvas.width,canvas.height, resolution_x,resolution_y]
        var [source_x, source_y, destin_x, destin_y, renderer_x, renderer_y] = Boundary.get_empties(ranges,'max');
        destin_x = Boundary.align(destin_x, 'M', source_x, 'M', offset[0]);
        destin_y = Boundary.align(destin_y, 'M', source_y, 'M', offset[1]);
        // destin_x = Boundary.align(renderer_x, 'M', destin_x, 'M', 0);
        // destin_y = Boundary.align(renderer_y, 'M', destin_y, 'M', 0);
        return [source_x.minimum, source_y.minimum, source_x.maximum, source_y.maximum, 
            destin_x.minimum, destin_y.minimum, 
            source_x.maximum, source_y.maximum, ]
        // ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        // destin_x.shrink(source_x, source_y, destin_x, destin_y).forEach((b)=>{b.print()})
    }

    // draw_image(source_image, scale = 1.0){
    //     const canvas = this.canvas.canvas
    //     // const [resolution_x,resolution_y] = [512, 512]//scene.resolution ? scene.resolution : [1920, 1080]
    //     // const offset = scene.origin_coords ? scene.origin_coords : [0,0,0]
    //     const offset = [0,0,0]
    //     const ranges = [source_image.width, source_image.height, canvas.width,canvas.height, canvas.width*scale,canvas.height*scale]
    //     // const ranges = [source_image.width*scale, source_image.height*scale, canvas.width,canvas.height, resolution_x,resolution_y]
    //     var [source_x, source_y, destin_x, destin_y, renderer_x, renderer_y] = Boundary.get_empties(ranges,'max');
    //     destin_x = Boundary.align(destin_x, 'M', source_x, 'M', offset[0]);
    //     destin_y = Boundary.align(destin_y, 'M', source_y, 'M', offset[1]);
    //     // destin_x = Boundary.align(renderer_x, 'M', destin_x, 'M', 0);
    //     // destin_y = Boundary.align(renderer_y, 'M', destin_y, 'M', 0);
    //     return [source_x.minimum, source_y.minimum, source_x.maximum, source_y.maximum, 
    //         destin_x.minimum, destin_y.minimum, 
    //         source_x.maximum, source_y.maximum, ]
    //     // ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    //     // destin_x.shrink(source_x, source_y, destin_x, destin_y).forEach((b)=>{b.print()})
    // }
    drawfunction (img) {
        
        const canvas = this.html.canvas
        const ctx = this.canvas
        // set size proportional to image
        canvas.height = canvas.width * (img.height / img.width);
    
        // step 1 - resize to 50%
        var oc = document.createElement('canvas'), 
        octx = oc.getContext('2d');
    
        oc.width = img.width * 0.5;
        oc.height = img.height * 0.5;
        octx.drawImage(img, 0, 0, oc.width, oc.height);
    
        // step 2
        octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);
    
        // step 3, resize to final size
        ctx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5,
        0, 0, canvas.width, canvas.height);
    }
    drawImageScaled(img) {
        const ctx = this.canvas
        var canvas = this.html.canvas ;
        var hRatio = canvas.width  / img.width    ;
        var vRatio =  canvas.height / img.height  ;
        var ratio  = Math.min ( hRatio, vRatio );
        var centerShift_x = ( canvas.width - img.width*ratio ) / 2;
        var centerShift_y = ( canvas.height - img.height*ratio ) / 2;  
        // ctx.clearRect(0,0,canvas.width, canvas.height);
        // ctx.drawImage(img, 0,0, img.width, img.height, centerShift_x,centerShift_y,img.width*ratio, img.height*ratio);  

        ctx.drawImage(img, 0, 0, img.width,    img.height,     // source rectangle
                   0, 0, canvas.width, canvas.height); // destination rectangle
    }

    draw_layer(image, scene, scale, fill=/* "rgb(255,0,0)" */"rgba(0,0,0,0)"){
        const canvas = this.canvas
        const draw_rect = this.draw_rect(image, scene, scale);
        const [sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight] = draw_rect
        if(fill){
            // const fill_style = this.slot.canvas.fillStyle
            // this.slot.canvas.fillStyle = fill;
            // this.slot.canvas.fillRect(0, 0, size_xy.x, size_xy.y);
            // this.slot.canvas.fillStyle = fill_style
            const fill_style = canvas.fillStyle
            canvas.fillStyle = "rgb(255,0,0)";//fill;
            canvas.globalAlpha = 0.0;
            canvas.fillRect(dx, dy, dWidth, dHeight); //canvas.canvas.fillRect(50,50,75,50);
            canvas.globalAlpha = 1.0;
            // canvas.canvas.fillRect(0, 0, size_xy.x, size_xy.y);
            canvas.fillStyle = fill_style

            var imgdata = canvas.getImageData(0,0, dWidth, dHeight);
            // var imgdata = canvas.getImageData(dx, dy, dWidth, dHeight);
            var imgdatalen = imgdata.data.length;
            for(var i=0;i<imgdatalen/4;i++){  //iterate over every pixel in the canvas
                imgdata.data[4*i] = 0;    // RED (0-255)
                imgdata.data[4*i+1] = 0;    // GREEN (0-255)
                imgdata.data[4*i+2] = 0;    // BLUE (0-255)
                imgdata.data[4*i+3] = 0;  // APLHA (0-255)
            }
            // canvas.putImageData(imgdata,dx, dy);
        }
        canvas.drawImage(image, ...draw_rect);
    }
    
    image_hvrp(image, metadata, scale){
        const scene = metadata['tEXt'].scene ? JSON.parse(metadata['tEXt'].scene) : {'origin_coords':[0, 0, 0]}
        // this.image_to_slot(image, 132)
        this.image_scene_scales.push([image, scene, scale])
        this.draw_layer(image, scene, scale)
        return
        const image_hash = metadata['tEXt'].asset_hash
        console.log(metadata['tEXt'].pose_name)
        if(this.image_map.has(image_hash)){
            const hvrp = this.image_map.get(image_hash);
            const slot = this.camera_space.index(hvrp['v'],hvrp['h'])
            this.image_to_slot(image, 132)
            // var image = this.image_map.get(image_key)
        }
    }
    
    hvrp_hash(p, r=5.0, v=0, h=0){ //hvrp_hash(5,0,(5.0).toPrecision(2),'captured01')
        const md = this.M
        md.file_path= ''
        md.file_name= 'PRINCESS 0.5.4v.blend'
        md.collection= `PoseAtlas/${p}` //'PoseAtlas/captured01',
        md.object_name= 'MBlab_sk1616213127.086241'
        md.author= ''
        // r = Parseltongue.is_float(r, true) ? r.toPrecision(2) : r
        const name = [md.file_name, md.collection, md.object_name, h,v, Number(r).toPrecision(2) ,p].join(',')
        const image_hash = MD5(name)
        this.store_hash(image_hash,{h:h,v:v,r:r,p:p})
        return [name, image_hash]
    }

    shuffle(){
        let stack_size = this.image_scene_scales.length
        if (stack_size){
            let image, scene, scale =  this.image_scene_scales[this.image_scene_scale%stack_size]
            this.draw_layer(image, scene, scale)
            this.image_scene_scale++
        }
    }

    load_pose(){
        

    }

    import_image(program,name_hash){
        var form = new FormData();
        form.append('parseltongue', 'image');
        form.append('payload', name_hash);
        // this.image_map.set(image_key, new Image());
        program.queue('postmaster', 'POST', '', form, this);
    }

    import_pose(program, pose_name){
        var form = new FormData();
        form.append('parseltongue', 'pose');
        form.append('payload', pose_name);
        // this.image_map.set(image_key, new Image());
        program.queue('postmaster', 'POST', '', form, this);
    }

    import_poses(program){
        var form = new FormData();
        form.append('parseltongue', 'poses');
        form.append('payload', 'PoseAtlas');
        // this.image_map.set(image_key, new Image());
        program.queue('postmaster', 'POST', '', form, this);
    }


    update(){
        if(false){
            // this.camera.set_camera(this.world.scene.position)
            this.camera.raycast(this.mesh)
            this.mesh.material.uniforms.camera_location.value = this.camera.camera.position
        }
        else{

            const texture_array = this.mesh.geometry.attributes.texture_index.array;
            const slot_array = this.mesh.geometry.attributes.index.array;
            for (let i = 0; i < this.instances.length; ++i){ 
                const instance = this.instances[i];
                // instance.update_indices(texture_array, slot_array)
                instance.update_matrix(this.mesh, this.camera.camera)
            }
            this.mesh.geometry.attributes.texture_index.needsUpdate = true;
            this.mesh.geometry.attributes.index.needsUpdate = true;
            this.mesh.instanceMatrix.needsUpdate = true;
            this.mesh.geometry.setDrawRange( 0, this.instances.length);
        }
    }

    /* ---------------P I X E L S --------------------- */    

    get_slot_size(){
        const size_xy = new THREE.Vector2();
        size_xy.x = this.width_boundary.fraction_precise()
        size_xy.y = this.height_boundary.fraction_precise()
        return size_xy
    }

    get_slot_position(slot_idx){
        const position_xy = new THREE.Vector2();
        const [v_idx, h_idx] = this.camera_space.coordinates(slot_idx) //[10, 11, 4, 1]
        const size_xy = this.get_slot_size()
        position_xy.x = h_idx * size_xy.x
        position_xy.y = v_idx * size_xy.y
        return position_xy
    }

    get grid_size(){
        return new THREE.Vector2(this.width_boundary.fractions, this.height_boundary.fractions)
    }

    get slot_count(){
        return this.width_boundary.fractions * this.height_boundary.fractions
    }

    get map_size(){
        return new THREE.Vector2(parseInt(this.width_boundary.range()), parseInt(this.height_boundary.range()))
    }

    get image(){
        if (this.image_map.has(this.image_hash)){ return this.image_map.get(this.image_hash) }
        else{ return null }
    }

    add_image(image, pose, slot_idx){
        this.image_hash.push(image)
        this.image_to_slot(image, slot_idx)
        this.upload_slot(pose, slot_idx)
    }
    
    load_image(){
        var imageElement = document.createElement('img');
        let plane = this.plane
        imageElement.onload = function(e) {
            if (plane.material.map){
                plane.material.map.dispose()
            }
            var map = new THREE.Texture( this );
            map.needsUpdate = true;

            plane.material.uniforms.map.value = map;
            plane.material.uniforms.map.needsUpdate = true;
            plane.material.needsUpdate = true;
        };
        // imageElement.src = dataurl;
        imageElement.src = "../../../../../Environments/Medusa/Medallion.png";
    }

    draw_text_grid () {
        let x_range = Boundary.view_range(this.bounds,'x', in_bounds);
        let y_range = Boundary.view_range(this.bounds,'y', in_bounds);
        let z_range = Boundary.view_range(this.bounds,'z', in_bounds);
        let range = [x_range, y_range, z_range];
        let draw_range = Canvas.draw_text_grid(Ui, text, range, 2);
        // this.draw_label(Ui, 'this.footer', range, draw_range, 'BOTTOM-LEFT', 3);

    }

    get texture(){
        let texture = this.texture_cache.get(this.texture_name)
        if (texture){ return texture }
        else{
            let image = self.image
            if (image){
                this.clear_job(this.texture_name)
                this.texture_cache.set(this.texture_name, this.create_texturespace(image))
                return this.texture_cache.get(this.texture_name)
            }
            else{
                if (this.jobs.has(this.texture_name)){
                    return this.default_texture
                }
                else{
                    this.add_job()
                    return this.default_texture
                }
            }
        }
    }

    static image(object_hash, image_hash, value){
        let image_key = `${this.identity}:${this.action}:${this.angle[0]}:${this.angle[1]}`;
        if(this.image_map.has(image_key) && this.current_image!==image_key){
            var image = this.image_map.get(image_key)
            this.write( image, 0, 0 );
            this.current_image = image_key;
        }
        else{
            var image = new Image();
            // img.onload = (function () { this.write( img, 0, 0 );}).bind(this);
            var form = new FormData();
            form.append('parseltongue', '');
            form.append('payload', { 'identity':this.identity , 'action': action, 'angle': angle,});
            this.image_map.set(image_key, new Image());
            self.program.queue('PostMaster', 'lightcast', 'request', form, image);
        }
    }


    update_test() {
        let tile = this;
        var width = 512;
        var height = 512;
        tile.setSize( width, height );
        var img = new Image();
        img.onload = function () {
            // alert("image is loaded");
            tile.write( img, 0, 0 )
        }
        img.src = "../../../../../Environments/Medusa/Medallion.png";
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
}