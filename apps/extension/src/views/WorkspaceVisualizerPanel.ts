//  Library
import * as vscode from 'vscode';
import { WebviewPanel } from "../class/WebviewPanel";

//  Helpers
import { getNonce } from '../helpers';

// ==========================
// WORKSPACE VISUALIZER PANEL
// ==========================

/** The Singleton class to represent the Workspace-Visualizer Webview Panel */
export class WorkspaceVisualizerPanel extends WebviewPanel {

    /** Track the current panel. Only allow a single panel to exist at a time */
    public static currentPanel: WorkspaceVisualizerPanel | undefined;

    /** Default title of the webview panel */
    public static title = "Workspace Visualizer";
    /** Identifies the type of the webview panel */
    public static readonly viewType = "workspace-visualizer";
    /** Extension path */
    public static extensionUri: vscode.Uri;
    /** Settings for the webview panel */
    public static get webviewOptions(): vscode.WebviewOptions {
        return {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(WorkspaceVisualizerPanel.extensionUri, "media")]
        };
    };

    /** Show the webview panel */
    public static show(
        viewColumn?: vscode.ViewColumn
    ) {
        //  Determine the column to show the webview in
        const columnToShowIn = viewColumn || vscode.window.activeTextEditor?.viewColumn || vscode.ViewColumn.One;

        //	If we already have a panel, show it.
        if (WorkspaceVisualizerPanel.currentPanel) {
            WorkspaceVisualizerPanel.currentPanel._panel.reveal(columnToShowIn);
            return;
        }

        //	...Otherwise, create a new panel
        WorkspaceVisualizerPanel.currentPanel = new WorkspaceVisualizerPanel(columnToShowIn);
    }

    // public static revive(panel: vscode.WebviewPanel) {
    //     WorkspaceVisualizerPanel.currentPanel = new WorkspaceVisualizerPanel();
    // }

    constructor(viewColumn: vscode.ViewColumn) {
        //  Instantiate the webview class
        super(
            WorkspaceVisualizerPanel.viewType,
            WorkspaceVisualizerPanel.title,
            viewColumn,
            WorkspaceVisualizerPanel.webviewOptions
        );

        //	Set the webview's initial html content
        this.update();

        //	Update the content based on view changes
        this._panel.onDidChangeViewState(e => {
            if (!this._panel.visible) { return; }
            this.update();
        }, null, this._disposables);

        //	Listen for when the panel is disposed
        //	This happens when the user closes the panel or when the panel is closed programmatically
        this.onDidDispose(() => WorkspaceVisualizerPanel.currentPanel = undefined);
    }

    /** Update the HTML Content */
    private async update() {

        const styleUri = this._panel.webview.asWebviewUri(
            vscode.Uri.joinPath(WorkspaceVisualizerPanel.extensionUri, "media", "style.css")
        );

        const scriptUri = this._panel.webview.asWebviewUri(
            vscode.Uri.joinPath(WorkspaceVisualizerPanel.extensionUri, "media", "script.js")
        );
        const nonce = getNonce(); //  Generate a nonce to whitelist which scripts can be run

        const content = `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none';style-src ${this._panel.webview.cspSource}; img-src ${this._panel.webview.cspSource} https:; script-src 'nonce-${nonce}';" />
				<link rel="stylesheet" href="${styleUri}" />
				<script type="module" src="${scriptUri}" nonce="${nonce}"></script>
				<title>Document</title>
			</head>
			<body>
			</body>
			</html>
		`;
        this.setHTML(content);
    }

    /** Show the Force-Directed Graph */
    public async showForceDirectedGraph(tree: Object) {
        this.update();
        this._panel.webview.postMessage({ type: "force-directed-graph", payload: tree });
    }

    /** Show the Radial Tree */
    public async showRadialTree(tree: Object) {
        this.update();
        this._panel.webview.postMessage({ type: "radial-tree", payload: tree });
    }

}
