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
import fs from 'fs-extra';
import { OUTPUT_SUFFIX as DEV_SUFFIX } from './build-development';
import { OUTPUT_SUFFIX as PROD_SUFFIX } from './build-production';
import getPackageName from './get-package-name';
import readConfigWithCWD from './read-config-with-cwd';

export default async function buildEntry(): Promise<void> {
  const packageName = await getPackageName();
  const baseLine = `module.exports = require('./${packageName}`;
  const contents = `
'use strict';
if (process.env.NODE_ENV === 'production') {
  ${baseLine}.${PROD_SUFFIX}.js')
} else {
  ${baseLine}.${DEV_SUFFIX}.js')
}
  `;

  await fs.outputFile(readConfigWithCWD().outFile, contents);
}
