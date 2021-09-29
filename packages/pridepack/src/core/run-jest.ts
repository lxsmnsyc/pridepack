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
import * as jest from 'jest';
import { InitialOptions } from '@jest/types/build/Config';
import readConfig from './read-config';

const DEFAULT_JEST_CONFIG: InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};

export default async function runJest(args: string[]): Promise<void> {
  // Swap environments
  process.env.NODE_ENV = 'test';
  // Read config
  const config = await readConfig();
  // Merge config
  const currentConfig = {
    ...DEFAULT_JEST_CONFIG,
    ...config.jest,
  };

  // Map config to args
  return jest.run([
    ...args,
    '--config',
    JSON.stringify(currentConfig),
  ]);
}