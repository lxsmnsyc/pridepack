import chalk from 'chalk';
import { Box } from 'ink';
import path from 'path';
import React from 'react';
import { Diagnostic, flattenDiagnosticMessageText } from 'typescript';

// Components
import DiagnosticMessage from '../utils/DiagnosticMessage';

export interface CompileTypesDiagnosticsProps {
  diagnostics: Diagnostic[];
}

function diagnosticToMessage(diagnostic: Diagnostic): string {
  const baseMessage = flattenDiagnosticMessageText(diagnostic.messageText, '\n');
  if (diagnostic.file) {
    const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);
    const fileName = path.relative(process.cwd(), diagnostic.file.fileName);
    const file = chalk.blue(fileName);
    const styledLine = chalk.yellow(line + 1);
    const column = chalk.yellow(character + 1);
    return `${file} (${styledLine}, ${column}): ${baseMessage}`;
  }

  return baseMessage;
}

export default function CompileTypesDiagnostics(
  { diagnostics }: CompileTypesDiagnosticsProps,
): JSX.Element {
  return (
    <Box flexDirection="column" marginLeft={2}>
      {
        diagnostics.map((diagnostic, index) => (
          <Box key={`diagnostic-${index}`}>
            <DiagnosticMessage
              category={diagnostic.category}
              message={diagnosticToMessage(diagnostic)}
            />
          </Box>
        ))
      }
    </Box>
  )
}