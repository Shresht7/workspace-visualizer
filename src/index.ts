// Library
import { Command } from 'commander';
import { readFileSync, writeFileSync } from 'fs';
import { generateForceDirectedTreeGraph } from './forceDirectedGraph.js';
import { Node } from './node.js';

const program = new Command();

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

program
    .name(pkg.name)
    .description(pkg.description)
    .version(pkg.version, '-v, --version', 'Output the current version');

program
    .command('snapshot')
    .description('Create a snapshot of your workspace')
    .argument('[path]', 'The path to the workspace', process.cwd())
    .argument('[output]', 'The output file path', './tree.json')
    .action((path, output) => {
        // Create root
        const root = Node.fromPath(path);

        // Write to file
        writeFileSync(output, JSON.stringify(root, null, 4));
    });

program
    .command('graph')
    .description('Create a graph of your workspace')
    .argument('[path]', 'The path to the JSON file to graph', './tree.json')
    .argument('[output]', 'The output file path', './graph.html')
    .action((path, output) => {
        // Read file
        const root = JSON.parse(readFileSync(path, 'utf-8'));

        // Generate graph
        generateForceDirectedTreeGraph(root, output);
    });

program.parse()
