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

// Hooks
import { LoadableEvent, useLoadableRace } from '../utils/hooks/useLoadableEvent';

// Core
import { commandTitle } from '../core/styled-messages';
import { LintOptions } from '../core/run-linter';

// Components
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';
import Timer from '../utils/Timer';
import RunLinter from './RunLinter';

export interface LintProps extends LintOptions, LoadableEvent<void, undefined> {
}

export default function Lint(
  {
    files,
    fix,
    cache,
    ...props
  }: LintProps,
): JSX.Element {
  const {
    status,
    onSuccess,
    onFailure,
  } = useLoadableRace(props, files ? 1 : 2, [files, fix, cache]);

  const title = commandTitle('lint');

  return (
    <Box flexDirection="column" marginLeft={2}>
      <SuperDiagnosticMessage
        status={status}
        pending={title}
        success={title}
        failure={title}
      />
      <Spacer />
      <Box flexDirection="column" marginLeft={2}>
        {
          files
            ? (
              <RunLinter
                files={files}
                fix={fix}
                cache={cache}
                pattern=""
                onFailure={onFailure}
                onSuccess={onSuccess}
              />
            )
            : (
              <>
                <RunLinter
                  files={files}
                  fix={fix}
                  cache={cache}
                  pattern="src"
                  onFailure={onFailure}
                  onSuccess={onSuccess}
                />
                <RunLinter
                  files={files}
                  fix={fix}
                  cache={cache}
                  pattern="test"
                  onFailure={onFailure}
                  onSuccess={onSuccess}
                />
              </>
            )
        }
      </Box>
      <Timer status={status} />
    </Box>
  );
}
