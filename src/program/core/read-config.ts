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
import fs from 'fs';
import DEFAULT_CONFIG, { PridepackConfig } from './default-config';

export const CONFIG_NAMES = [
  '.pridepackrc',
  '.pridepack.json',
  'pridepack.json',
  'pridepack.config.json',
  '.pridepack.config.json',
];

let CONFIG: PridepackConfig;

export default function readConfig(): PridepackConfig {
  if (CONFIG) {
    return CONFIG;
  }
  // Get working directory
  const cwd = process.cwd();

  for (let i = 0; i < CONFIG_NAMES.length; i += 1) {// Get config file path
    const filepath = path.resolve(path.join(cwd, CONFIG_NAMES[i]));
  
    // Check if config exists
    if (fs.existsSync(filepath)) {
      // Read config
      const result = fs.readFileSync(filepath);
  
      // Parse config to object
      const customConfig = JSON.parse(result.toString()) as Partial<PridepackConfig>;
  
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
