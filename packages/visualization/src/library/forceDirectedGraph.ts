// Library
import * as d3 from 'd3' // Data-Visualization Library

// Type Definitions
import type { Node } from '@workspace-visualizer/fs-tree'

// ----------------
// TYPE DEFINITIONS
// ----------------

/** Options to customize the force-directed-tree-graph SVG */
interface options {

    // SVG Options
    // -----------

    svg: {
        /** Width of the SVG output */
        width: number,
        /** Height of the SVG output */
        height: number,
        /** Margins around the force-directed-tree-graph */
        margin: {
            top: number,
            right: number,
            bottom: number,
            left: number
        },
    }

    // Force Directed Tree Options
    // ---------------------------

    graph: {
        /** X position of the center of the force-directed-tree */
        centerX: number,
        /** Y position of the center of the force-directed-tree */
        centerY: number,
        /** Strength of the links */
        linkStrength: number | ((d: d3.HierarchyPointLink<Node>) => number),
        /** Distance of the links */
        linkDistance: number | ((d: d3.HierarchyPointLink<Node>) => number),
        /** Many body force multiplier. Negative values imply repulsion and positive values imply attraction */
        nodeForce: number | ((d: d3.SimulationNodeDatum) => number),
        /** Callback function to set separation of two adjacent nodes */
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
            /** Stroke color of the nodes */
            stroke: string | ((d: d3.HierarchyPointNode<Node>) => string),
            /** Stroke width of the nodes */
            strokeWidth: number | ((d: d3.HierarchyPointNode<Node>) => number),
            /** Fill color of the nodes */
            fill: string | ((d: d3.HierarchyPointNode<Node>) => string),
            /** Radius of the nodes */
            r: number | ((d: d3.HierarchyPointNode<Node>) => number),
            /** Callback function to set the title of the nodes */
            title: string | ((d: d3.HierarchyPointNode<Node>) => string),
        }
    }

}

// ---------------
// DEFAULT OPTIONS
// ---------------

/** Default options */
const defaultOptions: options = {

    // SVG Options
    svg: {
        width: 400,
        height: 400,
        margin: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
        },
    },

    // Force Directed Tree Options
    graph: {
        centerX: 200, // Half of the width
        centerY: 200, // Half of the height
        linkStrength: 1,
        linkDistance: 30,
        nodeForce: -60,
        sortFn: (a, b) => a.data.name.localeCompare(b.data.name),
    },

    // Styling Options
    style: {
        // Styling Options - Links
        link: {
            stroke: '#333',
            strokeOpacity: 0.6,
            strokeLineCap: 'round',
            strokeLineJoin: 'round',
            strokeWidth: 1.5,
        },
        // Styling Options - Nodes
        node: {
            stroke: '#fff',
            strokeWidth: 1.5,
            fill: '#fff',
            r: 5,
            title: (d) => d.data.name
        }
    },

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
export async function generateForceDirectedTreeGraph(root: Node, opts: Partial<options> = defaultOptions): Promise<SVGElement | null> {

    // Merge options with defaults
    const options = { ...defaultOptions, ...opts } as options

    // Create SVG
    const svg = d3.select(document.body).append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr("viewBox", [
            -options.svg.width - options.svg.margin.left,
            -options.svg.height - options.svg.margin.top,
            2 * options.svg.width + options.svg.margin.right,
            2 * options.svg.height + options.svg.margin.bottom
        ])

    // Create tree
    const tree = d3.tree<Node>()
        .size([options.svg.width, options.svg.height])

    // Create node tree
    const nodes = tree(d3.hierarchy(root))

    // Sort nodes
    nodes.sort(options.graph.sortFn)

    // Create descendants and links
    const descendants = nodes.descendants()
    const links = nodes.links()

    // Create simulation
    const simulation = d3.forceSimulation(descendants)
        .force('center', d3.forceCenter(options.graph.centerX, options.graph.centerY))
        .force('charge', d3.forceManyBody().strength(options.graph.nodeForce))
        .force('x', d3.forceX())
        .force('y', d3.forceY())
        .force('link', d3.forceLink(links)
            .id(d => (d as Node).path)
            .strength(options.graph.linkStrength)
            .distance(options.graph.linkDistance)
        )


    // Create links
    const link = svg.append('g')
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke', options.style.link.stroke)
        .attr('stroke-opacity', options.style.link.strokeOpacity)
        .attr('stroke-linecap', options.style.link.strokeLineCap)
        .attr('stroke-linejoin', options.style.link.strokeLineJoin)
        .attr('stroke-width', options.style.link.strokeWidth)

    // Create nodes
    const node = svg.append('g')
        .selectAll('circle')
        .data(descendants)
        .join('circle')
        .attr('stroke', options.style.node.stroke)
        .attr('stroke-width', options.style.node.strokeWidth)
        .attr('r', options.style.node.r)
        .attr('fill', options.style.node.fill)

    // Add title to the nodes
    node.append('title')
        .text(options.style.node.title)

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
