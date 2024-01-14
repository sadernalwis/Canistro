export const vertex_shader = `
#define PI 3.1415926538
precision highp float;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
attribute vec3 position;
attribute vec2 uv;
attribute mat4 instanceMatrix;
attribute float index;
attribute float texture_index;
uniform vec2 rows_cols;
uniform vec3 camera_location;

varying float vTexIndex;
varying vec2 vUv;
varying vec4 transformed_normal;

float angle_to_index(float angle1, float angle2){
    // float range = rows_cols.x*rows_cols.y;
    // angle1 = angle1/PI*180.0 + 180.0;
    // angle1 = degrees(angle1);
    if (0.0<=angle1 && angle1<=360.0){
        return floor(angle1/(360.0/rows_cols.x));
    }
    return 0.0;
}

float lengths_to_index(float length1, float length2){
    // float angle1 = atan(length1, length2)/PI*180.0 + 180.0; // Quadrant- 10 limit
    // float angle1 = atan(length1, -length2)/PI*180.0 + 180.0;  // Quadrant- 10 limit
    // float angle1 = atan(-length1, length2)/PI*180.0 + 180.0; // Quadrant- 20 limit
    // float angle1 = atan(-length1, -length2)/PI*180.0 + 180.0; // Quadrant- 20 limit

    // float angle1 = atan(length2, length1)/PI*180.0 + 180.0;  // Quadrant- 20 limit
    // float angle1 = atan(length2, -length1)/PI*180.0 + 180.0; // Quadrant- 20 limit
    // float angle1 = atan(-length2, length1)/PI*180.0 + 180.0; //  Quadrant- 36 limit
    // float angle1 = atan(-length2, -length1)/PI*180.0 + 180.0;  // Quadrant- 20 limit

    // float angle1 = degrees(atan(length1, length2));
    // float angle1 = degrees(atan(length1, -length2));
    // float angle1 = degrees(atan(-length1, length2)); // Quadrant- 10 limit
    // float angle1 = degrees(atan(-length1, -length2));  // Quadrant- 10 limit

    // float angle1 = degrees(atan(length2, length1)); // 1-18
    // float angle1 = degrees(atan(length2, -length1));
    // float angle1 = degrees(atan(-length2, length1)); //
    // float angle1 = degrees(atan(-length2, -length1));


    float radians = atan(length2, length1);
    // float radians = atan(length1, length2);
    // float radians = atan(length2, -length1);
    // float radians = atan(-length2, length1);
    // float radians = atan(-length2, -length1);
    float angle1 = radians * 180.0 / PI;
    if (radians < 0.0) { angle1 += 360.0;  }

    if (0.0<=angle1 && angle1<=360.0){
        return floor(angle1/(360.0/rows_cols.x));
    }
    return 0.0;
}

float view_to_index(vec4 view_normal, vec4 model_normal, mat4 rot_matrix){
    vec4 upvector = vec4(0, 1.0, 0, 1.0);
    view_normal = normalize(view_normal);
    model_normal = normalize(model_normal);

    float view_x_length = normalize(dot(view_normal, normalize(rot_matrix * vec4(1.0,0,0, 1.0))));
    float view_y_length = normalize(dot(view_normal, normalize(rot_matrix * vec4(0,1.0,0, 1.0))));
    float view_z_length = normalize(dot(view_normal, normalize(rot_matrix * vec4(0,0,1.0, 1.0))));
    // float view_x_length = dot(vec4(1.0,0,0, 1.0), view_normal);
    // float view_y_length = dot(vec4(0,1.0,0, 1.0), view_normal);
    // float view_z_length = dot(vec4(0,0,1.0, 1.0), view_normal);
    
    // float radians = atan(view_x_length, view_z_length);
    // float radians = atan(-view_x_length, -view_z_length);
    // float radians = atan(-view_z_length, -view_x_length);
    float radians = atan(view_z_length, view_x_length);
    // float radians = atan(length1, length2);
    // float radians = atan(length2, -length1);
    // float radians = atan(-length2, length1);
    // float radians = atan(-length2, -length1);
    float angle1 = radians * 180.0 / PI;
    if (radians < 0.0) { angle1 += 360.0;  }

    if (0.0<=angle1 && angle1<=360.0){
        return floor(angle1/(360.0/rows_cols.x));
    }
    return 0.0;
}
    // https://stackoverflow.com/questions/26070410/robust-atany-x-on-glsl-for-converting-xy-coordinate-to-angle
    float angleInDegrees(vec3 ini, vec3 end) { //https://stackoverflow.com/questions/1311049/how-to-map-atan2-to-degrees-0-360
        // An alternative solution is to use the mod () function defined as:
        // function mod(a, b) {return a - Math.floor (a / b) * b;}
        // Then, with the following function, the angle between ini(x,y) and end(x,y) points is obtained. The angle is expressed in degrees normalized to [0, 360] deg. and North referencing 360 deg.
        float radian = atan/* 2 */((end.y - ini.y), (end.x - ini.x));//radian [-PI,PI]
        // return mod(radian * 180 / Math.PI + 90, 360);
        return 0.0;

        // double degree = fmodf((atan2(x, y) * (180.0 / M_PI)) + 360, 360); // This will return degree from 0°-360° counter-clockwise, 0° is at 3 o'clock.
        // theta_rad = atan2(y,x); // @erikkallen is close but not quite right.
        // theta_deg = (theta_rad/M_PI*180) + (theta_rad > 0 ? 0 : 360);
        // theta_deg = fmod(atan2(y,x)/M_PI*180,360); // This should work in C++: (depending on how fmod is implemented, it may be faster or slower than the conditional expression)
        // theta_deg = atan2(-y,-x)/M_PI*180 + 180; //// Alternatively, since (x,y) and (-x,-y) differ in angles by 180 degrees.

        // // @Jason S: your "fmod" variant will not work on a standards-compliant implementation. The C standard is explicit and clear (7.12.10.1, "the fmod functions"):
        // if y is nonzero, the result has the same sign as x 
        // fmod(atan2(y,x)/M_PI*180,360) //thus,
        // atan2(y,x)/M_PI*180 //is actually just a verbose rewriting of:
        // Your third suggestion, however, is spot on.
        
        // Here's some javascript. Just input x and y values.
        // var angle = (Math.atan2(x,y) * (180/Math.PI) + 360) % 360;

        // angle = Math.atan2(x,y)*180/Math.PI;//I have made a Formula for orienting angle into 0 to 360        
        // angle + Math.ceil( -angle / 360 ) * 360;

        // float rads = atan2(y, x);
        // if (y < 0) rads = M_PI*2.f + rads;
        // float degrees = rads*180.f/M_PI;
        


        // I have 2 solutions that seem to work for all combinations of positive and negative x and y.
        // 1) Abuse atan2()
        // According to the docs atan2 takes parameters y and x in that order. However if you reverse them you can do the following:
        // double radians = std::atan2(x, y);
        // double degrees = radians * 180 / M_PI;
        // if (radians < 0) { degrees += 360;  }

        // 2) Use atan2() correctly and convert afterwards
        // double degrees = std::atan2(y, x) * 180 / M_PI;
        // if (degrees > 90){ degrees = 450 - degrees; }
        // else { degrees = 90 - degrees; }

        // Just add 360° if the answer from atan2 is less than 0°.

        // if you don't like branching, just negate the two parameters and add 180° to the answer.
        // (Adding 180° to the return value puts it nicely in the 0-360 range, but flips the angle. Negating both input parameters flips it back.)
        
        // (x > 0 ? x : (2*PI + x)) * 360 / (2*PI)
        // Probably also want x >= 0 for the x = 0 case
        // For those not comfortable with this notation, and without the conversion to degrees built in: 
        // if(x>0) {radians = x;} else {radians = 2*PI + x;} so we are just adding 2PI to the result if it is less than 0. Or ,
        // (x >= 0 ? x : (2*PI + x)) * 180/PI as in (x < 0 ? 2*PI + x : x) * 180/PI

        // float ATan2(vec2 dir){ //https://github.com/google/filament/issues/1531
        //     float angle = asin(dir.x) > 0 ? acos(dir.y) : -acos(dir.y);
        //     return angle; }
        // https://thebookofshaders.com/05/
        // https://glslsandbox.com/e#79708.0
    }

    float normal_to_orbit(vec3 rotation_vector, vec3 view_vector, mat4 rot_matrix){

    //   normal_to_orbit( new THREE.Vector3(10,10,10))
    //   normal_to_orbit( new THREE.Vector3(0,-10,10))
        rotation_vector = normalize(rotation_vector);
        view_vector = normalize(view_vector);
        vec3 x_direction = vec3(1.0,0,0);
        vec3 y_direction = vec3(0,1.0,0);
        vec3 z_direction = vec3(0,0,1.0);

        float rotation_x_length = dot(rotation_vector, x_direction);
        float rotation_y_length = dot(rotation_vector, y_direction);
        float rotation_z_length = dot(rotation_vector, z_direction);

        float view_x_length = dot(view_vector, x_direction);
        float view_y_length = dot(view_vector, y_direction);
        float view_z_length = dot(view_vector, z_direction);

        // //TOP 
        // float top_rotation = degrees(atan(rotation_x_length, rotation_z_length));
        // float top_view = degrees(atan(view_x_length, view_z_length));
        // float top_final = top_view-top_rotation;
        // float top_idx = floor(top_final/(360.0/rows_cols.x));
        // //FRONT
        // float front_rotation = degrees(atan(rotation_x_length, rotation_z_length));
        // float front_view = degrees(atan(view_x_length, view_z_length));
        // float front_final = front_view-front_rotation;
        // float front_idx = floor(front_final/(360.0/rows_cols.y));
        
        //TOP Y-ROT
        // float top_rotation = degrees(atan(rotation_x_length, rotation_z_length));
        // float top_rotation =  atan(-rotation_x_length, -rotation_z_length)/PI*180.0 + 180.0;
        float top_rotation =  atan(-rotation_x_length, -rotation_z_length);

        // float top_view = degrees(atan(view_x_length, view_z_length));
        float top_view = atan(-view_x_length, -view_z_length)/PI*180.0 + 180.0;
        float top_final = top_view-top_rotation;
        float top_idx = floor(top_final/(360.0/rows_cols.x));
        //SIDE X-ROT
        // float front_rotation = degrees(atan(rotation_x_length, rotation_z_length));
        float front_rotation = atan(-rotation_x_length, -rotation_z_length)/PI*180.0 + 180.0;
        // float front_view = degrees(atan(view_y_length, view_z_length));
        float front_view = atan(-view_y_length, -view_z_length)/PI*180.0 + 180.0;
        float front_final = front_view-front_rotation;
        float front_idx = floor(front_final/(360.0/rows_cols.y));
        
        return abs((front_idx*rows_cols.x)+top_idx);
        // return angle_to_index(top_view, front_view);
        // return angle_to_index(top_rotation, front_view);
        // return angle_to_index(top_rotation, front_view);
        // return lengths_to_index(rotation_x_length, rotation_z_length);
        // return lengths_to_index(view_x_length, view_z_length);
        // return view_to_index(view_vector, rotation_vector, rot_matrix);

        // console.clear()
        // console.log('X', Math.atan2(x_length, y_length) * 180 / Math.PI)
        // console.log('Y', Math.atan2(y_length, x_length, ) * 180 / Math.PI)
        // console.log(top_idx, front_idx, final_idx)
    }

mat4 rotationMatrix(vec3 axis, float angle){
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}
      
vec3 extractEulerAngleXYZ(mat4 mat) {
    vec3 rotangles = vec3(0,0,0);
    rotangles.x = atan(mat[2].z, -mat[1].z);
    float cosYangle = sqrt(pow(mat[0].x, 2.0) + pow(mat[0].y, 2.0));
    rotangles.y = atan(cosYangle, mat[0].z);
    float sinXangle = sin(rotangles.x);
    float cosXangle = cos(rotangles.x);
    rotangles.z = atan(cosXangle * mat[1].y + sinXangle * mat[2].y, cosXangle * mat[1].x + sinXangle * mat[2].x);
    return rotangles;
}

    float view_index2(vec3 position, mat4 mv_matrix, mat4 rot_matrix){
        vec4 posInView = mv_matrix * vec4(0.0, 0.0, 0.0, 1.0);
        // posInView /= posInView[3];
        vec3 VinView = normalize(-posInView.xyz); // (0, 0, 0) - posInView
        // vec4 NinView = normalize(rot_matrix * vec4(0.0, 0.0, 1.0, 1.0));
        // float NdotV = dot(NinView, VinView);
        vec4 view_normal = rot_matrix * vec4(VinView.xyz, 1.0);
        float view_x_length = dot(view_normal.xyz, vec3(1.0,0,0));
        float view_y_length = dot(view_normal.xyz, vec3(0,1.0,0));
        float view_z_length = dot(view_normal.xyz, vec3(0,0,1.0));
        // float radians = atan(-view_x_length, -view_z_length);
        float radians = atan(view_x_length, view_z_length);
        // float angle = radians/PI*180.0 + 180.0;
        float angle = degrees(radians);
        if (radians < 0.0) { angle += 360.0;  }
        if (0.0<=angle && angle<=360.0){
            return floor(angle/(360.0/rows_cols.x));
        }
        return 0.0;

    }
	vec2 offset_uv2(vec2 uv, mat4 mv_matrix, mat4 rot_matrix){
        vec4 posInView = mv_matrix * vec4(0.0, 0.0, 0.0, 1.0);
        vec3 VinView = normalize(-posInView.xyz); // (0, 0, 0) - posInView
        vec4 view_normal = rot_matrix * vec4(VinView.xyz, 1.0);
          vec2 dd = normalize(view_normal.xy); 
        float u = atan(dd.y, dd.x); 
        float v = acos(view_normal.z); 
        return (vec2(u, v) + uv) / rows_cols;
        
      }
      
    float offset_index3(vec3 uv, mat4 mv_matrix, mat4 rot_matrix){
        vec4 posInView = mv_matrix * vec4(0.0, 0.0, 0.0, 1.0);
        vec3 VinView = normalize(-posInView.xyz); // (0, 0, 0) - posInView
        vec4 view_normal = rot_matrix * vec4(VinView.xyz, 1.0);
          //vec2 dd = normalize(view_normal.xy); 
        
        /* p = q'*(obj-cam)*q */
          vec3 p = normalize(view_normal.xyz); 
        float az = atan(p.x,-p.z);
        float el = asin(p.y/sqrt(p.x*p.x + p.y*p.y + p.z*p.z));
        
        float radians = el;
        float rad_x = az;
        float ang_x = degrees(rad_x);
        float rad_y = el;
        float ang_y = degrees(rad_y);
        
        if (rad_x < 0.0) { ang_x += 180.0;  }
        if (rad_y < 0.0) { ang_y += 180.0;  }
        /* if (0.0<=angle && angle<=360.0){
          return floor(angle/(360.0/rows_cols.x));
        }
        return 0.0; */
            
        float x_idx = floor(ang_x/(360.0/rows_cols.x));
        float y_idx = floor(ang_y/(360.0/rows_cols.y));
        return abs((y_idx*rows_cols.x)+x_idx);
        
        // float x_idx = floor(rad_x/(360.0/rows_cols.x));
        // float y_idx = floor(rad_y/(360.0/rows_cols.y));
        // return abs((y_idx*rows_cols.x)+x_idx);
        
        /* if (radians < 0.0) { angle += 360.0;  }
        if (0.0<=angle && angle<=360.0){
          return floor(angle/(360.0/rows_cols.x));
        }
        return 0.0; */
        
        //float u = atan(dd.y, dd.x); 
        //float v = acos(view_normal.z); 
        /* return (vec2(az, el) + uv) / rows_cols */;
        
      }
      
	float offset_index(vec3 uv, mat4 mv_matrix, mat4 rot_matrix){
        vec4 posInView = mv_matrix * vec4(0.0, 0.0, 0.0, 1.0);
        vec3 VinView = normalize(-posInView.xyz); // (0, 0, 0) - posInView
        vec4 view_normal = rot_matrix * vec4(VinView.xyz, 1.0);
          //vec2 dd = normalize(view_normal.xy); 
        
        /* p = q'*(obj-cam)*q */
          vec3 p = normalize(view_normal.xyz); 
        float az = atan(p.x,-p.z);
        float el = asin(p.y/sqrt(p.x*p.x + p.y*p.y + p.z*p.z));
        
        float radians = el;
        float rad_x = az;
        float ang_x = degrees(rad_x);
        float rad_y = el;
        float ang_y = degrees(rad_y);
        
        if (rad_x < 0.0) { ang_x += 180.0;  }
        //if (rad_y < 0.0) { ang_y += 90.0;  }
        ang_y += 90.0;
        if (0.0<=ang_y && ang_y<=180.0){
          return floor(ang_y/(180.0/rows_cols.y));
        }
        return 0.0;
            
        //float x_idx = floor(ang_x/(360.0/rows_cols.x));
        //float y_idx = floor(ang_y/(360.0/rows_cols.y));
        //return abs((y_idx*rows_cols.x)+x_idx);
        
        // float x_idx = floor(rad_x/(360.0/rows_cols.x));
        // float y_idx = floor(rad_y/(360.0/rows_cols.y));
        // return abs((y_idx*rows_cols.x)+x_idx);
        
        /* if (radians < 0.0) { angle += 360.0;  }
        if (0.0<=angle && angle<=360.0){
          return floor(angle/(360.0/rows_cols.x));
        }
        return 0.0; */
        
        //float u = atan(dd.y, dd.x); 
        //float v = acos(view_normal.z); 
        /* return (vec2(az, el) + uv) / rows_cols */;
        
      }
    

void main(){
    // vec4 original_normal = vec4(0.0, 0.0, 1.0, 1.0);
    // // transformed_normal = modelViewMatrix * instanceMatrix * original_normal;
    // vec3 rotangles = extractEulerAngleXYZ(modelViewMatrix * instanceMatrix);
    // // transformed_normal = vec4(rotangles.xyz, 1.0);
    // transformed_normal = vec4(camera_location.xyz, 1.0);
    
    
    // vec4 model_center = (modelViewMatrix* instanceMatrix* vec4(0.0, 0.0, 0.0, 1.0));
    // vec4 model_normal = (modelViewMatrix* instanceMatrix* vec4(0.0, 0.0, 1.0, 1.0));

    mat4 base_matrix = modelViewMatrix* instanceMatrix;
    vec3 rotangles = extractEulerAngleXYZ(base_matrix);
    mat4 x_rot_matrix = rotationMatrix(vec3(1.0, 0.0, 0.0), rotangles.x);
    mat4 y_rot_matrix = rotationMatrix(vec3(0.0, 1.0, 0.0), rotangles.y);
    mat4 z_rot_matrix = rotationMatrix(vec3(0.0, 0.0, 1.0), rotangles.z);
    mat4 combined_rot = x_rot_matrix * y_rot_matrix * z_rot_matrix;

    // vec4 cam_loc = vec4(camera_location.xyz, 1.0);
    // vec4 view_vector = normalize((cam_loc-model_center));
    // // float findex = normal_to_orbit(model_normal.xyz, view_vector.xyz, );
    
    // vec4 model_normal_2 = normalize(combined_rot * vec4(0.0, 0.0, 1.0, 1.0));

    // // float findex = normal_to_orbit(model_normal_2.xyz, view_vector.xyz, combined_rot);
    // float findex = view_to_index(model_normal_2, view_vector, combined_rot);
    
    vTexIndex = texture_index;
    // findex = angle_to_index(findex);
    // float findex = view_index(position, base_matrix, combined_rot);
    //float findex = offset_index(position, base_matrix, combined_rot);
    float findex = offset_index(position, base_matrix, combined_rot);
    // vUv = vec2(mod(findex,rows_cols.x)/rows_cols.x, floor(findex/rows_cols.x)/rows_cols.y) + (uv / rows_cols);
    /* vUv = offset_uv(uv, base_matrix, combined_rot) */
    vUv = vec2(mod(index,rows_cols.x)/rows_cols.x, floor(index/rows_cols.x)/rows_cols.y) + (uv / rows_cols);
    
    // vec4 v = (modelViewMatrix* instanceMatrix* vec4(0.0, 0.0, 0.0, 1.0)) + vec4(position.x, position.y, 0.0, 0.0) * vec4(1.0, 1.0, 1.0, 1.0);
    // vec4 v = (modelViewMatrix* instanceMatrix* vec4(0.0, 0.0, 0.0, 1.0)) + vec4(position.x, position.y, 0.0, 0.0);
    // gl_Position = projectionMatrix * v;

    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
}
`

export const vertex_shader2 = `
precision highp float;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
attribute vec3 position;
attribute vec2 uv;
attribute mat4 instanceMatrix;
attribute float index;
attribute float texture_index;
uniform vec2 rows_cols;
uniform vec3 camera_location;

varying float vTexIndex;
varying vec2 vUv;
varying vec4 transformed_normal;

mat4 rotationMatrix(vec3 axis, float angle){
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

// float angleBetween(// https://stackoverflow.com/questions/31064234/find-the-angle-between-two-vectors-from-an-arbitrary-origin
//     glm::vec3 a,
//     glm::vec3 b,
//     glm::vec3 origin
//    ){
//     glm::vec3 da=glm::normalize(a-origin);
//     glm::vec3 db=glm::normalize(b-origin);
//     return glm::acos(glm::dot(da, db));
// }


// void main2(){
//     color = in_color;
//     mat4 rotate_x, rotate_y, rotate_z;
//     mat4 translate1, translate2; 
//     mat4 scale_double, scale_half;

//     translate1 = mat4(1.0, 0.0, 0.0, -0.5, 
//                     0.0, 1.0, 0.0, -0.25, 
//                     0.0, 0.0, 1.0, 0.0,  
//                     0.0, 0.0, 0.0, 1.0);

//     translate2 = mat4(1.0, 0.0, 0.0, 0.5, 
//                     0.0, 1.0, 0.0, 0.25,  
//                     0.0, 0.0, 1.0, 0.0,  
//                     0.0, 0.0, 0.0, 1.0);
// translate1 = mat4(1.0, 0.0, 0.0, 0.0,  0.0, 1.0, 0.0, 0.0,  0.0, 0.0, 1.0, 0.0,  -0.5, -0.25, 0.0, 1.0);


//     scale_double = mat4(2.0, 0.0, 0.0, 0.0, 
//                 0.0, 2.0, 0.0, 0.0, 
//                 0.0, 0.0, 2.0, 0.0, 
//                 0.0, 0.0, 0.0, 1.0);

//     scale_half = mat4(0.5, 0.0, 0.0, 0.0, 
//                 0.0, 0.5, 0.0, 0.0, 
//                 0.0, 0.0, 0.5, 0.0, 
//                 0.0, 0.0, 0.0, 1.0);
    
// //	rotate_x = mat4(1.0, 0.0, 0.0, 0.0,
// //					0.0, cos(rotation.x), sin(rotation.x), 0.0,
// //					0.0, -sin(rotation.x), cos(rotation.x), 0.0,
// //					0.0, 0.0, 0.0, 1.0);

// //	rotate_y = mat4(cos(rotation.y), 0.0, -sin(rotation.y), 0.0,
// //					0.0, 1.0, 0.0, 0.0,
// //					sin(rotation.y), 0.0, cos(rotation.y), 0.0,
// //					0.0, 0.0, 0.0, 1.0);

//     rotate_z = mat4(cos(rotation.z), -sin(rotation.z), 0.0, 0.0, 
//                     sin(rotation.z), cos(rotation.z), 0.0, 0.0,
//                     0.0, 0.0, 1.0, 0.0,
//                     0.0, 0.0, 0.0, 1.0);

    
//     gl_Position =   translate2 * rotate_z * translate1  * vec4(in_position, 1);

    
// }

// #version 450 core
// layout (location = 0) in vec3 Pos;
// layout (location = 1) in vec2 UV;
// layout (location = 2) in vec3 Normal;
// layout (location = 3) in vec4 Color;

// uniform mat4 WorldMatrix;
// uniform mat4 ViewMatrix;
// uniform mat4 ProjectionMatrix;



// smooth out vec2 TextureCoordinates;
// smooth out vec3 VertexNormal;
// smooth out vec4 RGBAColor;
// smooth out vec4 PositionRelativeToCamera;
// out vec3 WorldSpacePosition;


// void main()
// {
//     gl_Position = WorldMatrix * vec4(Pos, 1.0f);				//Apply object's world matrix.
//     WorldSpacePosition = gl_Position.xyz;						//Save the position of the vertex in the 3D world just calculated. Convert to vec3 because it will be used with other vec3's.
//     gl_Position = ViewMatrix * gl_Position;						//Apply the view matrix for the camera.
//     PositionRelativeToCamera = gl_Position;
//     gl_Position = ProjectionMatrix * gl_Position;				//Apply the Projection Matrix to project it on to a 2D plane.
//     TextureCoordinates = UV;									//Pass through the texture coordinates to the fragment shader.
//     VertexNormal = mat3(WorldMatrix) * Normal;					//Rotate the normal according to how the model is oriented in the 3D world.
//     RGBAColor = Color;											//Pass through the color to the fragment shader.
// };


// vec4 row( mat4 mat, int row)  {
//     return vec4(
//         mat[row*4],
//         mat[row*4+1],
//         mat[row*4+2],
//         mat[row*4+3]
//     );
// }
// vec4 column(mat4 mat, int column)  {
//     return vec4(
//         mat[column],
//         mat[column + 4],
//         mat[column + 8],
//         mat[column + 12]
//     );
// }

// vec4 row( mat4 mat, int row)  {
//     // return vec4(0,0,0,0);
//     return vec4( mat[0][row], mat[1][row], mat[2][row], mat[3][row] );
// }
// vec4 column(mat4 mat, int column)  {
//     return mat[column];
// }

// mat4 multiply( mat4& other) {
//     mat4 result;
//     for (int row = 0; row < 4; ++row) {
//         for (int column = 0; column < 4; ++column) {
//             result.values[row*4+column] = this->row(row).dot(other.column(column));
//         }
//     }
//     return result;
// }

vec3 extractEulerAngleXYZ(mat4 mat) {
    vec3 rotangles = vec3(0,0,0);
    rotangles.x = atan(mat[2].z, -mat[1].z);
    float cosYangle = sqrt(pow(mat[0].x, 2.0) + pow(mat[0].y, 2.0));
    rotangles.y = atan(cosYangle, mat[0].z);
    float sinXangle = sin(rotangles.x);
    float cosXangle = cos(rotangles.x);
    rotangles.z = atan(cosXangle * mat[1].y + sinXangle * mat[2].y, cosXangle * mat[1].x + sinXangle * mat[2].x);
    return rotangles;
}

void main(){
    // vUv = uv;
    // vUv = uvOffset + (uv / atlasSize);
    // vec2 uvi = vec2(mod(index,rows)/rows, floor(index/rows)/cols) + (uv / atlasSize);
    vec4 original_normal = vec4(0.0, 0.0, 1.0, 1.0);
    // transformed_normal = modelViewMatrix * instanceMatrix * original_normal;
    vec3 rotangles = extractEulerAngleXYZ(modelViewMatrix * instanceMatrix);
    // transformed_normal = vec4(rotangles.xyz, 1.0);
    transformed_normal = vec4(camera_location.xyz, 1.0);
    
    vTexIndex = texture_index;
    vUv = vec2(mod(index,rows_cols.x)/rows_cols.x, floor(index/rows_cols.x)/rows_cols.y) + (uv / rows_cols);
    
    vec4 v = (modelViewMatrix* instanceMatrix* vec4(0.0, 0.0, 0.0, 1.0)) + vec4(position.x, position.y, 0.0, 0.0) * vec4(1.0, 1.0, 1.0, 1.0);
    // output.pos = mul(UNITY_MATRIX_P, mul(UNITY_MATRIX_MV, v);
    gl_Position = projectionMatrix * v;
    // gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
    // https://stackoverflow.com/questions/338762/how-do-you-calculate-the-angle-between-two-normals-in-glsl
    // https://stackoverflow.com/questions/47851547/how-to-preserve-rotation-and-scaling-transforms-in-a-model-view-projection-billb
    // https://www.flipcode.com/documents/matrfaq.html
    // https://github.com/MonoGame/MonoGame/blob/develop/MonoGame.Framework/Matrix.cs#L2081
    // https://github.com/mattdesl/mat4-decompose/blob/master/index.js
    // https://www.geeks3d.com/20141201/how-to-rotate-a-vertex-by-a-quaternion-in-glsl/
    // https://gist.github.com/yiwenl/3f804e80d0930e34a0b33359259b556c
    // https://thebookofshaders.com/08/
    // https://inspirnathan.com/posts/56-shadertoy-tutorial-part-10/
} 









`