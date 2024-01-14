export class Key{
    constructor(event){
        this.event = event
        this._key = event.key
    }

    get key(){ return this._key }
    set key(value){ this._key = value }

    get alt(){            return this.event.altKey }
    get ctrl_or_alt(){    return this.event.ctrlKey || this.event.altKey }
    get ctrl_and_alt(){   return this.event.ctrlKey && this.event.altKey }
    get ctrl_or_shift(){  return this.event.ctrlKey || this.event.shiftKey }
    get ctrl_and_shift(){ return this.event.ctrlKey && this.event.shiftKey }
    get alt_or_shift(){  return this.event.altKey || this.event.shiftKey }
    get alt_and_shift(){ return this.event.altKey && this.event.shiftKey }

    get enter(){ return this.key==='Enter' }
    get backspace(){ return this.key==='Backspace' }
    get space(){ return this.key===' ' }
    get up(){ return this.key==='Up' }
    get down(){ return this.key==='Down' }
    get left(){ return this.key==='Left' }
    get right(){ return this.key==='Right' }
    get arrowup(){ return this.key==='ArrowUp' }
    get arrowdown(){ return this.key==='ArrowDown' }
    get arrowleft(){ return this.key==='ArrowLeft' }
    get arrowright(){ return this.key==='ArrowRight' }
    get escape(){ return this.key==='Escape' || this.key==='Esc' }
    get tab(){ return this.key==='Tab' }
    get home(){ return this.key==='Home' }
    get end(){ return this.key==='End' }

    get printable() { 
        const str = this.key
        return str.length === 1 && str.match(/\S| /); 
    }

    block_event(){
        this.event.stopPropagation();
        this.event.preventDefault();
    }


    get backwards(){ return this.key==='<' }
    get forwards(){ return this.key==='>' }
    get horizontal_navigation(){ return this.arrowleft || this.arrowright  }
    get vertical_navigation(){ return this.arrowup || this.arrowdown  }
    get is_navigation(){ return this.vertical_navigation || this.horizontal_navigation  }
}