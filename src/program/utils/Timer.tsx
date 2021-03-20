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
import React, { useEffect } from 'react';
import {
  useConstant,
  useForceUpdate,
} from '@lyonph/react-hooks';
import { AsyncStatus } from './hooks/useAsyncMemo';
import SuperDiagnosticMessage from './SuperDiagnosticMessage';

interface TimerProps {
  status: AsyncStatus;
}

export default function Timer(
  { status }: TimerProps,
): JSX.Element {
  const startTime = useConstant(() => Date.now());

  const forceUpdate = useForceUpdate();

  useEffect(() => {
    if (status === 'pending') {
      const interval = setInterval(() => {
        forceUpdate();
      }, 100);

      return () => {
        clearInterval(interval);
      };
    }
    return undefined;
  }, [status]);

  const elapsed = `Time elapsed: ${(Date.now() - startTime) / 1000}s`;

  return (
    <SuperDiagnosticMessage
      status={status}
      pending={chalk.yellow(elapsed)}
      success={chalk.green(elapsed)}
      failure={chalk.red(elapsed)}
    />
  );
}