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
import copyFromTemplate from '../utils/copy-from-template';
import getSafePackageName from '../utils/get-safe-package-name';
import createPackage from '../init/create-package';
import { installDevDeps, installDeps } from '../init/install-deps';
import addPeers from '../init/add-peers';
import measureTask from '../utils/measure-task';

export default function create(name: string, template: string): void {
  const safeName = getSafePackageName(name);

  measureTask(new Listr([
    {
      title: `Generating package from template '${template}'.`,
      task: () => new Listr([
        {
          title: 'Generating package.json',
          task: () => createPackage(name, safeName),
        },
        {
          title: 'Generating .gitignore',
          task: () => copyFromTemplate(template, safeName, '_gitignore', '.gitignore'),
        },
        {
          title: 'Generating .eslintrc',
          task: () => copyFromTemplate(template, safeName, '.eslintrc'),
        },
        {
          title: 'Generating .pridepackrc',
          task: () => copyFromTemplate(template, safeName, '.pridepackrc'),
        },
        {
          title: 'Generating tsconfig',
          task: () => new Listr([
            {
              title: 'Generating tsconfig.json',
              task: () => copyFromTemplate(template, safeName, 'tsconfig.json'),
            },
            {
              title: 'Generating tsconfig.eslint.json',
              task: () => copyFromTemplate(template, safeName, 'tsconfig.eslint.json'),
            },
          ]),
        },
        {
          title: 'Finishing template',
          task: () => new Listr([
            {
              title: 'Generating source directory',
              task: () => copyFromTemplate(template, safeName, 'src'),
            },
            {
              title: 'Generating test directory',
              task: () => copyFromTemplate(template, safeName, 'test'),
            },
          ]),
        },
      ]),
    },
    {
      title: 'Installing dev dependencies',
      task: () => installDevDeps(template, safeName),
    },
    {
      title: 'Installing dependencies',
      task: () => installDeps(template, safeName),
    },
    {
      title: 'Adding peer dependencies',
      task: () => addPeers(template, safeName),
    },
  ]));
}
