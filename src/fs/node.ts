// Library
import * as fs from 'node:fs';

// Node
export interface Node {
    name: string;
    type: NodeType;
    path: string;
    children: Node[];
}

// NodeType
export const enum NodeType {
    File = 'file',
    Directory = 'directory',
    SymbolicLink = 'symbolic-link',
}

/** Determine the node type */
export function determineNodeType(file: fs.Dirent): NodeType {
    if (file.isFile()) {
        return NodeType.File;
    } else if (file.isDirectory()) {
        return NodeType.Directory;
    } else {
        return NodeType.SymbolicLink;
    }
}
