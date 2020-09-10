/**
 * @license
 * MIT License
 *
 * Copyright (c) 2020 Lyon Software Technologies, Inc.
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
import { Listr } from 'listr2';
import { installDevDeps, installDeps } from './install-deps';
import getCWDName from '../utils/get-cwd-name';
import addPeers from './add-peers';
import createPackage from './create-package';
import copyFromTemplate from '../utils/copy-from-template';
import measureTask from '../utils/measure-task';

export default function init(template: string): void {
  measureTask(new Listr([
    {
      title: `Generating package from template '${template}'.`,
      task: () => new Listr([
        {
          title: 'Generating package.json.',
          task: () => createPackage(getCWDName(), '.'),
        },
        {
          title: 'Generating .gitignore.',
          task: () => copyFromTemplate(template, '.', '_gitignore', '.gitignore'),
        },
        {
          title: 'Generating .eslintrc.',
          task: () => copyFromTemplate(template, '.', '.eslintrc'),
        },
        {
          title: 'Generating .pridepackrc',
          skip: () => template !== 'preact',
          task: () => copyFromTemplate(template, '.', '.pridepackrc'),
        },
        {
          title: 'Generating tsconfig',
          task: () => new Listr([
            {
              title: 'Generating tsconfig.json',
              task: () => copyFromTemplate(template, '.', 'tsconfig.json'),
            },
            {
              title: 'Generating tsconfig.eslint.json',
              task: () => copyFromTemplate(template, '.', 'tsconfig.eslint.json'),
            },
          ]),
        },
        {
          title: 'Finishing template',
          task: () => new Listr([
            {
              title: 'Generating source directory',
              task: () => copyFromTemplate(template, '.', 'src'),
            },
            {
              title: 'Generating test directory',
              task: () => copyFromTemplate(template, '.', 'test'),
            },
          ]),
        },
      ]),
    },
    {
      title: 'Installing dev dependencies',
      task: () => installDevDeps(template),
    },
    {
      title: 'Installing dependencies',
      task: () => installDeps(template),
    },
    {
      title: 'Adding peer dependencies',
      task: () => addPeers(template),
    },
  ]));
}
