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
import dotenv from 'dotenv';

const ENV = '.env';
const ENV_PRODUCTION = '.env.production';
const ENV_DEVELOPMENT = '.env.development';

export default function readEnv(isProduction: boolean): Partial<Record<string, string>> {
  const cwd = process.cwd();

  try {
    return dotenv.parse(
      isProduction
        ? fs.readFileSync(path.resolve(path.join(cwd, ENV_PRODUCTION)))
        : fs.readFileSync(path.resolve(path.join(cwd, ENV_DEVELOPMENT))),
    );
  } catch (err) {
    try {
      return dotenv.parse(fs.readFileSync(path.resolve(path.join(cwd, ENV))));
    } catch (err2) {
      return {};
    }
  }
}
