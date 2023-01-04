// Imports
import { describe, test, expect } from 'vitest'; // Testing framework
import { getExtensionColor } from './getExtensionColor.js'; // Function to get the color of the extension

// Test
describe('getExtensionColor', () => {
    test('returns the color of the extension', () => {
        expect(getExtensionColor('./file.js')).toBe('#f7df1e');
    });

    test('returns the color of html for html files', () => {
        expect(getExtensionColor('./file.html')).toBe('#FFA500');
    })

    test('does not return the color of html for js files', () => {
        expect(getExtensionColor('./file.js')).not.toBe('#FFA500');
    })

    test('returns the fallback color if the extension is not in the JSON file', () => {
        expect(getExtensionColor('./file.unknown')).toBe('#000000');
    });

    test('returns the correct color even if the extension is uppercase', () => {
        expect(getExtensionColor('./file.JS')).toBe('#f7df1e');
    })

    test('returns the fallback if there is no extension at all', () => {
        expect(getExtensionColor('./file')).toBe('#000000');
    })

    test('returns the fallback if the path is empty', () => {
        expect(getExtensionColor('')).toBe('#000000');
    })

    test('use the last extension if there are multiple', () => {
        expect(getExtensionColor('./file.js.html')).toBe('#FFA500');
    })
});
