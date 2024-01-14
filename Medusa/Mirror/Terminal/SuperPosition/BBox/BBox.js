// import { Log } from './log.js';
export let BBox = {
    initialize: function(offset,bounds) {
        this.name = "Bounding Box";
        this.type = "bbox";
        this.offset = offset ? offset : {x:0,y:0,z:0}; //{x:0,y:0,z:0}
        this.bounds = (typeof(bounds)==='object' && !Array.isArray(bounds)) ? bounds : {};
        this.bboxes = [];
        this.dimensions = Object.keys(this.offset).length;
        // this.scale = scale ? scale : 0;
        // this.anchor = anchor ? anchor : 0;
        this.fields ={ 'field':[], 'symbol':[], 'image':[], 'sound':[]};
        this.superpostions = {};
        this.parent_bbox = null;
        this.parent_knot = null;
        this.parent_tunnel = null;
        Object.assign(this,BBox);
    },
    set_parent: function(tunnel,knot,bbox,field) {
        if(tunnel!=null){ 
            this.parent_tunnel = tunnel;
        }
        if(knot!=null){ 
            this.parent_knot = knot;
        }
        let dis = this;
        for (const field_type in this.fields) {
            let field_array = this.fields[field_type];
            field_array.forEach(function(field, field_name) { 
                field.set_parent(dis.parent_tunnel, dis.parent_knot, dis, null);
            });
        }
    },
    add_boundary: function(dimension,boundary) { // dimension name: boundary
        this.bounds[dimension] = (boundary);
    },
    add_field: function(in_field) {
        if(in_field.type in this.fields){
            in_field.parent_bbox = this;
            in_field.parent_knot = this.parent_knot;
            in_field.parent_tunnel = this.parent_tunnel;
            this.fields[in_field.type].push(in_field);
        }
    },
    add_bbox: function(bbox) {
        this.bboxes.push(bbox);
    },
    min: function(dimension) { return this.bounds[dimension].min();},
    max: function(dimension) { return this.bounds[dimension].max();},
    range: function(dimension) { return this.bounds[dimension].range();},

    keydown: function(e) {
        if (e.key in ["Shift"]) {
            
        }
        else {
            this.fields['symbol'].some(
                function(field, field_name) { 
                    if(field.state=='EXIT'){
                        return false;
                    }else{
                        field.keydown(e);
                        return true;
                    }
                    
                });
            let non_exit = this.fields['symbol'].filter(function(field, index, arr){ return field.state != 'EXIT';});
            this.state = non_exit.length ? 'ENTER' : 'EXIT';
        }
    },
    hit: function(obox) {
        let result = { 'SAME':[], 'SUPERSET':[], 'SUBSET':[], 'UNION':[], 'SEPERATE':[],};
        for (const dimension in this.bounds) {
            if (dimension in obox.bounds) { // if (Object.hasOwnProperty.call(d2, dimension)) {
                let b1 = this.bounds[dimension];
                let b2 = obox.bounds[dimension];
                result[b1.domain(b2)].push(dimension);}}
        const filtered = Object.entries(result).filter(([key, arr]) => arr.length); // Convert the key/value array back to an object:// `{ name: 'Luke Skywalker', title: 'Jedi Knight' }`
        return Object.fromEntries(filtered); /* Object.keys(filtered).length */
    },
    draw: function(ui,ranges,index_in) {
        // this.bboxes.sort();
 
        let rows = this.bounds['x'] ? this.bounds['x'].fractions : 1;
        let columns = this.bounds['y'] ? this.bounds['y'].fractions : 1;
        let layers = this.bounds['z'] ? this.bounds['z'].fractions : 1;
        
        for (const field_type in this.fields) {
            let field_array = this.fields[field_type];
            let field_index = 0;
            let dis = this;
            field_array.forEach(function(field, field_name) { 
                field.draw(ui,ranges,field_index,dis.bounds);
                field_index++;
            });
        }
        this.bboxes.forEach(function(bbox, index_out) { 

            bbox.draw(ui,ranges,index_out);
        
        });
    },

    draw_text_grid:function(Ui,text,bbox,row,to_row,rows,col,to_col,cols,style){
            if(rows && cols){
                for(let rowx = 0; row< rows && row<to_row;row++,rowx++){
                    for(let colx = 0; colx< cols&& colx<to_col;col++,colx++){
                        let index = ((rowx*cols)+colx);

                        Ui.ctx2.fillStyle = `rgb(${Math.floor(255 - 42.5)},0,0)`;
                        Ui.ctx2.strokeStyle = `rgb(${Math.floor(255 - 42.5)},0,0)`;
                        Ui.ctx2.beginPath();
                        let x = (bbox.x_min*Ui.dpi) + (colx * (bbox.width*Ui.dpi/cols))+(bbox.width*Ui.dpi/cols/2);
                        let y = (bbox.y_min*Ui.dpi) + (row * (bbox.height*Ui.dpi/rows))+(bbox.height*Ui.dpi/rows/2);
                        let radius = Math.min((bbox.height*Ui.dpi/rows/2),(bbox.width*Ui.dpi/cols/2)); 

                        if(style%2){
                            Ui.ctx2.arc(x, y, radius, 0, Math.PI * 2, true);
                            Ui.ctx2.fill();
                        }else{
                            Ui.ctx2.lineWidth = 5* Ui.dpi;
                            Ui.ctx2.arc(x, y, radius, 0, Math.PI * 2, true);
                            Ui.ctx2.stroke();
                        }
                        if(index<text.length){
                            // Ui.ctx2.font = `${radius}px mono`;
                            Ui.ctx2.font = `${radius}px serif`;
                            Ui.ctx2.fillStyle = `white`;
                            Ui.ctx2.textBaseline = 'middle';
                            Ui.ctx2.textAlign = 'center';
                            let font_width = Ui.ctx2.measureText(text[index].toUpperCase()).width;
                            Ui.ctx2.fillText(text[index].toUpperCase(),x,y,radius);

                        }
                    }
                }
            }
    },
    draw_image_grid:function(Ui,text,bbox,row,to_row,rows,col,to_col,cols,style){
    },
    draw_file_grid:function(Ui,text,bbox,row,to_row,rows,col,to_col,cols,style){
    },
    
};