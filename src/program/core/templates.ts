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

export type PeerDependency = string | [string, string];

export interface Template {
  name: string;
  dependencies: string[];
  peerDependencies: PeerDependency[];
  devDependencies: string[];
}

export interface Templates {
  [key: string]: Template;
}

const baseDevDependencies = [
  '@types/jest',
  '@types/node',
  'eslint',
  'eslint-config-lxsmnsyc',
  'tslib',
  'typescript',
  'pridepack',
  'jest',
  'ts-jest',
];

const TEMPLATES: Templates = {
  basic: {
    name: 'basic',
    dependencies: [],
    peerDependencies: [],
    devDependencies: [
      ...baseDevDependencies,
    ],
  },
  react: {
    name: 'react',
    dependencies: [
    ],
    peerDependencies: [
      ['react', '^16.8.0 || ^17.0.0'],
      ['react-dom', '^16.8.0 || ^17.0.0'],
    ],
    devDependencies: [
      ...baseDevDependencies,
      '@types/react',
      '@testing-library/react',
      '@testing-library/jest-dom',
      '@testing-library/react-hooks',
      'react-test-renderer',
    ],
  },
  preact: {
    name: 'preact',
    dependencies: [
    ],
    peerDependencies: [
      ['preact', '^10.0.0'],
    ],
    devDependencies: [
      ...baseDevDependencies,
      '@testing-library/preact',
      '@testing-library/jest-dom',
      '@testing-library/preact-hooks',
    ],
  },
  vue: {
    name: 'vue',
    dependencies: [
    ],
    peerDependencies: [
      ['vue', '^2.6.0'],
    ],
    devDependencies: [
      ...baseDevDependencies,
      '@testing-library/vue',
      '@testing-library/jest-dom',
      'esbuild-vue',
    ],
  },
  fastify: {
    name: 'fastify',
    dependencies: [
      'fastify',
    ],
    peerDependencies: [],
    devDependencies: [
      ...baseDevDependencies,
    ],
  },
};

export default TEMPLATES;
