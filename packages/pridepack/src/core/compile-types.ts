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
import ts from 'typescript';
import { PridepackConfig } from './default-config';
import { outputFile } from './fs-utils';
import getTSEntrypoints from './get-ts-entrypoints';
import readValidCompilerOptions from './read-valid-compiler-options';
import { DEFAULT_TYPES_OUTPUT } from './resolve-entrypoint';

interface OutputFile {
  name: string;
  data: string;
}

export default async function compileTypes(
  config: PridepackConfig,
  noEmit = true,
): Promise<ts.Diagnostic[]> {
  const options = await readValidCompilerOptions();
  const cwd = process.cwd();

  const baseConfig: ts.CompilerOptions = {
    ...options,
    outDir: path.resolve(
      path.join(
        cwd,
        DEFAULT_TYPES_OUTPUT,
      ),
    ),
    emitDeclarationOnly: !noEmit,
    moduleResolution: 2,
    noEmit,
  };

  // Create a Program with an in-memory emit
  const host = ts.createCompilerHost(baseConfig);

  const files: OutputFile[] = [];

  host.writeFile = (name, data) => {
    files.push({
      name,
      data,
    });
  };

  // Prepare and emit the d.ts files
  const program = ts.createProgram(
    getTSEntrypoints(config),
    baseConfig,
    host,
  );

  const result = program.emit();

  await Promise.all(
    files.map((file) => outputFile(file.name, file.data)),
  );

  return ts.getPreEmitDiagnostics(program)
    .concat(result.diagnostics);
}
