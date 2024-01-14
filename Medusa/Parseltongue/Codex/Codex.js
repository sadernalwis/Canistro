import { Parseltongue } from "../Parseltongue"

class Vantage{
	static UNDEFINED = 0
	static BOOLEAN = 1
	static INTEGER = 2
	static FLOAT = 3
	static STRING = 4
	static ARRAY = 5
	static SET = 6
	static MAP = 7
	static OBJECT = 8
	static FUNCTION = 9
	static DATE = 10
	static TYPE = 11
	constructor(value, address, name, type, age){  
		[this.value, this.address, this.name, this.type, this.age] = [value, address, name, type, age]
		this.flags = {} }
	get is_UNDEFINED(){ return this.typ==V.UNDEFINED ? true :false}
	get is_BOOLEAN(){ 	return this.typ==V.BOOLEAN   ? true :false}
	get is_INTEGER(){ 	return this.typ==V.INTEGER   ? true :false}
	get is_FLOAT(){ 	return this.typ==V.FLOAT     ? true :false}
	get is_STRING(){ 	return this.typ==V.STRING    ? true :false}
	get is_ARRAY(){ 	return this.typ==V.ARRAY     ? true :false}
	get is_SET(){ 		return this.typ==V.SET       ? true :false}
	get is_MAP(){ 		return this.typ==V.MAP       ? true :false}
	get is_OBJECT(){ 	return this.typ==V.OBJECT    ? true :false}
	get is_FUNCTION(){ 	return this.typ==V.FUNCTION  ? true :false} 
	get is_DATE(){ 		return this.typ==V.DATE  	 ? true :false} 
	get is_TYPE(){ 		return this.is_OBJECT && this.value.hasOwnProperty("type")}
	get is_PARENT(){ 	return this.value.hasOwnProperty("children")}
	get is_CHILD(){ 	return this.value.hasOwnProperty("parent")}
	get is_NODE(){ 		return this.is_PARENT && this.is_CHILD}
	

	get length(){
		if (this.is_ARRAY || this.is_STRING )		 { return this.value.length}
		else if (this.is_SET || this.is_MAP )		 { return this.value.size}
		else if (this.is_OBJECT || this.is_FUNCTION ){ return Object.keys(this.value).length}
		else 								 		 { return 1} }

	load(){
		// let address = this.address.replace(new RegExp('^[/]+window'), '')
		this.value = this.address ? Parseltongue.get(window, this.address) : window
		return this
	}

	has_all(...keys){
		let attributes = this.keys(0)
		return keys.every(((key) => attributes.indexOf(key)!=-1).bind(this)) }
	has_any(...keys){
		let attributes = this.keys(0)
		return keys.some(((key) => attributes.indexOf(key)!=-1).bind(this)) }

	travel(pt){
		let [b_key, segment, keys] = ['', '', ['\\','/']]
		let [command, address] = [new V(Parseltongue.clean(pt)), Parseltongue.clean(this.address).split(keys[1])]
		for (const a_key of command.items(0)) {
			let [a_letter, b_letter] = [!keys.includes(a_key), !keys.includes(b_key)]
			if (a_key ==keys[0]){ 
				if(!segment){ address.pop() }
				segment = "" }
			else if( !b_letter && a_letter){ 
				if (segment){address.push(segment)}
				segment = a_key }
			else if(a_letter){ segment += a_key }
			b_key = a_key }
		if (segment){address.push(segment)}
		return new V(null, address.join('/'))}

	items(step_index, block_size){
		block_size = block_size<0 ? this.length+block_size : block_size
		step_index = step_index<0 ? this.length+step_index : step_index
		var item_list = []
		if (this.is_ARRAY || this.is_STRING ) 					{ item_list = this.value }
		else if (this.is_SET || this.is_MAP ) 					{ item_list = Array.from(this.value) }
		else if (this.is_NODE && !this.flags.attribute_mode)  	{ item_list = this.value.children }
		else if (this.is_OBJECT || this.is_FUNCTION )  			{ item_list = Object.values(this.value) }
		else 													{ item_list = [this.value]} 
		step_index = step_index || 0;
		[step_index, block_size] = [step_index, block_size ? (step_index+block_size) : undefined]
		return item_list.slice(step_index, block_size) }

	keys(step_index, block_size, prefix){
		block_size = block_size<0 ? this.length+block_size : block_size
		step_index = step_index<0 ? this.length+step_index : step_index
		var item_list = []
		if (this.is_ARRAY || this.is_STRING ) 					{ item_list = Object.keys(this.value) }
		else if (this.is_SET || this.is_MAP ) 					{ item_list = Array.from(this.value) }
		else if (this.is_NODE && !this.flags.attribute_mode)  	{ item_list = this.value.names(prefix) }
		else if (this.is_OBJECT || this.is_FUNCTION )  			{ item_list = Object.keys(this.value) }
		else 													{ item_list = [this.value]} 
		step_index = step_index || 0;
		[step_index, block_size] = [step_index, block_size ? (step_index+block_size) : undefined]
		return item_list.slice(step_index, block_size) }

	get first_value(){ 	return this.length ? this.items(0,1)[0] : undefined}
	get first_key(){ 	return this.length ? this.keys(-1)[0] : undefined}
	get last_value(){ 	return this.length ? this.items(0,1)[0] : undefined}
	get last_key(){ 	return this.length ? this.keys(-1)[0] : undefined}
	get stage_idx(){ 	
		let keys = ['\\','/']
		let address = Parseltongue.clean(this.address).split(keys[1])
		while (address.length) {
			let v = new V(null, address.join('/')).load()
			if (v.is_UNDEFINED){ address.pop()}
			else { return address.length-1}}
		return address.length ? (address.length-1) : undefined }

	get typ(){
		const [obj_type, obj] = [typeof this.value, this.value];
		switch (obj_type) {
			case "object": 
				if (obj == null) { 	 					return V.UNDEFINED }
				else if (obj instanceof Array) { 		return V.ARRAY }
				else if (obj instanceof Set) { 		 	return V.SET }
				else if (obj instanceof Map) { 	 		return V.MAP }
				else if (obj instanceof Date) { 	 	return V.DATE }
				else{ 									return V.OBJECT }  
			case "string": 								return isNaN(obj) ? V.STRING : new V(parseFloat(obj)).typ;
			case "number": 								return obj%1 ? V.FLOAT : V.INTEGER;
			case "boolean": 							return V.BOOLEAN;
			case "function": 							return V.FUNCTION;
			default: 									return V.UNDEFINED } }
}

export let Codex = {


	continuum:function*(iterable) {
		yield 42;
	},
	type:function(value) {
		return new V(value).typ
	},
	get_default: function(type) {
		if(['[]','array','list'].includes(type)){
			type = 'array';
			object = [];  }
		else if(['{}','kv','dict',null].includes(type)){
			type = 'object';
			object = {};  }
		else if(['map','hashmap','m'].includes(type)){
			type = 'map';
			object = new Map(); }
		else if(['set','unique'].includes(type)){
			type = 'set';
			object = new Set(); }
		else if(['date','time','timestamp','datetime','t'].includes(type)){
			type = 'date';
			object = new Date(); }
		else if(['a-z','text','string','s'].includes(type)){
			type = 'string';
			object = value ? value : '';  }
		else if(['0','int','integer','number','index','i'].includes(type)){
			type = 'number';
			object = 0;  }
		else if(['0.0','float','fraction','decimal','point','f'].includes(type)){
			type = 'number';
			object = 0.0; }
		else{ object = {};} },

};
window.v = window.V = Vantage

