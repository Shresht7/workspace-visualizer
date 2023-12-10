// Library
import { readFileSync, writeFileSync } from "node:fs"; // Read and write files
import { extname } from "node:path"; // Get the extension of a file path
import { snapshot } from "@workspace-visualizer/fs-tree"; // Create a tree of your workspace
import { generateForceDirectedGraph, ForceDirectedGraphOptions } from "@workspace-visualizer/visualization"; // Generate a graph of your workspace

// Helpers
import { getExtensionColor } from "@workspace-visualizer/file-color-associations"; // Assigns colors to file extensions

// Type Definitions
import type { Node } from "@workspace-visualizer/fs-tree";

/** Graph Options */
interface GraphOptions extends Partial<ForceDirectedGraphOptions> {
    /** The path to the workspace to graph */
    path: string,
    /** The output file path */
    output: string,
}
type Graph = (options: GraphOptions) => void;

const command: Command<Graph> = {
    name: "graph",
    description: "Visualize the workspace tree as a graph",
    aliases: ['g', 'visualize', 'v'],
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
            name: "-w, --width [width]",
            description: "The width of the output SVG",
        },
        {
            name: "-h, --height [height]",
            description: "The height of the output SVG",
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
            name: "--center-x [centerX]",
            description: "The x position of the center of the graph",
        },
        {
            name: "--center-y [centerY]",
            description: "The y position of the center of the graph",
        },
        {
            name: "--link-strength [linkStrength]",
            description: "The strength of the links between nodes",
        },
        {
            name: "--link-distance [linkDistance]",
            description: "The distance between nodes",
        },
        {
            name: "--node-force [nodeForce]",
            description: "The force of the nodes",
        },
        {
            name: "--link-stroke [linkStroke]",
            description: "The stroke color of the links",
        },
        {
            name: "--link-stroke-width [linkStrokeWidth]",
            description: "The stroke width of the links",
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
            name: "--node-stroke [nodeStroke]",
            description: "The stroke color of the nodes",
        },
        {
            name: "--node-stroke-width [nodeStrokeWidth]",
            description: "The stroke width of the nodes",
        },
        {
            name: "--node-radius [nodeRadius]",
            description: "The radius of the nodes",
        },
        {
            name: "--node-fill [nodeFill]",
            description: "The fill color of the nodes",
        }
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
        const svg = await generateForceDirectedGraph(root, {
            // Set the node force of repulsion based on the file size
            nodeForce: (d) => -(d as Node).size,
            // Set the stroke color of the links and nodes based on the file extension
            linkStroke: (d) => getExtensionColor(d.target.data.path),
            // Set the node radius based on the file size
            nodeRadius: (d) => Math.sqrt(d.data.size / Math.PI),
            // Set the fill color of the nodes based on the file extension
            nodeFill: (d) => getExtensionColor(d.data.path),
            // Use user defined options if provided
            ...options,
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
