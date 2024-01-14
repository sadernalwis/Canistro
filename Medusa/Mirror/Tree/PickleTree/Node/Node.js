import { HTML } from "Medusa/Parseltongue/HTML/HTML.js";

export class Node{

	constructor(obj, tree) {
		/** creating node
		 * @param {object} obj */
        this.tree = tree
		const id = Date.now();
		this.value        =  id                         // node value
		this.id           =  tree.target + "node_" + id // node id
		this.title        =  "untitled " + id           // node title
		this.elements     =  []                         // node html elements
		this.order        =  null                       // order number
		this.parent       =  { id: 0 }                  // node parent element
		this.childs       =  []                         // child element ids
		this.addional     =  {}                         // addional info
		this.foldedStatus =  tree.config.foldedStatus   // childs status (child list opened or not)
		this.checkStatus  =  false                      // check status for node};
		for (let key in obj) { //check setted values here!!
			if (obj[key] !== undefined) this[key.split("_")[1]] = obj[key];
			if (key === "n_id") this["id"] = tree.target + "node_" + obj["n_id"]; }
		if (this.order === null) this.order = 0;
		tree.nodeList[obj["n_id"]] = this; // node is added to container
		// this.drawNode(node); // node is drawed
		// tree.log("Node is created (" + node.id + ")"); // logged
    }

    getChilds() {
        const tree = this.tree
		let list = [];
		for (let key in tree.nodeList) {
			if (this.childs.includes(tree.nodeList[key].id)) { list.push(tree.nodeList[key]); } }
		tree.log("node childs returned..");
		return list; }

    deleteNode() {
        const tree = this.tree
        let elm = document.getElementById(this.id); //remove this from old parent's child data !!!!
		let childs = this.getChilds();
		if (childs.length > 0) {
			for (let i = 0; i < childs.length; i++) { tree.deleteNode(childs[i]); } }
		if (elm !== null) elm.parentNode.removeChild(elm);
		tree.log("this removed..(" + this.id + ")");
		if (tree.nodeRemove !== undefined) tree.nodeRemove(this); 
    }

    updateNode() {
        const tree = this.tree
        tree.getNode(this.id.split("node_")[1]).deleteNode(); //first remove old this
		if (this.old_parent !== undefined && this.old_parent.id !== 0) { //clear old parent's childs if old parent info is exist
			tree.nodeList[this.old_parent.value].childs = tree.nodeList[this.old_parent.value].childs.filter((x) => { return x !== this.id; });
			if (tree.nodeList[this.old_parent.value].childs.length === 0) { document.getElementById("i_" + this.old_parent.id).style.display = "none"; } } /* if child count is 0 then remove minus icon */
		const set = (data) => { // draw new this with childs
			// tree.drawNode(data);
			data.drawNode();
			let childs = data.getChilds();
			if (childs.length > 0) {
				for (let i = 0; i < childs.length; i++) { set(childs[i]); } } };
		set(this);
		tree.log("Node is created (" + this.id + ")"); //log
		return this; 
    }
    toggleNode() {
        const tree = this.tree
        if (this.childs.length > 0) {
            let [ie, ule] = HTML.byIDS(document, ["i_" + this.id, "c_" + this.id])
			if (this.foldedStatus === false) {
                HTML.swap_classes(ie, ["fa-plus"], ["fa-minus"])
                HTML.swap_classes(ule, ["not-active"], ["active"]) /* ule.style.display = "none"; //hide element */ } 
			else {
                HTML.swap_classes(ie, ["fa-plus"], ["fa-minus"], true)
                HTML.swap_classes(ule, ["not-active"], ["active"], true) }
			this.foldedStatus = !this.foldedStatus;
			for (let key in tree.nodeList) { //change this status
				if (tree.nodeList[key].id === this.id) {
					tree.nodeList[key].foldedStatus = this.foldedStatus; } }
			tree.log("this toggled.."); } 
		else { tree.log("this not has childs...!"); } 
    }
	async showFamily() { /** unfold all parents of node */
        const tree = this.tree
		if (this.parent.id !== 0) { //check if has parent
			this.parent.foldedStatus = true; //then make node status closed
			tree.toggleNode(this.parent); //after send parent node for toggle
			tree.showFamily(this.parent); /* make recursive for another parents */ } }
	
    toggleCheck(status){
        const tree = this.tree
        this.checkStatus = status;
        tree.checkNode(this); } //check node

    scroll(){ document.getElementById(this.id).scrollIntoView() }

    find(text){ //find child nodes from text
        const tree = this.tree
        const nodes = [];
        document.getElementById(this.id).querySelectorAll('li').forEach(
			el=>{ 
				if(el.innerHTML.includes(text)){ nodes.push(tree.getNode(el.id.split("node_")[1])) } });
        return nodes; } 

	checkNode() { /** check node and its family.*/
		let clength = this.childs.length; //then if is checked and folded unfold and open childs
		if (this.checkStatus && clength > 0) {
			this.foldedStatus = true; //make element looks like is folded
			this.toggleNode(); }
		if (typeof this.switchCallback == "function") this.switchCallback(); //trigger callback if exists
		document.getElementById("ck_" + this.id).checked = this.checkStatus; /* check html element if family mode is open */ }


	trans(status){
		this.checkStatus = status; //change parent this status
		this.checkNode(); //check parent node
		this.parentCheck(); /* then restart process */ };

	async parentCheck (status){
		if (this.parent.id !== 0) { // first check if has parent
			const parent = this.parent; //get parent this
			if (!status) { //decide for uncheck
				let valid = true; //if all childs is unchecked or child count is equal to 1
				let childs = parent.getChilds();
				for (let i = 0; i < childs.length; i++) {
					if (childs[i].checkStatus) { valid = false; } }
				if (valid) parent.trans(status); } 
			else { parent.trans(status); } } };

	async childCheck(status) {
        const tree = this.tree
		this.checkNode(); //first check main this
		if (this.childs.length > 0) { //then check childs if exist
			for (let i = 0; i < this.childs.length; i++) { //foreach child
				let c_node = tree.getNode(this.childs[i].split("node_")[1]);
				c_node.checkStatus = status;
				c_node.childCheck(); /* restart process */ } } };
				
	checkNodeFamily() { /** check this childs and his parents if not checked. */
		const tree = this.tree
		let status = this.checkStatus;
		if (tree.config.autoChild) this.childCheck(status);
		if (tree.config.autoParent) this.parentCheck(status); }

	
	setChildNodes() {
		const tree = this.tree
		/** set child nodes for parent this
		 * @param {object} this */
		const tnodes = tree.nodeList;
		for (let key in tnodes) { //update this parent
			if (tnodes[key].id === this.parent.id) {
				tnodes[key].childs.push(this.id);
				const ic = document.getElementById("i_" + tnodes[key].id); //show icon for childs
				if (ic !== null) ic.style.display = ""; } } }
	
	drawNode() { 
		const [tree,C] = [this.tree, this.tree.config]
		let [UNFOLDED_ICON, FOLDED_ICON, ORDER, DRAG, SWITCH_MODE, AUTO_CHILD, AUTO_PARENT, MENU_ICON] = [C.unFoldedIcon, C.foldedIcon, C.order, C.drag, C.switchMode, C.autoChild, C.autoParent, C.menuIcon]
		let style = "";
		let defaultClass = "active";
		if (this.foldedStatus) {
			UNFOLDED_ICON = FOLDED_ICON;
			style = "none";
			defaultClass = "not-active"; }
		let li_item = document.createElement("li"); //this li item
		let [div_item, ul_item] = HTML.ladder(li_item, `div:::/ul:${defaultClass}::c_${this.id}`)
		// let a_item = document.createElement("a"); //this a item
		// let i_item = document.createElement("i"); //this i item
		// let ul_item = document.createElement("ul"); //this ul item
		// let div_item = document.createElement("div"); //this group item
		if (ORDER) { //make this ordarable
			// const o_div = document.createElement("div");
			// o_div.id = "order_" + this.id;
			let [o_div] = HTML.ladder(div_item, `div:ptree_order_div::order_${this.id}`)
			let [up_i, dw_i] = HTML.ladder(o_div, `i:fa,fa-arrow-up::/i:fa,fa-arrow-down::`)
			// const up_i = document.createElement("i"); //create buttons
			// const dw_i = document.createElement("i");
			// o_div.classList.add("ptree_order_div");
			// up_i.classList.add("fa", "fa-arrow-up");
			// dw_i.classList.add("fa", "fa-arrow-down");
			up_i.dataset.target = "1";
			dw_i.dataset.target = "0";
			// o_div.appendChild(up_i);
			// o_div.appendChild(dw_i);
			o_div.onclick = (e) => (e.target.tagName == "I" ? tree.orderNode(e) : false); //ordering event
			// div_item.appendChild(o_div); 
		}
		if (DRAG) { //make this dragable
			// const a_ditem = document.createElement("a"); //add drag button to start
			// const i_ditem = document.createElement("i");
			let [, a_ditem, i_ditem] = HTML.chain(div_item, `a:drag-handler::a_dr_${this.id}/i:fa,fa-bars::`)
			// i_ditem.classList.add("fa"); //set UNFOLDED_ICON drag button
			// i_ditem.classList.add("fa-bars");
			// a_ditem.classList.add("drag-handler");
			// a_ditem.id = "a_dr_" + this.id;
			// a_ditem.appendChild(i_ditem);
			HTML.configure(a_ditem, {"dragable":true, "drag-title":this.title})
			a_ditem.href = "javascript:;";
			// a_ditem.setAttribute("dragable", true);
			// a_ditem.setAttribute("drag-title", this.title);
			// div_item.appendChild(a_ditem); //UNFOLDED_ICON added to div
			div_item.classList.add("drop_target"); }

		let [,a_item, i_item] = HTML.chain(div_item, `a:: ${this.title}:a_toggle_${this.id}/i:::i_${this.id}`)
		// i_item.id = "i_" + this.id; //set i item id
		i_item.style.color = "black"; //set i item style
		UNFOLDED_ICON = UNFOLDED_ICON.split(" "); //set i item UNFOLDED_ICON
		for (let i = 0; i < UNFOLDED_ICON.length; i++) { i_item.classList.add(UNFOLDED_ICON[i]); }
		i_item.style.display = "none";
		// ul_item.id = "c_" + this.id; //set ul item id
		//ul_item.style.display = style; //set ul item style
		// ul_item.classList.add(defaultClass); //set ul item class
		// a_item.id = "a_toggle_" + this.id; // set a item id
		// a_item.appendChild(i_item); // set i tag to a item
		a_item.href = "javascript:;"; // set a item href
		// a_item.innerHTML += " " + this.title; // set a_item title
		a_item.onclick = (e) => this.toggleNode(this);
		li_item.id = this.id; //set li item id
		li_item.dataset.order = "order_" + this.order;
		div_item.id = "div_g_" + this.id;
		// div_item.appendChild(a_item); //set a tag to div item
		if (SWITCH_MODE) { //set switch to li item if user is wanted
			// const sw_item = document.createElement("label");
			// const ck_item = document.createElement("input");
			// const spn_item = document.createElement("span");
			let [,sw_item] = HTML.chain(div_item, `label:switch::sw_${this.id}`)
			let [, ck_item, spn_item] = HTML.ladder(sw_item, `input:::ck_${this.id}/span:slider,round::`)
			// spn_item.classList.add("slider");
			// spn_item.classList.add("round");
			ck_item.type = "checkbox";
			// sw_item.classList.add("switch");
			// sw_item.appendChild(ck_item);
			// sw_item.appendChild(spn_item);
			// ck_item.id = "ck_" + this.id; //id definitions
			// sw_item.id = "sw_" + this.id;
			ck_item.value = this.value;
			ck_item.checked = this.checkStatus; //if item created as checked
			let dis = this;
			ck_item.onclick = (e) => {
				dis.checkStatus = e.target.checked;
				if (AUTO_CHILD || AUTO_PARENT) { dis.checkNodeFamily(); }
				else{ dis.checkNode(); } };
			// div_item.appendChild(sw_item); /* switch is added to li element */ 
		}
		if (this.elements.length > 0) { //if this has extra elements
			// let a_item = document.createElement("a"); //add menu button to end
			// let i_item = document.createElement("i");
			let [, a_item, i_item] = HTML.chain(div_item, `a:menuIcon::a_me_${this.id}/i:::`)
			for (let i = 0; i < MENU_ICON.length; i++) { i_item.classList.add(MENU_ICON[i]); } //set UNFOLDED_ICON for menu
			// a_item.id = "a_me_" + this.id;
			// a_item.appendChild(i_item);
			a_item.href = "javascript:;";
			// a_item.classList.add("menuIcon");
			// div_item.appendChild(a_item); /* UNFOLDED_ICON added to div */ 
		}
		// li_item.appendChild(div_item);
		// li_item.appendChild(ul_item); //set ul tag to li item
		
		//#endregion
		if (this.parent.id === 0) { tree.area.appendChild(li_item); /* put item to area */ }  //if is main this check if element is exist for preventing copy elements
		else {
			this.setChildNodes(this); //if has parent set to parents childs
			const cont = document.getElementById("c_" + this.parent.id); //then put item
			if (cont !== null) cont.appendChild(li_item); }
		//this.element = li_item;
		this.setNodeEvents(div_item); //set this events
		if (typeof this.rowCreateCallback == "function") this.rowCreateCallback(this); /* draw callback  method */ }

	setNodeEvents(parent) {
		const [tree,C] = [this.tree, this.tree.config]
		if (C.order) { //order event for node
			document.getElementById('order_' + this.id).addEventListener('click', e => {
				if (e.target.tagName == 'I') {
					const isBefore = e.target.dataset.target == 1;
					const main = e.target.parentNode.parentNode.parentNode;
					const target = isBefore ? main.previousElementSibling : main.nextElementSibling;
					if (target !== null) { //get nodes
						const targetNode = tree.getNode(target.id.split("_").at(-1)); //replace data
						const mainNode = tree.getNode(main.id.split("_").at(-1));
						//console.log( mainNode.order,targetNode.order);
						const currentOrder = mainNode.order;
						const targetOrder = targetNode.order === mainNode.order ? (isBefore ? targetNode.order - 1 : targetNode.order + 1) : targetNode.order;
						targetNode.order = currentOrder; //change order data
						mainNode.order = targetOrder;
						//console.log( mainNode.order,targetNode.order);
						main.parentNode.replaceChild(main, target); //replace element
						main.parentNode.insertBefore(target, isBefore ? main.nextSibling : main); } } }); } }

}