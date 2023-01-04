// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Node } from './class/Node';
import { WorkspaceVisualizerPanel } from './views/WorkspaceVisualizerPanel';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-workspace-visualizer" is now active!');

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

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vscode-workspace-visualizer.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from vscode-workspace-visualizer!');

		//	Show Force-Directed Graph View
		WorkspaceVisualizerPanel.show();
		WorkspaceVisualizerPanel.currentPanel?.showForceDirectedGraph(node);
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
