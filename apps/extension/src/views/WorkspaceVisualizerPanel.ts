//  Library
import * as vscode from 'vscode';
import { WebviewPanel } from "../class/WebviewPanel";

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
    /** Settings for the webview panel */
    public static readonly webviewOptions: vscode.WebviewOptions = { enableScripts: true };

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
        this.update("");

        //	Update the content based on view changes
        this._panel.onDidChangeViewState(e => {
            if (!this._panel.visible) { return; }
            this.update("");
        }, null, this._disposables);

        //	Listen for when the panel is disposed
        //	This happens when the user closes the panel or when the panel is closed programmatically
        this.onDidDispose(() => WorkspaceVisualizerPanel.currentPanel = undefined);
    }

    /** Update the HTML Content */
    private async update(content: string) {
        this.setHTML(content);

    }

    /** Set the Webview HTML content to show the Force-Directed Graph */
    public async showForceDirectedGraph(tree: Object) {
        const content = this.getForceDirectedGraphHTMLContent(JSON.stringify(tree));
        this.update(content);
    }

    /** Get the HTML content to show the Force-Directed Graph */
    public getForceDirectedGraphHTMLContent(tree: string) {
        return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Document</title>
		</head>
		<style>
			html,body {
				height: 100vh;
				width: 100vw;
			}
		</style>
		<body>		
		</body>
		<script type="module">
			import * as d3 from "https://cdn.skypack.dev/d3@7"
			
			const width = 400
			const height = 400
			const root = d3.hierarchy(${tree})
			const links = root.links()
			const nodes = root.descendants()
			const simulation = d3.forceSimulation(nodes)
				.force('link', d3.forceLink(links).id(d => d.id).distance(0).strength(1))
				.force('charge', d3.forceManyBody().strength(-50))
				.force('x', d3.forceX())
				.force('y', d3.forceY())
			const svg = d3.select(document.body).append("svg")
				.attr("width", width)
				.attr("height", height)
				.attr("viewBox", [-(width/2), -(height/2), width, height])
			const link = svg.append("g")
				.attr("stroke", "#999")
				.attr("stroke-opacity", 0.6)
				.selectAll("line")
				.data(links)
				.join("line")
			const node = svg.append("g")
				.attr("fill", "#fff")
				.attr("stroke", "#000")
				.attr("stroke-width", 1.5)
				.selectAll("circle")
				.data(nodes)
				.join("circle")
				.attr("fill", d => d.children ? null : "#000")
				.attr("stroke", d => d.children ? null : "#fff")
				.attr("r", 3.5)
			// .call(drag(simulation))
			node.append("title")
				.text(d => d.data.name)
			simulation.on("tick", () => {
				link
					.attr("x1", d => d.source.x)
					.attr("y1", d => d.source.y)
					.attr("x2", d => d.target.x)
					.attr("y2", d => d.target.y)
				node
					.attr("cx", d => d.x)
					.attr("cy", d => d.y)
			})
		</script>
		</html>
	`;
    }

}
