# Workspace Visualizer

This is a simple tool to record and visualize a workspace on the file-system.

<!-- TODO: Add a screenshot of the visualization -->

---

<!-- ! Not yet published on npm ! -->
<!--
## Installation

Install the package globally:

```sh
npm install -g workspace-visualizer
```
-->

## 📘 Usage

### `snapshot`

Take a snapshot of the current workspace:

```sh
workspace-visualizer snapshot
```

This will create a file called `workspace.json` in the current directory.

You can also specify a path to the workspace and the desired output file:

```sh
workspace-visualizer snapshot --path <path-to-workspace> --output <path-to-output>
```

#### Options

| Option           | Description             | Default            |
| ---------------- | ----------------------- | ------------------ |
| `-p, --path`     | Path to the workspace   | `process.cwd()`    |
| `-o, -output`    | Path to the output file | `./workspace.json` |
| `-i, --ignore`   | Ignore patterns         | `['.git']`         |
| `-n, --include`  | Include patterns        | `[]`               |
| `-e, --exclude`  | Exclude patterns        | `[]`               |
| `-j --json`      | Output as JSON          | `false`            |
| `--pretty-print` | Pretty print JSON       | `false`            |

### `graph`

Visualize the workspace as a force-directed graph:

```sh
workspace-visualizer graph
```

#### Options

| Option                  | Description                             | Default            |
| ----------------------- | --------------------------------------- | ------------------ |
| `-p, --path`            | Path to the workspace                   | `process.cwd()`    |
| `-o, -output`           | Path to the output file                 | `./workspace.json` |
| `-w, --width`           | Width of the SVG                        | `400`              |
| `-h, --height`          | Height of the SVG                       | `400`              |
| `--margin-top`          | Top margin of the SVG                   | `10`               |
| `--margin-right`        | Right margin of the SVG                 | `10`               |
| `--margin-bottom`       | Bottom margin of the SVG                | `10`               |
| `--margin-left`         | Left margin of the SVG                  | `10`               |
| `--center-x`            | X coordinate of the center of the graph | `0`                |
| `--center-y`            | Y coordinate of the center of the graph | `0`                |
| `--link-strength`       | Strength of the links between nodes     | `1`                |
| `--link-distance`       | Distance of the links between nodes     | `30`               |
| `--node-force`          | Force of the nodes                      | `-50`              |
| `--link-stroke`         | Stroke color of the links               | `#333`             |
| `--link-stroke-width`   | Stroke width of the links               | `1px`              |
| `--link-stroke-opacity` | Stroke opacity of the links             | `0.6`              |
| `--link-stroke-linecap` | Stroke linecap of the links             | `round`            |
| `--node-stroke`         | Stroke color of the nodes               | `#fff`             |
| `--node-stroke-width`   | Stroke width of the nodes               | `1px`              |
| `--node-radius`         | Radius of the nodes                     | `5`                |
| `--node-fill`           | Fill color of the nodes                 | `#999`             |

### `radial`

Visualize the workspace as a radial graph:

```sh
workspace-visualizer radial
```

#### Options

| Option                     | Description                   | Default            |
| -------------------------- | ----------------------------- | ------------------ |
| `-p, --path`               | Path to the workspace         | `process.cwd()`    |
| `-o, -output`              | Path to the output file       | `./workspace.json` |
| `--margin-top`             | Top margin of the SVG         | `10`               |
| `--margin-right`           | Right margin of the SVG       | `10`               |
| `--margin-bottom`          | Bottom margin of the SVG      | `10`               |
| `--margin-left`            | Left margin of the SVG        | `10`               |
| `--angle`                  | Angle of the radial tree      | `2 * Math.PI`      |
| `--radius`                 | Radius of the radial tree     | `1600`             |
| `--link-stroke`            | Stroke color of the links     | `#333`             |
| `--link-stroke-opacity`    | Stroke opacity of the links   | `0.6`              |
| `--link-stroke-linecap`    | Stroke linecap of the links   | `round`            |
| `--node-fill`              | Fill color of the nodes       | `#fff`             |
| `--node-radius`            | Radius of the nodes           | `2.5`              |
| `--node-text-stroke`       | Stroke color of the node text | `#fff`             |
| `--node-text-stroke-width` | Stroke width of the node text | `2px`              |
| `--node-text-size`         | Font size of the node text    | `10px`             |

---

## 📄 License

[MIT License](./LICENSE)
