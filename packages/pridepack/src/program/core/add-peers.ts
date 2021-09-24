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
import fs from 'fs-extra';
import { IDependencyMap } from 'package-json-type';
import readPackage from './read-package';
import getPackagePath from './get-package-path';
import TEMPLATES from './templates';
import { SCRIPTS } from './create-package';

export default async function addPeers(template: string, cwd = '.'): Promise<void> {
  const packageInfo = await readPackage(cwd);
  const peerDependencies: IDependencyMap = {};

  if (packageInfo.devDependencies) {
    const peers = TEMPLATES[template].peerDependencies;
    Object.entries(packageInfo.devDependencies).forEach(([key, value]) => {
      peers.forEach((peer) => {
        if (typeof peer === 'object') {
          if (peer.name === key) {
            peerDependencies[key] = peer.peer;
          }
        } else if (peer === key) {
          peerDependencies[key] = value;
        }
      });
    });
  }

  const newInfo = {
    ...packageInfo,
    peerDependencies,
    scripts: SCRIPTS,
  };

  await fs.outputJson(getPackagePath(cwd), newInfo, {
    spaces: 2,
  });
}
