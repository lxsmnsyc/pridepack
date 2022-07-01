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
import { build, BuildResult } from 'esbuild';
import { PRODUCTION_ENV } from './read-env-defs';
import readExternals from './read-externals';
import { PridepackConfig } from './default-config';
import getBuildEntrypoints from './get-build-entrypoints';

export default async function buildCJSProduction(
  config: PridepackConfig,
  incremental: boolean,
): Promise<BuildResult> {
  const externals = await readExternals();
  const cwd = process.cwd();
  // run esbuild
  return build({
    entryPoints: getBuildEntrypoints(
      config,
      false,
      false,
    ),
    outExtension: {
      '.js': config.jsx === 'preserve' ? '.jsx' : '.js',
    },
    outdir: cwd,
    bundle: true,
    minify: true,
    platform: 'neutral',
    sourcemap: true,
    define: {
      ...await PRODUCTION_ENV,
      'process.env.NODE_ENV': '"production"',
      'import.meta.env.MODE': '"production"',
      'import.meta.env.DEV': 'false',
      'import.meta.env.PROD': 'true',
    },
    incremental,
    external: externals,
    target: config.target,
    tsconfig: path.resolve(path.join(cwd, config.tsconfig)),
    jsx: config.jsx,
    jsxFactory: config.jsxFactory,
    jsxFragment: config.jsxFragment,
    logLevel: 'silent',
    charset: 'utf8',
    plugins: (
      typeof config.plugins === 'function'
        ? config.plugins({ isDev: false, isCJS: false, isESM: true })
        : config.plugins
    ),
    legalComments: 'eof',
  });
}
