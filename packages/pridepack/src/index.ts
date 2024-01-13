#!/usr/bin/env node

import prompts from 'prompts';
import yargs from 'yargs';
import runProgram from './program';
import './program/graceful-crash';

const { argv } = yargs(process.argv.slice(2))
  .scriptName('pridepack')
  .usage('Usage: $0 <command> [options]')
  .command(
    'build',
    'Build the project directory.',
  )
  .command(
    'create <name> [template]',
    'Creates a Typescript package project.',
    (args) => (
      args
        .positional('name', {
          describe: 'Name of the package',
          type: 'string',
        })
        .positional('template', {
          describe: 'Project template to be used',
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
  .command(
    'check',
    'Performs typechecking',
  )
  .command(
    'watch',
    'Opts-in to watch mode for building.',
  )
  .command(
    'clean',
    'Cleans output directory.',
  )
  .command(
    'start',
    'Runs the package in production mode.',
  )
  .command(
    'dev',
    'Runs the package in development mode.',
  )
  .demandCommand(1)
  .help();

prompts.override(argv);
runProgram();
