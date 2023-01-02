// Library
import { Command } from 'commander';
import { readFileSync } from 'node:fs';
import { commands } from './commands/index.js';

// Instantiate program
const program = new Command();

// Read package.json
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

program
    .name(pkg.name)
    .description(pkg.description)
    .version(pkg.version, '-v, --version', 'Output the current version');

// Add commands
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

    // Add action
    command.action(cmd.run)
})

// Parse arguments
program.parse()

// Output help if no arguments are provided
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
