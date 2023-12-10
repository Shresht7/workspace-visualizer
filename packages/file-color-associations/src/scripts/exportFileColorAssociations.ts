// =====================================
// EXPORT FILE COLOR ASSOCIATIONS SCRIPT
// =====================================

/**
 * Description: Exports the file color associations to a JSON file
 * Usage: `node exportFileColorAssociations.js <destination>`
 * Example: `node exportFileColorAssociations.js ./fileColors.json`
*/

// Library
import { writeFileSync } from 'node:fs'; // Node.js file system module for writing files
import extensionColors from '../fileColors.js'; // Assigns colors to file extensions

// Constants
const DEFAULT_FILENAME = "./fileColors.json";

// Destination of the file from the command line
const destination = process.argv[2] || DEFAULT_FILENAME;

// Write the JSON file to the destination
writeFileSync(destination, JSON.stringify(extensionColors, null, 4));
