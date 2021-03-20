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
import { Box } from 'ink';
import { BuildResult, BuildFailure } from 'esbuild';

// Hooks
import useAsyncMemo from '../utils/hooks/useAsyncMemo';
import useLoadableEvent, { LoadableEvent } from '../utils/hooks/useLoadableEvent';

// Core
import buildProduction from '../core/build-production';

// Components
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';
import BuildResultDiagnostics from './BuildResultDiagnostics';
import { pendingMessage } from '../core/styled-messages';

export interface BuildProductionProps extends LoadableEvent<BuildResult, BuildFailure> {
}

export default function BuildProduction(
  props: BuildProductionProps,
): JSX.Element {
  const data = useAsyncMemo<BuildResult, BuildFailure>(
    () => buildProduction(),
    [],
  );

  useLoadableEvent(props, data);

  return (
    <Box flexDirection="column">
      <SuperDiagnosticMessage
        status={data.status}
        pending={pendingMessage('Generating', 'CommonJS production build')}
        success={pendingMessage('Generated', 'CommonJS production build')}
      />
      {
        data.status === 'success' && (
          <BuildResultDiagnostics
            messages={data.result.warnings}
            isWarning
          />
        )
      }
      {
        data.status === 'failure' && (
          <>
            <BuildResultDiagnostics
              messages={data.result.errors}
            />
            <BuildResultDiagnostics
              messages={data.result.warnings}
            />
          </>
        )
      }
    </Box>
  );
}