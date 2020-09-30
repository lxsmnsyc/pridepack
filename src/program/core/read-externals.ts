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
import { builtinModules } from 'module';
import readPackage from './read-package';

let EXTERNALS: string[];

export default async function readExternals(): Promise<string[]> {
  if (EXTERNALS) {
    return EXTERNALS;
  }

  const {
    dependencies,
    devDependencies,
    peerDependencies,
    optionalDependencies,
  } = await readPackage();

  const external = new Set<string>();

  Object.keys(dependencies || {}).forEach((key) => {
    external.add(key);
  });
  Object.keys(devDependencies || {}).forEach((key) => {
    external.add(key);
  });
  Object.keys(peerDependencies || {}).forEach((key) => {
    external.add(key);
  });
  Object.keys(optionalDependencies || {}).forEach((key) => {
    external.add(key);
  });

  EXTERNALS = [
    ...builtinModules,
    ...Array.from(external),
  ];

  return EXTERNALS;
}
