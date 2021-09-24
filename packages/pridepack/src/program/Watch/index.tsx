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
import BuildEntry from '../Build/BuildEntry';
import BuildOutput from '../Build/BuildOutput';
import { commandTitle } from '../core/styled-messages';
import useRemount from '../utils/hooks/useRemount';
import IndefiniteMessage from '../utils/IndefiniteMessage';
import WatchCompileTypes from './WatchCompileTypes';

export default function Watch(): JSX.Element {
  const [key, remount] = useRemount();

  const title = commandTitle('watch');

  return (
    <Box flexDirection="column">
      <IndefiniteMessage
        color="magenta"
        message={title}
        type="dots3"
      />
      <Box flexDirection="column" marginLeft={2}>
        <BuildEntry
          key={`entry-${key}`}
        />
        <BuildOutput
          key={`output-${key}`}
        />
        <WatchCompileTypes
          remount={remount}
        />
      </Box>
    </Box>
  );
}
