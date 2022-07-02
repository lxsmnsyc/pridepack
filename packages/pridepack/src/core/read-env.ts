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
import dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import { pathExists, isFile } from './fs-utils';

const ENV = '.env';
const ENV_PRODUCTION = '.env.production';
const ENV_DEVELOPMENT = '.env.development';

export default async function readEnv(
  isProduction: boolean,
): Promise<Partial<Record<string, string>>> {
  const cwd = process.cwd();

  if (isProduction) {
    const productionPath = path.resolve(path.join(cwd, ENV_PRODUCTION));
    if (await isFile(productionPath)) {
      return dotenv.parse(await readFile(productionPath, 'utf-8'));
    }
  } else {
    const developmentPath = path.resolve(path.join(cwd, ENV_DEVELOPMENT));
    if (await isFile(developmentPath)) {
      return dotenv.parse(await readFile(developmentPath, 'utf-8'));
    }
  }

  const defaultPath = path.resolve(path.join(cwd, ENV));

  if (await pathExists(defaultPath)) {
    return dotenv.parse(await readFile(defaultPath, 'utf-8'));
  }
  return {};
}
