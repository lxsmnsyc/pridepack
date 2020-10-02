import chalk from 'chalk';
import { ESLint, Linter } from 'eslint';
import { Box, Spacer, Text } from 'ink';
import path from 'path';
import React from 'react';
import { DiagnosticCategory } from 'typescript';
import DiagnosticMessage from '../utils/DiagnosticMessage';

interface LinterResultProps {
  result: ESLint.LintResult;
}

type SeverityMap = Record<Linter.Severity, DiagnosticCategory>;

const diagnostics: SeverityMap = {
  0: DiagnosticCategory.Message,
  1: DiagnosticCategory.Warning,
  2: DiagnosticCategory.Error,
};

function linterMessageToString(message: Linter.LintMessage): string {
  const baseMessage = message.message;
  const rule = chalk.blue(message.ruleId ? ` [${message.ruleId}]`: '');
  const line = chalk.yellow(message.line);
  const column = chalk.yellow(message.column);
  return `(${line}, ${column}): ${baseMessage}${rule}`;
}

export default function LinterResult({ result }: LinterResultProps): JSX.Element {
  if (result.messages.length) {
    return (
      <Box flexDirection="column">
        <Box>
          <Text>{path.relative(process.cwd(), result.filePath)}</Text>
        </Box>
        <Spacer />
        <Box flexDirection="column" marginLeft={2}>
          {
            result.messages.map((message, index) => (
              <Box key={`message-${index}`}>
                <DiagnosticMessage
                  category={diagnostics[message.severity]}
                  message={linterMessageToString(message)}
                />
              </Box>
            ))
          }
        </Box>
      </Box>
    );
  }
  return <></>;
}