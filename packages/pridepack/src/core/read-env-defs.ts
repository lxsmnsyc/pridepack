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
import readEnv from './read-env';

const CJS_ENV = 'process.env';
const ESM_ENV = 'import.meta.env';

export default async function readEnvDefinitions(
  isDev: boolean,
): Promise<Record<string, string>> {
  const env = await readEnv(isDev);
  const container: Record<string, string> = {};

  for (const key of Object.keys(env)) {
    const value = JSON.stringify(env[key]);
    container[`${CJS_ENV}.${key}`] = value;
    container[`${ESM_ENV}.${key}`] = value;
  }

  container[`${CJS_ENV}.NODE_ENV`] = isDev ? '"development"' : '"production"';
  container[`${ESM_ENV}.MODE`] = isDev ? '"development"' : '"production"';
  container[`${ESM_ENV}.DEV`] = isDev ? 'true' : 'false';
  container[`${ESM_ENV}.PROD`] = isDev ? 'false' : 'true';

  return container;
}
