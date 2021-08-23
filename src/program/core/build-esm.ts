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
import { build, BuildResult } from 'esbuild';
import { DEVELOPMENT_ENV } from './read-env-defs';
import readConfig from './read-config';
import readConfigWithCWD from './read-config-with-cwd';
import readExternals from './read-externals';
import readPackage from './read-package';

export const DEFAULT_ESM_ENTRY = 'dist/esm/index.js';

export async function resolveESM(): Promise<string> {
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
  const targetPath = await resolveESM();

  return path.dirname(targetPath);
}

export default async function buildESM(): Promise<BuildResult> {
  const config = await readConfig();
  const configCWD = await readConfigWithCWD();
  const externals = await readExternals();
  // get outfile
  const esmFile = await resolveESM();
  const outfile = path.resolve(esmFile);
  const withJSX = config.jsx === 'preserve' && outfile.endsWith('.js')
    ? `${outfile}x`
    : outfile;
  // run esbuild
  return build({
    entryPoints: [
      configCWD.srcFile,
    ],
    outfile: withJSX,
    bundle: true,
    minify: false,
    platform: 'node',
    format: 'esm',
    sourcemap: true,
    define: {
      ...await DEVELOPMENT_ENV,
    },
    external: externals,
    target: config.target,
    tsconfig: configCWD.tsconfig,
    jsx: config.jsx,
    jsxFactory: config.jsxFactory,
    jsxFragment: config.jsxFragment,
    logLevel: 'silent',
    charset: 'utf8',
    plugins: config.plugins,
    legalComments: 'eof',
  });
}
