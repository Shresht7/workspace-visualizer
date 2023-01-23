<!-- ======= -->
<!-- FS TREE -->
<!-- ======= -->

# `workspace-visualizer/fs-tree`

This package contains the helper functions to generate a tree structure from a workspace.

---

## 📘 Usage
<!-- ====== -->

```js
import { snapshot } from "@workspace-visualizer/fs-tree";

const tree = await snapshot({
    root: "/path/to/workspace",
    ignore: ["node_modules", "dist"],
    // ... other options
});
```

## 📕 API Reference
<!-- ============== -->

### `snapshot`
<!-- -------- -->

This function generates a tree structure for a workspace.

#### Parameters

- `options`: [`SnapshotOptions`][snapshot] - The options to generate the tree.
  - `path`: `string` - The path to the workspace
  - `ignore`: `[]string` - The paths to ignore
  - `include`: `[]string` - The paths to include
  - `exclude`: `[]string` - The paths to exclude

#### Return

[`Node`][Node] - The tree structure representation of the workspace

#### Example

```javascript
import { snapshot } from "@workspace-visualizer/fs-tree";

const tree = await snapshot({
    root: "/path/to/workspace",
    ignore: ["node_modules", "dist"],
});
```

---

## 📄 License

[MIT License](LICENSE)

<!-- ===== -->
<!-- LINKS -->
<!-- ===== -->

[Node]: ./src/class/Node.ts
[snapshot]: ./src/snapshot.ts
