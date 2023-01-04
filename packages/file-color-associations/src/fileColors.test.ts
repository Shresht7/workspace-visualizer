// Imports
import { describe, test, expect } from 'vitest'; // Testing framework
import fileColors from './fileColors.js'; // File colors

// Test
describe('fileColors', () => {
    test('should exist', () => {
        expect(fileColors).toBeDefined();
    });

    test('should be an object', () => {
        expect(fileColors).toBeInstanceOf(Object);
    });

    test('should have extension keys', () => {
        for (const extension of Object.keys(fileColors)) {
            expect(extension.startsWith('.')).toBe(true);
        }
    })

    test('should have hexadecimal values', () => {
        for (const color of Object.values(fileColors)) {
            expect(color).toMatch(/^#[0-9A-F]{6}$/i);
        }
    });
})
