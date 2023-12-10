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

// Destination of the file from the command line
let destination = process.argv[2];
if (!destination) { // If null, use the default
    destination = "./fileColors.json";
}

// Write the JSON file to the destination
writeFileSync(destination, JSON.stringify(extensionColors, null, 4));
