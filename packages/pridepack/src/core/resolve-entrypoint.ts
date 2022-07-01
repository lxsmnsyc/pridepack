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
import readTSConfig from './read-tsconfig';

export const DEFAULT_CJS_OUTPUT = 'dist/cjs';
export const DEFAULT_CJS_PRODUCTION_ENTRY = 'production';
export const DEFAULT_CJS_DEVELOPMENT_ENTRY = 'development';

export function getCJSTargetDirectory(moduleEntry: string, isDev: boolean): string {
  return path.join(
    DEFAULT_CJS_OUTPUT,
    isDev ? DEFAULT_CJS_DEVELOPMENT_ENTRY : DEFAULT_CJS_PRODUCTION_ENTRY,
    moduleEntry === '.' ? './index' : moduleEntry,
  );
}

export const DEFAULT_ESM_OUTPUT = 'dist/esm';
export const DEFAULT_ESM_PRODUCTION_ENTRY = 'production';
export const DEFAULT_ESM_DEVELOPMENT_ENTRY = 'development';

export function getESMTargetDirectory(moduleEntry: string, isDev: boolean): string {
  return path.join(
    DEFAULT_ESM_OUTPUT,
    isDev ? DEFAULT_ESM_DEVELOPMENT_ENTRY : DEFAULT_ESM_PRODUCTION_ENTRY,
    moduleEntry === '.' ? './index' : moduleEntry,
  );
}

export const DEFAULT_TYPES_OUTPUT = 'dist/types';

export async function getTypesTarget(entrypoint: string): Promise<string> {
  const config = await readTSConfig();
  const root = config.compilerOptions?.rootDir;
  if (!root) {
    throw new Error('Missing `rootDir` in tsconfig.json');
  }
  const cwd = process.cwd();
  const targetEntry = path.join(cwd, entrypoint);
  const targetRoot = path.join(cwd, root);
  const targetPath = path.relative(targetRoot, targetEntry);
  const parsed = path.parse(targetPath);
  return path.join(
    DEFAULT_TYPES_OUTPUT,
    parsed.dir,
    parsed.name,
  );
}
