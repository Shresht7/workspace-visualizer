// Library
import * as fs from 'node:fs';
import * as path from 'node:path';
import ignore, { Ignore } from 'ignore';

// ---------
// NODE TYPE
// ---------

/** The type of the node. Can be a `file`, `directory` or a `symbolic-link` */
export enum NodeType {
    File = 'file',
    Directory = 'directory',
    SymbolicLink = 'symbolic-link',
}

/**
 * Determine the node type.
 * The node can be a `file`, `directory` or a `symbolic-link`.
 * Returns `undefined` if the node type is unknown.
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

// ----
// NODE
// ----

/**
 * A node in the workspace tree.
 * Contains information about the node and its children.
 * A node can be a `file`, `directory` or a `symbolic-link`.
 * A node can have other nodes as children.
*/
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

    /** Create a new node */
    constructor(p: string) {
        // Resolve the path
        this.path = fs.realpathSync(p)

        // Get file stats
        const stats = fs.statSync(this.path);

        // Set properties
        this.name = path.basename(this.path);
        this.type = determineNodeType(stats) || NodeType.File;
        this.createdAt = stats.birthtimeMs;
        this.accessedAt = stats.atimeMs;
        this.modifiedAt = stats.mtimeMs;
        this.children = [];
    }

    /** The ignore instance. */
    #ignore: Ignore = ignore();

    /**
 * Get the ignore filter. Determines the ignore files and rules.
 * @param {string} entry The entry path
 * @param {string[]} ignoreFiles The ignore files
 * @param {string[]} ignoreRules The ignore rules
 * @returns {Function} The ignore filter
 */
    private _getIgnoreFilter(
        entry: string,
        ignoreFiles: string[] = ['.gitignore', '.ignore'],
        ignoreRules: string[] = ['.git']
    ): (name: string) => boolean {
        this.#ignore.add(ignoreRules);
        for (const ignoreFile of ignoreFiles) {
            const ignorePath = path.join(entry, ignoreFile);
            if (fs.existsSync(ignorePath)) {
                const contents = fs.readFileSync(ignorePath, 'utf-8').replace(/\/$/gm, "");
                this.#ignore.add(contents);
            }
        }
        return this.#ignore.createFilter();
    }

    /** Build the tree */
    buildTree(): void {

        // Get the ignore filter
        const ignoreFilter = this._getIgnoreFilter(this.path);

        // Read the directory
        let entries = fs.readdirSync(this.path)
        entries = entries.filter(ignoreFilter);

        for (const entry of entries) {
            // Create the child node
            const childPath = path.join(this.path, entry);
            const child = new Node(childPath);

            // Build the child tree
            if (child.type === NodeType.Directory) {
                child.buildTree();
            }

            // Add the child to the children
            this.children.push(child);
        }

    }
}
