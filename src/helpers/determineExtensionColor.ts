// Library
import { extname } from "node:path"; // Node.js path module to get the extension of the file
import extensionColors from "./colorAssociation.json"; // This is a JSON file with the colors of the extensions

/**
 * Determines the color of the extension icon based on the file extension
 * @param path The path to the file
 * @param fallbackColor The fallback color
 * @returns The color of the extension icon
 * @example
 * const color = determineExtensionColor("C:\\Users\\User\\Desktop\\file.js")
 * console.log(color) // #f7df1e
 */
export function determineExtensionColor(path: string, fallbackColor: string = "#000000"): string {
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
