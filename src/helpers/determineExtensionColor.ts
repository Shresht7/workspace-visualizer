// Library
import { extname } from "node:path";

/** Colors associated with extensions */
const extensionColors = {
    ".js": "#f7df1e",
    ".jsx": "#f7df1e",
    ".ts": "#007ACC",
    ".tsx": "#007ACC",
    ".html": "#FFA500",
    ".htm": "#FFA500",
    ".css": "#264de4",
    ".json": "#eeb82e",
    ".md": "#f1e05a",
    ".mdx": "#f1e05a",
    ".txt": "#f1e05a",
    ".yml": "#f1e05a",
    ".yaml": "#f1e05a",
    ".xml": "#e34c26",
    ".svg": "#e34c26",
    ".png": "#e34c26",
    ".jpg": "#e34c26",
    ".jpeg": "#e34c26",
    ".gif": "#e34c26",
    ".ico": "#e34c26",
    ".mp4": "#e34c26",
    ".mp3": "#e34c26",
    ".wav": "#e34c26",
    ".ogg": "#e34c26",
    ".flac": "#e34c26",
    ".aac": "#e34c26",
    ".m4a": "#e34c26",
    ".wma": "#e34c26",
    ".zip": "#563d7c",
    ".rar": "#563d7c",
    ".7z": "#563d7c",
    ".tar": "#563d7c",
    ".gz": "#563d7c",
    ".bz2": "#563d7c",
    ".xz": "#563d7c",
    ".exe": "#e34c26",
    ".dll": "#e34c26",
    ".ps1": "#2c4e6a",
    ".psm1": "#2c4e6a",
    ".psd1": "#2c4e6a",
}

/**
 * Determines the color of the extension icon based on the file extension
 * @param path The path to the file
 * @returns The color of the extension icon
 * @example
 * const color = determineExtensionColor("C:\\Users\\User\\Desktop\\file.js")
 * console.log(color) // #f7df1e
 */
export function determineExtensionColor(path: string): string {
    const extension = extname(path).toLowerCase();
    if (extension in extensionColors) {
        return extensionColors[extension as keyof typeof extensionColors]
    } else {
        return "#000000"
    }
}
