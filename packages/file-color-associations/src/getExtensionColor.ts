// Library
import { extname } from 'node:path'; // Node.js path module to get the extension of the file
import extensionColors from './fileColors.js'; // Assigns colors to file extensions

/**
 * Determines the color based on the file extension
 * @param path The path to the file
 * @param fallbackColor The fallback color - hex format (default: #000000)
 * @returns The associated color
 * @example
 * const color = getExtensionColor("./file.js")
 * console.log(color) // #f7df1e
 */
export function getExtensionColor(path: string, fallbackColor: string = "#000000"): string {
    // Get the extension of the file
    const extension = extname(path).toLowerCase();
    // Check if the extension is in the JSON file
    if (extension in extensionColors) {
        // Return the color of the extension
        return extensionColors[extension as keyof typeof extensionColors];
    } else {
        // Return the fallback color
        return fallbackColor;
    }
}
