// Library
import * as fs from 'node:fs';

// Node
interface Node {
    name: string;
    type: 'file' | 'directory' | 'symbolic-link';
    path: string;
    children: Node[];
}

const root: Node = {
    name: 'root',
    type: 'directory',
    path: 'C:/Users/shres/Projects/vscode-workspace-visualizer',
    children: [],
};

function buildTree(node: Node): void {
    const files = fs.readdirSync(node.path, { withFileTypes: true });
    for (const file of files) {
        const child: Node = {
            name: file.name,
            type: file.isFile() ? 'file' : file.isDirectory() ? 'directory' : 'symbolic-link',
            path: `${node.path}/${file.name}`,
            children: [],
        };
        node.children.push(child);
        if (file.isDirectory()) {
            buildTree(child);
        }
    }
}

buildTree(root);

console.log(JSON.stringify(root, null, 2));
