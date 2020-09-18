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
import path from 'path';
import fs from 'fs-extra';
import { IPackageJson } from 'package-json-type';
import getSafePackageName from '../utils/get-safe-package-name';

const BASE_PACKAGE: IPackageJson = {
  version: '0.0.0',
  main: 'dist/index.js',
  types: 'dist/index.d.ts',
  files: [
    'dist',
    'src',
  ],
  engines: {
    node: '>=10',
  },
  scripts: {
    prepublish: 'pridepack build',
    build: 'pridepack build',
    'type-check': 'pridepack check',
    lint: 'pridepack lint',
    test: 'pridepack test',
  },
  license: 'MIT',
};

export default async function createPackage(name: string, target: string): Promise<void> {
  const packageInfo: IPackageJson = {
    ...BASE_PACKAGE,
    name,
    module: `dist/${getSafePackageName(name)}.esm.js`,
  };
  const packagePath = path.resolve(path.join(process.cwd(), target, 'package.json'));
  await fs.outputFile(packagePath, JSON.stringify(packageInfo, null, 2));
}
