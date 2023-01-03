// Library
import * as d3 from 'd3';
import { JSDOM } from 'jsdom';
import { Node } from '../class/Node.js';

interface options {
    radius: number,
    width: number,
    height: number,
    marginLeft: number,
    marginTop: number,
    separator: (a: d3.HierarchyPointNode<Node>, b: d3.HierarchyPointNode<Node>) => number,
    sortFn: (a: d3.HierarchyPointNode<Node>, b: d3.HierarchyNode<Node>) => number,
    stroke: string,
    strokeOpacity: number,
    strokeLinecap: 'butt' | 'round' | 'square' | 'inherit',
    strokeLinejoin: 'miter' | 'round' | 'bevel' | 'inherit',
    strokeWidth: number,
    fill: string,
    r: number,
    halo: string,
    haloColor: string,
    haloWidth: number,
}

export async function generateRadialTree(root: Node, options: options = {
    radius: 1600,
    width: 2400,
    height: 2400,
    marginLeft: 0,
    marginTop: 0,
    separator: (a, b) => a.parent === b.parent ? 1 : 2,
    sortFn: (a, b) => d3.ascending(a.data.name, b.data.name),
    stroke: '#ccc',
    strokeOpacity: 0.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 1.5,
    fill: '#fff',
    r: 2.5,
    halo: "#eee",
    haloColor: '#eee',
    haloWidth: 1,
}): Promise<SVGElement | null> {
    // JSDOM
    const dom = new JSDOM();
    const body = dom.window.document.body;

    // Create tree
    const tree = d3.tree<Node>()
        .size([2 * Math.PI, options.radius])
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

    // Create SVG
    const svg = d3.select(body).append("svg")
        // .attr("width", options.width)
        // .attr("height", options.height)
        .attr("viewBox", [-options.marginLeft - options.radius, -options.marginTop - options.radius, options.width, options.height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10);

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

    const L = descendants.map(d => d.data?.name || '');

    if (L) node.append("text")
        .attr("transform", d => `rotate(${d.x >= Math.PI ? 180 : 0})`)
        .attr("dy", "0.32em")
        .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
        .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
        .attr("paint-order", "stroke")
        .attr("stroke", options.halo)
        .attr("stroke-width", options.haloWidth)
        .text((d, i) => L[i]);

    return svg.node();
}
