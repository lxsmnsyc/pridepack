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
import { Box, Spacer } from 'ink';
import React from 'react';

// Hooks
import { LoadableEvent, useLoadableRace } from '../utils/hooks/useLoadableEvent';

// Components
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';
import BuildDevelopment from './BuildDevelopment';
import BuildProduction from './BuildProduction';

import { pendingMessage, successMessage } from '../core/styled-messages';

export interface BuildCJSProps extends LoadableEvent<void, undefined> {
}

const MAX_SUCCESS = 2;

export default function BuildCJS(
  props: BuildCJSProps,
): JSX.Element {
  const {
    status,
    onSuccess,
    onFailure,
  } = useLoadableRace(props, MAX_SUCCESS, []);

  return (
    <Box flexDirection="column">
      <SuperDiagnosticMessage
        status={status}
        pending={pendingMessage('Generating', 'CommonJS build')}
        success={successMessage('Generated', 'CommonJS build')}
      />
      <Spacer />
      <Box flexDirection="column" marginLeft={2}>
        <BuildDevelopment
          onFailure={onFailure}
          onSuccess={onSuccess}
        />
        <Spacer />
        <BuildProduction
          onFailure={onFailure}
          onSuccess={onSuccess}
        />
      </Box>
      <Spacer />
    </Box>
  );
}