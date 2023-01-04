// Library
import { writeFileSync } from "node:fs";
import { snapshot, options } from "@workspace-visualizer/fs-tree";

// Type Definitions
interface snapshotOptions extends options {
    output: string,
    json: boolean,
    prettyPrint: boolean
}
type Snapshot = (options: snapshotOptions) => void;

const command: Command<Snapshot> = {
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
            name: "-j, --json",
            description: "Output the JSON to the console",
            default: false
        },
        {
            name: "-i, --ignore [ignore...]",
            description: "Ignore files matching the pattern",
            default: []
        },
        {
            name: "-n, --include [include...]",
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
    /** Create a snapshot of your workspace */
    run: (options: snapshotOptions) => {
        console.log('Creating snapshot...')

        // Create the snapshot
        const root = snapshot(options)

        // Convert the snapshot to JSON
        const json = JSON.stringify(
            root,
            null,
            options.prettyPrint ? 4 : 0
        )

        if (options.json) {
            // Output the JSON to the console
            console.log(json)
        } else {
            // Write the snapshot to the output file
            writeFileSync(options.output, json);
        }

        console.log('Snapshot created successfully! -- ' + options.output)
    },
}

// --------------------
export default command;
// --------------------
