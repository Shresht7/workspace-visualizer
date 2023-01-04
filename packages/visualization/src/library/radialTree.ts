// Library
import * as d3 from 'd3' // Data-Visualization Library

// Type Definitions
import type { Node } from '@workspace-visualizer/fs-tree'

// ----------------
// TYPE DEFINITIONS
// ----------------

/** Options to customize the radial-tree-graph SVG */
interface options {

    // SVG Options
    // -----------

    svg: {
        /** Margins around the radial-tree-graph */
        margin: {
            top: number,
            right: number,
            bottom: number,
            left: number
        },
    }

    // Radial Tree Options
    // -------------------

    graph: {
        /** Radial sweep angle of the tree */
        angle: number,
        /** Radius of the radial tree */
        radius: number,
        /** Callback function to set separation of two adjacent nodes */
        separator: (a: d3.HierarchyPointNode<Node>, b: d3.HierarchyPointNode<Node>) => number,
        /** Callback function to sort nodes */
        sortFn: (a: d3.HierarchyPointNode<Node>, b: d3.HierarchyNode<Node>) => number,
    }

    // Styling Options
    // ---------------

    style: {
        // Links
        link: {
            /** Stroke color of the links */
            stroke: string | ((d: d3.HierarchyPointLink<Node>) => string),
            /** Stroke opacity of the links */
            strokeOpacity: number | ((d: d3.HierarchyPointLink<Node>) => number),
            /** Stroke linecap of the links */
            strokeLineCap: StrokeLineCap | ((d: d3.HierarchyPointLink<Node>) => StrokeLineCap),
            /** Stroke linejoin of the links */
            strokeLineJoin: StrokeLineJoin | ((d: d3.HierarchyPointLink<Node>) => StrokeLineJoin),
            /** Stroke width of the links */
            strokeWidth: number | ((d: d3.HierarchyPointLink<Node>) => number),
        },
        // Nodes
        node: {
            /** Fill color of the nodes */
            fill: string | ((d: d3.HierarchyPointNode<Node>) => string),
            /** Radius of the nodes */
            r: number | ((d: d3.HierarchyPointNode<Node>) => number),
            /** Stroke color of the text */
            textStroke: string | ((d: d3.HierarchyPointNode<Node>) => string),
            /** Stroke width of the text */
            textStrokeWidth: number | ((d: d3.HierarchyPointNode<Node>) => number),
            textSize: number | ((d: d3.HierarchyPointNode<Node>) => number),
        }
    }

}

// ---------------
// DEFAULT OPTIONS
// ---------------

/** Default options for the radial-tree-graph SVG */
const defaultOptions: options = {
    // SVG Options
    svg: {
        margin: { top: 40, right: 40, bottom: 40, left: 40 },
    },

    // Radial Tree Options
    graph: {
        angle: 2 * Math.PI, // 360 degrees sweep
        radius: 1600, // 1600 pixels
        separator: (a, b) => a.parent === b.parent ? 1 : 2, // 1 for siblings, 2 for non-siblings
        sortFn: (a, b) => d3.ascending(a.data.name, b.data.name), // sort by name in ascending order
    },

    style: {
        link: {
            // Styling Options - Links
            stroke: '#ccc',
            strokeOpacity: 0.6,
            strokeLineCap: 'round',
            strokeLineJoin: 'round',
            strokeWidth: 1.5,
        },
        // Styling Options - Nodes
        node: {
            fill: '#fff',
            r: 2.5,
            textStroke: "#eee",
            textStrokeWidth: 1,
            textSize: 10,
        }
    }

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
    const options = { ...defaultOptions, ...opts } as options

    // Create SVG
    const svg = d3.select(document.body).append("svg")
        .attr("width", '100%')
        .attr("height", '100%')
        .attr("viewBox", [
            -options.graph.radius - options.svg.margin.left,
            -options.graph.radius - options.svg.margin.top,
            2 * options.graph.radius + options.svg.margin.right,
            2 * options.graph.radius + options.svg.margin.bottom
        ])

    // Create tree
    const tree = d3.tree<Node>()
        .size([options.graph.angle, options.graph.radius])
        .separation(options.graph.separator)

    // Create node tree
    const nodes = tree(d3.hierarchy(root))

    // Sort nodes
    nodes.sort(options.graph.sortFn)

    // Create descendants and links
    const descendants = nodes.descendants()
    const links = nodes.links()

    // Create links
    svg.append("g")
        .selectAll("path")
        .data(links)
        .join("path")
        .attr("fill", "none")
        .attr("stroke", options.style.link.stroke)
        .attr("stroke-width", options.style.link.strokeWidth)
        .attr("stroke-opacity", options.style.link.strokeOpacity)
        .attr("stroke-linecap", options.style.link.strokeLineCap)
        .attr("stroke-linejoin", options.style.link.strokeLineJoin)
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
        .attr("fill", options.style.node.fill)
        .attr("r", options.style.node.r)

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
        .attr("stroke", options.style.node.textStroke)
        .attr("stroke-width", options.style.node.textStrokeWidth)
        .attr("font-size", options.style.node.textSize)
        .attr('fill', options.style.node.fill)
        .text((d, i) => d.data.name)

    // Return SVG
    return svg.node()
}
