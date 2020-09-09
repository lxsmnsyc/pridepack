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
import { CompilerOptions, createCompilerHost, createProgram } from 'typescript';
import TSCONFIG from '../utils/read-tsconfig';
import CONFIG_WITH_CWD from '../utils/read-config-with-cwd';

export default function compileTypes(): void {
  const baseConfig: CompilerOptions = {
    ...TSCONFIG.compilerOptions,
    outDir: CONFIG_WITH_CWD.outDir,
    emitDeclarationOnly: true,
    moduleResolution: 2,
  };
  // Create a Program with an in-memory emit
  const host = createCompilerHost(baseConfig);

  host.writeFile = (fileName, data) => {
    fs.outputFileSync(fileName, data);
  };

  // Prepare and emit the d.ts files
  const program = createProgram(
    [CONFIG_WITH_CWD.srcFile],
    baseConfig,
    host,
  );
  program.emit();
}
