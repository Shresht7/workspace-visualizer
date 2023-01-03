// Library
import { readFileSync, writeFileSync } from "node:fs";
import { extname } from "node:path";
import { snapshot } from "../library/snapshot.js";
import { generateForceDirectedTreeGraph } from "../library/forceDirectedGraph.js";

// Type Definitions
import type { Node } from "../class/Node.js";

interface graphOptions {
    path: string,
    output: string,
}
type Graph = (options: graphOptions) => void;

const command: Command<Graph> = {
    name: "graph",
    description: "Visualize the workspace tree as a graph",
    args: [
    ],
    options: [
        {
            name: "-p, --path [path]",
            description: "The path to the workspace to graph",
            default: process.cwd()
        },
        {
            name: "-o, --output [output]",
            description: "The output file path",
            default: "./workspace.svg"

        },
    ],
    /** Create a graph of your workspace */
    run: async ({ path, output }) => {
        console.log('Creating graph...')


        let root: Node
        if (extname(path) === '.json') {
            root = JSON.parse(readFileSync(path, 'utf-8'));
        } else {
            root = snapshot({ path, ignore: [], include: [], exclude: [] });
        }

        // Generate the graph
        const svg = await generateForceDirectedTreeGraph(root, {
            width: 400,
            height: 400
        });

        // Write the SVG to the output file
        if (svg) {
            writeFileSync(output, svg.outerHTML);
        }

        console.log('Graph created successfully! -- ' + output)
    }
}

// --------------------
export default command;
// --------------------
