// Library
import { readFileSync } from "node:fs";
import { generateForceDirectedTreeGraph } from "../forceDirectedGraph.js";

// Type Definitions
type graph = (options: { path: string, output: string }) => void;

export const command: Command<graph> = {
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
    /** Create a graph of your workspace */
    run: ({ path, output }) => {
        console.log('Creating graph...')

        // Read file
        const root = JSON.parse(readFileSync(path, 'utf-8'));

        // Generate graph
        generateForceDirectedTreeGraph(root, output);

        console.log('Graph created successfully! -- ' + output)
    }
}

export default command
