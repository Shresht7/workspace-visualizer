//  Library
import { readFileSync, writeFileSync } from "node:fs"; // Read and write files
import { extname } from "node:path"; // Get the extension of a file path
import { snapshot } from "@workspace-visualizer/fs-tree"; // Create a tree of your workspace
import { generateRadialTree, RadialGraphOptions } from "@workspace-visualizer/visualization"; // Generate a graph of your workspace

// Helpers
import { getExtensionColor } from '@workspace-visualizer/file-color-associations'; // Assigns colors to file extensions

// Type Definitions
import type { Node } from "@workspace-visualizer/fs-tree";

/** Graph Options */
interface GraphOptions extends Partial<RadialGraphOptions> {
    /** The path to the workspace to graph */
    path: string,
    /** The output file path */
    output: string,
}
type Radial = (options: GraphOptions) => void;

const command: Command<Radial> = {
    name: "radial",
    description: "Visualize the workspace tree as a radial tree graph",
    aliases: ['r', 'radialtree'],
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
        {
            name: "--margin-top [marginTop]",
            description: "The top margin of the output SVG",

        },
        {
            name: "--margin-right [marginRight]",
            description: "The right margin of the output SVG",

        },
        {
            name: "--margin-bottom [marginBottom]",
            description: "The bottom margin of the output SVG",

        },
        {
            name: "--margin-left [marginLeft]",
            description: "The left margin of the output SVG",

        },
        {
            name: "--angle [angle]",
            description: "The angle of the radial tree",

        },
        {
            name: "--radius [radius]",
            description: "The radius of the radial tree",

        },
        {
            name: "--link-stroke [linkStroke]",
            description: "The stroke color of the links",

        },
        {
            name: "--link-stroke-opacity [linkStrokeOpacity]",
            description: "The stroke opacity of the links",

        },
        {
            name: "--link-stroke-linecap [linkStrokeLinecap]",
            description: "The stroke linecap of the links",

        },
        {
            name: "--link-stroke-linejoin [linkStrokeLinejoin]",
            description: "The stroke linejoin of the links",

        },
        {
            name: "--link-stroke-width [linkStrokeWidth]",
            description: "The stroke width of the links",

        },
        {
            name: "--node-fill [nodeFill]",
            description: "The fill color of the nodes",

        },
        {
            name: "--node-radius [nodeRadius]",
            description: "The radius of the nodes",

        },
        {
            name: "--node-text-stroke [nodeTextStroke]",
            description: "The stroke color of the node text",

        },
        {
            name: "--node-text-stroke-width [nodeTextStrokeWidth]",
            description: "The stroke width of the node text",

        },
        {
            name: "--node-text-size [nodeTextSize]",
            description: "The size of the node text",

        },
    ],
    /** Create a graph of your workspace */
    run: async (options) => {
        console.log('Creating graph...')

        let root: Node
        if (extname(options.path) === '.json') {
            root = JSON.parse(readFileSync(options.path, 'utf-8'));
        } else {
            root = snapshot({ path: options.path, ignore: [], include: [], exclude: [] });
        }

        // Generate the graph
        const svg = await generateRadialTree(root, {
            // Set the stroke color of the links based on the file extension
            linkStroke: (d) => getExtensionColor(d.target.data.path),
            // Set the stroke color of the node text based on the file extension
            nodeTextStroke: (d) => getExtensionColor(d.data.path),
            // Set the node radius based on the file size
            nodeRadius: (d) => Math.sqrt(d.data.size / Math.PI),
            // Set the fill color of the nodes based on the file extension
            nodeFill: (d) => getExtensionColor(d.data.path),
            // Use user defined options
            ...options
        });

        // Throw an error if the graph failed to generate
        if (!svg) { throw new Error('Failed to create graph!'); }

        // Write the SVG to the output file
        writeFileSync(options.output, svg.outerHTML);

        console.log('Graph created successfully! -- ' + options.output)
    }
}

// --------------------
export default command;
// --------------------
