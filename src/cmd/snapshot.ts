// Library
import { writeFileSync } from "node:fs";
import { Node } from "../node.js";

const command: Command = {
    name: "snapshot",
    description: "Create a snapshot of your workspace",
    args: [
    ],
    options: [
        {
            name: "-p, --path [path]",
            description: "The path to the workspace",
            default: process.cwd()
        },
        {
            name: "-o, --output [output]",
            description: "The output file path",
            default: "./tree.json"
        }
    ],
    /**
     * Create a snapshot of your workspace
     * @param {string} path The path to the workspace
     * @param {string} output The output file path
     */
    run: ({ path, output }: { path: string, output: string }) => {
        console.log('Creating snapshot...')

        // Create root
        const root = Node.fromPath(path);

        // Write to file
        writeFileSync(output, JSON.stringify(root, null, 4));
    }
}

export default command;
