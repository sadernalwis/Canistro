import { Block } from "Medusa/Mirror/Terminal/Block/Block.js"
import { PickleTree } from "Medusa/Mirror/Tree/PickleTree/PickleTree.js";
import { AddrressBar } from "Medusa/Mirror/Terminal/AddrressBar/AddrressBar.js";

export class Tree {

	render() {
		// this.carousel.render()
	}

    graph(wrapper){
        // var createSettingsView = import('./Graph/config');//
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
        this.addressbar = new AddrressBar(this);
        this.addressbar = new AddrressBar(this);
        // this.html.tree.container = tree_container
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