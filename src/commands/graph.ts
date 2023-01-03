// Library
import { readFileSync, writeFileSync } from "node:fs";
import { generateForceDirectedTreeGraph } from "../library/forceDirectedGraph.js";

// Type Definitions
interface graphOptions {
    path: string,
    output: string,
}
type Graph = (options: graphOptions) => void;

export const command: Command<Graph> = {
    name: "graph",
    description: "Visualize your workspace tree as a graph",
    args: [
    ],
    options: [
        {
            name: "-p, --path [path]",
            description: "The path to the JSON file to graph",
            default: "./workspace.json"
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

        // Read the JSON file
        const root = JSON.parse(readFileSync(path, 'utf-8'));

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

// -------------------
export default command
// -------------------
