
import { Box } from 'ink';
import React from 'react';
import { DiagnosticCategory } from 'typescript';
import { Message } from 'esbuild';

// Components
import DiagnosticMessage from '../utils/DiagnosticMessage';
import chalk from 'chalk';

export interface BuildResultDiagnosticsProps {
  messages: Message[];
  isWarning?: boolean;
}

function messageToString(message: Message): string {
  const baseMessage = message.text;
  if (message.location) {
    const { location } = message;
    const file = chalk.blue(location.file);
    const line = chalk.yellow(location.line);
    const column = chalk.yellow(location.column + 1);
    return `${file} (${line}, ${column}): ${baseMessage}`;
  }

  return baseMessage;
}

export default function BuildResultDiagnostics(
  { messages, isWarning }: BuildResultDiagnosticsProps,
): JSX.Element {
  return (
    <Box flexDirection="column" marginLeft={2}>
      {
        messages.map((message, index) => (
          <Box key={`diagnostic-${index}`}>
            <DiagnosticMessage
              category={
                isWarning
                  ? DiagnosticCategory.Warning
                  : DiagnosticCategory.Error
              }
              message={messageToString(message)}
            />
          </Box>
        ))
      }
    </Box>
  );
}