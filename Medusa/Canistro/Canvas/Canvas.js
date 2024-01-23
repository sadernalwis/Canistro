import { Layout } from '../ui/layout.js';
import { Container } from '../ui/container.js';
import { Pointer } from '../Pointer/Pointer.js';
import { Key } from "Medusa/Mirror/Terminal/Input/Key/Key.js";

export class UX{
    constructor() {
        this.pointer = Pointer.init(Ui, Ui.c1);
    }
    
    touchstart(evt) {
        evt.preventDefault();
        Ui.draw_touch(evt, "s");
        Ui.touch_map.set(evt.pointerId, [evt]);

    }

    touchmove(evt) {
        evt.preventDefault();
        Ui.draw_touch(evt, "m");
    }

    touchend(evt) {
        evt.preventDefault();
        Ui.draw_touch(evt, "e");
        Ui.touch_map.delete(evt.pointerId);
    }

    touchcancel(evt) {
        // evt.preventDefault();
        Ui.draw_touch(evt, "c");
        Ui.touch_map.delete(evt.pointerId);
    }

    draw_touch(touch, c) {
        if (touch.buttons > 0) {
            Ui.ctx1.fillStyle = `Black`;
            Ui.ctx1.font = `${100}px mono`;
            Ui.ctx1.textBaseline = 'middle';
            Ui.ctx1.textAlign = 'center';
            Ui.ctx1.fillText(`${touch.pointerId}:${touch.pressure.toFixed(2)}`, touch.clientX * Ui.dpi, touch.clientY * Ui.dpi);
        }
    }


};

const NF = 16
const NAV_MAP = {
  187: { dir: 1, act: 'zoom', name: 'in' } /* + */,
  61: { dir: 1, act: 'zoom', name: 'in' } /* + WTF, FF? */,
  189: { dir: -1, act: 'zoom', name: 'out' } /* - */,
  173: { dir: -1, act: 'zoom', name: 'out' } /* - WTF, FF? */,
  37: { dir: -1, act: 'move', name: 'left', axis: 0 } /* ⇦ */,
  38: { dir: -1, act: 'move', name: 'up', axis: 1 } /* ⇧ */,
  39: { dir: 1, act: 'move', name: 'right', axis: 0 } /* ⇨ */,
  40: { dir: 1, act: 'move', name: 'down', axis: 1 } /* ⇩ */ }
_SVG = document.querySelector('svg')
VB = _SVG.getAttribute('viewBox').split(' ').map(c => +c)
DMAX = VB.slice(2)
WMIN = 8
_MSG = document.querySelector('.msg');

let rID = null,f = 0,nav = {},tg = Array(4);
function stopAni() {
    cancelAnimationFrame(rID);
    rID = null; };

function update() {
    let k = ++f / NF,j = 1 - k,cvb = VB.slice();
    if (nav.act === 'zoom') {
        for (let i = 0; i < 4; i++){ cvb[i] = j * VB[i] + k * tg[i];} }
    if (nav.act === 'move')
    cvb[nav.axis] = j * VB[nav.axis] + k * tg[nav.axis];
    _SVG.setAttribute('viewBox', cvb.join(' '));
    if (!(f % NF)) {
        f = 0;
        VB.splice(0, 4, ...cvb);
        nav = {};
        tg = Array(4);
        stopAni();
        return; }
  rID = requestAnimationFrame(update); };

addEventListener('keydown', e => {e.preventDefault();}, false);
addEventListener('keypress', e => {e.preventDefault();}, false);
addEventListener('keyup', e => {
    e.preventDefault();
    _MSG.textContent = '';
    if (!rID && e.keyCode in NAV_MAP) {
        nav = NAV_MAP[e.keyCode];
        if (nav.act === 'zoom') {
            if (nav.dir === -1 && VB[2] >= DMAX[0] || nav.dir === 1 && VB[2] <= WMIN) {
                //console.log(`cannot ${nav.act} ${nav.name} more`);
                _MSG.textContent = `cannot ${nav.act} ${nav.name} more`;
                return; }
            for (let i = 0; i < 2; i++) {
                tg[i + 2] = VB[i + 2] / Math.pow(2, nav.dir);
                tg[i] = .5 * (DMAX[i] - tg[i + 2]); } } 
        else if (nav.act === 'move') {
            if (nav.dir === -1 && VB[nav.axis] <= 0 || nav.dir === 1 && VB[nav.axis] >= DMAX[nav.axis] - VB[2 + nav.axis]) {
            //console.log(`at the edge, cannot go ${nav.name}`);
            _MSG.textContent = `at the edge, cannot go ${nav.name}`;
            return; }
        tg[nav.axis] = VB[nav.axis] + .5 * nav.dir * VB[2 + nav.axis]; }
        update(); } }, false);
    