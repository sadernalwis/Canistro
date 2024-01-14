export default function eventify(subject) {
	validateSubject(subject);
	var eventsStorage = createEventsStorage(subject);
	subject.on 	 = eventsStorage.on;
	subject.off  = eventsStorage.off;
	subject.fire = eventsStorage.fire;
	return subject; };

function createEventsStorage(subject) { // Store all event listeners to this hash. Key is event name, value is array of callback records. 
	var registeredEvents = Object.create(null); // A callback record consists of callback function and its optional context: { 'eventName' => [{callback: function, ctx: object}] }
	return {
		on: function (eventName, callback, ctx) {
			if (typeof callback !== 'function') { throw new Error('callback is expected to be a function'); }
			var handlers = registeredEvents[eventName];
			if (!handlers) { handlers = registeredEvents[eventName] = []; }
			handlers.push({ callback: callback, ctx: ctx });
			return subject; },
		off: function (eventName, callback) {
			var wantToRemoveAll = (typeof eventName === 'undefined');
			if (wantToRemoveAll) { // Killing old events storage should be enough in this case:
				registeredEvents = Object.create(null);
				return subject; }
			if (registeredEvents[eventName]) {
				var deleteAllCallbacksForEvent = (typeof callback !== 'function');
				if (deleteAllCallbacksForEvent) { delete registeredEvents[eventName]; } 
				else {
					var callbacks = registeredEvents[eventName];
					for (var i = 0; i < callbacks.length; ++i) {
						if (callbacks[i].callback === callback) { callbacks.splice(i, 1); } } } }
			return subject; },
		fire: function (eventName) {
			var callbacks = registeredEvents[eventName];
			if (!callbacks) { return subject; }
			var fireArguments;
			if (arguments.length > 1) { fireArguments = Array.prototype.splice.call(arguments, 1); }
			for (var i = 0; i < callbacks.length; ++i) {
				var callbackInfo = callbacks[i];
				callbackInfo.callback.apply(callbackInfo.ctx, fireArguments); }
			return subject; } }; }

function validateSubject(subject) {
	if (!subject) { throw new Error('Eventify cannot use falsy object as events subject'); }
	var reservedWords = ['on', 'fire', 'off'];
	for (var i = 0; i < reservedWords.length; ++i) {
		if (subject.hasOwnProperty(reservedWords[i])) { throw new Error("Subject cannot be eventified, since it already has property '" + reservedWords[i] + "'"); } } }

// 	Copyright (c) 2013-2023 Andrei Kashcha
// All rights reserved.
// Redistribution and use in source and binary forms, with or without modification,
// are permitted provided that the following conditions are met:
// Redistributions of source code must retain the above copyright notice, this
// list of conditions and the following disclaimer.
// Redistributions in binary form must reproduce the above copyright notice, this
// list of conditions and the following disclaimer in the documentation and/or
// other materials provided with the distribution.
// Neither the name of the Andrei Kashcha nor the names of its
// contributors may be used to endorse or promote products derived from
// this software without specific prior written permission.
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
// ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
// ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
// ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
