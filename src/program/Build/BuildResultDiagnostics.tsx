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
import { Box } from 'ink';
import React from 'react';
import { DiagnosticCategory } from 'typescript';
import { Message } from 'esbuild';
import chalk from 'chalk';

// Components
import DiagnosticMessage from '../utils/DiagnosticMessage';

export interface BuildResultDiagnosticsProps {
  messages: Message[];
  isWarning?: boolean;
}

function messageToString(message: Message): string {
  const baseMessage = message.text;
  if (message.location) {
    const { location } = message;
    const file = chalk.blue(location.file);
    const line = chalk.yellow(location.line);
    const column = chalk.yellow(location.column + 1);
    return `${file} (${line}, ${column}): ${baseMessage}`;
  }

  return baseMessage;
}

export default function BuildResultDiagnostics(
  { messages, isWarning }: BuildResultDiagnosticsProps,
): JSX.Element {
  return (
    <Box flexDirection="column" marginLeft={2}>
      {
        messages.map((message) => {
          const parsed = messageToString(message);
          return (
            <Box key={parsed}>
              <DiagnosticMessage
                category={
                  isWarning
                    ? DiagnosticCategory.Warning
                    : DiagnosticCategory.Error
                }
                message={parsed}
              />
            </Box>
          );
        })
      }
    </Box>
  );
}
