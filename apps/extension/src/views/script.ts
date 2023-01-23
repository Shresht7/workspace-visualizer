// Library
import { generateForceDirectedGraph, generateRadialTree } from '@workspace-visualizer/visualization';

window.addEventListener('message', (event) => {
    const message = event.data;     //  The JSON payload

    switch (message.type) {
        case 'force-directed-graph':
            generateForceDirectedGraph(message.payload);
            break;
        case 'radial-tree':
            generateRadialTree(message.payload);
        default:
            break;
    }
});
