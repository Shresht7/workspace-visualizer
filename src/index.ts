// Library
import { Node } from './node.js';
import { generateForceDirectedTreeGraph } from './forceDirectedGraph.js';
import { writeFileSync } from 'fs';

// Accept path as an argument or use the current directory
// TODO: Accept multiple arguments and create a tree for each under the root
const path = process.argv[2] || process.cwd();

// Create root
const root = Node.fromPath(path);

// Write to JSON file
writeFileSync('./build/tree.json', JSON.stringify(root, null, 2));

// ==
// D3
// ==

// generateForceDirectedTreeGraph(root, './build/tree.svg');
