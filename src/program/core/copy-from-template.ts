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
import { isDirectory, isFile } from './stat';

const TRANSFORMS = [
  {
    from: '_gitignore',
    to: '.gitignore',
  },
];

export default async function copyFromTemplate(
  template: string,
  directory: string,
): Promise<void> {
  const source = path.resolve(
    __dirname,
    '..',
    'templates',
    template,
  );

  if (await isDirectory(source)) {
    const target = path.resolve(
      process.cwd(),
      directory,
    );
    await fs.copy(source, target);

    for (let i = 0; i < TRANSFORMS.length; i += 1) {
      const file = path.resolve(
        process.cwd(),
        directory,
        TRANSFORMS[i].from,
      );

      if (await isFile(file)) {
        const newName = path.resolve(
          process.cwd(),
          directory,
          TRANSFORMS[i].to,
        );
        await fs.rename(file, newName);
      }
    }
  }
}
