<!-- ============= -->
<!-- VISUALIZATION -->
<!-- ============= -->

# `workspace-visualizer/visualization`

This package contains the code that is responsible for visualizations for the `workspace-visualizer` package. It contains functions
to create [d3](https://d3js.org) visualizations of the workspace tree structure.

<!-- TODO: Add Two Screenshots -->

---

## 📘 Usage
<!-- ====== -->

```js
import { generateForceDirectedGraph } from "@workspace-visualizer/visualization";}

const svg = await generateForceDirectedGraph(tree, {
    width: 1000,
    height: 1000,
    nodeRadius: 10,
    // ... other options
});
```

## 📕 API Reference
<!-- ============== -->

### `generateForceDirectedGraph`
<!-- -------------------------- -->

This function generates a force directed graph from a tree structure.

#### Parameters

- `root` **[Node][Node]** - The root node of the tree
- `options` **[ForceDirectedGraphOptions][ForceDirectedGraph]** - The options for visualizing the graph


#### Return

**[`Promise`][Promise]<[`SVGElement`][SVGElement] | [`null`][null]>** - The SVG element of the graph

#### Example

```javascript
import { generateForceDirectedGraph } from "@workspace-visualizer/visualization";

const svg = await generateForceDirectedGraph(tree, {
    width: 1000,
    height: 1000,
    nodeRadius: 10,
});
```

#### Notes

The function is `async` because it needs to perform the simulation of the force-directed graph before rendering it.

### `generateRadialTree`
<!-- ------------------- -->

This function generates a radial tree from a tree structure.

#### Parameters

- `root` **[Node][Node]** - The root node of the tree
- `options` **[RadialTreeOptions][RadialTree]** - The options for visualizing the tree

#### Return

**[`Promise`][Promise]<[`SVGElement`][SVGElement] | [`null`][null]>** - The SVG element representation of the tree

#### Example

```javascript
import { generateRadialTree } from "@workspace-visualizer/visualization";

const svg = await generateRadialTree(tree, {
    width: 1000,
    height: 1000,
    nodeRadius: 10,
});
```

#### Notes

This function does not actually need to be `async` but it is to maintain consistency across the API.

---

## License
<!-- ===== -->

[MIT License](./LICENSE)

<!-- ===== -->
<!-- LINKS -->
<!-- ===== -->

[Promise]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise
[SVGElement]: https://developer.mozilla.org/docs/Web/API/SVGElement
[null]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/null

[Node]: ../fs-tree/src/class/Node.ts
[ForceDirectedGraph]: ./src/library/forceDirectedGraph.ts
[RadialTree]: ./src/library/radialTree.ts
