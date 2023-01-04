#! /usr/bin/env node

// Library
import { Command } from 'commander'; // CLI framework
import { JSDOM } from 'jsdom'; // DOM parser
import { commands } from './commands/index.js'; // All commands

// Instantiate JSDOM
const dom = new JSDOM();
globalThis.document = dom.window.document; // Set document to globalThis so that it can be used in the visualization library

// Instantiate program
const program = new Command();

// Add program information
program
    .name('workspace-visualizer')
    .description('A simple tool to record and visualize your workspace')
    .version('0.1.0', '-v, --version', 'Output the current version');

// Add commands to program
commands.forEach(cmd => {
    const command = program
        .command(cmd.name)
        .description(cmd.description)

    // Add arguments and options
    cmd.args.forEach(arg => {
        command.argument(arg.name, arg.description, arg.default)
    })
    cmd.options.forEach(option => {
        if (option.required) {
            command.requiredOption(option.name, option.description, option.default)
        } else {
            command.option(option.name, option.description, option.default)
        }
    })

    // Add action handlers
    command.action(cmd.run)
})

// Parse arguments
program.parse()

// Output help if no arguments are provided
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
