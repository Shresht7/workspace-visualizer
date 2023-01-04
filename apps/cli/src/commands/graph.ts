// Library
import { readFileSync, writeFileSync } from "node:fs"; // Read and write files
import { extname } from "node:path"; // Get the extension of a file path
import { snapshot } from "@workspace-visualizer/fs-tree"; // Create a tree of your workspace
import { generateForceDirectedTreeGraph, ForceDirectedGraphOptions } from "@workspace-visualizer/visualization"; // Generate a graph of your workspace

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
            default: 400
        },
        {
            name: "-h, --height [height]",
            description: "The height of the output SVG",
            default: 400
        },
        {
            name: "--margin-top [marginTop]",
            description: "The top margin of the output SVG",
            default: 10
        },
        {
            name: "--margin-right [marginRight]",
            description: "The right margin of the output SVG",
            default: 10
        },
        {
            name: "--margin-bottom [marginBottom]",
            description: "The bottom margin of the output SVG",
            default: 10
        },
        {
            name: "--margin-left [marginLeft]",
            description: "The left margin of the output SVG",
            default: 10
        },
        {
            name: "--center-x [centerX]",
            description: "The x position of the center of the graph",
            default: 200
        },
        {
            name: "--center-y [centerY]",
            description: "The y position of the center of the graph",
            default: 200
        },
        {
            name: "--link-strength [linkStrength]",
            description: "The strength of the links between nodes",
            default: 0.1
        },
        {
            name: "--link-distance [linkDistance]",
            description: "The distance between nodes",
            default: 30
        },
        {
            name: "--node-force [nodeForce]",
            description: "The force of the nodes",
            default: -30
        },
        {
            name: "--link-stroke [linkStroke]",
            description: "The stroke color of the links",
            default: "#999"
        },
        {
            name: "--link-stroke-width [linkStrokeWidth]",
            description: "The stroke width of the links",
            default: "1px"
        },
        {
            name: "--link-stroke-opacity [linkStrokeOpacity]",
            description: "The stroke opacity of the links",
            default: 0.6
        },
        {
            name: "--link-stroke-linecap [linkStrokeLinecap]",
            description: "The stroke linecap of the links",
            default: "round"
        },
        {
            name: "--link-stroke-linejoin [linkStrokeLinejoin]",
            description: "The stroke linejoin of the links",
            default: "round"
        },
        {
            name: "--node-stroke [nodeStroke]",
            description: "The stroke color of the nodes",
            default: "#fff"
        },
        {
            name: "--node-stroke-width [nodeStrokeWidth]",
            description: "The stroke width of the nodes",
            default: "1.5px"
        },
        {
            name: "--node-radius [nodeRadius]",
            description: "The radius of the nodes",
            default: 5
        },
        {
            name: "--node-fill [nodeFill]",
            description: "The fill color of the nodes",
            default: "#999"
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
        const svg = await generateForceDirectedTreeGraph(root, {
            // Set the fill color of the nodes based on the file extension
            nodeFill: (d) => getExtensionColor(d.data.path),
            // Set the stroke color of the links based on the file extension
            linkStroke: (d) => getExtensionColor(d.target.data.path),
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
