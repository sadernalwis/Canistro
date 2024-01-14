import { Tunnel } from "../../Tunnel.js";
import { Boundary } from "../Boundary/Boundary.js";
import { Canvas } from "../Canvas/Canvas.js";
import { Label } from "./Label/Label.js";

// import { Log } from './log.js';
export let Field = {
    initialize: function (type, label, value, regex, style, bounds) {
        this.name = "Field";
        this.type = type ? type : "field";
        this.label = label;
        this.header = label;
        this.value = value;
        this.footer = label;
        this.regex = regex;
        this.style = style ? style : 0;
        this.state = null;
        this.bounds = (typeof (bounds) === 'object' && !Array.isArray(bounds)) ? bounds : {};
        this.parent_bbox = null;
        this.parent_knot = null;
        this.parent_tunnel = null;
        Object.assign(this, Field);
    },
    time_ago:function (time) { //https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site/23259289#23259289

        switch (typeof time) {
          case 'number':
            break;
          case 'string':
            time = +new Date(time);
            break;
          case 'object':
            if (time.constructor === Date) time = time.getTime();
            break;
          default:
            time = +new Date();
        }
        var time_formats = [
          [60, 'seconds', 1], // 60
          [120, '1 minute ago', '1 minute from now'], // 60*2
          [3600, 'minutes', 60], // 60*60, 60
          [7200, '1 hour ago', '1 hour from now'], // 60*60*2
          [86400, 'hours', 3600], // 60*60*24, 60*60
          [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
          [604800, 'days', 86400], // 60*60*24*7, 60*60*24
          [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
          [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
          [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
          [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
          [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
          [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
          [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
          [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
        ];
        var seconds = (+new Date() - time) / 1000,
          token = 'ago',
          list_choice = 1;
      
        if (seconds == 0) {
          return 'Just now'
        }
        if (seconds < 0) {
          seconds = Math.abs(seconds);
          token = 'from now';
          list_choice = 2;
        }
        var i = 0,
          format;
        while (format = time_formats[i++])
          if (seconds < format[0]) {
            if (typeof format[2] == 'string')
              return format[list_choice];
            else
              return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
          }
        return time;

        
        //   var aDay = 24 * 60 * 60 * 1000;
        //   console.log(time_ago(new Date(Date.now() - aDay)));
        //   console.log(time_ago(new Date(Date.now() - aDay * 2)));
    },
    add_boundary: function (dimension, boundary) {
        this.bounds[dimension] = boundary;
    },
    set_parent: function(tunnel,knot,bbox,field) {
        if(tunnel!=null){ 
            this.parent_tunnel = tunnel;
        }
        if(knot!=null){ 
            this.parent_knot = knot;
        }
        if(bbox!=null){ 
            this.parent_bbox = bbox;
        }
    },
    keydown: function(e) {
        if (e.key in ["Shift", "Ctrl"]) {}
        else if (e.key === "ArrowUp")   {/* Setting.shoulder.right(); */}
        else if (e.key === "ArrowDown") {/* Setting.shoulder.left(); */}
        else if (e.key.toLowerCase() == "backspace") {
            Tunnel.key_buffer.pop();
        } 
        else if (e.keyCode == 13) {
            Tunnel.key_buffer=[];
            this.state = 'EXIT';
            e.preventDefault();
            return;
            // GatePass.send(Tunnel.key_buffer,Tunnel.key_buffer);
            // alert(Tunnel.key_buffer);
        } 
        else { Tunnel.key_buffer.push(e.key);}
        this.value = Tunnel.key_buffer.join('').toUpperCase();
        // const keyboard_write = keyboard_print.toLowerCase();
        e.preventDefault(); /* or e.stopPropagation,  */
    },
    draw: function (Ui, ranges, index_in, in_bounds) {
        if (this.type === 'symbol') {
            this.draw_text_grid(Ui, this.value, in_bounds, this.style);
        }
        else if (this.type === 'image') {
            this.field.forEach(function (field, index_out) {
                // this.draw_text_grid(Ui,text,bbox,row,to_row,rows,col,to_col,cols,style); 
            });
        }
        else if (this.type === 'sound') {
            this.field.forEach(function (field, index_out) {
                // this.draw_text_grid(Ui,text,bbox,row,to_row,rows,col,to_col,cols,style); 
            });
        }
        else if (this.type === 'field') {
            this.field.forEach(function (field, index_out) {
                // this.draw_text_grid(Ui,text,bbox,row,to_row,rows,col,to_col,cols,style); 
            });
        }
    },

    view_range: function (dimension, in_bounds) {
        if (dimension in in_bounds && dimension in this.bounds) {
            let b1 = this.bounds[dimension];
            let b2 = in_bounds[dimension];
            let [union_range, union_ratio, fraction_start_index, union_fractions] = b1.union_size(b2);
            let unit_size = b2.range() / union_fractions; // b1.range()/union_fractions;
            let minimum = b1.midpoint() - (unit_size * union_fractions / 2);
            let index_to = fraction_start_index + union_fractions;
            return [b1.fractions, fraction_start_index, union_fractions, index_to, unit_size, minimum];
        }

    },
    draw_label: function (Ui, label, range ,draw_range, alignment, style) {
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
            return new Label.initialize('label',label, alignment, Ui.language, 0, {x:bx,y:by,z:bz}).draw(Ui, alignment, style);
        // }
        // this.label.draw(Ui, alignment, style);

    },
    draw_text_grid: function (Ui, text, in_bounds, style) {
        let x_range = Boundary.view_range(this.bounds,'x', in_bounds);
        let y_range = Boundary.view_range(this.bounds,'y', in_bounds);
        let z_range = Boundary.view_range(this.bounds,'z', in_bounds);
        let range = [x_range, y_range, z_range];
        let draw_range = Canvas.draw_text_grid(Ui,text,range, 2);
        let header_range = this.draw_label(Ui,this.header,range ,draw_range, 'TOP-LEFT', 3);
        // this.footer = `${this.header}:  ${this.parent_tunnel.knots.indexOf(this.parent_knot)+1}/${Tunnel.tunnel.knots.length}`;
        this.footer = `${this.time_ago(this.parent_knot.get_gatepass_time())}:  ${this.parent_tunnel.knots.indexOf(this.parent_knot)+1}/${Tunnel.tunnel.knots.length}`;
        if(text.length){
            this.draw_label(Ui,this.footer, range, draw_range, 'BOTTOM-LEFT', 3);
        }
        else{
            this.draw_label(Ui,this.footer, range, header_range, 'BOTTOM-LEFT', 3);
        }

    },
    draw_image_grid: function (Ui, text, bbox, row, to_row, rows, col, to_col, cols, style) {
    },
    draw_file_grid: function (Ui, text, bbox, row, to_row, rows, col, to_col, cols, style) {
    },

};