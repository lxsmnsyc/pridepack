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
import path from 'path';
import { getLicense } from 'license';
import { IPackageJson } from 'package-json-type';
import readPackage from './read-package';
import getPackagePath from './get-package-path';
import { outputFile, outputJson } from './fs-utils';

const SCRIPTS = {
  prepublishOnly: 'pridepack clean && pridepack build',
  build: 'pridepack build',
  'type-check': 'pridepack check',
  lint: 'pridepack lint',
  clean: 'pridepack clean',
  watch: 'pridepack watch',
  start: 'pridepack start',
  dev: 'pridepack dev',
};

interface Patch {
  name: string;
  license?: string;
  author: string;
  description: string;
  repository: string;
  homepage: string;
  issues: string;
  isPrivate: boolean;
}

export default async function patchPackage(patch: Patch, cwd = '.'): Promise<void> {
  const packageInfo = await readPackage(cwd);

  if (patch.license) {
    await outputFile(
      path.join(cwd, 'LICENSE'),
      getLicense(patch.license, {
        author: patch.author,
        year: new Date().getFullYear().toString(),
      }),
      {
        encoding: 'utf-8',
      },
    );
  }

  const newInfo: IPackageJson = {
    ...packageInfo,
    name: patch.name ?? packageInfo.name,
    version: '0.0.0',
    description: patch.description,
    repository: {
      url: patch.repository,
      type: 'git',
    },
    homepage: patch.homepage,
    bugs: {
      url: patch.issues,
    },
    author: patch.author,
    license: patch.license as any,
    private: patch.isPrivate,
    publishConfig: {
      access: patch.isPrivate ? 'restricted' : 'public',
    },
    scripts: {
      ...SCRIPTS,
      ...packageInfo.scripts,
    },
  };

  await outputJson(getPackagePath(cwd), newInfo);
}
