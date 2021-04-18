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
import fs from 'fs-extra';
import DEFAULT_CONFIG, { PridepackConfig } from './default-config';
import { loadJS } from './load-js';
import { isFile } from './stat';

export const CONFIG_NAMES = [
  '.pridepackrc',
  '.pridepack.json',
  'pridepack.json',
  'pridepack.config.json',
  '.pridepack.config.json',
];

export const CONFIG_JS = [
  'pridepack.config.js',
  'pridepack.js',
  '.pridepack.config.js',
  '.pridepack.js',
];

let CONFIG: PridepackConfig;

export default async function readConfig(): Promise<PridepackConfig> {
  if (CONFIG) {
    return CONFIG;
  }
  // Get working directory
  const cwd = process.cwd();

  for (let i = 0; i < CONFIG_NAMES.length; i += 1) {// Get config file path
    const filepath = path.resolve(path.join(cwd, CONFIG_NAMES[i]));
  
    // Check if config exists
    if (await isFile(filepath)) {
      // Read config
      const customConfig = await fs.readJson(filepath) as Partial<PridepackConfig>;
  
      CONFIG = {
        ...customConfig,
        srcFile: customConfig.srcFile || DEFAULT_CONFIG.srcFile,
        tsconfig: customConfig.tsconfig || DEFAULT_CONFIG.tsconfig,
        target: customConfig.target || DEFAULT_CONFIG.target,
      };

      return CONFIG;
    }
  }

  for (let i = 0; i < CONFIG_JS.length; i += 1) {
    const filepath = path.resolve(path.join(cwd, CONFIG_JS[i]));
  
    if (await isFile(filepath)) {
      const customConfig: Partial<PridepackConfig> = loadJS(filepath);

      CONFIG = {
        ...customConfig,
        srcFile: customConfig.srcFile || DEFAULT_CONFIG.srcFile,
        tsconfig: customConfig.tsconfig || DEFAULT_CONFIG.tsconfig,
        target: customConfig.target || DEFAULT_CONFIG.target,
      };

      return CONFIG;
    }
  }
  
  CONFIG = DEFAULT_CONFIG;

  // Return default config
  return CONFIG;
}
