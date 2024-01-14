export const fragment_shader = (texture_count)=>{
    var fragShader =  `
        precision highp float;
        uniform sampler2D textures[${texture_count}];
        varying float vTexIndex;
        varying vec2 vUv;
        varying vec4 transformed_normal;

        void main() {
            vec4 finalColor;
            `;
          for(var i = 0; i < texture_count; i++){
            if(i == 0){ 
              fragShader += `if (vTexIndex < ${i}.5) {
                finalColor = texture2D(textures[${i}], vUv);
                }
              `
            }
            else{
              fragShader += `else if (vTexIndex < ${i}.5) {
                finalColor = texture2D(textures[${i}], vUv);
                }
              `
            }
          }
        // fragShader += `gl_FragColor = finalColor * transformed_normal; }`;
        fragShader += `gl_FragColor = finalColor; }`;
        // fragShader += `gl_FragColor = startColor * finalColor; }`;   
        // int index = int(v_TexIndex+0.5); //https://stackoverflow.com/questions/60896915/texture-slot-not-getting-picked-properly-in-shader-issue
        console.log('frag shader: ', fragShader)
        return fragShader;
}