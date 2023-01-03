// Library
import { Node } from "../class/Node.js";

// Type Definitions
export interface options {
    path: string,
    ignore: string[],
    include: string[],
    exclude: string[],
}

/** Create a snapshot of your workspace */
export function snapshot({
    path,
    ignore,
    include,
    exclude,
}: options) {
    // Create the root node
    const root = new Node(path);

    // Add the rules of selection
    ignore.forEach((pattern) => root.addIgnoreRule(pattern));
    include.forEach((pattern) => root.addIncludeRule(pattern));
    exclude.forEach((pattern) => root.addExcludeRule(pattern));

    // Build the tree
    root.buildTree();

    // Write the snapshot to the output file
    return root;
}
