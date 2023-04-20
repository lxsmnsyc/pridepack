/**
 * @license
 * MIT License
 *
 * Copyright (c) 2023 Lyon Software Technologies, Inc.
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
import { Plugin } from 'esbuild';

interface PridepackPluginEnv {
  isDev: boolean;
  isESM: boolean;
  isCJS: boolean;
}

type PridepackLazyPlugin = (env: PridepackPluginEnv) => Plugin[];

export interface PridepackConfig {
  entrypoints: Record<string, string>;
  tsconfig: string;
  target: string | string[];
  outputDir: string;
  startEntrypoint?: string;
  jsx?: 'transform' | 'preserve';
  jsxFactory?: string;
  jsxFragment?: string;
  plugins?: Plugin[] | PridepackLazyPlugin;
}

const DEFAULT_CONFIG: PridepackConfig = {
  startEntrypoint: '.',
  entrypoints: {
    '.': 'src/index.ts',
  },
  target: 'es2018',
  tsconfig: 'tsconfig.json',
  outputDir: 'dist',
};

export default DEFAULT_CONFIG;
