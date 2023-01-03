// Library
import * as fs from 'node:fs';
import * as path from 'node:path';
import ignore from 'ignore';

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

    /** Ignore rules */
    #ignoreRules: string[] = ['.git'];
    /** Ignore files */
    #ignoreFiles: string[] = ['.gitignore', '.ignore'];

    /** Include rules */
    #include: string[] = [];
    /** Exclude rules */
    #exclude: string[] = [];

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

    /**
     * Add an ignore rule.
     * @param {string} rule The ignore rule
     * @returns {void}
     * @example
     * node.addIgnoreRule('node_modules');
     * @example
     * node.addIgnoreRule('*.log');
     */
    addIgnoreRule(rule: string): void {
        this.#ignoreRules.push(rule);
    }

    /**
     * Add an include rule.
     * @param {string} rule The include rule
     * @returns {void}
     * @example
     * node.addIncludeRule('*.js');
     * @example
     * node.addIncludeRule('*.ts');
     */
    addIncludeRule(rule: string): void {
        // The ! is required to negate the rule
        this.#include.push(`!${rule}`);
    }

    /**
     * Add an exclude rule.
     * @param {string} rule The exclude rule
     * @returns {void}
     * @example
     * node.addExcludeRule('*.js');
     * @example
     * node.addExcludeRule('*.ts');
     */
    addExcludeRule(rule: string): void {
        this.#exclude.push(rule);
    }

    /**
     * Get the ignore filter. Determines which files and directories should be ignored.
     * @param {string} entry The entry path
     * @returns {Function} The ignore filter
     */
    private _getIgnoreFilter(entry: string): ((name: string) => boolean) {

        // Instantiate the ignore manager
        const _ignore = ignore();

        // Add the ignore rules
        _ignore.add(this.#ignoreRules);

        // Add the exclude rules
        _ignore.add(this.#exclude);

        // Add the include rules
        _ignore.add(this.#include);

        // Add the ignore rules from the ignore files
        for (const ignoreFile of this.#ignoreFiles) {
            const ignoreFilePath = path.join(entry, ignoreFile);
            if (fs.existsSync(ignoreFilePath)) {
                // Read the ignore file (and remove the trailing slash as they were causing issues)
                const contents = fs.readFileSync(ignoreFilePath, 'utf-8').replace(/\/$/gm, "");
                _ignore.add(contents);
            }
        }

        // Return the ignore filter
        return _ignore.createFilter();
    }

}
