import { Boundary } from "../../Boundary/Boundary.js";
import { Canvas } from "../../Canvas/Canvas.js";

// import { Log } from './log.js';
export let Label = {
    initialize: function (type, value, alignment, language, style, bounds) {
        this.name = "Label";
        this.type = type ? type : "label";
        this.value = value;
        this.alignment = alignment;
        this.language = language;
        this.style = style ? style : 0;
        this.bounds = (typeof (bounds) === 'object' && !Array.isArray(bounds)) ? bounds : {};
        Object.assign(this, Label);
    },
    add_boundary: function (dimension, boundary) {
        this.bounds[dimension] = boundary;
    },
    draw: function (Ui, alignment, style) {
        
        let x_range = Boundary.draw_range(this.bounds,'x');
        let y_range = Boundary.draw_range(this.bounds,'y');
        let z_range = Boundary.draw_range(this.bounds,'z');

        let [total_columns, column_from, columns, column_to, width, x_min] = x_range;
        let [total_rows, row_from, rows, row_to, height, y_min] = y_range;
        let [total_layers, layers_from, layers, layer_to, depth, z_min]     = z_range;


        let bx = this.bounds['x'];
        let by = this.bounds['y'];
        let bz = this.bounds['z'];
        // Canvas.roundRect(ctx, x, y, width, height, radius, fill, stroke);
        // Ui.ctx2.fillStyle = "rgba(0, 0, 0, 0.5)";
        Ui.ctx2.fillStyle = "rgba(27, 27, 27)";
        Ui.ctx2.strokeStyle = "rgb(0, 0, 0)";
        // Ui.ctx2.strokeStyle = "rgb(255, 0, 0)";
        // Ui.ctx2.fillStyle = "rgba(0, 0, 0, 1.0)";
        Canvas.roundRect(Ui.ctx2, bx.min()*Ui.dpi, by.min()*Ui.dpi, total_columns*width*Ui.dpi, height*Ui.dpi, 5*Ui.dpi ,true);
        return Canvas.draw_text_grid(Ui,this.value, x_range, y_range, z_range, style);
        // Canvas.roundRect(Ui.ctx2, x_min, y_min, total_rows*width, height,5,true);
        // Canvas.draw_text_grid()
    },
    draw2: function (Ui, alignment, style) {
        
        let x_range = Boundary.view_range(this.bounds,'x',this.bounds);
        let y_range = Boundary.view_range(this.bounds,'y',this.bounds);
        let z_range = Boundary.view_range(this.bounds,'z',this.bounds);

        let [total_rows, row_from, rows, row_to, width, x_min] = x_range;
        let [total_columns, column_from, columns, column_to, height, y_min] = y_range;
        let [total_layers, layers_from, layers, layer_to, depth, z_min] = z_range;


        let bx = this.bounds['x'];
        let by = this.bounds['y'];
        let bz = this.bounds['z'];
        // Canvas.roundRect(ctx, x, y, width, height, radius, fill, stroke);
        Ui.ctx2.fillStyle = "rgba(0, 0, 0, 0.5)";
        Ui.ctx2.strokeStyle = "rgb(255, 0, 0)";
        // Ui.ctx2.fillStyle = "rgba(0, 0, 0, 1.0)";
        Canvas.roundRect(Ui.ctx2, bx.min(),by.min(),total_rows*width, height,5,true);
        Canvas.draw_text_grid(Ui,this.value, x_range, y_range, z_range, style);
        // Canvas.roundRect(Ui.ctx2, x_min, y_min, total_rows*width, height,5,true);
        // Canvas.draw_text_grid()
    },
};