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
import path from 'path';
import { legacy, resolve } from 'resolve.exports';
import readPackage from './read-package';

export const DEFAULT_OUTPUT = 'dist/cjs';
export const DEFAULT_CJS_PRODUCTION_ENTRY = 'production/index.js';
export const DEFAULT_CJS_DEVELOPMENT_ENTRY = 'development/index.js';
export const DEFAULT_CJS_PROD_ENTRY = `${DEFAULT_OUTPUT}/${DEFAULT_CJS_PRODUCTION_ENTRY}`;
export const DEFAULT_CJS_DEV_ENTRY = `${DEFAULT_OUTPUT}/${DEFAULT_CJS_DEVELOPMENT_ENTRY}`;

export async function resolveCJSEntry(dev: boolean): Promise<string> {
  const pkg = await readPackage();

  // Resolve through Export map
  let result: string | void;
  try {
    result = resolve(pkg, dev ? './dev' : '.', {
      require: true,
    }) ?? undefined;
  } catch (err) {
    result = undefined;
  }

  // If there is a definition, return it.
  if (result) {
    return result;
  }

  // Otherwise, fallback to legacy.
  const legacyResult = legacy(pkg, {
    browser: false,
    fields: ['main'],
  });

  if (legacyResult) {
    return legacyResult;
  }

  return dev ? DEFAULT_CJS_DEV_ENTRY : DEFAULT_CJS_PROD_ENTRY;
}

export async function getCJSTargetDirectory(dev: boolean): Promise<string> {
  const targetPath = await resolveCJSEntry(dev);

  return path.dirname(targetPath);
}
