// Library
import * as vscode from 'vscode'; // VS Code API
import * as path from 'node:path'; // Node.js path module
import ignore from 'ignore'; // Ignore manager for files and directories

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
    name: string = '';
    /** The node type */
    type: vscode.FileType = vscode.FileType.Unknown;
    /** The node path */
    path: string;
    /** The node uri */
    uri: vscode.Uri;
    /** The node size */
    size: number = 0;
    /** The node creation time */
    createdAt: number = 0;
    /** The node modification time */
    modifiedAt: number = 0;
    /** The node children */
    children: Node[] = [];

    /** Ignore rules */
    #ignoreRules: string[] = ['.git'];
    /** Ignore files */
    #ignoreFiles: string[] = ['.gitignore', '.ignore'];

    /** Include rules */
    #include: string[] = [];
    /** Exclude rules */
    #exclude: string[] = [];

    /** Create a new Node */
    constructor(p: vscode.Uri) {
        this.uri = p;
        this.path = p.path;
    }

    /** Update the node stats */
    async updateStats() {
        // Get the entry stats
        vscode.workspace.fs.stat(this.uri).then((stat) => {
            // Set properties
            this.name = path.basename(this.path);
            this.type = stat.type;
            this.size = stat.size;
            this.createdAt = stat.ctime;
            this.modifiedAt = stat.mtime;
        });
    }

    /** Build the node tree */
    async buildTree() {
        // Update stats
        await this.updateStats();

        // Get the ignore filter
        const ignoreFilter = await this._getIgnoreFilter(this.path);

        // Get the directory entries
        const _entries = await vscode.workspace.fs.readDirectory(this.uri);
        const entries = _entries.map(([name, _]) => name).filter(ignoreFilter);

        // For each entry
        for (const entry of entries) {
            // Create a new node
            const node = new Node(
                vscode.Uri.file(
                    path.join(this.path, entry)
                )
            );

            // If the node is a directory
            if (node.type === vscode.FileType.Directory) {
                // Build the tree (stats update is done automatically in the buildTree method)
                await node.buildTree();
            } else {
                // Update stats and continue
                await node.updateStats();
            }

            // Add the node to the children
            this.children.push(node);
        };
    }

    /**
     * Add an ignore rule.
     * @param rule The ignore rule
     * @example
     * node.addIgnoreRule('node_modules');
     * @example
     * node.addIgnoreRule('*.log');
     */
    addIgnoreRule(rule: string) {
        this.#ignoreRules.push(rule);
    }

    /**
     * Add an include rule.
     * @param rule The include rule
     * @example
     * node.addIncludeRule('*.js');
     * @example
     * node.addIncludeRule('*.ts');
     */
    addIncludeRule(rule: string) {
        this.#include.push(rule);
    }

    /**
     * Add an exclude rule.
     * @param rule The exclude rule
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
     * @param entry The entry path
     * @returns The ignore filter function
     */
    private async _getIgnoreFilter(entry: string): Promise<((name: string) => boolean)> {

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

            // Check if the ignore file exists
            const ignoreFilePath = path.join(entry, ignoreFile);
            try {
                const stats = await vscode.workspace.fs.stat(vscode.Uri.file(ignoreFilePath));
                if (stats.type === vscode.FileType.File) {

                    // If the ignore file exists add contents to ignore manager
                    const byteContents = await vscode.workspace.fs.readFile(vscode.Uri.file(ignoreFilePath));
                    _ignore.add(byteContents.toString());

                }
            } catch (error) {
                // Ignore file does not exist
            }

        }

        // Return the ignore filter
        return _ignore.createFilter();
    }
}
