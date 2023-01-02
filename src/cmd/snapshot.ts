// Library
import { writeFileSync } from "node:fs";
import { Node } from "../node.js";

// Type Definitions
type snapshotOptions = {
    path: string,
    output: string,
    prettyPrint: boolean
}
type snapshot = (options: snapshotOptions) => void;

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
        },
        {
            name: "--pretty-print",
            description: "Pretty print the JSON output",
            default: false
        }
    ],
    /**
     * Create a snapshot of your workspace
     */
    run: ({ path, output, prettyPrint }) => {
        console.log('Creating snapshot...')
        const root = Node.fromPath(path);
        writeFileSync(output, JSON.stringify(
            root,
            null,
            prettyPrint ? 4 : 0
        ));
        console.log('Snapshot created successfully! -- ' + output)
    }
}

// --------------------
export default command;
// --------------------
