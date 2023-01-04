// Library
import { readFileSync, writeFileSync } from "node:fs";
import { extname } from "node:path";
import { snapshot } from "@workspace-visualizer/fs-tree";
import { generateForceDirectedTreeGraph } from "@workspace-visualizer/visualization";

// Helpers
import { getExtensionColor } from "@workspace-visualizer/file-color-associations"; // Assigns colors to file extensions

// Type Definitions
import type { Node } from "@workspace-visualizer/fs-tree";

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
            height: 400,
            // Set the fill color of the nodes based on the file extension
            fill: (d) => getExtensionColor(d.data.path),
            // Set the stroke color of the links based on the file extension
            stroke: (d) => getExtensionColor(d.target.data.path),
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
