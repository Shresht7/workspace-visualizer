// Library
import { readFileSync } from "node:fs";
import { generateForceDirectedTreeGraph } from "../forceDirectedGraph.js";

export const command: Command = {
    name: "graph",
    description: "Create a graph of your workspace",
    args: [
    ],
    options: [
        {
            name: "-p, --path [path]",
            description: "The path to the JSON file to graph",
            default: "./tree.json"
        },
        {
            name: "-o, --output [output]",
            description: "The output file path",
            default: "./graph.html"

        },
    ],
    /** 
     * Create a graph of your workspace
     * @param {string} path The path to the JSON file to graph
     * @param {string} output The output file path
    */
    run: ({ path, output }: { path: string, output: string }) => {
        console.log('Creating graph...')

        // Read file
        const root = JSON.parse(readFileSync(path, 'utf-8'));

        // Generate graph
        generateForceDirectedTreeGraph(root, output);
    }
}

export default command
