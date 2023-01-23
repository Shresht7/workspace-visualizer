// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// Commands
import * as commands from './commands';

// WebViews
import { WorkspaceVisualizerPanel } from './views/WorkspaceVisualizerPanel';
import { SideViewProvider } from './views/SidePanel';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	//	Set Extension Path Uri to load resources
	WorkspaceVisualizerPanel.extensionUri = vscode.Uri.file(context.extensionPath);

	//	Register Contributions
	let disposables: vscode.Disposable[] = [

		//	Command: Show Force-Directed Graph
		vscode.commands.registerCommand('workspace-visualizer.show-force-directed-graph', commands.showForceDirectedGraph),

		//	Command: Show Radial Tree
		vscode.commands.registerCommand('workspace-visualizer.show-radial-tree', commands.showRadialTree),

		//	Webview: Side-Panel Webview Provider
		vscode.window.registerWebviewViewProvider(SideViewProvider.viewType, new SideViewProvider(context.extensionUri))

	];
	context.subscriptions.push(...disposables);
}

// This method is called when your extension is deactivated
export function deactivate() { }
