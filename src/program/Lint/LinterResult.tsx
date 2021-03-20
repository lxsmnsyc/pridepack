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
import { ESLint, Linter } from 'eslint';
import { Box, Spacer, Text } from 'ink';
import path from 'path';
import React from 'react';
import { DiagnosticCategory } from 'typescript';
import DiagnosticMessage from '../utils/DiagnosticMessage';

interface LinterResultProps {
  result: ESLint.LintResult;
}

type SeverityMap = Record<Linter.Severity, DiagnosticCategory>;

const diagnostics: SeverityMap = {
  0: DiagnosticCategory.Message,
  1: DiagnosticCategory.Warning,
  2: DiagnosticCategory.Error,
};

function linterMessageToString(message: Linter.LintMessage): string {
  const baseMessage = message.message;
  const rule = chalk.blue(message.ruleId ? ` [${message.ruleId}]`: '');
  const line = chalk.yellow(message.line);
  const column = chalk.yellow(message.column);
  return `(${line}, ${column}): ${baseMessage}${rule}`;
}

export default function LinterResult({ result }: LinterResultProps): JSX.Element {
  if (result.messages.length) {
    return (
      <Box flexDirection="column">
        <Box>
          <Text>{path.relative(process.cwd(), result.filePath)}</Text>
        </Box>
        <Spacer />
        <Box flexDirection="column" marginLeft={2}>
          {
            result.messages.map((message, index) => (
              <Box key={`message-${index}`}>
                <DiagnosticMessage
                  category={diagnostics[message.severity]}
                  message={linterMessageToString(message)}
                />
              </Box>
            ))
          }
        </Box>
      </Box>
    );
  }
  return <></>;
}