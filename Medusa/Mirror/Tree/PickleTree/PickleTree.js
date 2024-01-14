import { HTML } from "Medusa/Parseltongue/HTML/HTML.js";
import { JS } from "Medusa/Parseltongue/JS/JS.js";
import { Node } from "./Node/Node.js";
export class PickleTree {
	/** Pickle tree component created by Kadir Barış Bozat
	 * @param {object} obj as tree object */
	constructor(obj) {
		this.target = obj.c_target; // target div id
		this.area = ""; // building area
		this.nodeList = {}; // available nodes list
		this.rowCreateCallback = obj.rowCreateCallback; // row create callback
		this.drawCallback = obj.drawCallback; // draw callback
		this.switchCallback = obj.switchCallback; // switch callback
		this.dragCallback = obj.dragCallback; // drag callback
		this.dropCallback = obj.dropCallback; // drop callback
		this.orderCallback = obj.orderCallback; // order callback
		this.nodeRemove = obj.nodeRemoveCallback; // node removed callback
		this.data = obj.c_data; // tree json data
		this.build(obj.c_config); // build tree
		this.drawData(); 
		this.staticEvents(); /* start events */ }

	build(c_config) { /** Building main details */
		this.config = { //set default config
			key: new Date().getTime(), 
			logMode: false, // logs are open or close 
			switchMode: false, // switch mode 
			autoChild: true, // family mode: for child 
			autoParent: true, // for parent 
			foldedIcon: "fa fa-plus", // fold icon 
			unFoldedIcon: "fa fa-minus", // unfold icon 
			menuIcon: ["fa", "fa-list-ul"], // menu icon 
			foldedStatus: false, // start status is collapsed or not 
			drag: false, // drag 
			order: false, /* order */ };
		for (let key in this.config) { // check config here!!
			if (c_config[key] !== undefined) { this.config[key] = c_config[key]; } }
		if (document.getElementById(this.config.key + "_div_pickletree") !== null) { this.config.key = new Date().getTime() + 10; } //check if key is exist somewhere in document
		this.main_container = document.getElementById(this.target); // referance for some events
		this.main_container.classList.add('ptree');
		this.main_container.innerHTML = '<div id="' + this.config.key + '_div_pickletree"><ul id="' + this.config.key + '_tree_picklemain"></ul></div>';
		//console.log(this.main_container.getElementById(this.config.key+'_tree_picklemain'));
		this.area = document.getElementById(this.config.key + "_tree_picklemain");
		this.log("tree build started..");}

	drawData() { /** draw multiple data. start loading */
		if (this.data.length > 0) { //if data is exist
			let order = (list, p = { n_id: 0, Child: [] }, tree = []) => { //first reshape data
					let childrens = list.filter((y) => parseInt(y.n_parentid) === parseInt(p.n_id));
					if (childrens.length > 0) {
						childrens.sort((a, b) => JS.def_float(a.n_order_num, 0) - JS.def_float(b.n_order_num, 0)); // order items by order_num param if exist
						if (p.n_id === 0) { tree = childrens; } 
						else { p.Child = childrens; }
						for (let i = 0; i < childrens.length; i++) { order(list, childrens[i]); } }
					return tree; };
			let set = (list) => { //then create nodes
				for (let i = 0; i < list.length; i++) {
					this.createNode({
						n_data			: list[i],
						n_addional		: list[i].n_addional,
						n_value			: list[i].n_id,
						n_title			: list[i].n_title,
						n_id			: list[i].n_id,
						n_elements		: list[i].n_elements,
						n_parent		: this.getNode(list[i].n_parentid),
						n_checkStatus	: list[i].n_checkStatus === undefined ? false : list[i].n_checkStatus,
						n_order			: list[i].n_order_num, });
					if (list[i].Child) { set(list[i].Child); } } };
			set(order(this.data)); /* start chain */ }
		if (this.drawCallback !== undefined) this.drawCallback(); /* start drawcallback. end loading */ }
		
	staticEvents() { /** contains static events for tree */
		this.main_container.addEventListener("click", (e) => { //close menu
			let elm = e.target;
			document.querySelectorAll(".ptreemenuCont").forEach((menu) => { menu.outerHTML = ""; }); //close all first
			if (elm.classList.contains("menuIcon")) { setTimeout(() => { this.getMenu(e.target, this.getNode(elm.id.split("node_")[1])); }, 10); /* menu toggle event for node */ } });
		if (this.config.drag) { //drag - drop events
			this.invalid_area = { container: null, top: 0, left: 0, right: 0, bottom: 0, };
			this.main_container.addEventListener("dragstart", 
				async (e) => { //drag start
					this.invalid_area.container = document.getElementById(this.target + "node_" + e.target.id.split("node_")[1]); //give border to container
					this.invalid_area.top = this.invalid_area.container.getBoundingClientRect().top;
					this.invalid_area.left = this.invalid_area.container.getBoundingClientRect().left;
					this.invalid_area.right = this.invalid_area.left + this.invalid_area.container.offsetWidth;
					this.invalid_area.bottom = this.invalid_area.top + this.invalid_area.container.offsetHeight;
					setTimeout(() => {
						this.invalid_area.container.classList.add("valid");
						this._lock(); }, 300);
					if (this.dragCallback) { this.dragCallback(this.nodeList[parseInt(e.target.id.split("node_")[1])]); } //drag callback
					const id = e.target.id.split("node_")[1]; //draging //clone element when drag start
					this.clone = document.getElementById(this.target +'node_' + id).cloneNode(true);
					this.clone.style.position = 'absolute';
					this.clone.style.zIndex = 1000;
					this.clone.querySelectorAll('div').forEach(el=>el.style.backgroundColor = 'grey');
					this.clone.querySelectorAll('li').forEach(el=>el.style.border = 'unset !important');
					this.clone.style.width = '50vh';
					//this.clone.querySelector('ul').remove();
					this.clone.querySelectorAll('.switch').forEach(el => el.remove());
					const rul = document.createElement('ul');
					rul.appendChild(this.clone);
					const rdiv = document.createElement('div');
					rdiv.appendChild(rul);
					rdiv.classList.add('dragging-element');
					this.clone = rdiv;
					this.main_container.appendChild(this.clone); });
			this.main_container.addEventListener("drag", 
				(e) => { //dragging
					const bounds = e.currentTarget.getBoundingClientRect();
					this.clone.style.position = "absolute";
					this.clone.style.left = `${e.clientX - bounds.left + 30}px`;
					this.clone.style.top = `${e.clientY - bounds.top + 30 }px`; });
			this.main_container.addEventListener("dragend", 
				async (e) => { //drag end
					this.clone.remove();
					//console.log('drag end')
					this.invalid_area.container.classList.remove("invalid"); //remove border to container
					this.invalid_area.container.classList.remove("valid");
					this._lock(false); //make all elements pointer clean
					this.clearDebris(); //clear old targets
					const node = this.nodeList[parseInt(e.target.id.split("node_")[1])]; //get node
					node.old_parent = node.parent; //check is valid
					if (!this.invalid_area.valid) { node.parent = { id: 0 }; } 
					else {
						console.log('target' , this.drag_target);
						const drop = this.getNode(this.drag_target);
						if (this.drag_target === parseInt(e.target.id.split("node_")[1]) || this.drag_target === undefined || drop === undefined || drop.parent.value === node.value) {
							node.parent = { id: 0 }; /* this means it dragged to outside */ } 
						else { node.parent = drop; } }
					this.nodeList[node.value] = node.updateNode();
					console.log(this.nodeList[node.value]);
					if (this.dropCallback) { this.dropCallback(node); } /* drop callback */ });
			this.main_container.addEventListener("dragenter", 
				(e) => { //drag location
					//console.log('drag enter')
					this.clearDebris();
					try {
						let target = {  left: e.target.getBoundingClientRect().left, top: e.target.getBoundingClientRect().top, }; // check position is valid
						if (target.top > this.invalid_area.top && target.top < this.invalid_area.bottom && target.left > this.invalid_area.left && target.left < this.invalid_area.right) {
							this.invalid_area.valid = false;
							this.invalid_area.container.classList.add("invalid");
							this.invalid_area.container.classList.remove("valid"); } 
						else {
							this.invalid_area.valid = true;
							this.invalid_area.container.classList.remove("invalid");
							this.invalid_area.container.classList.add("valid"); }
						if (e.target.classList) {
							if (e.target.classList.contains("drop_target")) {
								e.target.classList.add("drag_triggered");
								this.drag_target = parseInt(e.target.id.split("node_")[1]); /* this is for updating node parent to current */ } } } 
					catch (e) {
						//console.log('dragging have exception..');
						this.drag_target = undefined; } }); } }

	async destroy() { //#region Helper Methods
		document.querySelectorAll(".ptreemenuCont").forEach((menu) => { menu.outerHTML = ""; }); //remove all menus
		document.getElementById(this.target).innerHTML = ""; /* remove all items */ }

	async _lock(type = true) { /** lock elements when dragging */
		const elms = document.querySelectorAll(".drop_target");
		for (let i = 0; i < elms.length; i++) {
			if (type) { elms[i].classList.add("disabled"); } 
			else { elms[i].classList.remove("disabled"); } } }

	log(message) { /** @param {string} message for log messages */
		if (this.config.logMode) { console.log(message); } }

	getNode(id) { /** @param {integer} id node id for finding node */
		this.log("node returned..");
		return this.nodeList[id]; }

	setChildNodes(node) {
		/** set child nodes for parent node
		 * @param {object} node */
		for (let key in this.nodeList) { //update node parent
			if (this.nodeList[key].id === node.parent.id) {
				this.nodeList[key].childs.push(node.id);
				const ic = document.getElementById("i_" + this.nodeList[key].id); //show icon for childs
				if (ic !== null) ic.style.display = ""; } } }

	getSelected() { /** return switched nodes */
		let nodes = [];
		for (let key in this.nodeList) { //get all checked nodes
			if (this.nodeList[key].checkStatus) nodes.push(this.nodeList[key]); }
		return nodes; }

	resetSelected(type = false) { /** reset switched nodes */
		for (let key in this.nodeList) { //get all checked nodes
			const node = this.nodeList[key];
			node.checkStatus = type;
			node.checkNode()}
		return true; }

	clearDebris() { /** drag - drop events helpers : clean entered areas after drag events */
		let elms = document.querySelectorAll(".drag_triggered"); //first clean all entered areas
		for (let i = 0; i < elms.length; i++) { elms[i].classList.remove("drag_triggered"); } }

	orderNode(e) {
		/** Node Events : order element
		 * @param {event} e */
		const isBefore = e.target.dataset.target == 1;
		const main = e.target.parentNode.parentNode.parentNode;
		const target = isBefore ? main.previousElementSibling : main.nextElementSibling;
		if (target !== null) { //get nodes
			const targetNode = this.getNode(target.id.split("_").at(-1)); //replace data
			const mainNode = this.getNode(main.id.split("_").at(-1));
			const currentOrder = mainNode.order;
			const targetOrder = targetNode.order === mainNode.order ? (isBefore ? targetNode.order - 1 : targetNode.order + 1) : targetNode.order;
			targetNode.order = currentOrder; //change order data
			mainNode.order = targetOrder;
			target.dataset.order = 'order_'+currentOrder;
			main.dataset.order   = 'order_'+targetOrder;
			main.parentNode.replaceChild(main, target); //replace element
			main.parentNode.insertBefore(target, isBefore ? main.nextSibling : main); }
		if (typeof this.orderCallback == "function") this.orderCallback(main, target); }
	// getChilds(node) {
	// 	/** get child nodes list of node
	// 	* @param {object} node */
	// 	let list = [];
	// 	for (let key in this.nodeList) {
	// 		if (node.childs.includes(this.nodeList[key].id)) { list.push(this.nodeList[key]); } }
	// 	this.log("node childs returned..");
	// 	return list; }

	// toggleNode(node) {
	// 	/** toggle open or close node childs
	// 	 * @param {object} node */
	// 	if (node.childs.length > 0) {
	// 		let ie = document.getElementById("i_" + node.id);
	// 		let ule = document.getElementById("c_" + node.id);
	// 		if (node.foldedStatus === false) {
	// 			ie.classList.remove("fa-minus"); //change icon
	// 			ie.classList.add("fa-plus");
	// 			//ule.style.display = "none"; //hide element
	// 			ule.classList.remove("active");
	// 			ule.classList.add("not-active"); } 
	// 		else {
	// 			ie.classList.remove("fa-plus"); //change icon
	// 			ie.classList.add("fa-minus");
	// 			//ule.style.display = ""; //show element
	// 			ule.classList.remove("not-active");
	// 			ule.classList.add("active"); }
	// 		node.foldedStatus = !node.foldedStatus;
	// 		for (let key in this.nodeList) { //change node status
	// 			if (this.nodeList[key].id === node.id) {
	// 				this.nodeList[key].foldedStatus = node.foldedStatus; } }
	// 		this.log("node toggled.."); } 
	// 	else { this.log("node not has childs...!"); } }

	// deleteNode(node) {
	// 	/** remove node from dom
	// 	 * @param {object} node */
	// 	let elm = document.getElementById(node.id); //remove node from old parent's child data !!!!
	// 	let childs = node.getChilds();
	// 	if (childs.length > 0) {
	// 		for (let i = 0; i < childs.length; i++) { this.deleteNode(childs[i]); } }
	// 	//delete this.nodeList[node.value]; //remove node from container
	// 	if (elm !== null) elm.parentNode.removeChild(elm);
	// 	this.log("node removed..(" + node.id + ")");
	// 	if (this.nodeRemove !== undefined) this.nodeRemove(node); }

	// checkNode(node) {
	// 	/** check node and its family.
	// 	 * @param {object} node */
	// 	//console.log(node);
	// 	let clength = node.childs.length; //then if is checked and folded unfold and open childs
	// 	if (node.checkStatus && clength > 0) {
	// 		node.foldedStatus = true; //make element looks like is folded
	// 		this.toggleNode(node); }
	// 	if (typeof this.switchCallback == "function") this.switchCallback(node); //trigger callback if exists
	// 	document.getElementById("ck_" + node.id).checked = node.checkStatus; /* check html element if family mode is open */ }

	// checkNodeFamily(node) {
	// 	/** check node childs and his parents if not checked.
	// 	* @param {object} node */
	// 	let status = node.checkStatus;
	// 	let parentCheck = async (node) => {
	// 		if (node.parent.id !== 0) { // first check if has parent
	// 			node = node.parent; //get parent node
	// 			let trans = () => {
	// 				node.checkStatus = status; //change parent node status
	// 				node.checkNode(); //check parent node
	// 				parentCheck(node); /* then restart process */ };
	// 			if (!status) { //decide for uncheck
	// 				let valid = true; //if all childs is unchecked or child count is equal to 1
	// 				let childs = node.getChilds();
	// 				for (let i = 0; i < childs.length; i++) {
	// 					if (childs[i].checkStatus) { valid = false; } }
	// 				if (valid) trans(); } 
	// 			else { trans(); } } };
	// 	let childCheck = async (node) => {
	// 		node.checkNode(); //first check main node
	// 		if (node.childs.length > 0) { //then check childs if exist
	// 			for (let i = 0; i < node.childs.length; i++) { //foreach child
	// 				let c_node = this.getNode(node.childs[i].split("node_")[1]);
	// 				c_node.checkStatus = status;
	// 				childCheck(c_node); /* restart process */ } } };
	// 	if (this.config.autoChild) childCheck(node);
	// 	if (this.config.autoParent) parentCheck(node); }

	// async showFamily(node) {
	// 	/** unfold all parents of node
	// 	 * @param {object} node */
	// 	if (node.parent.id !== 0) { //check if has parent
	// 		node.parent.foldedStatus = true; //then make node status closed
	// 		this.toggleNode(node.parent); //after send parent node for toggle
	// 		this.showFamily(node.parent); /* make recursive for another parents */ } }

	//#region Node Creator
	createNode(obj) {
		/** creating node
		 * @param {object} obj */
		// const id = Date.now();
		// const node = {
		// 	value: id, // node value
		// 	id: this.target + "node_" + id, // node id
		// 	title: "untitled " + id, // node title
		// 	elements: [], // node html elements
		// 	order: null, // order number
		// 	parent: { id: 0 }, // node parent element
		// 	childs: [], //  child element ids
		// 	addional: {}, // addional info
		// 	foldedStatus: this.config.foldedStatus, // childs status (child list opened or not)
		// 	checkStatus: false, // check status for node
		// 	getChilds: () => this.getChilds(node), // return child nodes
		// 	deleteNode: () => this.deleteNode(node), // remove node from dom
		// 	updateNode: () => this.updateNode(node), // update node
		// 	toggleNode: () => this.toggleNode(node), // toggle node
		// 	showFamily: () => this.showFamily(node), // show node location
		// 	toggleCheck: (status) => {
		// 		node.checkStatus = status;
		// 		node.checkNode(); }, //check node
		// 	scroll:() => document.getElementById(node.id).scrollIntoView(), //scroll to node
		// 	find  :(text) => { //find child nodes from text
		// 		const nodes = [];
		// 		document.getElementById(node.id).querySelectorAll('li').forEach(el=>{
		// 			if(el.innerHTML.includes(text)){ nodes.push(this.getNode(el.id.split("node_")[1])) } });
		// 		return nodes; } };
		// for (let key in obj) { //check setted values here!!
		// 	if (obj[key] !== undefined) node[key.split("_")[1]] = obj[key];
		// 	if (key === "n_id") node["id"] = this.target + "node_" + obj["n_id"]; }
		// if (node.order === null) node.order = 0;
		// this.nodeList[obj["n_id"]] = node; // node is added to container
		const node = new Node(obj, this)
		this.drawNode(node); // node is drawed
		this.log("Node is created (" + node.id + ")"); // logged
		return node; /* node is returned */ }

	// updateNode(node) { /** update node !! id is recommended */1
	// 	//console.log(this.getNode(node.id.split('_')[1]))
	// 	this.getNode(node.id.split("node_")[1]).deleteNode(); //first remove old node
	// 	if (node.old_parent !== undefined && node.old_parent.id !== 0) { //clear old parent's childs if old parent info is exist
	// 		this.nodeList[node.old_parent.value].childs = this.nodeList[node.old_parent.value].childs.filter((x) => { return x !== node.id; });
	// 		if (this.nodeList[node.old_parent.value].childs.length === 0) { document.getElementById("i_" + node.old_parent.id).style.display = "none"; } } /* if child count is 0 then remove minus icon */
	// 	const set = (data) => { // draw new node with childs
	// 		this.drawNode(data);
	// 		let childs = data.getChilds();
	// 		if (childs.length > 0) {
	// 			for (let i = 0; i < childs.length; i++) { set(childs[i]); } } };
	// 	set(node);
	// 	this.log("Node is created (" + node.id + ")"); //log
	// 	return node; }

	drawNode(node) { /** @param {object} node object for creating html element */
		let icon = this.config.unFoldedIcon;
		let style = "";
		let defaultClass = "active";
		if (node.foldedStatus) {
			icon = this.config.foldedIcon;
			style = "none";
			defaultClass = "not-active"; }
		//#region elements
		let li_item = document.createElement("li"); //node li item
		let a_item = document.createElement("a"); //node a item
		let i_item = document.createElement("i"); //node i item
		let ul_item = document.createElement("ul"); //node ul item
		let div_item = document.createElement("div"); //node group item
		if (this.config.order) { //make node ordarable
			const o_div = document.createElement("div");
			o_div.id = "order_" + node.id;
			const up_i = document.createElement("i"); //create buttons
			const dw_i = document.createElement("i");
			o_div.classList.add("ptree_order_div");
			up_i.classList.add("fa", "fa-arrow-up");
			up_i.dataset.target = "1";
			dw_i.classList.add("fa", "fa-arrow-down");
			dw_i.dataset.target = "0";
			o_div.appendChild(up_i);
			o_div.appendChild(dw_i);
			o_div.onclick = (e) => (e.target.tagName == "I" ? this.orderNode(e) : false); //ordering event
			div_item.appendChild(o_div); }
		if (this.config.drag) { //make node dragable
			const a_ditem = document.createElement("a"); //add drag button to start
			const i_ditem = document.createElement("i");
			i_ditem.classList.add("fa"); //set icon drag button
			i_ditem.classList.add("fa-bars");
			a_ditem.classList.add("drag-handler");
			a_ditem.id = "a_dr_" + node.id;
			a_ditem.appendChild(i_ditem);
			a_ditem.href = "javascript:;";
			a_ditem.setAttribute("dragable", true);
			a_ditem.setAttribute("drag-title", node.title);
			div_item.appendChild(a_ditem); //icon added to div
			div_item.classList.add("drop_target"); }
		i_item.id = "i_" + node.id; //set i item id
		i_item.style.color = "black"; //set i item style
		icon = icon.split(" "); //set i item icon
		for (let i = 0; i < icon.length; i++) { i_item.classList.add(icon[i]); }
		i_item.style.display = "none";
		ul_item.id = "c_" + node.id; //set ul item id
		//ul_item.style.display = style; //set ul item style
		ul_item.classList.add(defaultClass); //set ul item class
		a_item.id = "a_toggle_" + node.id; // set a item id
		a_item.appendChild(i_item); // set i tag to a item
		a_item.href = "javascript:;"; // set a item href
		a_item.innerHTML += " " + node.title; // set a_item title
		a_item.onclick = (e) => this.toggleNode(node);
		li_item.id = node.id; //set li item id
		li_item.dataset.order = "order_" + node.order;
		div_item.id = "div_g_" + node.id;
		div_item.appendChild(a_item); //set a tag to div item
		if (this.config.switchMode) { //set switch to li item if user is wanted
			const sw_item = document.createElement("label");
			const ck_item = document.createElement("input");
			const spn_item = document.createElement("span");
			spn_item.classList.add("slider");
			spn_item.classList.add("round");
			ck_item.type = "checkbox";
			sw_item.classList.add("switch");
			sw_item.appendChild(ck_item);
			sw_item.appendChild(spn_item);
			ck_item.id = "ck_" + node.id; //id definitions
			sw_item.id = "sw_" + node.id;
			ck_item.value = node.value;
			ck_item.checked = node.checkStatus; //if item created as checked
			ck_item.onclick = (e) => {
				node.checkStatus = e.target.checked;
				if (this.config.autoChild || this.config.autoParent) { node.checkNodeFamily(); }
				else{ node.checkNode(); } };
			div_item.appendChild(sw_item); /* switch is added to li element */ }
		if (node.elements.length > 0) { //if node has extra elements
			let a_item = document.createElement("a"); //add menu button to end
			let i_item = document.createElement("i");
			for (let i = 0; i < this.config.menuIcon.length; i++) { i_item.classList.add(this.config.menuIcon[i]); } //set icon for menu
			a_item.id = "a_me_" + node.id;
			a_item.appendChild(i_item);
			a_item.href = "javascript:;";
			a_item.classList.add("menuIcon");
			div_item.appendChild(a_item); /* icon added to div */ }
		li_item.appendChild(div_item);
		li_item.appendChild(ul_item); //set ul tag to li item
		//#endregion
		if (node.parent.id === 0) { this.area.appendChild(li_item); /* put item to area */ }  //if is main node check if element is exist for preventing copy elements
		else {
			this.setChildNodes(node); //if has parent set to parents childs
			const cont = document.getElementById("c_" + node.parent.id); //then put item
			if (cont !== null) cont.appendChild(li_item); }
		//node.element = li_item;
		this.setNodeEvents(node, div_item); //set node events
		if (typeof this.rowCreateCallback == "function") this.rowCreateCallback(node); /* draw callback  method */ }

	setNodeEvents(node, parent) {
		if (this.config.order) { //order event for node
			document.getElementById('order_' + node.id).addEventListener('click', e => {
				if (e.target.tagName == 'I') {
					const isBefore = e.target.dataset.target == 1;
					const main = e.target.parentNode.parentNode.parentNode;
					const target = isBefore ? main.previousElementSibling : main.nextElementSibling;
					if (target !== null) { //get nodes
						const targetNode = this.getNode(target.id.split("_").at(-1)); //replace data
						const mainNode = this.getNode(main.id.split("_").at(-1));
						//console.log( mainNode.order,targetNode.order);
						const currentOrder = mainNode.order;
						const targetOrder = targetNode.order === mainNode.order ? (isBefore ? targetNode.order - 1 : targetNode.order + 1) : targetNode.order;
						targetNode.order = currentOrder; //change order data
						mainNode.order = targetOrder;
						//console.log( mainNode.order,targetNode.order);
						main.parentNode.replaceChild(main, target); //replace element
						main.parentNode.insertBefore(target, isBefore ? main.nextSibling : main); } } }); } }

	//#endregion

	//#region Menu
	getMenu(element, node) {
		let x = element.getBoundingClientRect(); //get element location
		const origin = { node: node, left: x.x, top: x.y + x.height, };
		this.drawMenu(origin); /* draw menu */ }

	drawMenu(obj) {
		if (document.getElementById("div_menu_" + obj.node.id) === null) { //check if menu already exist
			const menu_item = document.createElement("div"); //create menu div
			document.body.appendChild(menu_item); //add to body
			menu_item.id = "div_menu_" + obj.node.id;
			menu_item.classList.add("ptreemenuCont");
			let span_item; //for each menu item
			let icon;
			for (let i = 0; i < obj.node.elements.length; i++) {
				span_item = document.createElement("span");
				span_item.setAttribute("data-node", obj.node.id);
				icon = obj.node.elements[i].icon.trim().length > 0 ? '<i class="' + obj.node.elements[i].icon.trim() + '"></i>' : "";
				span_item.innerHTML = icon + " " + obj.node.elements[i].title.trim();
				menu_item.appendChild(span_item);
				span_item.addEventListener("click", 
					(e) => { //then add click event
						obj.node.elements[i].onClick(this.getNode(e.target.getAttribute("data-node").split("node_")[1]));
						menu_item.outerHTML = ""; /* remove menu after click */ }); }
			if (screen.width - obj.left < menu_item.offsetWidth) { menu_item.style.left = obj.left - menu_item.offsetWidth + "px"; }  //calculate location
			else { menu_item.style.left = obj.left + "px"; }
			menu_item.style.top = obj.top + "px";
			menu_item.onmouseleave = (e) => { menu_item.remove(); }; /* listen mouse out */ } } /* #endregion */ 
	draw(){
		let [root, box] = HTML.chain(wrapper, `div::`); 
	}
	}
