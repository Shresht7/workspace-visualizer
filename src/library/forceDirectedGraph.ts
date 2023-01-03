// Library
import * as d3 from 'd3'; // Data-Visualization Library
import { JSDOM } from 'jsdom'; // DOM Manipulation outside of the browser

// Type Definitions
import type { Node } from '../class/Node.js';

// ----------------
// TYPE DEFINITIONS
// ----------------

type StrokeLineCap = 'butt' | 'round' | 'square' | 'inherit';
type StrokeLineJoin = 'miter' | 'round' | 'bevel' | 'inherit';

/** Options to customize the force-directed-tree-graph SVG */
interface options {

    // SVG Options
    // -----------

    /** Width of the SVG output */
    width: number,
    /** Height of the SVG output */
    height: number,

    // Force Directed Tree Options
    // ---------------------------

    /** Strength of the links */
    linkStrength: number,
    /** Distance of the links */
    linkDistance: number,
    /** Charge of the nodes */
    charge: number,
    /** Gravity of the nodes */
    gravity: number,
    /** X position of the center of the force-directed-tree */
    centerX: number,
    /** Y position of the center of the force-directed-tree */
    centerY: number,
    /** Callback function to set separation of two adjacent nodes */
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

    /** Stroke color of the nodes */
    nodeStroke: string | ((d: d3.HierarchyPointNode<Node>) => string),
    /** Stroke width of the nodes */
    nodeStrokeWidth: number | ((d: d3.HierarchyPointNode<Node>) => number),
    /** Fill color of the nodes */
    fill: string | ((d: d3.HierarchyPointNode<Node>) => string),
    /** Radius of the nodes */
    r: number | ((d: d3.HierarchyPointNode<Node>) => number),
}

// ---------------
// DEFAULT OPTIONS
// ---------------

/** Default options */
const defaultOptions: options = {

    // SVG Options
    width: 400,
    height: 400,

    // Force Directed Tree Options
    linkStrength: 1,
    linkDistance: 30,
    charge: -30,
    gravity: 0.1,
    centerX: 200, // Half of the width
    centerY: 200, // Half of the height
    sortFn: (a, b) => a.data.name.localeCompare(b.data.name),

    // Styling Options - Links
    stroke: '#333',
    strokeOpacity: 0.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 1.5,

    // Styling Options - Nodes
    nodeStroke: '#fff',
    nodeStrokeWidth: 1.5,
    fill: '#fff',
    r: 5,
};

// =============================
// GENERATE FORCE DIRECTED GRAPH
// =============================

/**
 * Generate a force directed tree graph
 * @param root Root node of the tree
 * @param options Options
 * @returns SVGElement
 */
export async function generateForceDirectedTreeGraph(root: Node, opts: Partial<options> = defaultOptions): Promise<SVGElement | null> {

    // Merge options with defaults
    const options = { ...defaultOptions, ...opts } as options;

    // JSDOM
    const dom = new JSDOM();
    const body = dom.window.document.body;

    // Create SVG
    const svg = d3.select(body).append('svg')
        .attr('width', options.width)
        .attr('height', options.height)
        .attr('viewBox', [-options.width / 2, -options.height / 2, options.width, options.height]);

    // Create tree
    const tree = d3.tree<Node>()
        .size([options.width, options.height]);

    // Create node tree
    const nodes = tree(d3.hierarchy(root));

    // Sort nodes
    if (options.sortFn) {
        nodes.sort(options.sortFn);
    }

    // Create descendants and links
    const descendants = nodes.descendants();
    const links = nodes.links();

    // Create simulation
    const simulation = d3.forceSimulation(descendants)
        .force('link', d3.forceLink(links).id(d => (d as Node).path))
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(options.centerX, options.centerY))
        .force('x', d3.forceX())
        .force('y', d3.forceY())


    // Create links
    const link = svg.append('g')
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke', options.stroke)
        .attr('stroke-opacity', options.strokeOpacity)
        .attr('stroke-linecap', options.strokeLinecap)
        .attr('stroke-linejoin', options.strokeLinejoin)
        .attr('stroke-width', options.strokeWidth)

    // Create nodes
    const node = svg.append('g')
        .selectAll('circle')
        .data(descendants)
        .join('circle')
        .attr('stroke', options.nodeStroke)
        .attr('stroke-width', options.nodeStrokeWidth)
        .attr('r', options.r)
        .attr('fill', options.fill);

    // Add title to the nodes
    node.append('title')
        .text(d => d.data.name);

    // Update position of the nodes and links
    simulation.on('tick', () => {
        // Update position of the link
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        // Update position of the node
        node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
    });

    return new Promise((resolve, reject) => {
        // Write the SVG when the simulation ends
        simulation.on('end', () => {
            resolve(svg.node())
        })
    })
}
