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
export interface Template {
  name: string;
  dependencies: string[];
  peerDependencies: string[];
  devDependencies: string[];
}

export interface Templates {
  [key: string]: Template;
}

const baseDevDependencies = [
  '@typescript-eslint/eslint-plugin',
  '@typescript-eslint/parser',
  'eslint',
  'eslint-import-resolver-node',
  'eslint-import-resolver-typescript',
  'eslint-plugin-import',
  'tslib',
  'typescript',
  // 'pridepack',
];

const TEMPLATES: Templates = {
  basic: {
    name: 'basic',
    dependencies: [],
    peerDependencies: [],
    devDependencies: [
      ...baseDevDependencies,
      'eslint-config-airbnb-base',
    ],
  },
  react: {
    name: 'react',
    dependencies: [
    ],
    peerDependencies: [
      'react',
    ],
    devDependencies: [
      ...baseDevDependencies,
      '@types/react',
      'eslint-plugin-jsx-a11y',
      'eslint-plugin-react',
      'eslint-plugin-react-hooks',
    ],
  },
  preact: {
    name: 'preact',
    dependencies: [
    ],
    peerDependencies: [
      'preact',
    ],
    devDependencies: [
      ...baseDevDependencies,
      'eslint-plugin-jsx-a11y',
      'eslint-plugin-preact',
    ],
  },
};

export default TEMPLATES;
