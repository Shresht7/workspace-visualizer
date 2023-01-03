#! /usr/bin/env node

// Library
import { Command } from 'commander'; // CLI framework
import { commands } from './commands/index.js'; // All commands

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
        command.option(option.name, option.description, option.default)
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
