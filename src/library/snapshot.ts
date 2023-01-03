// Library
import { Node } from "../class/Node.js";

// Type Definitions
export interface options {
    path: string,
    ignore: string[],
    include: string[],
    exclude: string[],
}

// ========
// SNAPSHOT
// ========

/** Create a snapshot of your workspace */
export function snapshot({
    path,
    ignore,
    include,
    exclude,
}: options) {
    // Create the root node of the tree from the path
    const root = new Node(path);

    // Add the rules of selection.
    // They determine which files and folders are included in and excluded from the snapshot.
    // These rules are applied in the order they are added.
    ignore.forEach((pattern) => root.addIgnoreRule(pattern));
    include.forEach((pattern) => root.addIncludeRule(pattern));
    exclude.forEach((pattern) => root.addExcludeRule(pattern));

    // Build the tree from the root node down
    root.buildTree();

    // Return the tree
    return root;
}
