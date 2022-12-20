// Library
import { writeFileSync } from "node:fs";
import { Node } from "../node.js";

export default {
    name: "snapshot",
    description: "Create a snapshot of your workspace",
    args: [
        {
            name: "[path]",
            description: "The path to the workspace",
            default: process.cwd()
        },
        {
            name: "[output]",
            description: "The output file path",
            default: "./tree.json"
        }
    ],
    /**
     * Create a snapshot of your workspace
     * @param {string} path The path to the workspace
     * @param {string} output The output file path
     */
    run: (path: string, output: string) => {
        console.log('Creating snapshot...')

        // Create root
        const root = Node.fromPath(path);

        // Write to file
        writeFileSync(output, JSON.stringify(root, null, 4));
    }
}
