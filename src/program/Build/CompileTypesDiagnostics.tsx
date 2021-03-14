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
import chalk from 'chalk';
import { Box } from 'ink';
import path from 'path';
import React from 'react';
import { Diagnostic, flattenDiagnosticMessageText } from 'typescript';

// Components
import DiagnosticMessage from '../utils/DiagnosticMessage';

export interface CompileTypesDiagnosticsProps {
  diagnostics: Diagnostic[];
}

export function diagnosticToMessage(diagnostic: Diagnostic): string {
  const baseMessage = flattenDiagnosticMessageText(diagnostic.messageText, '\n');
  if (diagnostic.file) {
    const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);
    const fileName = path.relative(process.cwd(), diagnostic.file.fileName);
    const file = chalk.blue(fileName);
    const styledLine = chalk.yellow(line + 1);
    const column = chalk.yellow(character + 1);
    return `${file} (${styledLine}, ${column}): ${baseMessage}`;
  }

  return baseMessage;
}

export default function CompileTypesDiagnostics(
  { diagnostics }: CompileTypesDiagnosticsProps,
): JSX.Element {
  return (
    <Box flexDirection="column" marginLeft={2}>
      {
        diagnostics.map((diagnostic, index) => (
          <Box key={`diagnostic-${index}`}>
            <DiagnosticMessage
              category={diagnostic.category}
              message={diagnosticToMessage(diagnostic)}
            />
          </Box>
        ))
      }
    </Box>
  )
}