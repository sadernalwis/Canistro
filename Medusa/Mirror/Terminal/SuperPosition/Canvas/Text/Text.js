export class Text  {
    
    static fillTextCenter(canvas, text, x, y, width, height) { //https://stackoverflow.com/questions/20551534/size-to-fit-font-on-a-canvas
        canvas.canvas.textBaseline = 'middle';
        canvas.canvas.textAlign = "center";
        const lines = text.match(/[^\r\n]+/g);
        const line_height = (height / (lines.length + 1))
        for (let i = 0; i < lines.length; i++) {
            // let xL = (width - x) / 2
            let xL = x + (width / 2)
            let yL = y + (line_height * (i + 1))

            canvas.canvas.fillText(lines[i], xL, yL)
        }
    }

    static getFontSizeToFit(canvas, text, fontFace, width, height) {
        canvas.canvas.font = `1px ${fontFace}`;
        let fitFontWidth = Number.MAX_VALUE
        const lines = text.match(/[^\r\n]+/g);
        lines.forEach(line => {
            fitFontWidth = Math.min(fitFontWidth, width / canvas.canvas.measureText(line).width)
        })
        let fitFontHeight = height / (lines.length * 1.2); // if you want more spacing between line, you can increase this value
        return Math.min(fitFontHeight, fitFontWidth)
    }

    static fit_text_center(text, slot_idx, canvas) {
        const slot_size = canvas.slot_size
        const slot_pos = canvas.get_slot_position(slot_idx)
        const fontSize = Text.getFontSizeToFit(canvas, text, "Arial", slot_size.x, slot_size.y)
        canvas.canvas.font = fontSize + "px Arial"
        canvas.canvas.fillStyle = 'Black'
        Text.fillTextCenter(canvas, text, slot_pos.x, slot_pos.y, slot_size.x, slot_size.y)
    }

    makeRange(n0, n1, a) {
        if (!a) {
            a = [];
        }
        for (; n0 < n1; n0++) {
            a.push(String.fromCharCode(n0));
        }
        return a;
    }

    draw(ctx) {
        ctx.font = "18px mono";
        ctx.textBaseline = "middle";

        var text = ctx.measureText('foo'); // TextMetrics object
        text.width; // 16;

        ctx.fillText(Text.makeRange(0x3b1, 0x3ca, []).join(''), 0, 100);
        ctx.fillText(Text.makeRange(0x391, 0x3a2, []).join(''), 0, 120);
        ctx.fillText(Text.makeRange(0x3a3, 0x3aa, []).join(''), 0, 140);

    }

    greek(lower) {
        if(lower) {
            return Text.makeRange(0x3c3, 0x3ca, Text.makeRange(0x3b1, 0x3c2, []));
        }
        else{
            return Text.makeRange(0x3a3, 0x3aa, Text.makeRange(0x391, 0x3a2, []));
        }
    }

    draw_string(string){
        const grid_size = canvas.grid_size
        canvas.canvas.fillStyle = `rgb(${0.0},${0.0},${1.0},${1.0})`;
        canvas.canvas.textBaseline = 'middle';
        canvas.canvas.textAlign = 'center';
        canvas.canvas.font = `${grid_size.y}px mono`;
        var tmp_text = string;
        var tmp_width = canvas.canvas.measureText(tmp_text).width;
        if (tmp_width > grid_size.x) {
            //tmp_text = node.src.substring(0, parseInt(grid_size.x / (tmp_width / node.src.length)));
            let lines = Math.ceil(node.height / grid_size.x);
            lines = (lines > tmp_text.length) ? tmp_text.length : lines;
            if (lines === 1 || tmp_text.length === 1) {
                let h1 = node.height;
                let w1 = tmp_width / tmp_text.length;
                let w2 = grid_size.x / tmp_text.length;
                let h2 = w2 / w1 * h1;
                canvas.canvas.font = `${Math.floor(h2)}px mono`;
                canvas.canvas.fillText(tmp_text, node.x, node.y);

            } else {
                let characters_per_line = Math.ceil(tmp_text.length / lines);
                let pager = [];
                for (let line = 0; line < lines; line++) {
                    let cursor_begin = line * characters_per_line;
                    let cursor_end = cursor_begin + characters_per_line;
                    if (cursor_end < tmp_text.length) {
                        pager.push(tmp_text.substring(cursor_begin, cursor_end));
                    } else {
                        pager.push(tmp_text.substring(cursor_begin, tmp_text.length));
                    }
                }

                let h1 = node.height;
                let w1 = tmp_width / tmp_text.length;
                let w2 = grid_size.x / characters_per_line;
                let h2 = w2 / w1 * h1;
                canvas.canvas.font = `${Math.floor(h2)}px mono`;

                let page_height = h2 * pager.length;

                if (page_height > node.height) {
                    w1 = canvas.canvas.measureText(" ").width;
                    h1 = h2;
                    w2 = w1 / h1 * (node.height / pager.length);
                    h2 = w2 / w1 * h1;
                    canvas.canvas.font = `${Math.floor(h2)}px mono`;
                }
                page_height = h2 * pager.length;
                pager.forEach(
                    function(line, index) {
                        canvas.canvas.fillText(
                            line,
                            node.x,
                            node.y - (page_height / 2) + (index * h2) + (h2 / 2));
                    }
                );

            }
        } else {
            canvas.canvas.fillText(tmp_text, node.x, node.y);
        }
    }
}