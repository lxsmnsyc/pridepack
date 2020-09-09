#!/usr/bin/env node
import yargs from 'yargs';
import build from './build';

const { argv } = yargs
  .usage('Usage: $0 <command>')
  .command(
    'build',
    'Build the project directory.',
  )
  .command(
    'create [name] [template]',
    'Creates a Typescript package project.',
    (args) => (
      args
        .positional('name', {
          describe: 'Name of the package',
          type: 'string',
        })
        .positional('template', {
          describe: 'Project template to be used',
          default: 'basic',
          type: 'string',
        })
    ),
  )
  .command(
    'init [template]',
    'Initializes current directory as a Typescript package project.',
    (args) => (
      args
        .positional('template', {
          describe: 'Project template to be used',
          default: 'basic',
          type: 'string',
        })
    ),
  )
  .demandCommand(1)
  .help();

switch (argv._[0]) {
  case 'build':
    build();
    break;
  case 'init':
    break;
  case 'create':
    break;
  case 'test':
    break;
  case 'lint':
    break;
  default:
    break;
}
