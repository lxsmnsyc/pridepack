import { Text, TextProps } from 'ink';
import React from 'react';
import { DiagnosticCategory } from 'typescript';


interface DiagnosticDisplay {
  symbol: string;
  color: TextProps['color'];
}

interface DiagnosticDisplayOptions {
  [key: string]: DiagnosticDisplay;
}

export const DIAGNOSTIC_DISPLAYS: DiagnosticDisplayOptions = {
  [DiagnosticCategory.Error]: {
    symbol: '✖',
    color: 'red',
  },
  [DiagnosticCategory.Message]: {
    symbol: '✔',
    color: 'green',
  },
  [DiagnosticCategory.Suggestion]: {
    symbol: 'ℹ',
    color: 'cyan',
  },
  [DiagnosticCategory.Warning]: {
    symbol: '⚠',
    color: 'yellow',
  },
};

export interface DiagnosticMessageProps {
  category: DiagnosticCategory;
  message: string;
}

export default function DiagnosticMessage(
  { category, message }: DiagnosticMessageProps,
): JSX.Element {
  return (
    <Text>
      <Text color={DIAGNOSTIC_DISPLAYS[category].color}>
        {DIAGNOSTIC_DISPLAYS[category].symbol}
      </Text>
      <Text>
        {` ${message}`}
      </Text>
    </Text>
  );
}