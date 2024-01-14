
export let SunBurst = {
    colors: [  "red", "blue", "green", "orange", "yellow", "teal", "indigo", "purple", "pink"],
    board_types : {column:'',row:'row',grid:'l-grid'},
    configure: function(child, attributes) {
        for (let attr_name in attributes) {
            if (attributes.hasOwnProperty(attr_name)) {
                child.setAttribute(attr_name, attributes[attr_name]);
            }
        }
        return child;
    },
    make: function(type,classname,children,attributes,id,inner) {
        const html = document.createElement(type);
        html.className = classname ? classname : '';        
        html.id = id ? id : '';
        html.innerHTML = inner ? inner : '';
        // for (let attr_name in attributes) {
        //     if (attributes.hasOwnProperty(attr_name)) {
        //         html.setAttribute(attr_name, attributes[attr_name]);
        //     }
        // }
        HTML.configure(html,attributes);
        children.forEach(child => {
            html.appendChild(child);        
        });
        return html;
    },
    put:function(parent,child, index){
        if (!index) {index = 0}
        if (index >= parent.children.length) {
            parent.appendChild(child)
        } 
        else {
            parent.insertBefore(child, parent.children[index])
        }
    },
    is_child:function(parent,candidate, index){
        if(index !== null && parent.children.length > index) { // child exists at index
            return parent.children[index] == candidate;
        }
        return candidate.parentNode == parent;
    },
    child_index:function(parent, candidate){
        if(parent !== null && candidate !== null && candidate.parentNode == parent) { // exists
            for(var i = 0, child = candidate; (child = child.previousSibling) != null; i++) {}
            return i;
        }
        // return Array.prototype.indexOf.call(parent.children, candidate);
        return -1;
    },
    index_exists:function(parent, index){
        return typeof parent.children[child_index] !== 'undefined'
    },
    
    chain:function (root_object, path_string, force_type, last_value) {
        if (typeof path_string==="string"){
            const segments = path_string.split('/');
            return segments.reduce(function (parent_list, segment, index, array) {
                const parent = parent_list[0];
                const [type_index,css_class,innerhtml] = segment.split(':');
                var child;
                if(!isNaN(type_index)){
                    const child_index = parseInt(type_index);
                    if(HTML.index_exists(parent, child_index)) { // exists
                        child = parent.children[child_index];
                    }
                    else { // not exists
                        child = HTML.make('div', 'invisible-container', [], {})
                        HTML.put(parent,child,child_index);
                    }
                }
                else{
                    child = HTML.make(type_index,css_class, [], {},'',innerhtml);    
                    parent.appendChild(child);
                }
                parent_list.unshift(child);
                return parent_list;
            }, [root_object !== null? root_object : HTML.make('div', 'container', [], {})]).reverse();
        }
    },
    ladder:function (root_object, path_string, force_type, last_value) {
        root_object !== null? root_object : HTML.make('div', 'container', [], {})
        if (typeof path_string==="string"){
            const segments = path_string.split('/');
            return segments.map(function (segment, index, array) {
                const [type_index, css_class, innerhtml] = segment.split(':');
                var child;
                if(!isNaN(type_index)){
                    const child_index = parseInt(type_index);
                    if(HTML.index_exists(root_object, child_index)) { // exists
                        child = root_object.children[child_index];
                    }
                    else { // not exists
                        child = HTML.make('div', 'invisible-container', [], {})
                        HTML.put(root_object,child,child_index);
                    }
                }
                else{
                    child = HTML.make(type_index,css_class, [], {},'',innerhtml);    
                    root_object.appendChild(child);
                }
                return child;
            });
        }
    },
    titleCase:function(str) {
        var splitStr = str.toLowerCase().split('_');
        for (var i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
        }
        return splitStr.join(' '); 
    },
    full_focus: function (e) {
        e.target.focus();
        e.target.select();
        e.target.setSelectionRange(0, e.target.value.length, 'forward')
    },
    visible:function (element,visibility) {
        element.style.display = visibility ? "block" : "none";
    },
    board:function(type,url,segments){
        const layout = HTML.make("div", HTML.board_types[type], [], {});
        segments.forEach(function(segment_count,index){
            const [segment,count] = segment_count;
            var [l,item, button] = HTML.chain(layout, "div:l-grid__item:/button:c-button:");
            var [image, span] = HTML.ladder(button, `img:c-button__icon:/span:c-button__label:${HTML.titleCase(segment)}`);
            HTML.configure(button,{"data-button" : HTML.get_color(index)});
            HTML.configure(image,{src: HTML.get_src(url+'channels/', segment)});
			button.addEventListener('click', () => { HTML.board_button(button); },true);
        });
        // var container = HTML.make("div", "invisible-container", [layout], {});
        return layout;
    },
    get_color:function(index){
        return HTML.colors[HTML.colors.length % index];
    },
    get_src:function(url, name){
        return url + name + ".svg";
    },
    board_button : function(button){
        let buttonState = button.classList.contains('c-button--active')
        let buttonType = button.dataset.button
        buttonState ? button.classList.remove(`u-text--${buttonType}`) : button.classList.add(`u-text--${buttonType}`);
        button.classList.toggle('c-button--active');
    }
}