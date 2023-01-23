
//  Library
import * as vscode from 'vscode';
import { Node } from '../class/Node';

//  Webview
import { WorkspaceVisualizerPanel } from '../views/WorkspaceVisualizerPanel';


// -------------------------
// SHOW FORCE DIRECTED GRAPH
// -------------------------

/** Show workspace visualization (force-directed graph) in the webview */
export async function showForceDirectedGraph() {

    // Get the current workspace
    const workspaceUri = vscode.workspace.workspaceFolders?.[0].uri;

    // Check if the workspace is defined
    if (!workspaceUri) {
        // Show an error message
        vscode.window.showErrorMessage('No workspace is opened');
        // Return
        return;
    }

    // Create a new node
    const node = new Node(workspaceUri);

    // Build the tree
    await node.buildTree();

    //	Show Force-Directed Graph View
    WorkspaceVisualizerPanel.show();
    WorkspaceVisualizerPanel.currentPanel?.showForceDirectedGraph(node);
};
