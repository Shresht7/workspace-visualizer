// Library
import { generateForceDirectedGraph } from '@workspace-visualizer/visualization';

window.addEventListener('message', (event) => {
    const message = event.data;     //  The JSON payload
    console.log(message.payload);
    switch (message.type) {
        case 'force-directed-graph':
            generateForceDirectedGraph(message.payload);
            break;
        default:
            break;
    }
});
