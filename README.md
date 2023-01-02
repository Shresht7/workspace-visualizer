# Workspace Visualizer

This is a simple tool to record and visualize a workspace on the file-system.

<!-- TODO: Add a screenshot of the visualization -->

<!-- ! Not yet published on npm ! -->
<!--
## Installation

Install the package globally:

```sh
npm install -g workspace-visualizer
```
-->

## Usage

### Snapshot

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
| `--path`         | Path to the workspace   | `process.cwd()`    |
| `--output`       | Path to the output file | `./workspace.json` |
| `--pretty-print` | Pretty print the output | `false`            |

### Visualize

Use a snapshot to visualize the workspace:

```sh
workspace-visualizer graph --path <path-to-snapshot>
```

#### Options

| Option     | Description             | Default            |
| ---------- | ----------------------- | ------------------ |
| `--path`   | Path to the snapshot    | `./workspace.json` |
| `--output` | Path to the output file | `./workspace.svg`  |

---

## License

