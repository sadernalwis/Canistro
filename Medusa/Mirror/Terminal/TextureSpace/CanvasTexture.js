
    vertex_shader = `
        precision highp float;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;

        uniform vec3 cameraPosition;

        attribute vec3 position; // sets the blueprint's vertex positions
        attribute vec3 translation; // x y translation offsets for an instance
        attribute float texIdx; // the texture index to access

        varying float vTexIdx;

        void main() {
            // set point position
            vec3 pos = position + translation;
            vec4 projected = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projected;

            // assign the varyings
            vTexIdx = texIdx;

            // use the delta between the point position and camera position to size point
            float xDelta = pow(projected[0] - cameraPosition[0], 2.0);
            float yDelta = pow(projected[1] - cameraPosition[1], 2.0);
            float zDelta = pow(projected[2] - cameraPosition[2], 2.0);
            float delta  = pow(xDelta + yDelta + zDelta, 0.5);
            gl_PointSize = 40000.0 / delta;
        }`

    
    fragment_shader = `
        precision highp float;

        uniform sampler2D a;
        uniform sampler2D b;

        varying float vTexIdx;

        void main() {
            int textureIndex = int(vTexIdx);
            vec2 uv = vec2(gl_PointCoord.x, gl_PointCoord.y);
            if (textureIndex == 0) { gl_FragColor = texture2D(a, uv); } 
            else if (textureIndex == 1) { gl_FragColor = texture2D(b, uv); }
        }`

  function addPoints(scene) {
    var BA = THREE.BufferAttribute;
    var IBA = THREE.InstancedBufferAttribute;
    var geometry  = new THREE.InstancedBufferGeometry();

    // add data for each observation
    var n = 10000; // number of observations
    var rootN = n**(1/2);
    var cellSize = 20;
    var translation = new Float32Array( n * 3 );
    var texIdx = new Float32Array( n );
    var translationIterator = 0;
    var texIterator = 0;
    for (var i=0; i<n*3; i++) {
        var x = Math.random() * n - (n/2);
        var y = Math.random() * n - (n/2);
        translation[translationIterator++] = x;
        translation[translationIterator++] = y;
        translation[translationIterator++] = Math.random() * n - (n/2);
        texIdx[texIterator++] = (x + y) > (n/8) ? 1 : 0;
    }

    var positionAttr = new BA(new Float32Array( [0, 0, 0] ), 3);
    var translationAttr = new IBA(translation, 3, 1);
    var texIdxAttr = new IBA(texIdx, 1, 1);
    positionAttr.dynamic = true;
    translationAttr.dynamic = true;
    texIdxAttr.dynamic = true;
    geometry.addAttribute('position', positionAttr);
    geometry.addAttribute('translation', translationAttr);
    geometry.addAttribute('texIdx', texIdxAttr);

    var canvases = [
        getElem('canvas', { width: 16384, height: 16384, }),
        getElem('canvas', { width: 16384, height: 16384, }), ];
    var material = new THREE.RawShaderMaterial({
    uniforms: {
        a: { type: 't', value: getTexture(canvases[0]), },
        b: { type: 't', value: getTexture(canvases[1]), }
    },
    vertexShader: document.getElementById('vertex-shader').textContent,
    fragmentShader: document.getElementById('fragment-shader').textContent,
    });
    var mesh = new THREE.Points(geometry, material);
    mesh.frustumCulled = false; // prevent the mesh from being clipped on drag
    scene.add(mesh);

    // Paint the canvas after the initial render
    setTimeout(function() {
    for (var i=0; i<canvases.length; i++) {
        var canvas = canvases[i];
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = i == 0 ? 'red' : 'blue';
        ctx.rect(0, 0, 16384, 16384);
        ctx.fill();
        // marking the material as dirty does not make the colors appear
        scene.children[0].material.needsUpdate = true;
    }
    }, 1000)
}

function getTexture(canvas) {
    var tex = new THREE.Texture(canvas);
    tex.needsUpdate = true;
    tex.flipY = false;
    return tex;
}

function update(scene, canvases){
    scene.children[0].material.uniforms.a.value = getTexture(canvases[0]);
    scene.children[0].material.uniforms.b.value = getTexture(canvases[1]);
    scene.children[0].material.needsUpdate = true;
}

function getElem(tag, obj) {
    var obj = obj || {};
    var elem = document.createElement(tag);
    Object.keys(obj).forEach(function(attr) { elem[attr] = obj[attr]; })
    return elem;
}

addPoints(scene);
render();



    // init() { //https://jsfiddle.net/xvnctbL0/2/
    //     const geometry = new THREE.BufferGeometry();
    //     const positions = new Float32Array( MAX_POINTS * 3 ); // 3 vertices per point
    //     geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    //     drawCount = 2; // draw the first 2 points, only
    //     geometry.setDrawRange( 0, drawCount );
    //     const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
    //     line = new THREE.Line( geometry,  material );
    //     scene.add( line );
    //     updatePositions();
    // }

    // update positions
    animate() {
        requestAnimationFrame( animate );
        drawCount = ( drawCount + 1 ) % MAX_POINTS;
        line.geometry.setDrawRange( 0, drawCount );
        if ( drawCount === 0 ) {
            updatePositions(); // periodically, generate new data
            line.geometry.attributes.position.needsUpdate = true; // required after the first render
            line.material.color.setHSL( Math.random(), 1, 0.5 );
        }
        render();
    }

        // this.geometry.addAttribute("cubePos", new THREE.InstancedBufferAttribute(new Float32Array([
        //   25, 25, 25,
        //   25, 25, -25, -25, 25, 25, -25, 25, -25,
        //   25, -25, 25,
        //   25, -25, -25, -25, -25, 25, -25, -25, -25
        // ]), 3, 1));

        
        // const center = new Float32Array(this.max_instances * 3);
        // for (let i = 0; i < this.this.max_instances; ++i){
        //     center[i*3] = Math.random()*spaceSize;
        //     center[i*3 + 1] = Math.random()*spaceSize;
        //     center[i*3 + 2] = 0;
        // }
        // this.geometry_data.setAttribute("center", new InstancedBufferAttribute(center, 3));

        // const uvOffset = new Float32Array(this.max_instance_count * 2);
        // for (let i = 0; i < this.max_instance_count; ++i){
        //     uvOffset[i*2] = Math.floor(Math.random() * (TextureSpace.global_atlas_width - 1)) / TextureSpace.global_atlas_width; // random int between 0 and 4
        //     uvOffset[i*2 + 1] = Math.floor(Math.random() * (TextureSpace.global_atlas_width - 1)) / TextureSpace.global_atlas_width; // random int between 0 and 4
        // }
        // this.geometry_data.setAttribute("uvOffset", new InstancedBufferAttribute(uvOffset, 2));