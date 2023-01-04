import * as d3 from "https://cdn.skypack.dev/d3@7";

const width = 400;
const height = 400;

function showForceDirectedGraph(tree) {
    const root = d3.hierarchy(tree);
    const links = root.links();
    const nodes = root.descendants();

    const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(0).strength(1))
        .force('charge', d3.forceManyBody().strength(-50))
        .force('x', d3.forceX())
        .force('y', d3.forceY());

    const svg = d3.select(document.body).append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-(width / 2), -(height / 2), width, height]);

    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line");

    const node = svg.append("g")
        .attr("fill", "#fff")
        .attr("stroke", "#000")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("fill", d => d.children ? null : "#000")
        .attr("stroke", d => d.children ? null : "#fff")
        .attr("r", 3.5);
    // .call(drag(simulation))

    node.append("title")
        .text(d => d.data.name);

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });
}

window.addEventListener('message', (event) => {
    const message = event.data;     //  The JSON payload
    switch (message.type) {
        case 'force-directed-graph':
            showForceDirectedGraph(message.payload);
            break;
        default:
            break;
    }
});
