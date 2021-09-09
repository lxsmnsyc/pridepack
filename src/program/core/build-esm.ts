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

export const DEFAULT_OUTPUT = 'dist/esm';
export const DEFAULT_ESM_PRODUCTION_ENTRY = 'production/index.js';
export const DEFAULT_ESM_DEVELOPMENT_ENTRY = 'development/index.js';
export const DEFAULT_ESM_ENTRY = `${DEFAULT_OUTPUT}/${DEFAULT_ESM_PRODUCTION_ENTRY}`;
export const DEFAULT_ESM_DEV_ENTRY = `${DEFAULT_OUTPUT}/${DEFAULT_ESM_DEVELOPMENT_ENTRY}`;

export async function resolveEntry(): Promise<string> {
  const pkg = await readPackage();

  // Resolve through Export map
  let result: string | void;
  try {
    result = resolve(pkg, '.') ?? undefined;
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
    fields: ['module'],
  });

  if (legacyResult) {
    return legacyResult;
  }

  return DEFAULT_ESM_ENTRY;
}
 
export async function getESMTargetDirectory(): Promise<string> {
  const targetPath = await resolveEntry();

  return path.dirname(targetPath);
}
 