// Description: This file is the entry point for all commands. It is used to export all commands to the main file.
import snapshot from './snapshot.js';
import graph from './graph.js';

// Export commands
export const commands: Command<any>[] = [
    snapshot,
    graph
];
