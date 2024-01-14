import * as THREE from '../../../../../text/javascript/threejs/build/three.module.js';
import { Boundary } from "../../../../../Boundary/Boundary.js";
import { Meta } from "../../../../../Meta/Meta.js";
import { Canvas } from "./Canvas/Canvas.js";
import { getTextures } from "../SuperPosition/ActionMap/Babel.js";
import { Space } from '../../../../../Parseltongue/Space/Space.js';
import { Instance } from './Instance/Instance.js';
import { MD5 } from '../TextureSpace/Image/MD5/MD5.js';
import { Parseltongue } from '../../../../../Parseltongue/Parseltongue.js';
import { vertex_shader } from './Shaders/Vertex.js';
import { fragment_shader } from './Shaders/Fragment.js';
import { Camera } from './Camera/Camera.js';
import { readMetadata } from '../TextureSpace/Image/PNG/Metadata/Metadata.js';


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

    setup_renderer(renderer){
        this.renderer = this.world.renderer
        const gl = this.renderer.getContext()
        this.max_gl_textures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)
        this.max_gl_texture_size = gl.getParameter(gl.MAX_TEXTURE_SIZE)
    }
    
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
    
    create_action_maps(){
        const max_maps = this.max_action_maps
        this.action_maps = []
        const textures = []
        const grid_xy = this.grid_size
        const map_xy = this.map_size
        for (let i = 0; i < max_maps; i++ ){  
            // const canvas = new Canvas(this.renderer, this.max_gl_texture_size , this.max_gl_texture_size, parseInt(grid_xy.x), parseInt(grid_xy.y))
            const canvas = new Canvas(this.renderer, map_xy.x , map_xy.y, parseInt(grid_xy.x), parseInt(grid_xy.y), i)
            this.action_maps.push(canvas);
            textures.push(canvas.texture);

        }
        return textures;
    }
    xyz_grid_partition(max){
        const cbrt = Math.cbrt(max)
        var rest = Math.ceil(cbrt%1)
        const block = Math.floor(cbrt)
        return [block, block, block+rest]
    }

    reset_instance_offsets() {
        const uv_indices = this.mesh.geometry.attributes.uv_index.array;
        for (let i = 0; i < this.max_instances; ++i){ uv_indices[i] = i }
        this.mesh.geometry.attributes.uv_index.needsUpdate = true; // required after the first render
    }

    reset_instance_positions() {
        // var [lx,ly,lz] = this.xyz_grid_partition(this.max_instances)
        const grid = this.grid_size
        var [lx,ly,lz] = [grid.x, grid.y, this.max_action_maps]
        const grid_space = new Space(0,[[0,undefined]],['z', lz],['y', ly],['x', lx])
        const dummy = new THREE.Object3D();
        let [p1, p2] = [[],[]]
        var [hlx,hly,hlz] = [lx/2,ly/2,lz/2]
        for(const i of grid_space.generator()){ 
            var [z,y,x] = i[2]
            var [x,y,z] = [x-hlx, y-hly, z-hlz]
            // var [x,y,z] = [x-hlx, y-hly, z]
            dummy.position.set(x*42.0,y*42.0,z*-42.0);
            // dummy.scale.set( 1.0, 2.0, 1 );
            dummy.updateMatrix();
            this.mesh.setMatrixAt( i[1], dummy.matrix );
            new Instance(this, `instance ${i[1]}`, i[1])
            // p1.push([x*42.0,y*42.0,z*42.0])
        }
        // for ( var i = 0; i < this.max_instances; i ++ ) {

        //     const xy = this.get_slot_position(i)
        //     // dummy.position.set(i, i, 0);
        //     dummy.position.set(xy.x, xy.y, 0);
        //     dummy.updateMatrix();
        //     this.mesh.setMatrixAt( i, dummy.matrix );
        //     p2.push([xy.x, xy.y, 0])
        // }
        this.mesh.instanceMatrix.needsUpdate = true;
        this.mesh.geometry.setDrawRange( 0, this.max_instances);
    }

    reset_instances() {
        // var [lx,ly,lz] = this.xyz_grid_partition(this.max_instances)
        const grid = this.grid_size
        var [lx,ly,lz] = [grid.x, grid.y, this.max_action_maps]
        const grid_space = new Space(0,[[0,undefined]],['z', lz],['y', ly],['x', lx])
        const scale_space = new Space(0,[[0,undefined]], ['scales',SuperPosition.scale],['z', 16],['y', 16],['x', 16])

        // var sg = new Space(0,[[0,undefined]],['z', 4],['y', 4],['x', 4]).generator()
        // let result = sg.next();
        // while (!result.done) {
        //     console.log(result.value); // 1 3 5 7 9
        //     result = sg.next();
        // }

        const dummy = new THREE.Object3D();
        let [p1, p2] = [[],[]]
        var [hlx,hly,hlz] = [lx/2,ly/2,lz/2]
        for(const i of grid_space.generator()){ 
            var [z,y,x] = i[2]
            // var [x,y,z] = [x-hlx, y-hly, z-hlz]
            var [x,y,z] = [x-hlx, y-hly, z]
            // var [x,y,z] = [x-hlx, y-hly, z]
            var {scale, size} = SuperPosition.scale[ i[1]%SuperPosition.scale.length ];
            scale = scale || 1;
            const Z = size * scale
            // const Z = 0
            dummy.position.set((x*42.0), (y*42.0),Z+(z*-42.0));
            dummy.scale.multiplyScalar( Z)
            dummy.updateMatrix();
            this.mesh.setMatrixAt( i[1], dummy.matrix );
            new Instance(this, `instance ${i[1]}`, i[1])
            // p1.push([x*42.0,y*42.0,z*42.0])
        }
        this.mesh.instanceMatrix.needsUpdate = true;
        this.mesh.geometry.setDrawRange( 0, this.max_instances);
    }


    test_rotation(instance_index){
        var matrix = new THREE.Matrix4(); // create one and reuse it
        const dummy = new THREE.Object3D();
        this.mesh.getMatrixAt(instance_index, matrix);
        matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
        const view_vector = dummy.position-this.camera.camera.position

    }
    
    setup_geometry() {
        const max_instances = this.max_instances
        const slot_count = this.slot_count
        const geometry = new THREE.InstancedBufferGeometry().copy(new THREE.PlaneBufferGeometry( 20, 20));
        const index = new Float32Array(max_instances * 1); // index
        for (let i = 0; i < max_instances; i++ ){  
            // index[i] = i*1.0  /* index[i] = 0.0  */ 
            // index[i] = (i%slot_count)*1.0  /* index[i] = 0.0  */ 
            index[i] = 0.0
        }
        geometry.setAttribute("index", new THREE.InstancedBufferAttribute(index, 1));
        const texture_index = new Float32Array(max_instances * 1); // texture_index
        const max_maps = this.max_action_maps
        for (let i = 0; i < max_instances; i++ ){  
            // texture_index[i] = (i%3)*1.0  /* index[i] = 0.0  */ 
            texture_index[i] = 0.0
            // texture_index[i] = (Math.floor(i/slot_count) % max_maps)*1.0  /* index[i] = 0.0  */ 
        }
        geometry.setAttribute("texture_index", new THREE.InstancedBufferAttribute(texture_index, 1));

        const textures = this.create_action_maps()
        // const textures = getTextures()

        const grid_xy = this.grid_size
        let mesh = new THREE.InstancedMesh( geometry,
            new THREE.RawShaderMaterial({
                uniforms: {
                    textures: { type: 'tv', value: textures } ,
                    rows_cols: { value: new THREE.Vector2(grid_xy.x*1.0, grid_xy.y*1.0) },
                    camera_location: { value: this.camera.camera.position }
                },
                // vertexShader: this.getVertexShader(),
                vertexShader: vertex_shader,
                // fragmentShader: this.getFragmentShader(textures.length),
                fragmentShader: fragment_shader(textures.length),
                side: THREE.DoubleSide,

                // blending: THREE.AdditiveBlending,
                // blending :THREE.NoBlending,
                // alphaTest: 0.1,
                // depthWrite: false,
                // depthTest: false,
                // transparent: true,
                // transparent: true,

                alphaTest: 0.5,
                transparent: true,
            }), max_instances );
        // vec2(mod(index,rows)/rows, floor(index/rows)/cols);
        this.mesh = mesh
        this.world.scene.add(mesh);
        this.reset_instance_positions()
    }

    add_instance(name, name_hash, image, index){
        new Instance(this, `instance ${i[1]}`, i[1])
    }

    // constructor(parent, world, object_hash, metadata_dict, resolution, map_size=new THREE.Vector2(512, 512), grid_size=new THREE.Vector2(3.0, 3.0), max_instances=27){
    // constructor(parent, world, object_hash, metadata_dict, resolution, map_size=new THREE.Vector2(512, 512), grid_size=new THREE.Vector2(8.0, 8.0), max_instances=8*8*32){
    // constructor(parent, world, object_hash, metadata_dict, resolution, map_size=new THREE.Vector2(1024, 1024), grid_size=new THREE.Vector2(16.0, 16.0), max_instances=16*16*32){
    // constructor(parent, world, object_hash, metadata_dict, resolution, map_size=new THREE.Vector2(2048, 2048), grid_size=new THREE.Vector2(32.0, 32.0), max_instances=32*32*32){
    // constructor(parent, world, object_hash, metadata_dict, resolution, map_size=new THREE.Vector2(1024, 1024), grid_size=new THREE.Vector2(32.0, 32.0), max_instances=32*32*32){
    constructor(parent, world, object_hash, metadata_dict, resolution, map_size=new THREE.Vector2(2048, 2048), grid_size=new THREE.Vector2(12.0, 12.0), max_instances=1){
		super(null, object_hash, null, parent);
        this.M = metadata_dict;
        this.W = this;
        this.poses = ["captured01", "glamour02", "glamour06", "gym02", "shojo_classic03", "sit_sexy", "standing03", "standing_basic", "standing_old_people",
        "flying01", "glamour03", "glamour07", "pinup01", "shojo_classic04", "sorceress", "standing04", "standing_fitness_competition", "standing_symmetric", "flying02", "glamour04", "glamour08", "shojo_classic01",
        "sit_basic", "standing01", "standing05", "standing_fitness_competition02", "glamour01", "glamour05",
        "gym01", "shojo_classic02", "sit_meditation", "standing02", "standing06", "standing_in_lab"]
        this.world = world;
        this.object_hash = object_hash
        this.max_instances = max_instances
		this.camera = new Camera(resolution)
        // this.instances = []
        this.image_map = new Map()
        this.setup_renderer()
        this.setup_boundaries(map_size, grid_size)
        this.create_space()
        this.setup_geometry()
        this.create_slot()
    }

    get_drawbox(source_image, slot_position_xy, slot_size_xy){
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
    normalize_scale(width, height, depth){
        var [w,h,d] = [false,false,false]
        Math.min()
    }

    scale_slot(image, slot_idx){
        const dummy = new THREE.Object3D();
        // dummy.position.set((x*42.0), (y*42.0),Z+(z*-42.0));
        // dummy.scale.multiplyScalar( Z)
        const matrix = new THREE.Matrix4(); // create one and reuse it
        this.mesh.getMatrixAt(slot_idx, matrix);
        // matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
        dummy.applyMatrix( matrix );
        dummy.scale.set( image.width/100, image.height/100, 1 );
        // dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
        dummy.updateMatrix();
        this.mesh.setMatrixAt( slot_idx, dummy.matrix );
        this.mesh.instanceMatrix.needsUpdate = true;
        this.mesh.geometry.setDrawRange( 0, this.max_instances);
    }
    
    image_to_slot(image, slot_idx, fill=/* "rgb(255,0,0)" */"rgba(0,0,0,0)"){
        const position_xy = this.get_slot_position(slot_idx)
        // const position_xy = new THREE.Vector2(0,0)
        const size_xy = this.get_slot_size()
        const canvas = this.action_maps[0]
        const draw_rect = this.get_drawbox(image, position_xy, size_xy);
        const [sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight] = draw_rect
        if(fill){
            // const fill_style = this.slot.canvas.fillStyle
            // this.slot.canvas.fillStyle = fill;
            // this.slot.canvas.fillRect(0, 0, size_xy.x, size_xy.y);
            // this.slot.canvas.fillStyle = fill_style
            const fill_style = canvas.canvas.fillStyle
            canvas.canvas.fillStyle = "rgb(255,0,0)";//fill;
            canvas.canvas.globalAlpha = 0.5;
            canvas.canvas.fillRect(dx, dy, dWidth, dHeight); //canvas.canvas.fillRect(50,50,75,50);
            canvas.canvas.globalAlpha = 1.0;
            // canvas.canvas.fillRect(0, 0, size_xy.x, size_xy.y);
            canvas.canvas.fillStyle = fill_style

            var imgdata = canvas.canvas.getImageData(dx, dy, dWidth, dHeight);
            var imgdatalen = imgdata.data.length;
            for(var i=0;i<imgdatalen/4;i++){  //iterate over every pixel in the canvas
                imgdata.data[4*i] = 0;    // RED (0-255)
                imgdata.data[4*i+1] = 0;    // GREEN (0-255)
                imgdata.data[4*i+2] = 0;    // BLUE (0-255)
                imgdata.data[4*i+3] = 0;  // APLHA (0-255)
            }
            canvas.canvas.putImageData(imgdata,dx, dy);


            canvas.texture.needsUpdate = true;
        }
        // this.slot.canvas.drawImage(image, ...this.get_drawbox(image, position_xy, size_xy));
        // this.slot.texture.needsUpdate = true;
        // canvas.canvas.drawImage(image, ...this.get_drawbox(image, position_xy, size_xy));
        canvas.canvas.drawImage(image, ...draw_rect);
        canvas.texture.needsUpdate = true;
        this.scale_slot(image, slot_idx)
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
                switch (parseltongue) {
                    case 'image':
                        this.imageElement.src = URL.createObjectURL(payload);
                        const buffer = await payload.arrayBuffer();
                        const metadata = readMetadata(buffer);
                        console.log(metadata)      
                        break;
                    case 'pose':
                        // image.src = data? data:"../../../../../Environments/Medusa/Medallion.png";
                        break;
                    case 'poses':
                        this.poses = await payload.json();
                        break;
                }
                try {
                    let result = await payload.json();
                    result
                } 
                catch (error) {
                    // this.imageElement.src = URL.createObjectURL(payload);
                    var image = document.createElement('img');
                    let sp = this
                    const object_url = URL.createObjectURL(payload);
                    const buffer = await payload.arrayBuffer();
                    const metadata = readMetadata(buffer);
                    // console.log(metadata)                    
                    image.onload = function(e) {
                        // var map = new THREE.Texture( this );
                        // map.needsUpdate = true;
                        // instance_mesh.material.uniforms.textures.value[3] = map
                        // instance_mesh.material.needsUpdate  = true;
                        // sp.image_to_slot(this, 143)

                        // sp.image_to_slot(this, 0)
                        sp.image_hvrp(this, metadata)

                        // sp.upload_slot(0,2)
                        
                    };
                    image.src = object_url
                    return metadata['tEXt'].asset_hash
                }


                // var img = document.createElement('img');
                // img.src = URL.createObjectURL(payload);
                // var texture = new THREE.Texture(img);
                // this.instance_mesh.material.uniforms.textures[0].image.src = texture;
                // this.instance_mesh.material.uniforms.textures[0].image.src = URL.createObjectURL(payload);
                // this.instance_mesh.material.uniforms.textures[0].needsUpdate = true
                // this.instance_mesh.material.needsUpdate = true
                // this.instance_mesh.material.uniforms.textures[0] = map
                // mesh.material.materials[0].map.image = { data: array, width: 20, height: 20 };
                // mesh.material.materials[0].map.needsUpdate = true;

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
    
    image_hvrp(image, metadata){
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

    create_slot(){
        if (this.slot){ this.slot.dispose() }
        const size_xy = this.get_slot_size()
        this.slot = new Canvas(this.renderer, size_xy.x, size_xy.x, 1, 1)
    }

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

    frustum_cull(){
        const frustum = new THREE.Frustum()
        const matrix = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
        frustum.setFromProjectionMatrix(matrix)
        if (!frustum.containsPoint(obj.position)) {
            console.log('Out of view')
        }

        frustum = new THREE.Frustum().setFromProjectionMatrix( camera.projectionMatrix ) //Once you have your frustum, loop through your scene objects to see if they are contained within:
        const visibleObjects = []
        yourScene.traverse( node => {
            if( node.isMesh && ( frustum.containsPoint( node.position ) || frustum.intersectsObject( node ) )){
                visibleObjects.push( node )
            }
        } )

    }
    // update(){

    //     let mat4 = new THREE.Matrix4();

	// 	o.getMatrixAt(idx, mat4);
	// 	mat4.decompose(dummy.position, dummy.quaternion, dummy.scale);
	// 	dummy.position.z = Math.sin(ph.phaseDepth + t * 0.5) * 0.125;
	// 	dummy.rotation.set(
	// 		Math.cos(ph.phaseX + t * Math.sign(ph.phaseX)) * Math.PI * 0.0625,
	// 		Math.sin(ph.phaseY + t * Math.sign(ph.phaseY)) * Math.PI * 0.0625,
	// 		0
	// 	);
	// 	dummy.updateMatrix();
	// 	o.setMatrixAt(idx, dummy.matrix);
	//     o.instanceMatrix.needsUpdate = true;
    // }

    dispose(){
        this.slot.dispose()
        this.action_maps.forEach(action_map => { action_map.dispose() });
        this.material.dispose()
        this.geometry.dispose()
        this.mesh.dispose()
    }

    get dummy_instance(){
        return {
            name: this.object_hash,
            frame_start:0,
            frame_end:0,
            action_start:'idle',
            action_end:'idle',
            location_start:'',
            location_end:'',
            rotation_start:'',
            rotation_end:'',
            scale_start:'', 
            scale_end:'', 
        }
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

    get draw_count(){
        if(this.instances){ return this.instances.length }
        else { return this.max_instances}
    }
    
    set_draw_range(start, stop){
        this.mesh.geometry.setDrawRange( 0, this.draw_count);
    }
    // get scale_geo(){
    //     self.scale = parent.scale  #parent.childscale
    //     denominating_axis_size = Math.max(image_width, image.height)
    //     largest_value = max(tw, th)
    //     reduction_ratio = denominating_axis_size/largest_value
    //     final_width = tw * reduction_ratio
    //     final_height = th * reduction_ratio
    // }


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

    setInstancedMeshPositions(mesh, section) {
        for ( var i = 0; i < mesh.count; i ++ ) {
          var xStaticPosition = -this.sectionWidth * (i - 1);
              var xSectionPosition = this.sectionWidth * section;
              var x = xStaticPosition + xSectionPosition;
              this.dummy.position.set(x, 0, 0);
              this.dummy.updateMatrix();
          mesh.setMatrixAt( i, this.dummy.matrix );
        }
        mesh.instanceMatrix.needsUpdate = true;
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

    transform(camera){
        image = this.image
        if(image){

        }

    }

    set_geometry_attributes(){
        const center = new Float32Array(this.max_instances * 3);
        for (let i = 0; i < this.max_instances; ++i){
            center[i*3] = Math.random()*spaceSize;
            center[i*3 + 1] = Math.random()*spaceSize;
            center[i*3 + 2] = 0;
        }
        this.geometry_data.setAttribute("center", new InstancedBufferAttribute(center, 3));

        const uvOffset = new Float32Array(this.max_instances * 2);
        for (let i = 0; i < this.max_instances; ++i){
            uvOffset[i*2] = Math.floor(Math.random() * (TextureSpace.global_atlas_width - 1)) / TextureSpace.global_atlas_width; // random int between 0 and 4
            uvOffset[i*2 + 1] = Math.floor(Math.random() * (TextureSpace.global_atlas_width - 1)) / TextureSpace.global_atlas_width; // random int between 0 and 4
        }
        this.geometry_data.setAttribute("uvOffset", new InstancedBufferAttribute(uvOffset, 2));
    }


    // addInstancedMesh() {
    //     // An InstancedMesh of 4 cubes
    //     this.geometry_data = new THREE.PlaneBufferGeometry(512, 512)
    //     let mesh = new THREE.InstancedMesh(geometry_data, new THREE.MeshNormalMaterial(), max_instances);
        
    //     this._instancedGeometry.setAttribute("center", new InstancedBufferAttribute(center, 3));
    //     const uvOffset = new Float32Array(this._count * 2);
    //     for (let i = 0; i < this._count; ++i){
    //         uvOffset[i*2] = Math.floor(Math.random() * (5 - 1)) / this._atlasRowNum; // random int between 0 and 4
    //         uvOffset[i*2 + 1] = Math.floor(Math.random() * (5 - 1)) / this._atlasRowNum; // random int between 0 and 4
    //     }
    //     this._instancedGeometry.setAttribute("uvOffset", new InstancedBufferAttribute(uvOffset, 2));
    //     const material = new RawShaderMaterial({
    //         uniforms: {
    //             map: { type: "t", value: this._textureAtlas },
    //             atlasSize: { type: "f", value: this._atlasRowNum }
    //         },
    //         vertexShader: Shaders.vertexShader,
    //         fragmentShader: Shaders.fragmentShader,
    //         transparent: true
    //     });
    //     this._instancedMesh = new InstancedMesh(this._instancedGeometry, material, this._count);
    //     const dummy = new Object3D();
    //     //this._instancedMesh.instanceMatrix.setUsage(DynamicDrawUsage);
    //     dummy.rotation.set(Math.PI / 2, 0, 0);
    //     for (let i = 0; i < this._count; ++i){
    //         dummy.position.set(Math.random()*Constants.SPACE_SIZE, Math.random()*Constants.SPACE_SIZE, Math.random()*0.1);
    //         dummy.updateMatrix();
    //         this._instancedMesh.setMatrixAt(i, dummy.matrix);
    //     }
    //     this._instancedMesh.instanceMatrix.needsUpdate = true;
    //     this._sceneManager.scene.add(this._instancedMesh);


    //     this.world.scene.add(mesh);
    //     this.setInstancedMeshPositions(mesh);
    //     this.mesh_instances.push(mesh)
    // }


    getTexture(canvas) {
        var tex = new THREE.Texture(canvas);
        tex.needsUpdate = true;
        tex.flipY = false;
        return tex;
    }
    
    // update(child){
    //     child.material.map.image = img;
    //     child.material.map.needsUpdate = true;
    //     child.material.uniforms.a.value = getTexture(canvases[0]);
    //     child.material.uniforms.b.value = getTexture(canvases[1]);
    //     child.material.needsUpdate = true;
    // }
    
    

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

    create_superposition(){
        var tile = new Tile();
        tile.setRenderer( this.world.renderer );
        tile.minFilter = tile.magFilter = THREE.NearestFilter;
        tile.generateMipmaps = false;
        var width = 512;
        var height = 512;
        var plane = new THREE.Mesh(
            new THREE.PlaneBufferGeometry( width, height ),
            new THREE.MeshBasicMaterial({ map: tile, side: THREE.DoubleSide, transparent: true,}));
        this.world.scene.add( plane );
        // renderer.render( scene, camera );
        var s = 32;
        tile.setSize( width, height );
        // tile.update_test();


        return tile;
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