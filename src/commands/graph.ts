// Library
import { readFileSync } from "node:fs";
import { generateForceDirectedTreeGraph } from "../library/forceDirectedGraph.js";

// Type Definitions
type graph = (options: { path: string, output: string }) => void;

export const command: Command<graph> = {
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
    run: ({ path, output }) => {
        console.log('Creating graph...')
        const root = JSON.parse(readFileSync(path, 'utf-8'));
        generateForceDirectedTreeGraph(root, output);
        console.log('Graph created successfully! -- ' + output)
    }
}

// -------------------
export default command
// -------------------
