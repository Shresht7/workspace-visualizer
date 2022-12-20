// Library
import * as fs from 'node:fs';

// NodeType
export enum NodeType {
    File = 'file',
    Directory = 'directory',
    SymbolicLink = 'symbolic-link',
}

/** Determine the node type */
export function determineNodeType(file: fs.Dirent | fs.Stats): NodeType {
    if (file.isFile()) {
        return NodeType.File;
    } else if (file.isDirectory()) {
        return NodeType.Directory;
    } else {
        return NodeType.SymbolicLink;
    }
}

// Node
export class Node {

    /** The node name */
    name: string;
    /** The node type */
    type: NodeType;
    /** The node path */
    path: string;
    /** The node creation time */
    createdAt: number;
    /** The node access time */
    accessedAt: number;
    /** The node modification time */
    modifiedAt: number;
    /** The node children */
    children: Node[];

    /** Create a new node from a path */
    static fromPath(path: string): Node {
        const node = new Node(path);
        node.buildTree();
        return node;
    }

    /** Create a new node */
    constructor(path: string) {
        // Get file stats
        const stats = fs.statSync(path);

        // Set properties
        this.name = path.split('/').pop() || '';
        this.type = determineNodeType(stats);
        this.path = path;
        this.createdAt = stats.birthtimeMs;
        this.accessedAt = stats.atimeMs;
        this.modifiedAt = stats.mtimeMs;
        this.children = [];
    }

    /** Build the tree */
    buildTree(): void {
        // Read the directory
        let files = fs.readdirSync(this.path);
        for (const file of files) {

            // Skip hidden files and node_modules
            if (this._ignoreEntry(file)) {
                continue;
            }

            // Create the child node
            const child = new Node(`${this.path}/${file}`);

            // Add the child to the parent
            this.children.push(child);

            // Recursively build the tree
            if (child.type === NodeType.Directory) {
                child.buildTree();
            }
        }

    }

    /** Ignore an entry */
    private _ignoreEntry(entry: string): boolean {
        return entry.startsWith('.') || entry === 'node_modules';
    }

}
