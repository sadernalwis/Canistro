var Vec2 = import('../vec2/vec2.js'), Quadtree2;
	// Quadtree2Helper = import('./quadtree2helper'),
	// Quadtree2Inspector = import('./quadtree2inspector'),
	// Quadtree2Validator = import('./quadtree2validator'),
	// Quadtree2Quadrant = import('./quadtree2quadrant'),

var Quadtree2Helper = {
	fnName: function fnName(fn) {
		var ret = fn.toString();
		ret = ret.substr('function '.length);
		ret = ret.substr(0, ret.indexOf('('));
		return ret; },
	thrower: function thrower(code, message, key) { // A verbose exception generator helper.
		var error = code;
		if (key) { error += '_' + key; }
		if (message) { error += ' - '; }
		if (message && key) { error += key + ': '; }
		if (message) { error += message; }
		throw new Error(error); },
	getIdsOfObjects: function getIdsOfObjects(hash) {
		var result = [];
		for (var id in hash) { result.push(hash[id].id_); }
		return result; },
	compare: function compare(a, b) { return a - b; },
	arrayDiffs: function arrayDiffs(arrA, arrB) {
		var i = 0, j = 0, retA = [], retB = [];
		arrA.sort(this.compare);
		arrB.sort(this.compare);
		while (i < arrA.length && j < arrB.length) {
			if (arrA[i] === arrB[j]) {
				i++;
				j++;
				continue; }
			if (arrA[i] < arrB[j]) {
				retA.push(arrA[i]);
				i++;
				continue; } 
			else {
				retB.push(arrB[j]);
				j++; } }
		if (i < arrA.length) { retA.push.apply(retA, arrA.slice(i, arrA.length)); } 
		else { retB.push.apply(retB, arrB.slice(j, arrB.length)); }
		return [retA, retB]; } };

var Quadtree2Inspector = function Quadtree2Inspector(data) {
	var qt, root, idKey, config, objects, objectQuadrants, log = '',
		getQuadrantCount = function getQuadrantCount(object) {
			if (object) { return Object.keys(objectQuadrants[object[idKey]]).length; }
			return 1 + root.getChildCount(true); },
		getObjectCount = function getObjectCount() {
			return Object.keys(objects).length; },
		magnify = function magnify(number, factor) { return factor ? factor * number : number; },
		stringifyVec2ConstructorCall = function stringifyVec2ConstructorCall(vec, factor) { return 'new Vec2(' + magnify(vec.x, factor) + ', ' + magnify(vec.y, factor) + ')'; },
		stringifyAddObjectCall = function stringifyAddObjectCall(object, factor) {
			var command = '', posParams = stringifyVec2ConstructorCall(object.pos, factor);
			command += 'o = {\n' +
				'  pos : ' + posParams + ',\n' +
				'  rad : ' + magnify(object.rad, factor) + ' \n' +
				'};\n\n';
			command += 'qt.addObject(o);\n';
			command += 'os[o.id] = o;\n\n';
			return command; },
		stringifyRemoveObjectCall = function stringifyRemoveObjectCall(object) { return 'qt.removeObjectById(' + object.id + ');\n\n'; },
		stringifyMoveObjectCall = function stringifyMoveObjectCall(object, position) {
			var command = '';
			command += 'o = os[' + object.id + '];\n';
			command += 'o.pos.x = ' + position.x + ';\n';
			command += 'o.pos.y = ' + position.y + ';\n\n';
			return command; },
		stringifyUpdateObjectCall = function stringifyUpdateObjectCall(object) { return 'qt.updateObjectById(' + object.id + ');\n\n'; },
		stringifyConstructorCall = function stringifyConstructorCall(factor) {
			var command = 'os = {};\n\n', sizeParams = stringifyVec2ConstructorCall(config.size, factor);
			command += 'qt = new Quadtree2({\n' +
				'  size         : ' + sizeParams + ',\n' +
				'  objectLimit  : ' + config.objectLimit + ',\n' +
				'  levelLimit   : ' + config.levelLimit + ' \n' +
				'});\n\n';
			return command; },
		getRebuildingCommand = function getRebuildingCommand(factor) {
			var id, object, command = stringifyConstructorCall(factor);
			for (id in objects) {
				object = objects[id];
				command += stringifyAddObjectCall(object, factor); }
			return command; },
		addLog = function addLog(message) { log += message; },
		getLog = function getLog() { return stringifyConstructorCall() + log; },
		wrapObjectManipulation = function wrapObjectManipulation(fnName, stringifier) {
			var self = this, fn = qt[fnName];
			qt[fnName] = function objectManipulationWrap(object) {
				addLog(stringifier(object));
				fn(object); }; },
		init = function init(data) {
			qt = data.qt;
			root = data.root;
			idKey = data.idKey;
			config = data.config;
			objects = data.objects;
			objectQuadrants = data.objectQuadrants;
			wrapObjectManipulation('addObject', stringifyAddObjectCall);
			wrapObjectManipulation('removeObject', stringifyRemoveObjectCall);
			wrapObjectManipulation('updateObject', stringifyUpdateObjectCall); };
	init(data);
	this.data = data;
	this.addLog = addLog;
	this.getLog = getLog;
	this.getObjectCount = getObjectCount;
	this.getQuadrantCount = getQuadrantCount;
	this.getRebuildingCommand = getRebuildingCommand;
	this.stringifyVec2ConstructorCall = stringifyVec2ConstructorCall;
	this.stringifyAddObjectCall = stringifyAddObjectCall;
	this.stringifyMoveObjectCall = stringifyMoveObjectCall;
	this.stringifyUpdateObjectCall = stringifyUpdateObjectCall;
	this.stringifyConstructorCall = stringifyConstructorCall; };

var Quadtree2Validator = function Quadtree2Validator() { };
Quadtree2Validator.prototype = {
	isNumber: function isNumber(param, key) { if ('number' !== typeof param) { Quadtree2Helper.thrower('NaN', 'Not a Number', key); } },
	isString: function isString(param, key) { if (!(typeof param === 'string' || param instanceof String)) { Quadtree2Helper.thrower('NaS', 'Not a String', key); } },
	isVec2: function isVec2(param, key) {
		var throwIt = false;
		throwIt = 'object' !== typeof param || param.x === undefined || param.y === undefined;
		if (throwIt) { Quadtree2Helper.thrower('NaV', 'Not a Vec2', key); } },
	isDefined: function isDefined(param, key) {
		if (param === undefined) { Quadtree2Helper.thrower('ND', 'Not defined', key); } },
	isObject: function isObject(param, key) {
		if ('object' !== typeof param) { Quadtree2Helper.thrower('NaO', 'Not an Object', key); } },
	hasKey: function hasKey(obj, k, key) {
		this.isDefined(obj, 'obj');
		if (Object.keys(obj).indexOf(k.toString()) === -1) { Quadtree2Helper.thrower('OhnK', 'Object has no key', key + k); } },
	hasNoKey: function hasNoKey(obj, k, key) {
		this.isDefined(obj, 'obj');
		if (Object.keys(obj).indexOf(k.toString()) !== -1) { Quadtree2Helper.thrower('OhK', 'Object has key', key + k); } },
	fnFalse: function fn(cb) { if (cb()) { Quadtree2Helper.thrower('FarT', 'function already returns true', Quadtree2Helper.fnName(cb)); } },
	byCallbackObject: function byCallbackObject(obj, cbObj, keyTable) {
		var key;
		for (key in cbObj) {
			if (keyTable !== undefined) { cbObj[key](obj[keyTable[key]], keyTable[key]); } 
			else { cbObj[key](obj[key], key); } } } };


var Quadtree2Quadrant = function Quadtree2Quadrant(leftTop, size, id, parent) {
	this.leftTop_ = leftTop.clone();
	this.children_ = [];
	this.objects_ = {};
	this.objectCount_ = 0;
	this.id_ = id || 0;
	this.parent_ = parent;
	this.refactoring_ = false;
	this.setSize(size); };

Quadtree2Quadrant.prototype = {
	setSize: function setSize(size) {
		if (!size) { return; }
		this.size_ = size;
		this.rad_ = size.multiply(0.5, true);
		this.center_ = this.leftTop_.add(this.rad_, true);
		this.leftBot_ = this.leftTop_.clone();
		this.leftBot_.y += size.y;
		this.rightTop_ = this.leftTop_.clone();
		this.rightTop_.x += size.x;
		this.rightBot_ = this.leftTop_.add(size, true);
		this.leftMid_ = this.center_.clone();
		this.leftMid_.x = this.leftTop_.x;
		this.topMid_ = this.center_.clone();
		this.topMid_.y = this.leftTop_.y; },

	makeChildren: function makeChildren(id) {
		if (this.children_.length > 0) { return false; }
		this.children_.push(
			new Quadtree2Quadrant(this.leftTop_, this.rad_, ++id, this),
			new Quadtree2Quadrant(this.topMid_, this.rad_, ++id, this),
			new Quadtree2Quadrant(this.leftMid_, this.rad_, ++id, this),
			new Quadtree2Quadrant(this.center_, this.rad_, ++id, this) );
		return id; },
	looseChildren: function looseChildren() { this.children_ = []; },
	addObjects: function addObjects(objs) {
		var id;
		for (id in objs) { this.addObject(id, objs[id]); } },
	addObject: function addObject(id, object) {
		this.objectCount_++;
		this.objects_[id] = object; }, 
	removeObjects: function removeObjects(removed, dir) {
		var id;
		if (!removed) { removed = []; }
		for (id in this.objects_) {
			removed.push({ object: this.objects_[id], quadrant: this });
			delete this.objects_[id]; }
		this.objectCount_ = 0;
		if (!dir || dir === 1) {
			if (this.parent_) { this.parent_.removeObjects(removed, 1); } }
		if (!dir || dir === -1) {
			this.children_.forEach(function (child) { child.removeObjects(removed, -1); }); }
		return removed; },
	removeObject: function removeObject(id) {
		var result = this.objects_[id];
		this.objectCount_--;
		delete this.objects_[id];
		return result; },
	getObjectCountForLimit: function getObjectCountForLimit() {
		var i, id, objects = {};
		for (id in this.objects_) { objects[id] = true; }
		for (i = 0; i < this.children_.length; i++) {
			for (id in this.children_[i].objects_) { objects[id] = true; } }
		return Object.keys(objects).length; },
	getObjectCount: function getObjectCount(recursive, onelevel) {
		var result = this.objectCount_;
		if (recursive) {
			this.children_.forEach(function (child) { result += child.getObjectCount(!onelevel && recursive); }); }
		return result; },
	intersectingChildren: function intersectingChildren(pos, rad) {
		return this.children_.filter(function (child) { return child.intersects(pos, rad); }); },
	intersects: function intersects(pos, rad) {
		var dist = pos.subtract(this.center_, true).abs(), cornerDist;
		if (dist.x > this.rad_.x + rad) { return false; }
		if (dist.y > this.rad_.y + rad) { return false; }
		if (dist.x <= this.rad_.x) { return true; }
		if (dist.y <= this.rad_.y) { return true; }
		cornerDistSq = Math.pow(dist.x - this.rad_.x, 2) + Math.pow(dist.y - this.rad_.y, 2);
		return cornerDistSq <= Math.pow(rad, 2); },
	hasChildren: function hasChildren() { return this.getChildCount() !== 0; },
	getChildCount: function getChildCount(recursive) {
		var count = this.children_.length;
		if (recursive) { this.children_.forEach(function (child) { count += child.getChildCount(recursive); }); }
		return count; },
	getChildren: function getChildren(recursive, result) {
		if (!result) result = [];
		result.push.apply(result, this.children_);
		if (recursive) { this.children_.forEach(function (child) { child.getChildren(recursive, result); }); }
		return result; },
	getObjectsUp: function getObjectsUp(result) {
		var id;
		if (result.quadrants[this.id_]) { return; }
		result.quadrants[this.id_] = true;
		for (id in this.objects_) { result.objects[id] = this.objects_[id]; }
		if (this.parent_) { this.parent_.getObjectsUp(result); } },
	getObjectsDown: function getObjectsDown(result) {
		var id;
		if (result.quadrants[this.id_]) { return; }
		result.quadrants[this.id_] = true;
		for (id in this.objects_) { result.objects[id] = this.objects_[id]; }
		for (id = 0; id < this.children_.length; id++) { this.children_[id].getObjectsDown(result); }
		return result; } };
	
Quadtree2 = function Quadtree2(config) {
	var
		size,
		root,
		inspector,
		levelLimit,
		objectLimit,
		quadrantSizeLimit,
		qt = this,
		idKey = 'id',
		posKey = 'pos',
		radKey = 'rad',
		autoObjectId = 1,
		quadrantId = 1,
		validator = new Quadtree2Validator(),
		objects = {},
		objectQuadrants = {},
		nextQuadrantId = function nextQuadrantId() {
			var id = quadrantId;
			quadrantId += 4;
			return id;  },
		getSmallestIntersectingQuadrants = function getSmallestIntersectingQuadrants(object, quadrant, result) {
			if (!quadrant.intersects(object[posKey], object[radKey])) { return; }
			var i, children = quadrant.getChildren(), childrenCount = children && children.length;
			if (childrenCount) {
				for (i = 0; i < childrenCount; i++) { getSmallestIntersectingQuadrants(object, children[i], result); } } 
			else { result[quadrant.id_] = quadrant; }
			return result; },
		removeObjectFromQuadrant = function removeObjectFromQuadrant(object, quadrant) {
			quadrant.removeObject(object[idKey]);
			delete objectQuadrants[object[idKey]][quadrant.id_];
			if (quadrant.parent_ && !quadrant.hasChildren()) { refactorSubtree(quadrant.parent_); } /* Call refactor only from leaf quadrants. */ },
		removeObjectFromQuadrants = function removeObjectFromQuadrants(object, quadrants) {
			var id;
			if (quadrants === undefined) { quadrants = objectQuadrants[object[idKey]]; }
			for (id in quadrants) { removeObjectFromQuadrant(object, quadrants[id]); } },
		addObjectToQuadrant = function addObjectToQuadrant(object, quadrant) {
			var id = object[idKey];
			if (objectQuadrants[id] === undefined) { objectQuadrants[id] = {}; }
			objectQuadrants[id][quadrant.id_] = quadrant;
			quadrant.addObject(id, object); },
		removeQuadrantObjects = function removeQuadrantObjects(quadrant) {
			var i, removed, removedObjects = quadrant.removeObjects([], 1);
			for (i = 0; i < removedObjects.length; i++) {
				removed = removedObjects[i];
				delete objectQuadrants[removed.object[idKey]][removed.quadrant.id_]; }
			return removedObjects; },
		populateQuadrant = function populateQuadrant(object, quadrant) {
			var i, id, smallestQuadrants, removes, removed;
			if (!quadrant) { quadrant = root; }
			if (quadrant.hasChildren()) { // Get smallest quadrants which intersect.
				smallestQuadrants = getSmallestIntersectingQuadrants(object, quadrant, {});
				for (id in smallestQuadrants) {  populateQuadrant(object, smallestQuadrants[id]);  /* Propagate further to children */ } } 
			else if (quadrant.size_.x <= object[radKey] || quadrant.getObjectCount() < objectLimit || quadrant.size_.x < quadrantSizeLimit.x) { addObjectToQuadrant(object, quadrant); /* Has no children but still got place, so store it. */ } 
			else {
				quadrant.makeChildren(nextQuadrantId()); /* Got no place so lets make children. */
				removes = removeQuadrantObjects(quadrant); /* Remove all the stored objects until the parent. */
				removes.push({ 'object': object, 'quadrant': quadrant });
				for (i = 0; i < removes.length; i++) { // Recalculate all objects which were stored before.
					removed = removes[i];
					populateQuadrant(removed.object, removed.quadrant); } } },
		addObject = function addObject(object) {
			var id = object[idKey];
			if (autoObjectId && !id) { id = object[idKey] = autoObjectId++; }
			if (objects[id]) { throw new Error('usedId'); }
			objects[id] = object;
			populateQuadrant(object);
			return object; },
		addObjects = function addObjects(objects) { return objects.forEach(addObject); },
		removeObject = function removeObject(objectToRemove) {
			var id = objectToRemove[idKey];
			removeObjectFromQuadrants(objectToRemove);
			delete objects[id]; },
		removeObjectById = function removeObjectById(id) {
			var object = objects[id];
			return removeObject(object); },
		removeObjects = function removeObjects(objectsToRemove) { return objectsToRemove.forEach(removeObject); },
		hasCollision = function hasCollision(objectA, objectB) { return objA[k.r] + objB[k.r] > objA[k.p].distance(objB[k.p]); },
		getCollidables = function getCollidables(object) {
			var i, id, quadrant, children, childrenCount, quadrants = objectQuadrants[object[idKey]], result = { 'objects': {}, 'quadrants': {} };
			for (id in quadrants) { /* TODO this could be improved as objects can be now only on leaf nodes. */
				quadrant = quadrants[id];
				quadrant.getObjectsUp(result);
				children = quadrant.children_;
				childrenCount = children.length;
				for (i = 0; i < childrenCount; i++) { children[i].getObjectsDown(result); } }
			delete result.objects[object[idKey]]; // Remove the original object from the results.
			return result.objects; },
		refactorSubtree = function refactorSubtree(quadrant) {
			var i, id, count, child, object;
			if (quadrant.refactoring_) { return; }
			// On the first outer call from removeObjectFromQuadrant, quadrant points on a leaf node. 
			// Need to make sure this does have only LEAF node siblings, so we check each of them for children. 
			for (i = 0; i < quadrant.children_.length; i++) {
				child = quadrant.children_[i];
				if (child.hasChildren()) { return; } }
			count = quadrant.getObjectCountForLimit(); // At this point it is sure, that none of the children quadrant has children itself, so all of the objects are inside the quadrant or directly in its children.
			if (count > objectLimit) { return; }
			quadrant.refactoring_ = true;
			for (i = 0; i < quadrant.children_.length; i++) {
				child = quadrant.children_[i];
				for (id in child.objects_) {
					object = child.objects_[id];
					removeObjectFromQuadrant(object, child); // The child quadrant has no childs, so this won't be a recursive call.
					addObjectToQuadrant(object, quadrant); } }
			quadrant.looseChildren();
			quadrant.refactoring_ = false;
			if (quadrant.parent_) { refactorSubtree(quadrant.parent_); } },
		getCollidings = function getCollidings(object) {
			var id, otherObject, objects = getCollidables(object);
			for (id in objects) {
				otherObject = objects[id];
				if (otherObject[posKey].distance(object[posKey]) > otherObject[radKey] + object[radKey]) { delete objects[id]; } /* Check if the two object are farer apart, than they size. */ }
			return objects; },
		updateObjectQuadrants = function updateObjectQuadrants(object) { // TODO this could be made much more faster w/o using arrayDiffs. 
			var oldQuadrants = objectQuadrants[object[idKey]],
				newQuadrants = getSmallestIntersectingQuadrants(object, root, {}),
				oldIds = Quadtree2Helper.getIdsOfObjects(oldQuadrants),
				newIds = Quadtree2Helper.getIdsOfObjects(newQuadrants),
				diffIds = Quadtree2Helper.arrayDiffs(oldIds, newIds),
				removeIds = diffIds[0],
				addIds = diffIds[1], i;
			for (i = 0; i < addIds.length; i++) { populateQuadrant(object, newQuadrants[addIds[i]]); }
			for (i = 0; i < removeIds.length; i++) {
				if (!oldQuadrants[removeIds[i]]) { continue; }
				removeObjectFromQuadrant(object, oldQuadrants[removeIds[i]]); } },
		updateObject = function updateObject(objectToUpdate) { return updateObjectQuadrants(objectToUpdate); },
		updateObjectById = function updateObjectById(id) {
			var object = objects[id];
			return updateObject(object); },
		updateObjects = function updateObjects(objectsToUpdate) { return objectsToUpdate.forEach(updateObject); },
		inspect = function inspect() {
			var data = { 'root': root, 'idKey': idKey, 'config': config, 'objects': objects, 'objectQuadrants': objectQuadrants };
			if (!inspector) {
				data.qt = qt;
				inspector = new Quadtree2Inspector(data);
				delete data.qt; }
			return inspector; },
		setKey = function setKey(type, value) {
			if (type === 'id') {
				autoObjectId = 0;
				idKey = value; } 
			else if (type === 'pos') { posKey = value; } 
			else if (type === 'rad') { radKey = value; } },
		init = function init(config) {
			size = config.size;
			objectLimit = config.objectLimit || 4;
			levelLimit = config.levelLimit || 6;
			validator.isVec2(size, 'size');
			validator.isNumber(objectLimit, 'objectLimit');
			validator.isNumber(levelLimit, 'levelLimit');
			root = new Quadtree2Quadrant(new Vec2(0, 0), size.clone(), 1);
			quadrantSizeLimit = size.clone().divide(Math.pow(2, levelLimit)); };
	init(config);
	this.addObject = addObject;
	this.addObjects = addObjects;
	this.getCollidables = getCollidables;
	this.getCollidings = getCollidings;
	this.updateObject = updateObject;
	this.updateObjectById = updateObjectById;
	this.updateObjects = updateObjects;
	this.removeObject = removeObject;
	this.removeObjectById = removeObjectById;
	this.removeObjects = removeObjects;
	this.setKey = setKey;
	this.inspect = inspect;
	return this; };

export default Quadtree2;
