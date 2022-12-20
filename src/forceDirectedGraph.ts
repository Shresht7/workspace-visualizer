// Library
import * as d3 from 'd3';
import { JSDOM } from 'jsdom';
import * as fs from 'node:fs';
import { Node } from './node.js';

// Constants
const width = 400;
const height = 400;

// JSDOM
const dom = new JSDOM();

/**
 * Generate a force directed tree graph
 * @param root The root node
 * @param output The output file path
 * @param body The body element
 */
export function generateForceDirectedTreeGraph(root: Node, output: string, body: HTMLElement = dom.window.document.body) {
    // Create SVG
    const svg = d3.select(body)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [-width / 2, -height / 2, width, height]);

    // Create tree
    const tree = d3.tree<Node>()
        .size([width, height]);

    // Create root
    const nodes = tree(d3.hierarchy(root));
    const descendants = nodes.descendants();
    const links = nodes.links();

    // Create simulation
    const simulation = d3.forceSimulation(descendants)
        .force('link', d3.forceLink(links).id(d => (d as Node).path))
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(width / 2, height / 2))
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

    // Write the SVG when the simulation ends
    simulation.on('end', () => {
        const element = svg.node();
        if (!element) { return; }
        // Write the SVG
        fs.writeFileSync(output, element.outerHTML);
    })
}
