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
import React from 'react';
import { Box, Spacer } from 'ink';
import { ESLint } from 'eslint';

// Hooks
import useAsyncMemo from '../utils/hooks/useAsyncMemo';
import useLoadableEvent, { LoadableEvent } from '../utils/hooks/useLoadableEvent';

// Core
import { pendingMessage, successMessage } from '../core/styled-messages';
import runLinter, { LintOptions } from '../core/run-linter';

// Components
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';
import LinterResult from './LinterResult';


interface RunLinterProps extends LintOptions, LoadableEvent<ESLint.LintResult[], Error> {
  pattern: string;
}

export default function RunLinter(
  { files, fix, cache, pattern, ...props }: RunLinterProps,
): JSX.Element {
  const data = useAsyncMemo<ESLint.LintResult[], Error>(
    () => runLinter({ files, fix, cache }, pattern),
    [files, fix, cache, pattern],
  );

  useLoadableEvent(props, data);

  return (
    <Box flexDirection="column">
      <SuperDiagnosticMessage
        status={data.status}
        pending={pendingMessage('Running', `ESLint for file pattern '${pattern}'`)}
        success={successMessage('Ran', `ESLint for file pattern '${pattern}'`)}
      />
      <Spacer />
      <Box flexDirection="column" marginLeft={2}>
        {
          data.status === 'success' && data.result.map((result) => (
            <LinterResult
              key={result.filePath}
              result={result}
            />
          ))
        }
      </Box>
    </Box>
  );
}