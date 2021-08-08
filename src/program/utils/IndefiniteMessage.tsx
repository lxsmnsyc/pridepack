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
import { TextProps, Text, Box } from 'ink';
import Spinner from 'ink-spinner';
import React, { FC } from 'react';

type PropsOf<T> = T extends FC<infer U> ? U : never;

interface IndefiniteMessageProps {
  color: TextProps['color'];
  type: PropsOf<typeof Spinner>['type'];
  message: string;
}

export default function IndefiniteMessage(
  { color, message, type }: IndefiniteMessageProps,
): JSX.Element {
  return (
    <Box>
      <Text color={color}>
        <Spinner type={type} />
      </Text>
      <Text>
        {` ${message}`}
      </Text>
    </Box>
  );
}
