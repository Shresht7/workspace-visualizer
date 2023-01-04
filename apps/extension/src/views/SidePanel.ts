//  Library
import * as vscode from 'vscode';
import { Node } from '../class/Node';

//  Helpers
import { getNonce } from '../helpers';

// ==================
// SIDE VIEW PROVIDER
// ==================

/** Side View Panel */
export class SideViewProvider implements vscode.WebviewViewProvider {

    /** Identifies the type of the webview panel */
    public static readonly viewType = "workspace-visualizer.workspace-side-view";

    /** Webview */
    private _view?: vscode.Webview;

    /** Instantiate the Side View Panel */
    constructor(private readonly _extensionUri: vscode.Uri) { }

    /** Resolves the webview view */
    public async resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext<unknown>, token: vscode.CancellationToken) {
        //  Get Webview
        this._view = webviewView.webview;

        //  Set Webview Options
        this._view.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        //  Set Webview Content
        this._view.html = this._getHTML();

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

        //	Build tree from the workspace file structure
        this._view?.postMessage({ type: "force-directed-graph", payload: node });
    }

    /** Get Side View HTML Content */
    private _getHTML() {
        if (!this._view) { return ""; };

        const nonce = getNonce();

        const styleUri = this._view.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "src", "views", "style.css")
        );

        const scriptUri = this._view.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "src", "views", "script.js")
        );

        const content = `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none';style-src ${this._view.cspSource}; img-src ${this._view.cspSource} https:; script-src 'nonce-${nonce}';" />
				<link rel="stylesheet" href="${styleUri}" />
				<script type="module" src="${scriptUri}" nonce="${nonce}"></script>
				<title>Document</title>
			</head>
			<body>
			</body>
			</html>
		`;
        return content;
    }
}
