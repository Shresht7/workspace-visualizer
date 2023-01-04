// Library
import * as d3 from 'd3' // Data-Visualization Library

// Type Definitions
import type { Node } from '@workspace-visualizer/fs-tree'

// ----------------
// TYPE DEFINITIONS
// ----------------

/** Options to customize the radial-tree-graph SVG */
export interface RadialGraphOptions {

    // SVG Options
    // -----------

    /** Margins around the radial-tree-graph */
    marginTop: number,
    marginRight: number,
    marginBottom: number,
    marginLeft: number,

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

    /** Fill color of the nodes */
    nodeFill: string | ((d: d3.HierarchyPointNode<Node>) => string),
    /** Radius of the nodes */
    nodeR: number | ((d: d3.HierarchyPointNode<Node>) => number),
    /** Stroke color of the text */
    nodeTextStroke: string | ((d: d3.HierarchyPointNode<Node>) => string),
    /** Stroke width of the text */
    nodeTextStrokeWidth: number | ((d: d3.HierarchyPointNode<Node>) => number),
    nodeTextSize: number | ((d: d3.HierarchyPointNode<Node>) => number),

}

// ---------------
// DEFAULT OPTIONS
// ---------------

/** Default options for the radial-tree-graph SVG */
const defaultOptions: RadialGraphOptions = {
    // SVG options
    marginTop: 10,
    marginRight: 10,
    marginBottom: 10,
    marginLeft: 10,

    // Radial Tree Options
    angle: 2 * Math.PI, // 360 degrees sweep
    radius: 1600, // 1600 pixels
    separator: (a, b) => a.parent === b.parent ? 1 : 2, // 1 for siblings, 2 for non-siblings
    sortFn: (a, b) => d3.ascending(a.data.name, b.data.name), // sort by name in ascending order

    // Styling Options - Links
    linkStroke: '#ccc',
    linkStrokeOpacity: 0.6,
    linkStrokeLineCap: 'round',
    linkStrokeLineJoin: 'round',
    linkStrokeWidth: 1.5,

    nodeFill: '#fff',
    nodeR: 2.5,
    nodeTextStroke: "#eee",
    nodeTextStrokeWidth: 1,
    nodeTextSize: 10,

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
export async function generateRadialTree(root: Node, opts: Partial<RadialGraphOptions> = defaultOptions): Promise<SVGElement | null> {

    // merge options with defaults
    const options = { ...defaultOptions, ...opts } as RadialGraphOptions

    // Create SVG
    const svg = d3.select(document.body).append("svg")
        .attr("width", '100%')
        .attr("height", '100%')
        .attr("viewBox", [
            -options.radius - options.marginLeft,
            -options.radius - options.marginTop,
            2 * options.radius + options.marginRight,
            2 * options.radius + options.marginBottom
        ])

    // Create tree
    const tree = d3.tree<Node>()
        .size([options.angle, options.radius])
        .separation(options.separator)

    // Create node tree
    const nodes = tree(d3.hierarchy(root))

    // Sort nodes
    nodes.sort(options.sortFn)

    // Create descendants and links
    const descendants = nodes.descendants()
    const links = nodes.links()

    // Create links
    svg.append("g")
        .selectAll("path")
        .data(links)
        .join("path")
        .attr("fill", "none")
        .attr("stroke", options.linkStroke)
        .attr("stroke-width", options.linkStrokeWidth)
        .attr("stroke-opacity", options.linkStrokeOpacity)
        .attr("stroke-linecap", options.linkStrokeLineCap)
        .attr("stroke-linejoin", options.linkStrokeLineJoin)
        // @ts-ignore - types don't seem to match up here
        .attr("d", d3.linkRadial().angle(d => d.x).radius(d => d.y))

    // Create nodes
    // Add node anchors. TODO: Link it somewhere?
    const node = svg.append("g")
        .selectAll("a")
        .data(descendants)
        .join("a")
        .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)

    // Add node circle
    node.append("circle")
        .attr("fill", options.nodeFill)
        .attr("r", options.nodeR)

    // Add title to the nodes
    node.append('title')
        .text(d => d.data.name)

    // Add node text
    node.append("text")
        .attr("transform", d => `rotate(${d.x >= Math.PI ? 180 : 0})`)
        .attr("dy", "0.32em")
        .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
        .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
        .attr("paint-order", "stroke")
        .attr("stroke", options.nodeTextStroke)
        .attr("stroke-width", options.nodeTextStrokeWidth)
        .attr("font-size", options.nodeTextSize)
        .attr('fill', options.nodeFill)
        .text((d, i) => d.data.name)

    // Return SVG
    return svg.node()
}
