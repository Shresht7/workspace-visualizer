// Library
import * as vscode from 'vscode'; // VS Code API
import * as path from 'node:path'; // Node.js path module

// ----
// NODE
// ----

export class Node {

    /** The node name */
    name: string = '';
    /** The node type */
    type: vscode.FileType = vscode.FileType.Unknown;
    /** The node path */
    path: string;
    /** The node size */
    size: number = 0;
    /** The node creation time */
    createdAt: number = 0;
    /** The node modification time */
    modifiedAt: number = 0;
    /** The node children */
    children: Node[] = [];

    constructor(p: vscode.Uri) {
        // Resolve the path
        this.path = p.path;
    }

    updateStats() {
        // Get the entry stats
        vscode.workspace.fs.stat(vscode.Uri.file(this.path)).then((stat) => {
            // Set properties
            this.name = path.basename(this.path);
            this.type = stat.type;
            this.size = stat.size;
            this.createdAt = stat.ctime;
            this.modifiedAt = stat.mtime;
        });
    }

    buildTree() {
        // Update stats
        this.updateStats();

        // Get the directory entries
        vscode.workspace.fs.readDirectory(vscode.Uri.file(this.path)).then((entries) => {
            // For each entry
            entries.forEach(([name, type]) => {
                // Create a new node
                const node = new Node(vscode.Uri.file(path.join(this.path, name)));

                // If the node is a directory
                if (node.type === vscode.FileType.Directory) {
                    // Build the tree
                    node.buildTree();
                } else {
                    // Update stats and continue
                    node.updateStats();
                }

                // Add the node to the children
                this.children.push(node);
            });
        });
    }

}
