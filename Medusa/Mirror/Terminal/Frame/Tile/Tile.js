import { HTML } from '../../../../../../Parseltongue/HTML/HTML.js';
import * as THREE from '../../../../../../text/javascript/threejs/build/three.module.js';
export class Tile extends THREE.Texture{
    constructor( format, type, mapping, wrapS, wrapT, magFilter, minFilter, anisotropy, encoding ) {
        // https://r105.threejsfundamentals.org/threejs/lessons/threejs-canvas-textures.html
        super( null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding );
        var canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        var ctx = canvas.getContext('2d');
        var imageData = ctx.createImageData(1, 1);
        this.image = imageData;
        this.magFilter = magFilter !== undefined ? magFilter : THREE.LinearFilter;
        this.minFilter = minFilter !== undefined ? minFilter : THREE.LinearMipMapLinearFilter;
        this.generateMipmaps = true;
        this.flipY = true;
        this.unpackAlignment = 1;
        this.needsUpdate = true;
        this.isUpdatableTexture = true;
        this.image_map = new Map();
        this.current_image = null;
        this.identity = null;
        this.action = null;
        this.angle = [0,0];
        // this.basic_material = new THREE.MeshBasicMaterial({ map: this, side: THREE.DoubleSide, transparent: true,})
        this.basic_material = new THREE.MeshBasicMaterial({ map: this, side: THREE.DoubleSide})
        // material = new THREE.RawShaderMaterial({
        //     uniforms: {
        //         map: { type: "t", value: this },
        //         atlasSize: { type: "f", value: this._atlasRowNum }
        //     },
        //     vertexShader: Shaders.vertexShader,
        //     fragmentShader: Shaders.fragmentShader,
        //     transparent: true
        // });
    }

    setRenderer( renderer ) {
        this.renderer = renderer;
        this.gl = this.renderer.getContext()
        this.utils = THREE.WebGLUtils(this.gl, this.renderer.extensions, this.renderer.capabilities )

    }


    setSize( width, height ) {
        if( width === this.width && height === this.height ) return;
        var textureProperties = this.renderer.properties.get( this );
        if( !textureProperties.__webglTexture ) return;
        this.width = width;
        this.height = height;
        var activeTexture = this.gl.getParameter( this.gl.TEXTURE_BINDING_2D );
        this.gl.bindTexture( this.gl.TEXTURE_2D, textureProperties.__webglTexture );
        if( !textureProperties.__webglTexture ) this.width = null;
        this.gl.texImage2D( this.gl.TEXTURE_2D, 0, this.utils.convert( this.format ), width, height, 0, this.utils.convert( this.format ), this.utils.convert( this.type ), null);
        this.gl.bindTexture( this.gl.TEXTURE_2D, activeTexture );
    }

    write( src, x, y ) {
        var textureProperties = this.renderer.properties.get( this );
        if( !textureProperties.__webglTexture ) return;
        var activeTexture = this.gl.getParameter( this.gl.TEXTURE_BINDING_2D );
        this.gl.bindTexture( this.gl.TEXTURE_2D, textureProperties.__webglTexture );
        let target  = this.gl.TEXTURE_2D
        let level   = 0
        let xoffset = 0
        let yoffset = 0
        let width   = src.width
        let height  = src.height
        let format  = this.utils.convert( this.format )
        let type    = this.utils.convert( this.type )
        let source  = src 
        // this.gl.texSubImage2D( this.gl.TEXTURE_2D, 0, x, this.height - y - src.height, this.utils.convert( this.format ), this.utils.convert( this.type ), src );
        // this.gl.texSubImage2D( this.gl.TEXTURE_2D, 0, 0, 0, this.utils.convert( this.format ), this.utils.convert( this.type ), src );
        this.gl.texSubImage2D( target, level, xoffset, yoffset, width, height, format, type, source);
        this.gl.generateMipmap( this.gl.TEXTURE_2D );
        this.gl.bindTexture( this.gl.TEXTURE_2D, activeTexture );
    }
    
    update(){
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
            // tile.setSize( img.width, img.height );
            tile.write( img, 0, 0 )
        }
        img.src = "../../../../../Environments/Medusa/Medallion.png";
    }

    update_test2() {
        var color = `rgb(${~~(Math.random()*255)},${~~(Math.random()*255)},${~~(Math.random()*255)})`;
        let dis = this;
        var s = 32;
        let width = 512;
        let height = 512;
        for( var y = 0; y < height; y += s ){
            for( var x = 0; x < width; x += s ) {
                (function( x, y ) {
                    function generate() {
                        var canvas = document.createElement( 'canvas' );
                        canvas.width = canvas.height = s;
                        var ctx = canvas.getContext( '2d' );
                        ctx.fillStyle = color;
                        ctx.fillRect( 0, 0, s, s );
                        ctx.globalAlpha = .5;
                        ctx.strokeStyle = '#000000'
                        ctx.beginPath();
                        ctx.moveTo( s, 0 );
                        ctx.lineTo( s, s );
                        ctx.lineTo( 0, s );
                        ctx.stroke();
                        ctx.strokeStyle = '#ffffff'
                        ctx.beginPath();
                        ctx.moveTo( s, 0 );
                        ctx.lineTo( 0, 0 );
                        ctx.lineTo( 0, s );
                        ctx.stroke();
                        dis.update( canvas, x, y );
                    }
                    setTimeout( generate, 500 * Math.random() );
                })( x, y );
            }
        }
        setTimeout( this.update_test, 1000 );
    }

}

