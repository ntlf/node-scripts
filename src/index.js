#!/usr/bin/env node

import commander from 'commander';

const command = process.argv[2];
const commandArgs = process.argv.slice(3);

async function handler() {
  const { default: run } = await import(`./scripts/${command}`);

  await run(commandArgs);
}

commander
  .name('@ntlf/node-scripts')
  .description('@ntlf/node-scripts - painless Node.js projects');

commander
  .command('build')
  .description('Builds current project')
  .allowUnknownOption()
  .action(handler);

commander
  .command('clean')
  .description('Cleans current project')
  .allowUnknownOption()
  .action(handler);

commander
  .command('start')
  .description('Starts development server')
  .allowUnknownOption()
  .action(handler);

commander
  .command('run')
  .description('Runs the given file')
  .allowUnknownOption()
  .action(handler);

commander
  .command('test')
  .description('Runs project tests')
  .allowUnknownOption()
  .option('-w, --watch', 'Run in watch mode')
  .action(handler);

commander
  .command('lint')
  .description('Lints project files')
  .allowUnknownOption()
  .action(handler);

commander
  .command('format')
  .description('Formats project files')
  .allowUnknownOption()
  .action(handler);

if (process.argv.slice(2).length === 0) {
  commander.outputHelp();
  process.exit();
}

commander.parse(process.argv);
