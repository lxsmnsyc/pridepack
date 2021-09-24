#!/usr/bin/env node

/**
 * @license
 * MIT License
 *
 * Copyright (c) 2021 Lyon Software Technologies, Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import prompts from 'prompts';
import yargs from 'yargs';
import runProgram from './program';

const { argv } = yargs
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
    'test',
    'Performs testing',
  )
  .command(
    'lint',
    'Performs linting',
    (args) => (
      args
        .option('files', {
          type: 'array',
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
  )
  .demandCommand(1)
  .help();

prompts.override(argv);
runProgram();
