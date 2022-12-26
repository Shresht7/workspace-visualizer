// Library
import * as fs from 'node:fs';
import ignore from 'ignore';

// NodeType
export enum NodeType {
    File = 'file',
    Directory = 'directory',
    SymbolicLink = 'symbolic-link',
}

/**
 * Determine the node type. Returns undefined if the node type is unknown.
 * @param {fs.Dirent | fs.Stats} file The file
 * @returns {NodeType | undefined} The node type
 */
export function determineNodeType(file: fs.Dirent | fs.Stats): NodeType | undefined {
    if (file.isFile()) {
        return NodeType.File;
    } else if (file.isDirectory()) {
        return NodeType.Directory;
    } else if (file.isSymbolicLink()) {
        return NodeType.SymbolicLink;
    } else {
        return undefined;
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
        this.type = determineNodeType(stats) || NodeType.File;
        this.path = path;
        this.createdAt = stats.birthtimeMs;
        this.accessedAt = stats.atimeMs;
        this.modifiedAt = stats.mtimeMs;
        this.children = [];
    }

    /** Build the tree */
    buildTree(): void {

        const ignoreFilter = this.getIgnoreFilter(this.path);

        // Read the directory
        let files = fs.readdirSync(this.path).filter(ignoreFilter);
        for (const file of files) {
            console.log(file)

            // Create the child node
            const child = new Node(`${this.path}/${file}`);

            // Recursively build the tree
            if (child.type === NodeType.Directory) {
                child.buildTree();
            }

            // Add the child to the parent
            this.children.push(child);
        }

    }

    /**
     * Get the ignore filter
     * @param {string} entry The entry path
     * @param {string[]} ignoreFiles The ignore files
     * @param {string[]} ignoreRules The ignore rules
     * @returns {Function} The ignore filter
     */
    private getIgnoreFilter(
        entry: string,
        ignoreFiles: string[] = ['.gitignore', '.ignore'],
        ignoreRules: string[] = ['.git']
    ): (name: string) => boolean {
        const IGNORE = ignore().add(ignoreRules);
        for (const ignoreFile of ignoreFiles) {
            const ignorePath = `${entry}/${ignoreFile}`;
            if (fs.existsSync(ignorePath)) {
                const contents = fs.readFileSync(ignorePath, 'utf-8')
                IGNORE.add(contents);
            }
        }
        return IGNORE.createFilter();
    }
}
