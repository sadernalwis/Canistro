import { HTML } from "Medusa/Parseltongue/HTML/HTML.js";
import { SVG } from "Medusa/Parseltongue/SVG/SVG.js";
import { Channel } from "./Channel/Channel.js";

export class Graph{
	
    paper(){ //https://stackoverflow.com/questions/61481183/how-to-get-intersection-pointx-y-on-svg-path
        let wave_path
        let bounds
        let wave_svg
        this.paper = new paper.PaperScope();
        this.paper.setup(this.canvas)
        wave_svg = this.paper.project.importSVG(this.svg)
        wave_svg.visible = true // Turn off the effect of display:none
        bounds = this.paper.view.bounds //fit wave into paper canvas
        wave_svg.fitBounds(bounds)
        // wave_path = wave_svg.children[0] //get contained path
        wave_path = wave_svg.children[0].children[0].children[0].children[0]
        // wave_path.strokeColor = 'black'
        // wave_path.fillColor = null
        this.paper.view.onMouseMove = mouse_move.bind(this) //set event handlers on paper canvas

        function mouse_move(event) {
            let mouse_location = event.point
            this.paper.project.clear() //clear canvas before redrawing
            //when creating a graphical object with paper, it automatically gets drawn to the canvas at the end of an event handler
            //draw vertical line to intersect with
            let line = new this.paper.Path(new this.paper.Point(mouse_location.x, 0), new this.paper.Point(mouse_location.x, bounds.height))
            line.strokeColor = 'black'

            // wave_path = this.channel.scopes[0].path
            //redraw wave path
            new this.paper.Layer(wave_path)
            
            //draw intersections
            let intersections = line.getIntersections(wave_path)
            for (const intersection of intersections) {
                let circle = new this.paper.Path.Circle(intersection.point, 5)
                circle.strokeColor = 'red'
                circle.fillColor = 'white'
                console.log(intersection.point)
            }
        }
    }

    resize(e){
		console.log(e)
		const svg_width =  this.svg_root.clientWidth;
		const svg_height = this.svg_root.clientHeight;
		// SVG.configure(this.svg_root, {viewBox:`${-svg_width/2} ${-svg_height/2} ${svg_width} ${svg_height}`}, true);
        this.channel.resize()
        this.paper()
    }

	graph(width, height) {
		// const svg_width = this.clientWidth | 400;
		// const svg_height = this.clientHeight | 400;
		const svg_width =  width | 800;
		const svg_height = height | 400;
	
		// let svg_root = SVG.put(this.shadow_root, SVG.make("svg", "svg_root", [], {width:svg_width, height:svg_height}), 0, true);
		let svg_root = SVG.put(this.shadow_root, SVG.make("svg", "svg_root", [], {}), 0, true);
		// SVG.configure(svg_root, {width:'100%', height:'100%', viewBox:`${-svg_width/2} ${-svg_height/2} ${svg_width} ${svg_height}`}, true);
		// SVG.configure(svg_root, {width:`${svg_width}px`, height:`${svg_height}px`, viewBox:`${-svg_width/2} ${-svg_height/2} ${svg_width} ${svg_height}`,preserveAspectRatio:"xMidYMid meet"}, true);
		// SVG.configure(svg_root, {width:`inherit`, height:`80%`}, true);
		HTML.style(svg_root,{  width:`95%`, height:`inherit`, position: 'absolute', display: 'content', 'align-self': 'center',left:'5%' /* 'margin-left': '45px' *//* , 'z-index': `${(z*2)+1}`,  */})
        svg_root.addEventListener("resize", this.resize.bind(this));
        svg_root.addEventListener("load", this.resize.bind(this));
		this.channel = new Channel(this, 'dataset_1', null, svg_root, {svg:svg_root}, null, null, false);
		return svg_root
		
	}
	graph(width, height) {
		this.canvas = HTML.make("canvas", "", [], {});
		this.svg = SVG.make("svg", "svg_root", [], {});
		HTML.style(this.canvas,{  width:`100%`, height:`inherit`, position: 'absolute', display: 'content', left:'0px' /* 'margin-left': '45px' *//* , 'z-index': `${(z*2)+1}`,  */})
		HTML.style(this.svg,{  width:`100%`, height:`inherit`, position: 'absolute', display: 'content', left:'0px' /* 'margin-left': '45px' *//* , 'z-index': `${(z*2)+1}`,  */})

		let draw_root = HTML.make("div", "", [this.svg, this.canvas], {})
		HTML.style(draw_root,{  width:`95%`, height:`inherit`, position: 'absolute', display: 'content', 'align-self': 'center',left:'5%' /* 'margin-left': '45px' *//* , 'z-index': `${(z*2)+1}`,  */})
        draw_root.addEventListener("resize", this.resize.bind(this));
        draw_root.addEventListener("load", this.resize.bind(this));
		this.channel = new Channel(this, 'dataset_1', null, this.svg, {svg:this.svg}, null, null, false);
		return draw_root
		
	}

    reload(text, line_no, width, height){
        this.ul =  HTML.make('ul','medusa-darkmode-graph',[],{});
        HTML.style(this.ul,{   
            margin: '0px',
            padding: '0px',
            'list-style-type': 'none',
            'overflow-y': 'hidden',
            'overflow-x': 'hidden',
            'white-space': 'nowrap',

            width: `100%`,
            // height: '5%',
            height: '5em',

            // background:'aliceblue',
            'font-size': '0.7em',
            'margin-left': '0px',

            display: 'flex',
            // display: 'inline-flex',
            'align-self': 'center'
            // margin: '0px',
            // padding: '0px',
            // position: 'absolute',
            // 'list-style': 'none',
            // 'background-color': 'rgba(57, 57, 57, 0.1)',
            // // display: 'none',
            // 'box-sizing': 'border-box',
            // border: '2px currentColor solid',
            // // 'max-height': `${height}px`,
            // width: `${width}px`,
            // overflow: 'scroll',
            // 'overflow-x': 'hidden',
            // 'font-size': '87.5%',
            // cursor: 'pointer',
            // display: 'flex', 
            // 'flex-direction': 'column-reverse',
            // 'margin-bottom': '1px'
        });
        for (let i = 0; i < 1; i++) {

            const z = i+1
            const span =  HTML.make('span','medusa-darkmode-skin',[],{});
            
            this.line_no =  HTML.make('span','',[],{},'', line_no.toString()/* .padEnd(4, ' ') */);
            HTML.style(this.line_no,{  position: 'relative', 'z-index': `${(z*2)+1}`, 'align-self': 'center', left:'1px' })
            this.svg_root =  this.graph()
            const li =  HTML.make('li','',[this.line_no, span, this.svg_root ],{},`segment${i}`);
            // const div =  HTML.make('span','',[li,span],{},`segment${i}`, 'segment');
            // const gutter =  HTML.make('div','',[this.line_no, span],{});
            // const li =  HTML.make('li','',[gutter, this.svg_root ],{},`segment${i}`);
            HTML.style(li,{   
                // content: '',
                // position: 'absolute',
                // top: '-0.2em',
                // bottom: '0',
                // width: '3em',
                // transform: 'rotate(30deg) skewy(30deg)',

                // padding: '1em 2em',

                'padding-top': '1em',
                'padding-right': '2em',
                'padding-bottom': '1em',
                'padding-left': '0.5em',

                position: 'relative',
                // display: 'inline-block',
                display: 'inline-flex',
				width:'inherit',
				height:'inherit',
                'align-self': 'center',

                'vertical-align': 'top',
                // background:'aliceblue',
                
                // display: 'flex',
                // 'flex-direction': 'row-reverse'
                // 'border-right': 'solid',
                // 'border-top': 'solid',
                // 'pointer-events': 'none',
                // 'box-sizing': 'border-box',
                // 'box-shadow': '3px -3px 6px -3px gray',/* a shadow effect can be added too */
                // 'z-index': '1',

            })
            HTML.style(span,{   
                // background:'aliceblue',
                content: '',
                position: 'absolute',
                // top: '-0.2em',
                // bottom: '0',

                // position: 'relative',
                'align-self': 'center',
                top: 'auto',
                bottom: 'auto',

                width: '3em',
                height: '3em',
                left:'10px',
                display: 'inline-block', 
                // position: 'relative',
                // transform: 'rotate(30deg) skewy(30deg)',
                transform: 'rotate(45deg) skewY(0deg)',
                'border-right': 'solid',
                'border-top': 'solid',
                'pointer-events': 'none',
                'box-sizing': 'border-box',
                // 'box-shadow': '3px -3px 6px -3px gray',/* a shadow effect can be added too */
                'border-radius': '4px',
                'z-index': `${z*2}`,
            })
            this.ul.appendChild(li)
            // this.ul.appendChild(div)
        }
    }

    constructor(terminal, text, line_no, width,height){
        this.terminal = terminal
        // this.node = HTML.make('input','cb_edit',[], {})
        // HTML.style(this.node, { width: 'inherit'});

        // this.button = new Button(this.terminal)
        this.container =  HTML.make('div','',[],{});
        HTML.style(this.container,{ width: '100%', display: 'flex', 'flex-direction': 'row','position':'relative'});
        this.reload(text, line_no, width, height);
        this.container.appendChild(this.ul);
        // this.container.appendChild(this.node);
        // this.container.appendChild(this.button.node);

        // this.node.addEventListener('keydown', terminal.key_down.bind(terminal));
        // this.node.addEventListener('keyup', terminal.key_up.bind(terminal));
        // this.node.addEventListener('click', HTML.full_focus, false);
        // this.node.addEventListener('click', terminal.toggle_list.bind(terminal));
        // this.node.addEventListener('focus', terminal.on_focus_input.bind(terminal));
        // this.node.addEventListener('blur', terminal.focus_out.bind(terminal));
        this.focused = false
    }


	setup_pulse(){
		let pulse = 0;
		let dis  = this;
		const interval = setInterval(() => {
			if(dis.status === 'Cancelled !' || dis.status === 'Completed !'){
				dis.remove(); // dis.style.display =  'none'
				clearInterval(interval);
				return;
			}
			if(dis.progress<0){ dis.status = 'Cancelled !'; }
			else if(dis.progress==100){ dis.status = 'Completed !'; }
			else{
				const circle = dis.shadow_root.querySelector('circle');
				if(circle){ circle.nextElementSibling.textContent = dis.status.padEnd(dis.status.length+(pulse%4),'.'); }
				else{
					dis.remove();
					clearInterval(interval); } }
			pulse++;
		}, 1000);
	}

	

}
