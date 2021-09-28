import chalk from 'chalk';
import { Message } from 'esbuild';
import ts from 'typescript';
import createDiagnosticMessage from './create-diagnostic-message';

function createEsbuildDiagnosticString(message: Message): string {
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

export default function generateESBuildDiagnostics(isWarning: boolean, messages: Message[]): void {
  for (let i = 0, len = messages.length; i < len; i += 1) {
    createDiagnosticMessage(
      isWarning ? ts.DiagnosticCategory.Warning : ts.DiagnosticCategory.Error,
      createEsbuildDiagnosticString(messages[i]),
    );
  }
}
