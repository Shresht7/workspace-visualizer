// Library
import { writeFileSync } from "node:fs";
import { Node } from "../class/Node.js";

// Type Definitions
type snapshotOptions = {
    path: string,
    output: string,
    ignore: string[],
    include: string[],
    exclude: string[],
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
            default: "./workspace.json"
        },
        {
            name: "-i, --ignore [ignore...]",
            description: "Ignore files matching the pattern",
            default: ['.git']
        },
        {
            name: "-i, --include [include...]",
            description: "Include files matching the pattern",
            default: []
        },
        {
            name: "-e, --exclude [exclude...]",
            description: "Exclude files matching the pattern",
            default: []
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
    run: ({
        path,
        output,
        ignore,
        include,
        exclude,
        prettyPrint
    }) => {
        console.log('Creating snapshot...')

        // Create the root node
        const root = new Node(path);

        // Add the rules of selection
        ignore.forEach((pattern) => root.addIgnoreRule(pattern));
        include.forEach((pattern) => root.addIncludeRule(pattern));
        exclude.forEach((pattern) => root.addExcludeRule(pattern));

        // Build the tree
        root.buildTree();

        // Write the snapshot to the output file
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
