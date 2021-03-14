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
import { Diagnostic } from 'typescript';

// Hooks
import useAsyncMemo from '../utils/hooks/useAsyncMemo';
import useLoadableEvent, { LoadableEvent } from '../utils/hooks/useLoadableEvent';

// Core
import compileTypes from '../core/compile-types';
import { pendingMessage, successMessage } from '../core/styled-messages';

// Components
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';
import CompileTypesDiagnostics from './CompileTypesDiagnostics';

export interface CompileTypesProps extends LoadableEvent<Diagnostic[], Error> {
  noEmit: boolean;
}

export default function CompileTypes(
  { noEmit, ...props}: CompileTypesProps,
): JSX.Element {
  const data = useAsyncMemo<Diagnostic[], Error>(
    () => compileTypes(noEmit),
    [],
  );

  useLoadableEvent(props, data);

  return (
    <Box flexDirection="column">
      <SuperDiagnosticMessage
        status={data.status}
        pending={pendingMessage('Compiling', 'type declarations')}
        success={successMessage('Compiled', 'type declarations')}
        failure={(data.result && data.result instanceof Error ) ? data.result.message : undefined}
      />
      {
        data.status === 'success' && (
          <CompileTypesDiagnostics diagnostics={data.result} />
        )
      }
    </Box>
  );
}