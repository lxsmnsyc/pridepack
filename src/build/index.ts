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
import fs from 'fs-extra';
import { Listr } from 'listr2';
import compileTypes from './compile-types';
import buildESM from './build-esm';
import CONFIG_WITH_CWD from '../utils/read-config-with-cwd';
import buildDevelopment from './build-development';
import buildProduction from './build-production';
import buildOut from './build-out';
import { startBenchmark, endBenchmark } from '../utils/get-benchmark';

export default function build(): void {
  const tasks = new Listr([
    {
      title: 'Cleaning out directory',
      task: () => fs.remove(CONFIG_WITH_CWD.outDir),
    },
    {
      title: 'Compiling source',
      task: compileTypes,
    },
    {
      title: 'Building source',
      task: () => new Listr(
        [
          {
            title: 'Building CommonJS',
            task: () => new Listr([
              {
                title: 'Building CommonJS Development output',
                task: buildDevelopment,
              },
              {
                title: 'Building CommonJS Production output',
                task: buildProduction,
              },
              {
                title: 'Building CommonJS Entry Point',
                task: buildOut,
              },
            ]),
          },
          {
            title: 'Building ESM',
            task: buildESM,
          },
        ],
      ),
    },
  ]);

  const time = startBenchmark('');
  tasks.run().then(
    () => {
      endBenchmark('Done in', time);
    },
    (err) => {
      console.error(err);
      process.exit(1);
    },
  );
}
