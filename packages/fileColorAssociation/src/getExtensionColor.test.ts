// Imports
import { describe, test, expect } from 'vitest';
import { getExtensionColor } from './getExtensionColor.js';

// Test
describe('getExtensionColor', () => {
    test('returns the color of the extension', () => {
        expect(getExtensionColor('./file.js')).toBe('#f7df1e');
    });

    test('returns the fallback color if the extension is not in the JSON file', () => {
        expect(getExtensionColor('./file.unknown')).toBe('#000000');
    });
});
