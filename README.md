# Workspace Visualizer

Visualize your project's file structure.

>[!CAUTION]
>
>This project has been archived as it never came to fruition and will be superseded by [Shresht7/chronicle](https://github.com/Shresht7/chronicle). 

- [CLI][CLI] - Workspace Visualizer Command-Line Interface
- [VS Code Extension][VS Code Extension] - Workspace Visualizer VS Code Extension

---

## 🪟 Applications

### 🌟 [`CLI`][CLI]

The CLI allows you to create visualizations of your workspace from the command line.

**Commands**

- `snapshot`: Take a snapshot of the current workspace and save it as a `workspace.json` file.
- `graph`: Visualize the workspace as a force-directed graph.
- `radial`: Visualize the workspace as a radial tree.

### 🌟 [`VS Code Extension`][VS Code Extension]

The VS Code extension provides a visual representation of your workspace in the editor.

**Features**

- **Force-Directed Graph**: Visualize your workspace as a force-directed graph.
- **Radial Tree**: Visualize your workspace as a radial tree.

## 📦 Packages

- [`@workspace-visualizer/file-color-associations`][file-color-associations]: A package to associate file extensions with colors.
- [`@workspace-visualizer/fs-tree`][fs-tree]: A package to generate a tree structure from a workspace.
- [`@workspace-visualizer/visualization`][visualization]: A package to create d3 visualizations of the workspace tree structure.

---

## 📃 License

[MIT License](./LICENSE)

<!-- ===== -->
<!-- LINKS -->
<!-- ===== -->

[CLI]: ./apps/cli/
[VS Code Extension]: ./apps/extension/

[file-color-associations]: ./packages/file-color-associations/
[fs-tree]: ./packages/fs-tree/
[visualization]: ./packages/visualization/
