// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as commands from './commands';
import { WorkspaceVisualizerPanel } from './views/WorkspaceVisualizerPanel';
import { SideViewProvider } from './views/SidePanel';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-workspace-visualizer" is now active!');

	//	Set Extension Path Uri
	WorkspaceVisualizerPanel.extensionUri = vscode.Uri.file(context.extensionPath);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	//	Register Contributions
	let disposables: vscode.Disposable[] = [];
	disposables.push(
		//	Show Force Directed Graph Command
		vscode.commands.registerCommand('workspace-visualizer.hello-world', commands.showForceDirectedGraph),
		//	Side Panel Webview Provider
		vscode.window.registerWebviewViewProvider(SideViewProvider.viewType, new SideViewProvider(context.extensionUri))
	);
	context.subscriptions.push(...disposables);
}

// This method is called when your extension is deactivated
export function deactivate() { }
