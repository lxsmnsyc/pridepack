#!/usr/bin/env node

import { intro } from '@clack/prompts';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import './program/graceful-crash';
import runBuildCommand from './program/run-build-command';
import runCleanCommand from './program/run-clean-command';
import runCompile from './program/run-compile';
import runCreateCommand from './program/run-create-command';
import runInitCommand from './program/run-init-command';
import runLintCommand from './program/run-lint-command';
import runStartCommand from './program/run-start-command';
import runWatchCommand from './program/run-watch-command';

// eslint-disable-next-line no-void
void yargs(hideBin(process.argv))
  .scriptName('pridepack')
  .usage('Usage: $0 <command> [options]')
  .command(
    'build',
    'Build the project directory.',
    (args) => args,
    async () => {
      intro('pridepack build');
      await runBuildCommand();
    },
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
          type: 'string',
        })
    ),
    async (args) => {
      intro('pridepack create');
      await runCreateCommand(args);
    },
  )
  .command(
    'init [template]',
    'Initializes current directory as a Typescript package project.',
    (args) => (
      args
        .positional('template', {
          describe: 'Project template to be used',
          type: 'string',
        })
    ),
    async (args) => {
      intro('pridepack init');
      await runInitCommand(args);
    },
  )
  .command(
    'check',
    'Performs typechecking',
    (args) => args,
    async () => {
      intro('pridepack check');
      await runCompile(true);
    },
  )
  .command(
    'watch',
    'Opts-in to watch mode for building.',
    (args) => args,
    async () => {
      intro('pridepack watch');
      await runWatchCommand();
    },
  )
  .command(
    'clean',
    'Cleans output directory.',
    (args) => args,
    async () => {
      intro('pridepack clean');
      await runCleanCommand();
    },
  )
  .command(
    'start',
    'Runs the package in production mode.',
    (args) => args,
    async () => {
      intro('pridepack start');
      await runStartCommand(false);
    },
  )
  .command(
    'dev',
    'Runs the package in development mode.',
    (args) => args,
    async () => {
      intro('pridepack dev');
      await runStartCommand(true);
    },
  )
  .command(
    'lint',
    'Performs linting',
    (args) => (
      args
        .option('files', {
          type: 'string',
          description: 'Pattern of files to lint',
        })
        .option('fix', {
          type: 'boolean',
          description: 'Automatically fix problems.',
        })
        .option('cache', {
          type: 'boolean',
          description: 'Only check changed files.',
        })
    ),
    async (args) => {
      intro('pridepack lint');
      await runLintCommand(args);
    },
  )
  .demandCommand(1)
  .help()
  .parse();
