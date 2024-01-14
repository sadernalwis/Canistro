import { Block } from "Medusa/Mirror/Terminal/Block/Block.js"
import { PickleTree } from "Medusa/Mirror/Tree/PickleTree/PickleTree.js";

export class Tree {

	render() {
		// this.carousel.render()
	}

    graph(wrapper){
        var createSettingsView = import('./Graph/config');
        // var query = import('query-string').parse(window.location.search.substring(1));
        // var graph = getGraphFromQueryString(query);
        // var renderGraph = import('../../');
        // var addCurrentNodeSettings = import('./nodeSettings.js');
        window.graph = generate.balancedBinTree(10)
        var renderer = renderGraph(window.graph, {container:container});
        return
        var settingsView = createSettingsView(renderer);
        var gui = settingsView.gui();
        var nodeSettings = addCurrentNodeSettings(gui, renderer);
        renderer.on('nodeclick', showNodeDetails);
        function showNodeDetails(node) {
            var nodeUI = renderer.getNode(node.id);
            nodeSettings.setUI(nodeUI);
        }
    }

    tree(wrapper){ 
		this.html.tree = {}
        // <div class="row">
        //     <div class="col-4">
        //         <div id="div_tree" class="tree"></div>
		let [, tree_container] = HTML.chain(wrapper, `div:tree::div_tree`); 
        this.tree = new PickleTree({
            c_target: 'div_tree',
            rowCreateCallback: (node) => { console.log(node) },
            switchCallback: (node) => { console.log(node) },
            drawCallback: () => { console.log('tree drawed ..'); },
            dragCallback: (node) => { console.log(node); },
            dropCallback: (node) => { console.log(node); /* retuns node with new parent and old parent in 'old_parent' key!! */ },
            c_config: {
                foldedStatus: false, /* start as folded or unfolded */
                logMode: false, /* for logging */
                switchMode: true, /* for switch element */
                autoChild: true, /* for automaticly select childs */
                autoParent: true, /* for automaticly select parents */
                drag: true, /* for drag / drop */
                order: true /* for ordering */ },
            c_data: [{ n_id: 1, n_title: 'falan1', n_parentid: 0, n_order_num : 0, n_checked: true,
                n_elements: [
                    { icon: 'fa fa-edit', title: 'Edit', onClick: (node) => { console.log('edit - ' + node.id); } /* context button click event */ },  
                    { icon: 'fa fa-trash', title: 'Delete', onClick: (node) => { console.log('delete - ' + node.id); } }], }, 
            { n_id: 2, n_title: 'falan2', n_order_num : 0, n_parentid: 0 }, 
            { n_id: 3, n_title: 'falan3', n_parentid: 0, n_order_num : 0, }, 
            { n_id: 4, n_order_num : 0, n_title: 'falan1-1', n_parentid: 1 }, 
            { n_id: 5, n_order_num : 0, n_title: 'falan1-2', n_parentid: 1 }, 
            { n_id: 10, n_order_num : 0, n_title: 'falan1-2-1', n_parentid: 5 }, 
            { n_id: 11, n_order_num : 0, n_title: 'falan1-2-1-1', n_parentid: 10 }, 
            { n_id: 6, n_order_num : 0, n_title: 'falan2-1', n_parentid: 2 }, 
            { n_id: 7, n_order_num : 0, n_title: 'falan2-2', n_parentid: 2 }, 
            { n_id: 8, n_order_num : 0, n_title: 'falan2-3', n_parentid: 2 }, 
            { n_id: 9, n_order_num : 0, n_title: 'falan1-2-2', n_parentid: 5 }] });
        this.html.tree.container = tree_container
    }

	constructor(terminal) {
		// eventify(this)
		this.terminal = terminal
		this.html = {}
        this.block = new Block(terminal)
        this.node = this.tree(this.block.node)
        this.node = this.block.node
	}
}