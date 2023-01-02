// Library
import { writeFileSync } from "node:fs";
import { Node } from "../node.js";

// Type Definitions
type snapshot = (options: { path: string, output: string }) => void;

const command: Command<snapshot> = {
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
     */
    run: ({ path, output }) => {
        console.log('Creating snapshot...')
        const root = Node.fromPath(path);
        writeFileSync(output, JSON.stringify(root, null, 4));
        console.log('Snapshot created successfully! -- ' + output)
    }
}

// --------------------
export default command;
// --------------------
