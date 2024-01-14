// import { SVG } from "../SVG.js";

import { Boundary } from "../../../Boundary/Boundary.js";
import { Meta } from "../../../Meta/Meta.js";
import { SVG } from "../SVG.js";

export class Traveller extends Meta{

	Init(evt) {
		SVGRoot = document.getElementById('bewaar_holder');
		TrueCoords = SVGRoot.createSVGPoint();
		GrabPoint = SVGRoot.createSVGPoint();
		BackDrop = document.getElementById('BackDrop');
	}

	Grab(evt) {
		var targetElement = evt.target;
		if (BackDrop != targetElement) {
			DragTarget = targetElement;
			DragTarget.parentNode.appendChild(DragTarget);
			DragTarget.setAttributeNS(null, 'pointer-events', 'none');
			var transMatrix = DragTarget.getCTM();
			GrabPoint.x = TrueCoords.x - Number(transMatrix.e);
			GrabPoint.y = TrueCoords.y - Number(transMatrix.f);
		}
	}

	Drag(evt) {
		GetTrueCoords(evt);
		if (DragTarget) {
			var newX = TrueCoords.x - GrabPoint.x;
			var newY = TrueCoords.y - GrabPoint.y;
			DragTarget.setAttributeNS(null, 'transform', 'translate(' + newX + ',' + newY + ')');
		}
	}

	Drop(evt) {
		if (DragTarget) {
			var targetElement = evt.target;
			DragTarget.setAttributeNS(null, 'pointer-events', 'all');
			if ('Folder' == targetElement.parentNode.id) {
				targetElement.parentNode.appendChild(DragTarget);
				alert(DragTarget.id + ' has been dropped into a folder, and has been inserted as a child of the containing group.');
			} else {
				alert(DragTarget.id + ' has been dropped on top of ' + targetElement.id);
			}
			DragTarget = null;
		}
	}

	GetTrueCoords(evt) {
		var newScale = SVGRoot.currentScale;
		var translation = SVGRoot.currentTranslate;
		TrueCoords.x = (evt.clientX - translation.x) / newScale;
		TrueCoords.y = (evt.clientY - translation.y) / newScale;
	}
    //https://github.com/petercollingridge/code-for-blog/blob/master/svg-interaction/pan_and_zoom_mouse/test.html

    static getMousePosition(evt, svgroot) {
        var CTM = svgroot.getScreenCTM();
        if (evt.touches) { evt = evt.touches[0]; }
        return {
            x: (evt.clientX - CTM.e) / CTM.a,
            y: (evt.clientY - CTM.f) / CTM.d
        };
    }

    get track(){
        return null;
    }
    move(p) {
        let [traveller, point] = [this, null];
        if(Array.isArray(p)){
            if(this.track){
                point = this.track.closestPoint(p);
            }
        }
        else {
            if(this.track){
                point = this.track.svg.getPointAtLength(p * this.track.svg.getTotalLength());
            }
        }
        this.svg_m.transform.setTranslate(point.x, point.y); //this.sprite.setAttribute("transform", `translate(${p.x}, ${p.y})`);
    }

    makeDraggable() { 
        let traveller = this;
        let svg = Meta.get(traveller,'svg');
        let svgroot = this.svgroot || svg.w.parentNode;

        function startDrag(evt) {
            svg.m.selected = evt.target;
            svg.m.offset = Traveller.getMousePosition(evt, svgroot);
            var transforms = svg.m.selected.transform.baseVal;

            if (transforms.length === 0 || transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
                var translate = svgroot.createSVGTransform(); // Create an transform that translates by (0, 0)
                translate.setTranslate(0, 0);
                svg.m.selected.transform.baseVal.insertItemBefore(translate, 0);
            }
            svg.m.transform = transforms.getItem(0);
            svg.m.offset.x -= svg.m.transform.matrix.e;
            svg.m.offset.y -= svg.m.transform.matrix.f;
            if (svg.m.confined) {
                bbox = svg.m.selected.getBBox();
                minX = boundaryX1 - bbox.x;
                maxX = boundaryX2 - bbox.x - bbox.width;
                minY = boundaryY1 - bbox.y;
                maxY = boundaryY2 - bbox.y - bbox.height;
            }
        
        }

        function drag(evt) {
            let svg = Meta.get(traveller,'svg');
            if (svg.m.selected) {
                evt.preventDefault();
                var coord = Traveller.getMousePosition(evt, svgroot);
                var dx = coord.x - svg.m.offset.x;
                var dy = coord.y - svg.m.offset.y;
        
                if (svg.m.confined) {
                    if (dx < svg.m.xbox.minimum) { dx = svg.m.xbox.minimum; }
                    else if (dx > svg.m.xbox.maximum) { dx = svg.m.xbox.maximum; }
                    if (dy < svg.m.ybox.minimum) { dy = svg.m.ybox.minimum; }
                    else if (dy > svg.m.ybox.maximum) { dy = svg.m.ybox.maximum; }
                }
        
                svg.m.transform.setTranslate(dx, dy);
            }
        }
        
        function endDrag(evt) { svg.m.selected = false; }
        function zoom(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            var scaleStep = evt.wheelDelta > 0 ? 1.25 : 0.8;
            var newMatrix = currentZoomMatrix.multiply(matrix);
            container.transform.baseVal.initialize(svgroot.createSVGTransformFromMatrix(newZoomMatrix));
        }

        svgroot.addEventListener('pointerdown', startDrag);
        svgroot.addEventListener('pointermove', drag);
        svgroot.addEventListener('pointerup', endDrag);
    }

    constructor(parent, name, collectors, svgroot, realm, svg, def_ref, draggable){
		super(parent, name, null, collectors, {}, svgroot, null, svg, def_ref, draggable);
        // this.name = name;
        // this.svgroot = svgroot;
        // this.def_ref = def_ref;
        // this.id = `${name}_${realm ? realm.svg.children.length : 0}`;
        // this.paths = {};
        // this.location = {path_name:'',};
        this.realm = realm;
        this.meta = new Meta(this, 'svg', svg ? svg : this.svg, [], {},svgroot, null, null, null, false);
        const [xbox, ybox] = Boundary.get_empties([1,1]);
        this.meta.configure({selected:false, confined:false, transform:false, offset:false, xbox:xbox, ybox:ybox});
        this.realm ? this.realm.svg.appendChild(this.meta.W) : null;
        this.draggable ? this.makeDraggable() : null;
    }

    
}
{}

function makeDraggable2(evt) {
    var svg = evt.target;

    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousemove', drag);
    svg.addEventListener('mouseup', endDrag);
    svg.addEventListener('mouseleave', endDrag);
    svg.addEventListener('touchstart', startDrag);
    svg.addEventListener('touchmove', drag);
    svg.addEventListener('touchend', endDrag);
    svg.addEventListener('touchleave', endDrag);
    svg.addEventListener('touchcancel', endDrag);

    var selectedElement, offset, transform,
        bbox, minX, maxX, minY, maxY, confined;

    var boundaryX1 = 10.5;
    var boundaryX2 = 30;
    var boundaryY1 = 2.2;
    var boundaryY2 = 19.2;

    function getMousePosition(evt) {
      var CTM = svg.getScreenCTM();
      if (evt.touches) { evt = evt.touches[0]; }
      return {
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d
      };
    }

    function startDrag(evt) {
      if (evt.target.classList.contains('draggable')) {
        selectedElement = evt.target;
        offset = getMousePosition(evt);

        // Make sure the first transform on the element is a translate transform
        var transforms = selectedElement.transform.baseVal;

        if (transforms.length === 0 || transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
          // Create an transform that translates by (0, 0)
          var translate = svg.createSVGTransform();
          translate.setTranslate(0, 0);
          selectedElement.transform.baseVal.insertItemBefore(translate, 0);
        }

        // Get initial translation
        transform = transforms.getItem(0);
        offset.x -= transform.matrix.e;
        offset.y -= transform.matrix.f;

        confined = evt.target.classList.contains('confine');
        if (confined) {
            bbox = selectedElement.getBBox();
            minX = boundaryX1 - bbox.x;
            maxX = boundaryX2 - bbox.x - bbox.width;
            minY = boundaryY1 - bbox.y;
            maxY = boundaryY2 - bbox.y - bbox.height;
        }
      }
    }

    function drag(evt) {
      if (selectedElement) {
        evt.preventDefault();

        var coord = getMousePosition(evt);
        var dx = coord.x - offset.x;
        var dy = coord.y - offset.y;

        if (confined) {
            if (dx < minX) { dx = minX; }
            else if (dx > maxX) { dx = maxX; }
            if (dy < minY) { dy = minY; }
            else if (dy > maxY) { dy = maxY; }
        }

        transform.setTranslate(dx, dy);
      }
    }

    function endDrag(evt) {
      selectedElement = false;
    }
  }
var makeDraggable = (function() {
    function makeDraggable(svg, element) { //https://github.com/petercollingridge/code-for-blog/blob/master/svg-interaction/pan_and_zoom_mouse/test.html
        var selected = false;
        var transforms = element.transform.baseVal; // Make sure the first transform on the element is a translate transform
        if (transforms.length === 0 || transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
            var translate = svg.createSVGTransform(); // Create an transform that translates by (0, 0)
            translate.setTranslate(0, 0);
            element.transform.baseVal.insertItemBefore(translate, 0);}
        svg.addEventListener('mousedown', startDrag);
        svg.addEventListener('mousemove', drag);
        svg.addEventListener('mouseup', endDrag);
        function getMousePosition(evt) {
            var CTM = svg.getScreenCTM();
            if (evt.touches) { evt = evt.touches[0]; }
            return {
                x: (evt.clientX - CTM.e) / CTM.a,
                y: (evt.clientY - CTM.f) / CTM.d
            };
        }
        function startDrag(evt) {
            selected = element;
            transform = transforms.getItem(0);
            offset = getMousePosition(evt); // Get initial translation
            offset.x -= transform.matrix.e;
            offset.y -= transform.matrix.f;}

        function drag(evt) {
            if (selected) {
                evt.preventDefault();
                var coord = getMousePosition(evt);
                transform.setTranslate(coord.x - offset.x, coord.y - offset.y);
            }}
        function endDrag(evt) { selected = false; }
        function zoom(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            var scaleStep = evt.wheelDelta > 0 ? 1.25 : 0.8;
            var newMatrix = currentZoomMatrix.multiply(matrix);
            container.transform.baseVal.initialize(svg.createSVGTransformFromMatrix(newZoomMatrix));
        }
    }

    return {
        byClassName: function(className) {
            document.querySelectorAll('svg').forEach(function(svg) {
                var elements = svg.getElementsByClassName(className);
                for (var i = 0; i < elements.length; i++) {
                    makeDraggable(svg, elements[i]);
                }
            });
        }
    };
})();