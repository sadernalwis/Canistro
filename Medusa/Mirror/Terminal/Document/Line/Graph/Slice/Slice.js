
class Slice{
	constructor(name,count) {
		super();
		this.name = name;
		this.count = count;
		this.coverage = count;
		
		this.current_radius = 0;
		this.current_startAngle = 0;
		this.current_endAngle = 0;

		this.final_radius = 0;
		this.final_startAngle = 0;
		this.final_endAngle = 0;

		this.duration = 1;
		this.elapsed = 1;
		this.svg = new Path('volElem', 10, 0, 45, 135, "#9E7818", 1, 'none', 0.4)



		// Kick off first phase of animation

		var  inner = document.getElementById("inner");
		var  tx = 0;     // the animated X position
		var  angle = 0;  // the animated angle
		stepRightTo200();

		// this.svg.setAttribute("transform", "translate(1 1)"); //https://stackoverflow.com/questions/44140069/how-to-translate-the-path-of-svg
		// this.svg.setAttribute("transform-origin", "172.498px 243.337px");
		// this.svg.setAttribute("transform", "rotate(-12.5)");
	}
	stepRightTo200() { //https://stackoverflow.com/questions/39792665/moving-an-svg-element-after-rotation
		setTimeout(function() {
			tx += 4;
			inner.setAttribute('transform', 'translate('+tx+',0) rotate('+angle+',50,100)');
			if (tx < 200){ stepRightTo200();}
			else{ rotateTo45();}
		}, 32);
	}
	
	rotateTo45() {
		setTimeout(function() {
			angle += 1;
			inner.setAttribute('transform', 'translate('+tx+',0) rotate('+angle+',50,100)');
			if (angle < 45){ rotateTo45();}
			else{ stepRightTo400(); }
		}, 32);
	} 
	stepRightTo400() {
		setTimeout(function() {
			tx += 4;
			inner.setAttribute('transform', 'translate('+tx+',0) rotate('+angle+',50,100)');
			if (tx < 400){ stepRightTo400();}
		}, 32);
	}
	
	is_ready(){
		return  this.current_radius == this.final_radius &&
				this.current_startAngle == this.final_startAngle &&
				this.current_endAngle == this.final_endAngle ;
	}
	elapse(ratio){
		this.current_radius = this.final_radius*ratio;
		this.current_startAngle = this.final_startAngle*ratio;
		this.current_endAngle = this.final_endAngle*ratio;
	}
	update(){
		if(this.elapsed<this.duration){
			if(this.is_ready()){
				this.elapsed = this.duration;
			}
			else{
				if(this.current_radius != this.final_radius)		 { this.current_radius = this.final_radius/this.duration*this.elapsed; }
				if(this.current_startAngle != this.final_startAngle) { this.current_startAngle = this.final_startAngle/this.duration*this.elapsed; }
				if(this.current_endAngle != this.final_endAngle)	 { this.current_endAngle = this.final_endAngle/this.duration*this.elapsed; }
				

				this.elapsed++;
			}
		}
	}
}
export class Radar extends HTMLElement {
	update(){
		this.slices.forEach((slice,index,slices)=>{ 
			slice.update()
		});
	}

	add_slice(name){
		this.slices.has(name)? this.slices.get(name).count++ : this.slices.set(name,new Slice(name,1));
	}
	recreate_slices(){
		const total_contacts = this.slices.reduce((total,slice,index,slices)=>{ return total+slice.count; },0);
		this.slices.forEach((slice,index,slices)=>{ 
			
		});
	}

	add_contact(name, contact){

	}

  
	add_object(name, object){
		
        for (var attr_name in attributes){ // https://www.py4u.net/discuss/975238
            element.setAttributeNS(null, attr_name.replace(/[A-Z]/g, function(m, attr_name, o, s) { return "-" + m.toLowerCase(); }), attributes[attr_name]);
        }
	}
	// contract_H_713b51a6fb1873637792885f58949e71_e37a3c00309bcd599d14c1e2085ca5b8_2021_12_31_20
	// contract_H_713b51a6fb1873637792885f58949e71_e37a3c00309bcd599d1
	// contract_H_713b51a6fb1873637792885f58949e71_2021_12_31_20
    sort (array, ...attrs){ // https://stackoverflow.com/questions/6913512/how-to-sort-an-array-of-objects-by-multiple-fields
        let predicates = attrs.map(pred => { // generate an array of predicate-objects contains property getter, and descending indicator
            let descending = pred.charAt(0) === '-' ? -1 : 1;
            pred = pred.replace(/^-/, '');
            return { getter: o => o[pred], descend: descending };
        });

        return array.map(item => { // schwartzian transform idiom implementation. aka: "decorate-sort-undecorate"
				return {
					src: item,
					compareValues: predicates.map(predicate => predicate.getter(item))
				};
				})
			.sort((o1, o2) => {
					let i = -1, result = 0;
					while (++i < predicates.length) {
						if (o1.compareValues[i] < o2.compareValues[i]){ result = -1;}
						if (o1.compareValues[i] > o2.compareValues[i]){ result = 1;}
						if (result *= predicates[i].descend)		  { break;}
					}
					return result;
					})
				.map(item => item.src);
        // let games = [
        //     { name: 'Pako',              rating: 4.21 },
        //     { name: 'Hill Climb Racing', rating: 3.88 },
        //     { name: 'Angry Birds Space', rating: 3.88 },
        //     { name: 'Badland',           rating: 4.33 }];
        //   console.log(sortByAttribute(games, 'name')); //   // sort by one attribute
        //   console.log(sortByAttribute(games, '-rating', 'name')); //   // sort by mupltiple attributes
          
    }
  
	get width() {
	  return this.video.width;
	}
  
	set width(val) {
	  this.setAttribute(`width`, val);
	}
  
	get height() {
	  return this.video.height;
	}
  
	set height(val) {
	  this.setAttribuite(`height`, val);
	}
  
	constructor() {
		super();
		this.shadow = this.attachShadow({mode: 'open'});
		this.objects = new Map();
		this.slices = new Map();
		this.slice_chain = 'objects.*.industry:/objects.*.category:/objects.*.subcategory:';

		// let wide_set = Parseltongue.sort(candidates, 'r_cw', '-r_index');
	}
    constructor() {
		super();

		let mainsvg = document.getElementById('speakersvg');
		let parent = {};
		const speaker_m   = new Path(parent, '', null, mainsvg, {svg:mainsvg}, null, 'def_ref', false,'speakB','','volElem', 10, 0, 0, 359, "#9E7818", 1, 'none', 0.4);
		const speaker_w   = new Path(parent, '', null, mainsvg, {svg:mainsvg}, null, 'def_ref', false,'speakF','','volElem', 25, 0, 0, 359, "#9E7818", 1, 'none', 0.4);
		const big_arc_m   = new Path(parent, '', null, mainsvg, {svg:mainsvg}, null, 'def_ref', false,'arcBigB','','volElem', 85, 0, 0, 359, "#9E7818", 1, 'none', 0.4);
		const big_arc_w   = new Path(parent, '', null, mainsvg, {svg:mainsvg}, null, 'def_ref', false,'arcBigF','','volElem', 85, 0, 0, 359, "#F4AF0A", 1, 'none', 1.0);
		const small_arc_m = new Path(parent, '', null, mainsvg, {svg:mainsvg}, null, 'def_ref', false,'arcSmB','','volElem', 55, 0, 0, 359, "#9E7818", 1, 'none', 0.4);
		const small_arc_w = new Path(parent, '', null, mainsvg, {svg:mainsvg}, null, 'def_ref', false,'arcSmF','','volElem', 55, 0, 0, 359, "#F4AF0A", 1, 'none', 1.0);
		const cross_l 	  = new Path(parent, '', null, mainsvg, {svg:mainsvg}, null, 'def_ref', false,'crossLtRb','','volElem', 100, 0, 0, 359, "#9E7818", 1, 'none', 0.4);
		const cross_r 	  = new Path(parent, '', null, mainsvg, {svg:mainsvg}, null, 'def_ref', false,'crossLbRt','','volElem', 115, 0, 0, 359, "#9E7818", 1, 'none', 0.4);
		let traveller = new Traveller(parent, 'traveller_1', null, mainsvg, {svg:mainsvg}, null, null, true);
		let dataset = new DataSet(parent, 'dataset_1', null, mainsvg, {svg:mainsvg}, null, null, false);

		
  
		this._root = this.attachShadow({mode: 'open'});
		// Apply external styles to the shadow dom
		const linkElem = document.createElement('link');
		linkElem.setAttribute('rel', 'stylesheet');
		linkElem.setAttribute('href', 'assets/css/Medusa.css');
		this._root.appendChild(linkElem); // Attach the created elements to the shadow dom
		this.status = '';
		this.progress = 0;

		let dis  = this;
		let pulse = 0;
		const interval = setInterval(() => {
		if(dis.status === 'Cancelled !' || dis.status === 'Completed !'){
			// dis.style.display =  'none'
			dis.remove();
			clearInterval(interval);
			return;
		}

		if(dis.progress<0){
			dis.status = 'Cancelled !';
		}
		else if(dis.progress==100){
			dis.status = 'Completed !';
		}
		else{
			const circle = dis._root.querySelector('circle');
			if(circle){
				circle.nextElementSibling.textContent = dis.status.padEnd(dis.status.length+(pulse%4),'.');    
			}
			else{
				
				dis.remove();
				clearInterval(interval);
			}
		}
		pulse++;
		}, 1000);
  
	  }
    
    setProgress(percent) {
      const offset = this._circumference - (percent / 100 * this._circumference);
      const circle = this._root.querySelector('circle');
      circle.style.strokeDashoffset = offset; 
      circle.previousElementSibling.textContent = `${percent}%`;

      
      circle.nextElementSibling.textContent = this.status;
      this.progress = parseInt(percent);
      // circle.nextElementSibling.textContent = this.status.padEnd(this.status.length+(percent%4),'.');
      // if(percent==='100'){
      //   this.status = 'Completed !';
      //   let dis  = this;
      //   circle.nextElementSibling.textContent = this.status;
      //   const interval = setInterval(() => {
      //       dis.style.display =  'none'
      //       clearInterval(interval);
      //   }, 1000);
      // }
    }

    redraw(percent) {
      const radius = this.getAttribute('radius');
      const progress = this.getAttribute('progress');
      const status = this.getAttribute('status');
      const stroke = radius * 0.2;
      const svg_width = radius * 5;
      const svg_height = radius * 2;
      const normalizedRadius = radius - stroke * 2;
      this._circumference = normalizedRadius * 2 * Math.PI;
      
      this._root.innerHTML = `
        <svg height="${svg_height}" width="${svg_width}">
            <text 
                x="${radius}"
                y="${radius}"
                font-size="18"
                text-anchor="middle"
                dominant-baseline="middle" 
                fill="black">${progress}</text>
            <circle class='time-scope'
                r="${normalizedRadius}"
                cx="${radius}"
                cy="${radius}"
                stroke="black"
                stroke-dasharray="${this._circumference} ${this._circumference}"
                style="stroke-dashoffset:${this._circumference}"
                stroke-width="${stroke}"
                fill="transparent" />
      
            <text 
                x="${radius * 2}"
                y="${radius}"
                font-size="18"
                text-anchor="start"
                dominant-baseline="middle" 
                fill="black">${status}</text>
        </svg>
        <style>
          .time-scope {
            stroke: #e74c3c;
            stroke-width: 10;
            stroke-linecap: round;
            fill: none;
            stroke-dashoffset: 0;
            stroke-dasharray: ${this._circumference}; // pi*2*circle_radius, the length of the "path"
            stroke-linecap: round;
            animation: dash 2s ease-in-out infinite;
            transform-origin: ${radius}px ${radius}px;
            transform: rotate(-90deg);
            
          }
        </style>
      `;

      `
      circle {
        stroke: #e74c3c;
        stroke-width: 10;
        fill: none;
        stroke-dashoffset: 0;
        stroke-dasharray: 504; // pi*2*circle_radius, the length of the "path"
        stroke-linecap: round;
        animation: dash 2s ease-in-out infinite;
      }`
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'progress') {
        this.setProgress(newValue);
      }
      else{
        this[name] = newValue;
        this.redraw();
      }
    }
  }
  
  