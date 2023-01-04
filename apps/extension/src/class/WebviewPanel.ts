//  Library
import * as vscode from 'vscode';

// =============
// WEBVIEW PANEL
// =============

/** VSCode Webview Panel */
export class WebviewPanel {

    /** The webview panel */
    protected readonly _panel: vscode.WebviewPanel;
    /** A collection of disposable elements */
    protected readonly _disposables: vscode.Disposable[] = [];

    /**
     * Instantiate a new webview panel
     * @param viewType Identifies the type of the webview panel
     * @param title Title of the panel
     * @param showOptions Where to show the webview in the editor. If `preserveFocus` is set, the new webview will not take focus
     * @param options Settings for the webview panel
     * @see {@link vscode.window.createWebviewPanel}
     */
    constructor(
        viewType: string,
        title: string,
        showOptions: vscode.ViewColumn | { readonly viewColumn: vscode.ViewColumn, readonly preserveFocus?: boolean },
        options?: vscode.WebviewOptions & vscode.WebviewPanelOptions
    ) {
        //  Create the webview panel
        this._panel = vscode.window.createWebviewPanel(
            viewType,
            title,
            showOptions,
            options
        );

        //	Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(this._handleMessage, null, this._disposables);

        //	Listen for when the panel is disposed
        //	This happens when the user closes the panel or when the panel is closed programmatically
        this._panel.onDidDispose(() => this._dispose(), null, this._disposables);
    }

    /** Set webview panel's title */
    protected setTitle(title: string) {
        this._panel.title = title;
    }

    /** Set webview panel's html content */
    protected setHTML(content: string) {
        this._panel.webview.html = content;
    }

    // TODO: Add support for message handlers
    /** Webview message handler */
    private _handleMessage(message: any) {
        console.warn("TODO: handle message", message);
    }

    /** Add a message event handler */
    protected addMessageHandler(message: string, handler: () => void) {

    }

    /** Dispose off the webview panel */
    protected _dispose() {
        //	Clean up our resources
        this._panel.dispose();

        //	Dispose all disposables
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            disposable?.dispose();
        }
    }
}
