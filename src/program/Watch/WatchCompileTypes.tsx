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
import React, { useEffect, useState } from 'react';
import { Diagnostic } from 'typescript';
import CompileTypesDiagnostics, { diagnosticToMessage } from '../Build/CompileTypesDiagnostics';
import watchCompileTypes from '../core/watch-compile-types';
import { Remount } from '../utils/hooks/useRemount';
import DiagnosticMessage from '../utils/DiagnosticMessage';
import IndefiniteMessage from '../utils/IndefiniteMessage';
import chalk from 'chalk';

interface WatchCompileTypesProps {
  remount: Remount;
  noEmit?: boolean;
}

export default function WatchCompileTypes(
  { remount, noEmit }: WatchCompileTypesProps,
): JSX.Element {
  const [watchStatus, setWatchStatus] = useState<Diagnostic | undefined>();
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);

  useEffect(() => {
    let collectDiagnostics = false;
    let mounted = true;

    const unregister = watchCompileTypes(
      (diagnostic) => {
        if (mounted) {
          setDiagnostics((current) => [...current, diagnostic]);
        }
      },
      (diagnostic) => {
        if (mounted) {
          collectDiagnostics = !collectDiagnostics;
  
          if (collectDiagnostics) {
            setDiagnostics([]);
          }
  
          setWatchStatus(diagnostic);
          remount();
        }
      },
      noEmit,
    );

    return () => {
      mounted = false;
      unregister();
    };
  }, [remount, noEmit]);

  return (
    <Box flexDirection="column">
      <IndefiniteMessage
        color="magenta"
        message={chalk.magenta('Compiling in watch mode...')}
        type="dots3"
      />
      <Box flexDirection="column" marginLeft={2}>
        {
          watchStatus && (
            <DiagnosticMessage
              category={watchStatus.category}
              message={diagnosticToMessage(watchStatus)}
            />
          )
        }
        <CompileTypesDiagnostics
          diagnostics={diagnostics}
        />
      </Box>
    </Box>
  );
}