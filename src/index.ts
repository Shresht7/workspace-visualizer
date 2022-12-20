// Library
import * as fs from 'node:fs';
import { JSDOM } from 'jsdom';
import * as d3 from 'd3';

import { Node, NodeType, determineNodeType } from './fs';

// JSDOM
const dom = new JSDOM();
const body = dom.window.document.body;

// Accept path as an argument or use the current directory
// TODO: Accept multiple arguments and create a tree for each under the root
const path = process.argv[2] || process.cwd();

/** The root node */
const root: Node = {
    name: 'root',
    type: NodeType.Directory,
    path: path,
    children: [],
};

/** Build the tree */
function buildTree(node: Node): void {
    // Read the directory
    let files = fs.readdirSync(node.path, { withFileTypes: true });
    for (const file of files) {

        // Skip hidden files and node_modules
        if (file.name.startsWith('.') || file.name === 'node_modules') {
            continue;
        }

        // Create the child node
        const child: Node = {
            name: file.name,
            type: determineNodeType(file),
            path: `${node.path}/${file.name}`,
            children: [],
        };
        // Add the child to the parent
        node.children.push(child);

        // Recursively build the tree
        if (file.isDirectory()) {
            buildTree(child);
        }
    }
}

// -------------
buildTree(root);
// -------------

// ==
// D3
// ==

// D3
const width = 400;
const height = 400;

// Create SVG
const svg = d3.select(body)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [-800, -800, 1600, 1600]);

// Create tree
const tree = d3.tree<Node>()
    .size([width, height]);

// Create root
const rootD3 = d3.hierarchy(root);
const nodes = tree(rootD3);
const descendants = nodes.descendants();
const links = nodes.links();

// Create simulation
const simulation = d3.forceSimulation(descendants)
    // @ts-ignore
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

simulation.on('end', () => {
    // Write the SVG
    fs.writeFileSync('build/tree.svg', svg.node()?.outerHTML || '');
})

