import { HTML } from "Medusa/Parseltongue/HTML/HTML.js";
import { Sequence } from "Medusa/Parseltongue/Jargon/Linguistic/Sequence/Sequence.js";
// import { readMetadata } from "../../TextureSpace/Image/PNG/Metadata/Metadata.js";
import { Button } from "../Button/Button.js";
import { Key } from "./Key/Key.js";
import { JS } from "Medusa/Parseltongue/JS/JS.js";
window.sequence = Sequence
export class Input {
	static command_types = {
		'delete_line': [['delete', 'remove', 'del'].reduce((l, w, i, a) => { return l + (i < a.length - 1 ? `${w}|` : `${w})`) }, '^(?<command>') + ' line (?<line_no>[\\d]+)', ['line_no']],
		'replace_line': [['replace'].reduce((l, w, i, a) => { return l + (i < a.length - 1 ? `${w}|` : `${w})`) }, '^(?<command>') + ' line (?<line_no>[\\d]+) |  (?<line>[\\d]+)', ['line_no', -1]],
		'insert_line': [['before', 'after'].reduce((l, w, i, a) => { return l + (i < a.length - 1 ? `${w}|` : `${w})`) }, '^(?<command>') + ' line (?<line>[\\d]+) |  (?<line>[\\d]+)', ['line_no', -1]],
	}
	get_command() {
		for (const cmd in Input.command_types) {
			const [regex, arg_format] = command_types[cmd]
			const matches = [...this.value.matchAll(new RegExp(regex), 'gid')]
			if (matches.length) {
				const match = matches[0]
				const groups = match.indices.groups
				let [range] = Boundary.get_empties([0]);
				for (const group_name in groups) {
					const group = groups[group_name]
					range.add(group[0], group[1]);
				}
				const args = arg_format.forEach(arg => { return match.groups[arg] }); // if(['progress', 'status', 'p_key'].every(prop => gatepass[prop]) ){} // Re-arrange
				args.push(this.value.substring(range.maximum))
				const func = Parseltongue.get(this.terminal, cmd);
				if (typeof func === 'function') {
					const retval = func.apply(this, ...args); /* return fn.call(script); */
					return retval
				}
			}
		}
	}
	get pool() { return this._pool || this.terminal.pool }

	constructor(terminal, pool) {
		this.terminal = terminal
		this.node = HTML.make('input', 'medusa-darkmode-noshadow', [], {})
		HTML.style(this.node, { width: 'inherit', 'outline': 'none', 'text-align': 'center', 'border-width': '1px', 'border-color': 'white' });//'limegreen'})
		HTML.configure(this.node, { type: 'text', id: "cb1-input", role: "combobox", 'aria-autocomplete': "both", 'aria-expanded': "false", 'aria-controls': "cb1-listbox" })

		this.button = new Button(this.terminal)
		this.container = HTML.make('div', '', [], {});
		HTML.style(this.container, { width: '100%', display: 'flex', 'flex-direction': 'row', 'position': 'relative' });
		this.container.appendChild(this.node);
		this.container.appendChild(this.button.node);

		this.node.addEventListener('keydown', this.key_down.bind(this));
		this.node.addEventListener('keyup', this.key_up.bind(this));
		this.node.addEventListener('click', HTML.full_focus, false);
		this.node.addEventListener('click', terminal.fullscreen.bind(terminal), false);
		this._pool = pool ? pool : this.terminal.pool
		// this.node.addEventListener('click', terminal.toggle_list.bind(terminal));
		// this.node.addEventListener('focus', terminal.on_focus_input.bind(terminal));
		// this.node.addEventListener('blur', terminal.focus_out.bind(terminal));
		this.focused = false
		this.filter = ''
		this.draw_scale = 1.0
		this.node.value = location.href + "|/ reserved / MadTesla / Clothes" + location.href
	}
	set activedescendant(value) {
		this.node.setAttribute('aria-activedescendant', value)
	}

	focus_in() {
		// this.node.parentNode.classList.add('focus'); // set the focus class to the parent for easier styling
		this.node.classList.add('focus'); // set the focus class to the parent for easier styling
		this.focused = true;
	}

	focus_out() {
		this.node.classList.remove('focus');
		// this.node.parentNode.classList.remove('focus');
		this.focused = false;
	}

	open() {
		this.node.setAttribute('aria-expanded', 'true');
		this.button.open()
	}

	close() {
		this.node.setAttribute('aria-expanded', 'false');
	}
	event_within(event) {
		return this.node.contains(event.target) || this.button.node.contains(event.target)
	}

	getSel() {
		var start = this.node.selectionStart; // obtain the index of the first selected character
		var finish = this.node.selectionEnd; // obtain the index of the last selected character
		var allText = this.value; //obtain all Text
		var sel = allText.substring(start, finish); // obtain the selected text
		var newText = allText.substring(0, start) + "<center>" + sel + "</center>" + allText.substring(finish, allText.length); //append te text;
		this.value = newText;
	}

	get selection() {
		let [sstart, send] = [this.node.selectionStart, this.node.selectionEnd]
		return this.node.value.slice(Math.min(sstart, send), Math.max(sstart, send))
	}

	set selection(text) { this.node.setRangeText(text) }
	select(start, end) { this.node.setSelectionRange(Math.min(start, end), Math.max(start, end)) }

	get value() {
		const splits = new V((JS.multi_split(this.node.value, '<>|/;:\\\\')));
		[this.trailer, this.lead] = [splits.items(0, -1), splits.items(-1)]
		console.log(this.trailer, this.lead)
		return this.lead ? this.lead[0] : ""
		// return this.node.value 
	}

	set value(value) {
		const pool = this.pool
		this.filter = value;
		this.flush(value)
		// this.node.value = value
		this.node.setSelectionRange(this.filter.length, this.filter.length);
		pool.populate(this.filter);
	}

	flush(value) {
		this.node.value = this.trailer + value
		this.trailer = ''
	}

	set_option(option, no_highlight) {
		const pool = this.pool
		if (typeof no_highlight !== 'boolean') { no_highlight = false; }
		if (option) {
			pool.option = option;
			// this.setCurrentOptionStyle(pool.option);
			// pool.option.scroll_to();
			pool.scroll_to(option);
			this.activedescendent = true
			// this.flush(pool.option.value)
			// // this.node.value = pool.option.value;
			// if (no_highlight) {  this.node.setSelectionRange( pool.option.length, pool.option.length ); } 
			// else {  this.node.setSelectionRange( this.filter.length, pool.option.length );}
		}
	}


	async incoming(event, data) {
		switch (event) {
			case 'queued': // image.src = data? data:"../../../../../Environments/Medusa/Medallion.png";
				break;
			case 'pre-send': // image.src = data? data:"../../../../../Environments/Medusa/Medallion.png";
				break;
			case 'sent': // image.src = data? data:"../../../../../Environments/Medusa/Medallion.png";
				break;
			case 'error': // image.src = data? data:"../../../../../Environments/Medusa/Medallion.png";
				break;
			case 'received':
				var [gatepass, parseltongue, payload] = data
				let [json, blob] = payload
				if (json) {
					const t = this.terminal
					payload = json
					var { gatepass, parseltongue, payload } = payload
					var { address, script } = payload
					t.addressbar.set_address(address)
					t.document.load_script(script)
					t.log.value = parseltongue
					return [gatepass, parseltongue, payload]
				}
				else {
					payload = blob
					var image = document.createElement('img');
					let sp = this.terminal.superposition
					const object_url = URL.createObjectURL(payload);
					const buffer = await payload.arrayBuffer();
					const metadata = readMetadata(buffer);
					// console.log(metadata)					
					image.onload = function (e) { sp.image_hvrp(this, metadata, this.draw_scale) };
					image.src = object_url
					var { gatepass, parseltongue, payload } = JSON.parse(metadata['tEXt'].data)
					return [gatepass, parseltongue, payload]
					// return [JSON.parse(metadata['tEXt'].gatepass), JSON.parse(metadata['tEXt'].parseltongue), JSON.parse(metadata['tEXt'].payload)]
					// return metadata['tEXt'].asset_hash
				}
		}
	}


	change_address() {
		// var form = new FormData();
		// form.append('parseltongue', 'mirror:parseltongue script');
		// form.append('payload', this.value);
		const value = this.value
		const heads = new V((JS.multi_split(value, ',.!?<>\\[\\]{}|;:')));
		if (heads.length>=1) {
			const head = heads.first_value
			if (head.startsWith('\\') || head.startsWith('/')) {
				let v = this.terminal.addressbar.vantage.travel(head)
				this.terminal.addressbar.set_address(v.address)
			} 
				
		}
		// const t = this.terminal
		// const form = {}
		// form['parseltongue'] = 'mirror:parseltongue script'
		// form['payload'] = { address: t.addressbar.address, command: this.value }
		// this.terminal.program.queue('BookKeeper', 'change address', '', form, this);
	}

	save_script() {
		// var form = new FormData();
		// form.append('parseltongue', 'mirror:parseltongue script');
		// form.append('payload', this.value);
		const t = this.terminal
		const form = {}
		form['parseltongue'] = 'mirror:parseltongue script'
		form['payload'] = { address: t.addressbar.address, script: t.document.script.join('\n'), command: this.value }
		this.terminal.program.queue('BookKeeper', 'save script', '', form, this);
	}

	reload_script() {
		// var form = new FormData();
		// form.append('parseltongue', 'mirror:parseltongue script');
		// form.append('payload', this.value);
		const t = this.terminal
		const form = {}
		form['parseltongue'] = 'mirror:parseltongue script'
		form['payload'] = { address: t.addressbar.address, command: this.value }
		this.terminal.program.queue('BookKeeper', 'reload script', '', form, this);
	}

	render_script() {
		// var form = new FormData();
		// form.append('parseltongue', 'mirror:parseltongue script');
		// form.append('payload', this.value);
		const t = this.terminal
		const form = {}
		form['parseltongue'] = 'mirror:parseltongue script'
		form['payload'] = { address: t.addressbar.address, command: this.value }
		this.terminal.program.queue('MatchMaker', 'render script', '', form, this);
	}

	draw_script(...args) {
		// var form = new FormData();
		// form.append('parseltongue', 'mirror:parseltongue script');
		// form.append('payload', this.value);
		const t = this.terminal
		const form = {}
		form['parseltongue'] = 'mirror:parseltongue script'
		form['payload'] = { address: t.addressbar.address, task_id: 1 }
		this.terminal.program.queue('TaskMaster', 'retrieve render', '', form, this);
	}

	execute() {
		const t = this.terminal
		var pt = Parseltongue.clean(this.value)
		// if (pt.endsWith('.')) {
		// 	pt = pt.slice(0, pt.length - 1)
		// 	t.document.add(pt)
		// 	return
		// }
		const args = pt.split(' ') // MD5('PRINCESS 0.5.4v.blend,PoseAtlas/captured01,MBlab_sk1616213127.086241,0,0,5.0,captured01')==='7320677ccfb68a31538462c249cd82d8'
		try {
			const graph_args = pt.split('>')
			if (graph_args.length === 3) { graph.addLink }
			else if (pt.startsWith('deploy ')) {
				// renderer.getNode(1).size = 40
				// renderer.getNode(1).subtype = 1
				pt = pt.replace(/^deploy /g, "")
				const deploy_sets = pt.split(',')
				deploy_sets.forEach((deploy_set) => {
					const node_args = deploy_set.split(' ')
					node_args.forEach((n) => { renderer.getNode(parseInt(n)).subtype = 1; })
				})
			}
			else if (pt === 'disband all') { graph.forEachLink((l) => { graph.removeLink(l) }) }
			else if (pt === 'kill all') {
				graph.forEachNode((l) => { graph.removeNode(l.id) })
			}
			else if (pt.startsWith('link ')) {
				pt = pt.replace(/^link /g, "")
				const link_sets = pt.split(',')
				link_sets.forEach((link_set) => {
					const node_args = link_set.split('&')
					if (node_args.length < 2) { throw new Error(`Not enough nodes in :${node_args.join(' & ')}`); }
					else {
						node_args.reduce((p, c) => {
							graph.addLink(parseInt(p), parseInt(c));
							return c;
						})
					}
				})
			}
			else if (pt.startsWith('kill ')) {
				pt = pt.replace(/^kill /g, "")
				const link_sets = pt.split(',')
				link_sets.forEach((link_set) => {
					const node_args = link_set.split(' ')
					node_args.forEach((n) => { graph.removeNode(parseInt(n)); })
				})
			}
			else if (pt.startsWith('\\') || pt.startsWith('/')) { this.change_address() }
			// t.document.execute(pt)
		} catch (error) {
			t.log.value = error
		}
		return
		if (pt === 'test postmaster') { t.import_default_superpositions() }
		else if (pt.startsWith('load pose')) {
			const [name, name_hash] = t.superposition.hvrp_hash(...args.slice(2))
			t.superposition.import_image(t.program, name_hash)
		}
		else if (pt.startsWith('scroll')) { t.addressbar.scroll_into_view(args[1] ? parseInt(args[1]) : 0) }
		else if (pt.startsWith('candidate')) { t.pool.scroll_into_view(args[1] ? parseInt(args[1]) : 0) }
		else if (pt.startsWith('recorder')) { t.recorder.execute(pt) }
		else if (pt.startsWith('>')) { this.change_address() }
		else if (pt.startsWith('<')) { this.change_address() }
		else if (pt === 'save') { this.save_script() }
		else if (pt === 'reload') { this.reload_script() }
		else if (pt === 'render') { this.render_script() }
		else if (pt.startsWith('draw ')) {
			this.draw_scale = args[1] ? parseInt(args[1]) : this.draw_scale;
			this.draw_script(...args.slice(1))
		}
		else if (pt.startsWith('block')) { t.block.run(pt) }
		else {
			try {
				t.document.execute(pt)
			} catch (error) {
				t.log.value = error
			}
		}
		// t.match_wordspace()
		// alert(pt)
	}

	// execute() {
	// 	this.terminal.execute(this.value)
	// 	// let pt = Parseltongue.clean(this.value)
	// 	// if (this.address.qualifier(pt)){
	// 	//	 // const parameters = this.address.execute(pt)
	// 	//	 // const parameters = this.pool.parameterize(pt)
	// 	//	 // const parameters = this.log.stack(payload)
	// 	// }
	// 	// else if (this.pool.qualifier(pt)){ 
	// 	//	 this.pool.populate(pt)
	// 	// }

	// }

	invert_navigation() {
		this.navigation_inverted = true
	}

	navigate_up(key, forced) {
		const pool = this.pool
		if (this.navigation_inverted && !forced) return this.navigate_down(key, true)
		if (pool.options.length > 0) {
			if (key.alt) { this.open(); }
			else {
				if (pool.focused || pool.options.length > 1) { this.set_option(pool.next_option, true); }
				else { this.set_option(pool.first_option, true); }
			}
		}
	}

	navigate_down(key, forced) {
		const pool = this.pool
		if (this.navigation_inverted && !forced) return this.navigate_up(key, true)
		if (pool.length) {
			if (key.alt) { this.set_option(pool.last_option, true); }
			else { this.set_option(pool.previous_option, true); }
		}
	}

	key_down(event) {
		const terminal = this.terminal
		const pool = this.pool
		var propogate = true;
		const key = new Key(event)
		if (key.ctrl_or_shift) { return; }
		if (key.enter) {
			if (pool.focused) { this.value = pool.option.value; }
			this.execute();
			propogate = false
		}
		else if (key.arrowdown) {
			this.navigate_down(key, false)
			propogate = false
		}
		else if (key.arrowup) {
			this.navigate_up(key, false)
			propogate = false
		}
		else if (key.tab) {
			if (pool.option) { this.value = pool.option.textContent; }
			propogate = false
		}
		else if (key.home) {
			this.node.setSelectionRange(0, 0);
			propogate = false
		}
		else if (key.end) {
			var length = this.node.value.length;
			this.node.setSelectionRange(length, length);
			propogate = false
		}
		if (propogate == false) { key.block_event() }
	}

	key_up(event) {
		const pool = this.pool
		const key = new Key(event)
		var flag = false, option = null//, char = event.key;
		if (key.space) {
			if (this.value.length && this.value[this.value.length - 1] === ' ') {
				this.flush(Parseltongue.clean(this.value) + ' ')
				// this.node.value = Parseltongue.clean(this.value)+' ';
				key.key = ''
			}
		}
		if (key.printable) { this.filter += key.key; }
		if (this.node.value.length < this.filter.length) { // this is for the case when a selection in the textbox has been deleted
			this.filter = this.node.value;
			pool.option = null;
			pool.populate(this.filter);
		}
		if (key.escape) { return; }
		if (key.backspace) {
			this.filter = this.node.value;
			pool.option = null;
			pool.populate(this.filter);
			flag = true;
		}
		else if (key.end) {
			this.filter = this.node.value;
			flag = true;
		}
		else if (key.printable) {
			flag = true;
			option = pool.populate(this.filter);
			if (option) {
				if (option.is_match(this.node.value)) {
					pool.option = option;
					pool.scroll_to(option);
					this.set_option(option);
				}
				else { pool.option = null; }
			}
			else {
				pool.option = null;
				this.activedescendent = false
			}
		}
		if (flag) { key.block_event() }
	}

	get value() { return this.node.value }
	get cursor() { return [this.node.selectionStart, this.node.selectionEnd] }
	tailhead(cursor) {
		cursor = cursor || this.cursor
		return [this.value.substring(0, cursor[0]), this.value.substring(cursor[0])]
	}

	cursor_segment(cursor) {
		let [value, head, tail] = [this.node.value, ...this.tailhead(cursor)]
		const heads = new V((JS.multi_split(head, ',.!?<>\\[\\]{}|/;:\\\\')));
		let [seg_idx, seg_start, seg_len] = [-1, 0, 0]
		for (const segment of heads.items(0)) {
			if (seg_start < head.length) {
				seg_idx += 1;
				seg_start += segment.length
				seg_len = segment.length
			}
			else { break; }
		}
		let is_empty = seg_idx < 0
		seg_start += heads.length - 1
		let sections = new V((JS.multi_split(value, ',.!?<>\\[\\]{}|/;:\\\\')))
		let section = sections.items(is_empty ? 0 : seg_idx)
		let section_len = section ? section[0] ? section[0].length : 0 : 0
		if (this.selection && !cursor) {
			let is_boundary = JS.character_regex(',.!?<>\\[\\]{}|/;:\\\\').test(this.selection)
			if (is_boundary) { return [is_empty ? undefined : ((seg_idx * 2) + 1), seg_start, seg_len, 1, true] }
		}
		return [is_empty ? undefined : (seg_idx * 2), seg_start, seg_len, section_len, false]
	}
	get segment_next() { return [this.node.selectionStart, this.node.selectionEnd] }

	navigate(key) {
		let [seg_idx, seg_start, seg_len, section_len, is_controller] = this.cursor_segment()
		let selection = this.selection
		let cursor = this.cursor
		if (key.horizontal_navigation) {
			this.tailpipe(key, [cursor[1]])
			let [is_left_border, is_right_border] = [seg_len == 0, cursor[1] == seg_start + section_len]
			if (key.arrowleft) {
				if (is_controller) { this.select(seg_start - seg_len, seg_start) }
				else if (is_left_border) { this.select(seg_start - 1, seg_start) }
				else { this.select(seg_start - seg_len, seg_start - seg_len + section_len) }
			}
			if (key.arrowright) {
				if (is_controller) {
					[seg_idx, seg_start, seg_len, section_len] = this.cursor_segment([seg_start + 1])
					this.select(seg_start, seg_start + section_len)
				}
				else if (is_right_border) { this.select(seg_start + section_len, seg_start + section_len + 1) }
				else { this.select(seg_start - seg_len, seg_start - seg_len + section_len) }
			}
		}
		else if (key.vertical_navigation) {
			if (key.arrowdown) {
				if (key.alt) {}
				else {}
				this.navigate_down(key, false)
				this.select(seg_start - seg_len, seg_start - seg_len + section_len)
				this.selection = this.pool.option.value
			}
			else if (key.arrowup) {
				if (key.alt) {}
				else {}
				this.navigate_up(key, false)
				this.select(seg_start - seg_len, seg_start - seg_len + section_len)
				this.selection = this.pool.option.value
			}
		}
		
	}

	tailpipe(key, cursor) {
		let [lead, trail] = this.tailhead(cursor)
		// const splits = new V((JS.multi_split(lead, '|/;:\\\\')));
		const splits = new V((JS.multi_split(lead, '|;:<>')));
		let [trailer, body] = [splits.items(0, -1), splits.items(-1)[0]]
		let pipe = lead[trailer.join('_').length]
		// pipe = body.length<2 ? pipe : lead[trailer.join('_').length-1]
		// return
		// const address = new V((JS.multi_split(body, '<>')));
		const address = new V((JS.multi_split(body, '/\\\\')));
		let [address_trailer, address_head] = [splits.items(0, -1), splits.items(-1)[0]]
		let traveller = address.length == 1 ? "" : Parseltongue.clean(body.substring(0, address.items(0, -1).join('_').length))
		let [filter, filter_length] = [Parseltongue.clean(address.items(-1)[0]), 0]
		let v = this.terminal.addressbar.vantage.travel(traveller).load()
		let option = this.pool.populate(filter, v.keys(), v)
		let clean_lead = lead.length - filter.length
		console.log(lead, trail)
		if (key.printable) {
			if (option) {
				this.node.value = lead + option.value.substring(filter.length) + trail
				this.select(clean_lead + filter.length, clean_lead + option.value.length)
				console.log(option.value)
			}
		}
		// else if (key.horizontal_navigation) {
		//	 let [seg_idx , seg_start, seg_len, section_len, is_controller] = this.cursor_segment()
		//	 let selection = this.selection
		//	 let cursor = this.cursor
		//	 let [is_left_border, is_right_border] = [seg_len==0, cursor[1]==seg_start+section_len]
		//	 if(key.arrowleft){
		//		 if (is_controller){ this.select(seg_start-seg_len, seg_start) }
		//		 else if (is_left_border){ this.select(seg_start-1, seg_start)}
		//		 else{  this.select(seg_start-seg_len, seg_start-seg_len+section_len)  } }
		//	 if(key.arrowright){
		//		 if (is_controller){ 
		//			 [seg_idx , seg_start, seg_len, section_len] = this.cursor_segment([seg_start+1])
		//			 this.select(seg_start, seg_start+section_len) }
		//		 else if (is_right_border){ this.select(seg_start+section_len, seg_start+section_len+1)}
		//		 else{ this.select(seg_start-seg_len, seg_start-seg_len+section_len) } } }
		// else if (key.vertical_navigation) {
		//	 console.log(selection, seg_idx , seg_start, seg_len, section_len)

		// }
		// return true
		// if (this.terminal.addressbar.qualifies(traveller)){
		// 	this.addressbar.set_address(address.join('/'))
		// }
		// console.log(this.trailer, this.lead)
		// return this.lead? this.lead[0] : ""
	}
	body(event) { }

	key_up(event) {
		const key = new Key(event)
		const terminal = this.terminal
		if (key.enter) {
			var pt = Parseltongue.clean(this.value)
			terminal.document.add(pt) 
			this.execute()
		}
		else if (!key.vertical_navigation) {
			this.tailpipe(key) }
		// key.block_event()
	}
	
	key_down(event) {
		const pool = this.pool
		const key = new Key(event)
		// let block = this.tailpipe(key)
		if (key.is_navigation) {
			this.navigate(key)
			key.block_event()
		}
		else {
		}
	}

}