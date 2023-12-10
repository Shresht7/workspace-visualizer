# `workspace-visualizer/file-color-associations`

This package provides a way to associate a color with a file extension.

---

## 📘 Usage

```javascript
import { getExtensionColor } from '@workspace-visualizer/file-color-associations';

getExtensionColor('js'); // => '#f7df1e'
getExtensionColor('ts'); // => '#007ACC'
```

## 📖 API

### `getExtensionColor`

Determine the color for a given file extension.

#### Parameters

- `path`: `string` - The file extension to get the color for.
- `fallbackColor`: `string` = `"#000000"` - The color to return if no color is found for the given extension.

#### Return

`string` - The color for the given extension.

#### Example

```javascript
import { getExtensionColor } from '@workspace-visualizer/file-color-associations';

getExtensionColor('js'); // => '#f7df1e'
getExtensionColor('ts'); // => '#007ACC'
```

## 📃 Scripts

### `exportFileColorAssociations`

Exports the file color associations to a JSON file.

```sh
npm run build:export
# or
node ./scripts/exportFileColorAssociations.js ./fileColors.json
```

---

## 📕 Reference

- https://github.com/github-linguist/linguist/blob/master/lib/linguist/languages.yml

## 📝 License

[MIT License](./LICENSE)
