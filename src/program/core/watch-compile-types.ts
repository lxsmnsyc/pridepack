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
import {
  CompilerOptions,
  createSemanticDiagnosticsBuilderProgram,
  createWatchCompilerHost,
  createWatchProgram,
  Diagnostic,
  sys,
  WatchOfConfigFile,
} from 'typescript';

import { BASE_PACKAGE } from './create-package';
import readConfigWithCWD from './read-config-with-cwd';
import readPackage from './read-package';
import readValidCompilerOptions from './read-valid-compiler-options';

export type EndCompile = () => void;
export type ReadDiagnostic = (diagnostic: Diagnostic) => void;

export default function watchCompileTypes(
  reportDiagnostic: ReadDiagnostic,
  reportWatchStatus: ReadDiagnostic,
  noEmit?: boolean,
) {
  let ready = true;

  let program: WatchOfConfigFile<any>;

  async function setup() {
    const pkg = await readPackage();

    if (!ready) {
      return;
    }

    const options = await readValidCompilerOptions();

    const baseConfig: CompilerOptions = {
      ...options,
      outDir: path.resolve(
        path.join(
          process.cwd(),
          path.dirname(pkg.types ?? BASE_PACKAGE.types ?? ''),
        ),
      ),
      emitDeclarationOnly: !noEmit,
      moduleResolution: 2,
      noEmit,
    };

    // Create a Program with an in-memory emit
    const cwdConfig = await readConfigWithCWD();

    if (!ready) {
      return;
    }

    const host = createWatchCompilerHost(
      cwdConfig.tsconfig,
      baseConfig,
      sys,
      createSemanticDiagnosticsBuilderProgram,
      reportDiagnostic,
      reportWatchStatus,
    );

    // Prepare and emit the d.ts files
    program = createWatchProgram(
      host,
    );
  }

  setup();

  return () => {
    ready = false;
    if (program) {
      program.close();
    }
  };
}