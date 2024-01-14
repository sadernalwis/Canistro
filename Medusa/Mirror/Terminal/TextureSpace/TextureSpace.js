import { Program } from "../../Program.js";
import { readMetadata, meta_test, meta_post_test } from "./Image/PNG/Metadata/Metadata.js";

export class TextureSpace extends Program{
    static global_atlas_width = 16
    static vertex_shader = `
        precision highp float;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        attribute vec3 position;
        attribute vec2 uv;
        attribute mat4 instanceMatrix;
        attribute vec3 center;
        attribute vec2 uvOffset;
        uniform float atlasSize;
        varying vec2 vUv;
        void main(){
            vUv = uvOffset + (uv / atlasSize);
            gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
        } `

    static fragment_shader =  `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D map;
        void main(){
            gl_FragColor = texture2D(map, vUv);
        }`
    static images = new Map()

    set_geometry_attributes(){
        const center = new Float32Array(this.max_instance_count * 3);
        for (let i = 0; i < this.max_instance_count; ++i){
            center[i*3] = Math.random()*spaceSize;
            center[i*3 + 1] = Math.random()*spaceSize;
            center[i*3 + 2] = 0;
        }
        this.geometry_data.setAttribute("center", new InstancedBufferAttribute(center, 3));

        const uvOffset = new Float32Array(this.max_instance_count * 2);
        for (let i = 0; i < this.max_instance_count; ++i){
            uvOffset[i*2] = Math.floor(Math.random() * (TextureSpace.global_atlas_width - 1)) / TextureSpace.global_atlas_width; // random int between 0 and 4
            uvOffset[i*2 + 1] = Math.floor(Math.random() * (TextureSpace.global_atlas_width - 1)) / TextureSpace.global_atlas_width; // random int between 0 and 4
        }
        this.geometry_data.setAttribute("uvOffset", new InstancedBufferAttribute(uvOffset, 2));
    }

    addInstancedMesh() {
        // An InstancedMesh of 4 cubes
        this.geometry_data = new THREE.PlaneBufferGeometry(512, 512)
        let mesh = new THREE.InstancedMesh(geometry_data, new THREE.MeshNormalMaterial(), 10);
        
        this._instancedGeometry.setAttribute("center", new InstancedBufferAttribute(center, 3));
        const uvOffset = new Float32Array(this._count * 2);
        for (let i = 0; i < this._count; ++i){
            uvOffset[i*2] = Math.floor(Math.random() * (5 - 1)) / this._atlasRowNum; // random int between 0 and 4
            uvOffset[i*2 + 1] = Math.floor(Math.random() * (5 - 1)) / this._atlasRowNum; // random int between 0 and 4
        }
        this._instancedGeometry.setAttribute("uvOffset", new InstancedBufferAttribute(uvOffset, 2));
        const material = new RawShaderMaterial({
            uniforms: {
                map: { type: "t", value: this._textureAtlas },
                atlasSize: { type: "f", value: this._atlasRowNum }
            },
            vertexShader: Shaders.vertexShader,
            fragmentShader: Shaders.fragmentShader,
            transparent: true
        });
        this._instancedMesh = new InstancedMesh(this._instancedGeometry, material, this._count);
        const dummy = new Object3D();
        //this._instancedMesh.instanceMatrix.setUsage(DynamicDrawUsage);
        dummy.rotation.set(Math.PI / 2, 0, 0);
        for (let i = 0; i < this._count; ++i){
            dummy.position.set(Math.random()*Constants.SPACE_SIZE, Math.random()*Constants.SPACE_SIZE, Math.random()*0.1);
            dummy.updateMatrix();
            this._instancedMesh.setMatrixAt(i, dummy.matrix);
        }
        this._instancedMesh.instanceMatrix.needsUpdate = true;
        this._sceneManager.scene.add(this._instancedMesh);


        this.world.scene.add(mesh);
        this.setInstancedMeshPositions(mesh);
        this.mesh_instances.push(mesh)
    }

    constructor(object_hash){
        this.object_hash = object_hash
        this.image_map = new Map()
        this.hvp = null
        this.location = null
        this.rotation = null
        this.image_hash = null
    }

    getTexture(canvas) {
        var tex = new THREE.Texture(canvas);
        tex.needsUpdate = true;
        tex.flipY = false;
        return tex;
    }
    
    update(child){
        child.material.map.image = img;
        child.material.map.needsUpdate = true;
        child.material.uniforms.a.value = getTexture(canvases[0]);
        child.material.uniforms.b.value = getTexture(canvases[1]);
        child.material.needsUpdate = true;
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
        
    async incoming(event, p_key, data){
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
                image.src = URL.createObjectURL(data);
                const buffer = await blob.arrayBuffer();
                metadata = readMetadata(buffer);

                break;
            default:
                // submitter.src = data? data:"../../../../../Environments/Medusa/Medallion.png";
                break;
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