import { TextProps, Text } from 'ink';
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
    <Text>
      <Text color={color}>
        <Spinner type={type} />
        {` ${message}`}
      </Text>
    </Text>
  );
}