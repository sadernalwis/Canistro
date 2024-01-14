// import { Sphere } from 'three';
import * as THREE from '../../../../../../text/javascript/threejs/build/three.module.js';
import { Meta } from "../../../../../../Meta/Meta.js";
import { Frustum, Sphere } from "../../../../../../text/javascript/threejs/build/three.module.js";
import { Space } from '../../../../../../Parseltongue/Space/Space.js';

export class CullableObject {
  boundingSphere = new Sphere
  cullable = true
}
export class Instance extends Meta{
    static instances = []
    constructor(parent, name, index){
		super(null, name, null, parent);
        // this.bounding_sphere = new Sphere();
        this.parent = parent
        this.index = index
        this.matrix_world = new THREE.Matrix4();
        this.texture_idx = 0
        this.slot_idx = 0
        this.image = null
        Instance.instances.push(this)
    }
    
    intersects_instance(frustum){
        // Patch Frustum to allow culling at object level. // https://discourse.threejs.org/t/how-to-do-frustum-culling-with-instancedmesh/22633/6
        const sphere = new Sphere()
        sphere.copy( this.bounding_sphere ).applyMatrix4( this.matrix_world);
        return frustum.intersectsSphere(sphere);
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

    update_indices(texture_array, slot_array) {
        texture_array[this.index] = this.texture_idx
        slot_array[this.index] = this.slot_idx
    }
    // https://discoverthreejs.com/book/first-steps/transformations/
    // https://cs.wellesley.edu/~cs307/readings/04-instance-transform.html
    // https://medium.com/@pailhead011/instancing-with-three-js-36b4b62bc127
    static matrix_column(matrix, column){
        const elements = matrix.elements
        return new THREE.Vector4( 
            elements[column*4],
            elements[column*4 + 1],
            elements[column*4 + 2],
            elements[column*4 + 3])
    }
    static matrix_from_angle(/* vec3  */axis, /* float */ angle){
        const m = new THREE.Matrix4();
        // m.set(  11, 12, 13, 14,
        //         21, 22, 23, 24,
        //         31, 32, 33, 34,
        //         41, 42, 43, 44 );
        // m.elements = [ 11, 21, 31, 41,
        //     12, 22, 32, 42,
        //     13, 23, 33, 43,
        //     14, 24, 34, 44 ];

        axis.normalize() // = normalize(axis);
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        const oc = 1.0 - c;
    
        /* mat4 */m.set(
            oc * axis.x * axis.x + c,           
            oc * axis.x * axis.y + axis.z * s,  
            oc * axis.z * axis.x - axis.y * s,  
            0.0,                                
            oc * axis.x * axis.y - axis.z * s,  
            oc * axis.y * axis.y + c,           
            oc * axis.y * axis.z + axis.x * s,  
            0.0,                                
            oc * axis.z * axis.x + axis.y * s,  
            oc * axis.y * axis.z - axis.x * s,  
            oc * axis.z * axis.z + c,           
            0.0,                                
            0.0,
            0.0,
            0.0,
            1.0            
        );
        return m;
    }

    static normal_to_orbit(rotation_vector, view_vector, rows_cols){
        rotation_vector.normalize();
        view_vector.normalize();
        const x_direction = new THREE.Vector3(1.0, 0, 0);
        const y_direction = new THREE.Vector3(0, 1.0, 0);
        const z_direction = new THREE.Vector3(0, 0, 1.0);

        const rotation_x_length = rotation_vector.dot(x_direction);
        const rotation_y_length = rotation_vector.dot(y_direction);
        const rotation_z_length = rotation_vector.dot(z_direction);

        const view_x_length = view_vector.dot(x_direction);
        const view_y_length = view_vector.dot(y_direction);
        const view_z_length = view_vector.dot(z_direction);
        
        //TOP Y-ROT
        const top_rotation = Math.atan2(-rotation_x_length, -rotation_z_length)/Math.PI*180.0 + 180.0;
        const top_view = Math.atan2(-view_x_length, -view_z_length)/Math.PI*180.0 + 180.0;
        const top_final = top_view-top_rotation;
        const top_idx = Math.floor(top_final/(360.0/rows_cols.x));
        //SIDE X-ROT
        const front_rotation = Math.atan2(-rotation_x_length, -rotation_z_length)/Math.PI*180.0 + 180.0;
        const front_view = Math.atan2(-view_y_length, -view_z_length)/Math.PI*180.0 + 180.0;
        const front_final = front_view-front_rotation;
        const front_idx = Math.floor(front_final/(360.0/rows_cols.y));
        
        return [Math.abs((front_idx*rows_cols.x)+top_idx), front_idx, top_idx];
    }
    
    static extractEulerAngleXYZ(matrix) {
        const rotangles = new THREE.Vector3(0,0,0);
        const mat_col_0 = Instance.matrix_column(matrix, 0)
        const mat_col_1 = Instance.matrix_column(matrix, 1)
        const mat_col_2 = Instance.matrix_column(matrix, 2)
        rotangles.x = Math.atan2(mat_col_2.z, -mat_col_1.z);
        const cosYangle = Math.sqrt(Math.pow(mat_col_0.x, 2.0) + Math.pow(mat_col_0.y, 2.0));
        rotangles.y = Math.atan2(cosYangle, mat_col_0.z);
        const sinXangle = Math.sin(rotangles.x);
        const cosXangle = Math.cos(rotangles.x);
        rotangles.z = Math.atan2(cosXangle * mat_col_1.y + sinXangle * mat_col_2.y, cosXangle * mat_col_1.x + sinXangle * mat_col_2.x);
        rotangles.x = rotangles.x/Math.PI*180.0 + 180.0
        rotangles.y = rotangles.y/Math.PI*180.0 + 180.0
        rotangles.z = rotangles.z/Math.PI*180.0 + 180.0
        return rotangles;
    }


    static change_texture(index, texture_idx){
        // Instance.change_texture(16912, 5)
        const instance = this.instances[index];
        const texture_array = instance.parent.mesh.geometry.attributes.texture_index.array;
        texture_array[index] = texture_idx
        instance.parent.mesh.geometry.attributes.texture_index.needsUpdate = true;
    }


    static check_rotation(index, rows, cols){
        // Instance.check_rotation(16912, 32, 32)
        const instance = Instance.instances[index];

        const matrix = new THREE.Matrix4();
        instance.parent.mesh.getMatrixAt(index, matrix);
        // const [position, rotation, scale] = Instance.decompose_matrix(matrix)

        const model_center = new THREE.Vector3(0.0, 0.0, 0.0).applyMatrix4(matrix);
        const cam_loc = instance.parent.camera.camera.position;
        const view_vector = new THREE.Vector3().subVectors(cam_loc, model_center);
        view_vector.normalize()

        // mat4 base_matrix = modelViewMatrix* instanceMatrix;
        const rotangles = Instance.extractEulerAngleXYZ(matrix);
        const x_rot_matrix = Instance.matrix_from_angle(new THREE.Vector3(1.0, 0.0, 0.0), rotangles.x);
        const y_rot_matrix = Instance.matrix_from_angle(new THREE.Vector3(0.0, 1.0, 0.0), rotangles.y);
        const z_rot_matrix = Instance.matrix_from_angle(new THREE.Vector3(0.0, 0.0, 1.0), rotangles.z);
        const combined_rot = new THREE.Matrix4() //x_rot_matrix * y_rot_matrix * z_rot_matrix;
        combined_rot.multiply(z_rot_matrix);
        combined_rot.multiply(y_rot_matrix);
        combined_rot.multiply(x_rot_matrix);
        
        const model_normal = new THREE.Vector3(0.0, 0.0, 1.0).applyMatrix4(combined_rot);
        model_normal.normalize()
        const [findex, row, col] = Instance.normal_to_orbit(model_normal, view_vector, new THREE.Vector2(rows, cols));
        console.log(index, findex, row, col)
        // Instance.test_rotation(0,32,32,0)
    }

    static create_rotation_matrix(x_degree, y_degree, z_degree){
        return  Instance.matrix_from_angle(THREE.Vector3(1.0, 0.0, 0.0), x_degree) *
                Instance.matrix_from_angle(THREE.Vector3(0.0, 1.0, 0.0), y_degree) *
                Instance.matrix_from_angle(THREE.Vector3(0.0, 0.0, 1.0), z_degree) ;
    }

    static decompose_matrix(index){
        const instance = Instance.instances[index];
        const matrix = new THREE.Matrix4();
        instance.parent.mesh.getMatrixAt(index, matrix);

        const dummy = new THREE.Object3D();
        matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
        var rotation = new THREE.Euler().setFromQuaternion( dummy.quaternion, 'XYZ');
        THREE.MathUtils.radToDeg(rotation.x)
        THREE.MathUtils.radToDeg(rotation.y)
        THREE.MathUtils.radToDeg(rotation.z)
        return {'R':rotation,'T':dummy.position,  'S':dummy.scale}
    }

    static normal_to_orbit2(rotation_vector, view_vector){

    //   normal_to_orbit( new THREE.Vector3(10,10,10))
    //   normal_to_orbit( new THREE.Vector3(0,-10,10))
        rotation_vector = rotation_vector.normalize()
        view_vector = view_vector.normalize()
        const x_direction = new THREE.Vector3(1,0,0)
        const y_direction = new THREE.Vector3(0,1,0)
        const z_direction = new THREE.Vector3(0,0,1)

        const rotation_x_length = rotation_vector.dot(x_direction)
        const rotation_y_length = rotation_vector.dot(y_direction)
        const rotation_z_length = rotation_vector.dot(z_direction)

        const view_x_length = view_vector.dot(x_direction)
        const view_y_length = view_vector.dot(y_direction)
        const view_z_length = view_vector.dot(z_direction)

        //TOP
        const top_rotation = Math.atan2(rotation_z_length, rotation_x_length) * 180 / Math.PI
        const top_view = Math.atan2(view_z_length, view_x_length) * 180 / Math.PI
        const top_final = top_view-top_rotation
        const top_idx = Math.floor(top_final/(360/12))
        //FRONT
        const front_rotation = Math.atan2(rotation_z_length, rotation_x_length) * 180 / Math.PI
        const front_view = Math.atan2(view_z_length, view_x_length) * 180 / Math.PI
        const front_final = front_view-front_rotation
        const front_idx = Math.floor(front_final/(360/12))
        
        const final_idx = (front_idx*12)+top_idx
        console.clear()
        // console.log('X', Math.atan2(x_length, y_length) * 180 / Math.PI)
        console.log('Y', Math.atan2(y_length, x_length, ) * 180 / Math.PI)
        console.log(top_idx, front_idx, final_idx)
    }

    get_projection(){ 
        var quaternion = new THREE.Quaternion(); // create one and reuse it
        quaternion.setFromUnitVectors( v1, v2 );
        var matrix = new THREE.Matrix4(); // create one and reuse it
        matrix.makeRotationFromQuaternion( quaternion );

        var rotation = new THREE.Euler().setFromQuaternion( quaternion, eulerOrder ); //https://stackoverflow.com/questions/12784807/get-euler-rotation-from-quaternion/12785589#12785589
        var rotation = new THREE.Euler().setFromQuaternion( quaternion, 'XYZ');
        THREE.MathUtils.radToDeg(rotation.x)
        THREE.MathUtils.radToDeg(rotation.y)
        THREE.MathUtils.radToDeg(rotation.z)
        // object.applyMatrix( matrix ); || // object.applyQuaternion( quaternion ); //https://stackoverflow.com/questions/25199173/how-to-find-rotation-matrix-between-two-vectors-in-three-js
        // normalize you vectors first and set 
        // axis.cross( v1, v2 ); 
        // angle = v1.angleTo( v2 ); 
        // matrix.makeRotationAxis( axis, angle ); 
        // object.applyMatrix( matrix );


    }

    update_matrix(parent_mesh, camera){
        const dummy = new THREE.Object3D();
        parent_mesh.getMatrixAt(this.index, this.matrix_world);
        this.matrix_world.decompose(dummy.position, dummy.quaternion, dummy.scale);
        // dummy.position.set(x*42.0,y*42.0,z*42.0);
        dummy.lookAt( camera.position );
        // dummy.scale.set(this.image.width, this.image.height);
        dummy.updateMatrix();
        parent_mesh.setMatrixAt(this.index, dummy.matrix);
        this.matrix_world = dummy.matrix
        // parent_mesh.instanceMatrix.needsUpdate = true;
    }


    set_instance_positions() {
        var [lx,ly,lz] = this.xyz_grid_partition(this.max_instances)
        const grid_space = new Space(0,[[0,undefined]],['x', lx],['y', ly],['z', lz])
        const dummy = new THREE.Object3D();
        var [hlx,hly,hlz] = [lx/2,ly/2,lz/2]
        for(const i of grid_space.generator()){ 
            var [x,y,z] = i[2]
            var [x,y,z] = [x-hlx, y-hly, z-hlz]
            dummy.position.set(x*42.0,y*42.0,z*42.0);
            dummy.updateMatrix();
            this.mesh.setMatrixAt( i[1], dummy.matrix );
        }
    }
}