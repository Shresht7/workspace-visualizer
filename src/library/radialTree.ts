// Library
import * as d3 from 'd3';
import { JSDOM } from 'jsdom';
import { Node } from '../class/Node.js';

interface options {
    /** Width of the SVG */
    width: number,
    /** Height of the SVG */
    height: number,
    /** Margin to leave on the left of the SVG */
    marginLeft: number,
    /** Margin to leave on the top of the SVG */
    marginTop: number,

    /** Radial sweep angle of the tree */
    angle: number,
    /** Radius of the radial tree */
    radius: number,
    /** Set the separation accessor for adjacent nodes */
    separator: (a: d3.HierarchyPointNode<Node>, b: d3.HierarchyPointNode<Node>) => number,
    /** Sorter function */
    sortFn: (a: d3.HierarchyPointNode<Node>, b: d3.HierarchyNode<Node>) => number,

    /** Stroke color of the links */
    stroke: string,
    /** Stroke opacity of the links */
    strokeOpacity: number,
    /** Stroke linecap of the links */
    strokeLinecap: 'butt' | 'round' | 'square' | 'inherit',
    /** Stroke linejoin of the links */
    strokeLinejoin: 'miter' | 'round' | 'bevel' | 'inherit',
    /** Stroke width of the links */
    strokeWidth: number,

    /** Fill color of the nodes */
    fill: string,
    /** Radius of the nodes */
    r: number,

    /** Stroke color of the text */
    textStroke: string,
    /** Stroke width of the text */
    textStrokeWidth: number,
}

const defaultOptions: options = {
    angle: 2 * Math.PI,
    radius: 1600,
    separator: (a, b) => a.parent === b.parent ? 1 : 2,
    width: 2400,
    height: 2400,
    marginLeft: 0,
    marginTop: 0,
    sortFn: (a, b) => d3.ascending(a.data.name, b.data.name),
    stroke: '#ccc',
    strokeOpacity: 0.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 1.5,
    fill: '#fff',
    r: 2.5,
    textStroke: "#eee",
    textStrokeWidth: 1,
}

/** Generate a radial tree graph */
export async function generateRadialTree(root: Node, options: options = defaultOptions): Promise<SVGElement | null> {

    // JSDOM
    const dom = new JSDOM();
    const body = dom.window.document.body;

    // Create SVG
    const svg = d3.select(body).append("svg")
        .attr("width", options.width)
        .attr("height", options.height)
        .attr("viewBox", [-options.marginLeft - options.radius, -options.marginTop - options.radius, options.width, options.height]);

    // Create tree
    const tree = d3.tree<Node>()
        .size([options.angle, options.radius])
        .separation(options.separator);

    // Create root
    const nodes = tree(d3.hierarchy(root));

    // Sort nodes
    if (options.sortFn) {
        nodes.sort(options.sortFn);
    }

    // Create descendants and links
    const descendants = nodes.descendants();
    const links = nodes.links();

    svg.append("g")
        .attr("fill", "none")
        .attr("stroke", options.stroke)
        .attr("stroke-opacity", options.strokeOpacity)
        .attr("stroke-linecap", options.strokeLinecap)
        .attr("stroke-linejoin", options.strokeLinejoin)
        .attr("stroke-width", options.strokeWidth)
        .selectAll("path")
        .data(links)
        .join("path")
        // @ts-ignore - types don't seem to match up here
        .attr("d", d3.linkRadial().angle(d => d.x).radius(d => d.y));

    const node = svg.append("g")
        .selectAll("a")
        .data(descendants)
        .join("a")
        .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`);

    node.append("circle")
        .attr("fill", d => d.children ? options.stroke : options.fill)
        .attr("r", options.r);

    node.append("text")
        .attr("transform", d => `rotate(${d.x >= Math.PI ? 180 : 0})`)
        .attr("dy", "0.32em")
        .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
        .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
        .attr("paint-order", "stroke")
        .attr("stroke", options.textStroke)
        .attr("stroke-width", options.textStrokeWidth)
        .text((d, i) => d.data.name);

    return svg.node();
}
