// Library
import * as d3 from 'd3'; // Data-Visualization Library

// Type Definitions
import type { Node } from '../class/Node.js';

// ----------------
// TYPE DEFINITIONS
// ----------------

type StrokeLineCap = 'butt' | 'round' | 'square' | 'inherit';
type StrokeLineJoin = 'miter' | 'round' | 'bevel' | 'inherit';

/** Options to customize the radial-tree-graph SVG */
interface options {

    // SVG Options
    // -----------

    /** Margins around the radial-tree-graph */
    margin: {
        top: number,
        right: number,
        bottom: number,
        left: number
    },

    // Radial Tree Options
    // -------------------

    /** Radial sweep angle of the tree */
    angle: number,
    /** Radius of the radial tree */
    radius: number,
    /** Callback function to set separation of two adjacent nodes */
    separator: (a: d3.HierarchyPointNode<Node>, b: d3.HierarchyPointNode<Node>) => number,
    /** Callback function to sort nodes */
    sortFn: (a: d3.HierarchyPointNode<Node>, b: d3.HierarchyNode<Node>) => number,

    // Styling Options
    // ---------------

    // Links

    /** Stroke color of the links */
    stroke: string | ((d: d3.HierarchyPointLink<Node>) => string),
    /** Stroke opacity of the links */
    strokeOpacity: number | ((d: d3.HierarchyPointLink<Node>) => number),
    /** Stroke linecap of the links */
    strokeLinecap: StrokeLineCap | ((d: d3.HierarchyPointLink<Node>) => StrokeLineCap),
    /** Stroke linejoin of the links */
    strokeLinejoin: StrokeLineJoin | ((d: d3.HierarchyPointLink<Node>) => StrokeLineJoin),
    /** Stroke width of the links */
    strokeWidth: number | ((d: d3.HierarchyPointLink<Node>) => number),

    // Nodes

    /** Fill color of the nodes */
    fill: string | ((d: d3.HierarchyPointNode<Node>) => string),
    /** Radius of the nodes */
    r: number | ((d: d3.HierarchyPointNode<Node>) => number),

    // Text

    /** Stroke color of the text */
    textStroke: string | ((d: d3.HierarchyPointNode<Node>) => string),
    /** Stroke width of the text */
    textStrokeWidth: number | ((d: d3.HierarchyPointNode<Node>) => number),
    textSize: number | ((d: d3.HierarchyPointNode<Node>) => number),
}

// ---------------
// DEFAULT OPTIONS
// ---------------

/** Default options for the radial-tree-graph SVG */
const defaultOptions: options = {
    // SVG Options
    margin: { top: 40, right: 40, bottom: 40, left: 40 },

    // Radial Tree Options
    angle: 2 * Math.PI, // 360 degrees sweep
    radius: 1600, // 1600 pixels
    separator: (a, b) => a.parent === b.parent ? 1 : 2, // 1 for siblings, 2 for non-siblings
    sortFn: (a, b) => d3.ascending(a.data.name, b.data.name), // sort by name in ascending order

    // Styling Options - Links
    stroke: '#ccc',
    strokeOpacity: 0.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 1.5,

    // Styling Options - Nodes
    fill: '#fff',
    r: 2.5,

    // Styling Options - Text
    textStroke: "#eee",
    textStrokeWidth: 1,
    textSize: 10,
}

// ==========================
// GENERATE RADIAL TREE GRAPH
// ==========================

/**
 * Generate a radial tree graph
 * @param root Root node of the tree
 * @param opts Options to customize the radial tree graph
 * @returns SVGElement
 */
export async function generateRadialTree(root: Node, opts: Partial<options> = defaultOptions): Promise<SVGElement | null> {

    // merge options with defaults
    const options = { ...defaultOptions, ...opts } as options;

    // Create SVG
    const svg = d3.select(document.body).append("svg")
        .attr("width", '100%')
        .attr("height", '100%')
        .attr("viewBox", [
            -options.radius - options.margin.left,
            -options.radius - options.margin.top,
            2 * options.radius + options.margin.right,
            2 * options.radius + options.margin.bottom
        ]);

    // Create tree
    const tree = d3.tree<Node>()
        .size([options.angle, options.radius])
        .separation(options.separator);

    // Create node tree
    const nodes = tree(d3.hierarchy(root));

    // Sort nodes
    if (options.sortFn) {
        nodes.sort(options.sortFn);
    }

    // Create descendants and links
    const descendants = nodes.descendants();
    const links = nodes.links();

    // Create links
    svg.append("g")
        .selectAll("path")
        .data(links)
        .join("path")
        .attr("fill", "none")
        .attr("stroke", options.stroke)
        .attr("stroke-width", options.strokeWidth)
        .attr("stroke-opacity", options.strokeOpacity)
        .attr("stroke-linecap", options.strokeLinecap)
        .attr("stroke-linejoin", options.strokeLinejoin)
        // @ts-ignore - types don't seem to match up here
        .attr("d", d3.linkRadial().angle(d => d.x).radius(d => d.y));

    // Create nodes
    // Add node anchors. TODO: Link it somewhere?
    const node = svg.append("g")
        .selectAll("a")
        .data(descendants)
        .join("a")
        .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`);

    // Add node circle
    node.append("circle")
        .attr("fill", options.fill)
        .attr("r", options.r);

    // Add title to the nodes
    node.append('title')
        .text(d => d.data.name);

    // Add node text
    node.append("text")
        .attr("transform", d => `rotate(${d.x >= Math.PI ? 180 : 0})`)
        .attr("dy", "0.32em")
        .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
        .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
        .attr("paint-order", "stroke")
        .attr("stroke", options.textStroke)
        .attr("stroke-width", options.textStrokeWidth)
        .attr("font-size", options.textSize)
        .attr('fill', options.fill)
        .text((d, i) => d.data.name);

    // Return SVG
    return svg.node();
}
