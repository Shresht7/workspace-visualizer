// Library
import { extname } from "node:path"; // Node.js path module to get the extension of the file
import extensionColors from "./colorAssociation.json"; // This is a JSON file with the colors of the extensions

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
