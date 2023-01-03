// Library
import * as d3 from 'd3';
import { JSDOM } from 'jsdom';
import { Node } from '../class/Node.js';

interface options {
    width: number,
    height: number,
}

/**
 * Generate a force directed tree graph
 * @param {Node} root The root node
 * @param {options} options The options
 * @returns {Promise<SVGElement | null>} The SVG element
 * @async Needs to wait for the simulation to end
 * @example
 * const svg = await generateForceDirectedTreeGraph(root, {
 *    width: 400,
 *   height: 400
 * });
 */
export async function generateForceDirectedTreeGraph(root: Node, options: options = {
    width: 400,
    height: 400,
}): Promise<SVGElement | null> {
    // JSDOM
    const dom = new JSDOM();
    const body = dom.window.document.body;

    // Create SVG
    const svg = d3.select(body)
        .append('svg')
        .attr('width', options.width)
        .attr('height', options.height)
    // .attr('viewBox', [-options.width / 2, -options.height / 2, options.width, options.height]);

    // Create tree
    const tree = d3.tree<Node>()
        .size([options.width, options.height]);

    // Create root
    const nodes = tree(d3.hierarchy(root));
    const descendants = nodes.descendants();
    const links = nodes.links();

    // Create simulation
    const simulation = d3.forceSimulation(descendants)
        .force('link', d3.forceLink(links).id(d => (d as Node).path))
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(options.width / 2, options.height / 2))
        .force('x', d3.forceX())
        .force('y', d3.forceY())


    // Create links
    const link = svg.append('g')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .selectAll('line')
        .data(links)
        .join('line');

    // Create nodes
    const node = svg.append('g')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .selectAll('circle')
        .data(descendants)
        .join('circle')
        .attr('r', 4)
        // TODO: color the nodes based on file extension
        .attr('fill', d => d.data.type === 'directory' ? 'red' : 'blue');

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
