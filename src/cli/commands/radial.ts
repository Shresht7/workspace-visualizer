//  Library
import { readFileSync, writeFileSync } from "node:fs";
import { extname } from "node:path";
import { snapshot } from "../../library/snapshot.js";
import { generateRadialTree } from "../../library/radialTree.js";

// Helpers
import { getExtensionColor } from '../../helpers/index.js'; // Assigns colors to file extensions

// Type Definitions
import type { Node } from "../../class/Node.js";

interface radialOptions {
    path: string,
    output: string,
}
type Radial = (options: radialOptions) => void;

const command: Command<Radial> = {
    name: "radial",
    description: "Visualize the workspace tree as a radial tree graph",
    args: [
    ],
    options: [
        {
            name: "-p, --path [path]",
            description: "The path to the workspace to graph",
            default: process.cwd()
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

        let root: Node
        if (extname(path) === '.json') {
            root = JSON.parse(readFileSync(path, 'utf-8'));
        } else {
            root = snapshot({ path, ignore: [], include: [], exclude: [] });
        }

        // Generate the graph
        const svg = await generateRadialTree(root, {
            // Set the fill color of the nodes based on the file extension
            fill: (d) => getExtensionColor(d.data.path),
            // Set the stroke color of the links based on the file extension
            stroke: (d) => getExtensionColor(d.target.data.path),
        });

        // Write the SVG to the output file
        if (svg) {
            writeFileSync(output, svg.outerHTML);
        }

        console.log('Graph created successfully! -- ' + output)
    }
}

// --------------------
export default command;
// --------------------
