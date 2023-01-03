// Library
import { extname } from "node:path"; // Node.js path module to get the extension of the file

const extensionColors = {
    ".js": "#f7df1e",
    ".jsx": "#f7df1e",
    ".ts": "#007ACC",
    ".tsx": "#007ACC",
    ".html": "#FFA500",
    ".htm": "#FFA500",
    ".css": "#264de4",
    ".json": "#eeb82e",
    ".md": "#eeeeee",
    ".mdx": "#ffca28",
    ".txt": "#000000",
    ".yml": "#ff5252",
    ".yaml": "#ff5252",
    ".xml": "#739e45",
    ".svg": "#ffb300",
    ".png": "#26a69a",
    ".jpg": "#26a69a",
    ".jpeg": "#26a69a",
    ".gif": "#26a69a",
    ".ico": "#26a69a",
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
    ".ps1": "#24acf2",
    ".psm1": "#24acf2",
    ".psd1": "#24acf2"
}


/**
 * Determines the color of the extension icon based on the file extension
 * @param path The path to the file
 * @param fallbackColor The fallback color
 * @returns The color of the extension icon
 * @example
 * const color = determineExtensionColor("C:\\Users\\User\\Desktop\\file.js")
 * console.log(color) // #f7df1e
 */
export function getExtensionColor(path: string, fallbackColor: string = "#000000"): string {
    // Get the extension of the file
    const extension = extname(path).toLowerCase();
    // Check if the extension is in the JSON file
    if (extension in extensionColors) {
        // Return the color of the extension
        return extensionColors[extension as keyof typeof extensionColors]
    } else {
        // Return the fallback color
        return fallbackColor;
    }
}

// TODO: Extract this to a separate npm package
