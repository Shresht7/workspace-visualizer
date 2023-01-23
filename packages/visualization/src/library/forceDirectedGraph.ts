// Library
import * as d3 from 'd3' // Data-Visualization Library

// Type Definitions
import type { Node } from '@workspace-visualizer/fs-tree'
import type { StrokeLineCap, StrokeLineJoin } from '../types'

// ----------------
// TYPE DEFINITIONS
// ----------------

/** Options to customize the force-directed-graph SVG */
export interface ForceDirectedGraphOptions {

    // SVG Options
    // -----------

    /** Width of the SVG output */
    width: number,
    /** Height of the SVG output */
    height: number,
    /** Margins around the force-directed-graph */
    marginTop: number,
    marginRight: number,
    marginBottom: number,
    marginLeft: number,

    // Force Directed Graph Options
    // ----------------------------

    /** X position of the center of the force-directed-graph */
    centerX: number,
    /** Y position of the center of the force-directed-graph */
    centerY: number,
    /** Strength of the links */
    linkStrength: number | ((d: d3.HierarchyPointLink<Node>) => number),
    /** Distance of the links */
    linkDistance: number | ((d: d3.HierarchyPointLink<Node>) => number),
    /** Many body force multiplier. Negative values imply repulsion and positive values imply attraction */
    nodeForce: number | ((d: d3.SimulationNodeDatum) => number),
    /** Callback function to set separation of two adjacent nodes */
    sortFn: (a: d3.HierarchyPointNode<Node>, b: d3.HierarchyNode<Node>) => number,

    // Styling Options
    // ---------------

    // Links

    /** Stroke color of the links */
    linkStroke: string | ((d: d3.HierarchyPointLink<Node>) => string),
    /** Stroke opacity of the links */
    linkStrokeOpacity: number | ((d: d3.HierarchyPointLink<Node>) => number),
    /** Stroke linecap of the links */
    linkStrokeLineCap: StrokeLineCap | ((d: d3.HierarchyPointLink<Node>) => StrokeLineCap),
    /** Stroke linejoin of the links */
    linkStrokeLineJoin: StrokeLineJoin | ((d: d3.HierarchyPointLink<Node>) => StrokeLineJoin),
    /** Stroke width of the links */
    linkStrokeWidth: number | ((d: d3.HierarchyPointLink<Node>) => number),

    // Nodes

    /** Stroke color of the nodes */
    nodeStroke: string | ((d: d3.HierarchyPointNode<Node>) => string),
    /** Stroke width of the nodes */
    nodeStrokeWidth: number | ((d: d3.HierarchyPointNode<Node>) => number),
    /** Fill color of the nodes */
    nodeFill: string | ((d: d3.HierarchyPointNode<Node>) => string),
    /** Radius of the nodes */
    nodeRadius: number | ((d: d3.HierarchyPointNode<Node>) => number),
    /** Callback function to set the title of the nodes */
    nodeTitle: string | ((d: d3.HierarchyPointNode<Node>) => string),

}

// ---------------
// DEFAULT OPTIONS
// ---------------

/** Default options */
const defaultOptions: ForceDirectedGraphOptions = {

    // SVG Options
    width: 400,
    height: 400,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,

    // Force Directed Graph Options
    centerX: 200, // Half of the width
    centerY: 200, // Half of the height
    linkStrength: 1,
    linkDistance: 30,
    nodeForce: -60,
    sortFn: (a, b) => a.data.name.localeCompare(b.data.name),

    // Styling Options
    // Styling Options - Links
    linkStroke: '#333',
    linkStrokeOpacity: 0.6,
    linkStrokeLineCap: 'round',
    linkStrokeLineJoin: 'round',
    linkStrokeWidth: 1,
    // Styling Options - Nodes
    nodeStroke: '#fff',
    nodeStrokeWidth: 1,
    nodeFill: '#fff',
    nodeRadius: 5,
    nodeTitle: (d) => d.data.name

}

// =============================
// GENERATE FORCE DIRECTED GRAPH
// =============================

/**
 * Generate a force directed tree graph
 * @param root Root node of the tree
 * @param options Options
 * @returns SVGElement
 */
export async function generateForceDirectedGraph(root: Node, opts: Partial<ForceDirectedGraphOptions> = defaultOptions): Promise<SVGElement | null> {

    // Merge options with defaults
    const options = { ...defaultOptions, ...opts } as ForceDirectedGraphOptions

    // Create SVG
    const svg = d3.select(document.body).append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr("viewBox", [
            -options.width - options.marginLeft,
            -options.height - options.marginTop,
            2 * options.width + options.marginRight,
            2 * options.height + options.marginBottom
        ])

    // Create tree
    const tree = d3.tree<Node>()
        .size([options.width, options.height])

    // Create node tree
    const nodes = tree(d3.hierarchy(root))

    // Sort nodes
    nodes.sort(options.sortFn)

    // Create descendants and links
    const descendants = nodes.descendants()
    const links = nodes.links()

    // Create simulation
    const simulation = d3.forceSimulation(descendants)
        .force('center', d3.forceCenter(options.centerX, options.centerY))
        .force('charge', d3.forceManyBody().strength(options.nodeForce))
        .force('x', d3.forceX())
        .force('y', d3.forceY())
        .force('link', d3.forceLink(links)
            .id(d => (d as Node).path)
            .strength(options.linkStrength)
            .distance(options.linkDistance)
        )


    // Create links
    const link = svg.append('g')
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke', options.linkStroke)
        .attr('stroke-opacity', options.linkStrokeOpacity)
        .attr('stroke-linecap', options.linkStrokeLineCap)
        .attr('stroke-linejoin', options.linkStrokeLineJoin)
        .attr('stroke-width', options.linkStrokeWidth)

    // Create nodes
    const node = svg.append('g')
        .selectAll('circle')
        .data(descendants)
        .join('circle')
        .attr('stroke', options.nodeStroke)
        .attr('stroke-width', options.nodeStrokeWidth)
        .attr('r', options.nodeRadius)
        .attr('fill', options.nodeFill)

    // Add title to the nodes
    node.append('title')
        .text(options.nodeTitle)

    // Update position of the nodes and links
    simulation.on('tick', () => {
        // Update position of the link
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y)

        // Update position of the node
        node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
    })

    // Write the SVG when the simulation ends
    return new Promise((resolve, reject) => {
        simulation.on('end', () => {
            resolve(svg.node())
        })
    })
}
