import path from 'node:path';
import ts from 'typescript';
import { blue, yellow } from '../core/colors';
import createDiagnosticMessage from './create-diagnostic-message';

function createTSDiagnosticString(diagnostic: ts.Diagnostic): string {
  const baseMessage = ts.flattenDiagnosticMessageText(
    diagnostic.messageText,
    '\n',
  );
  if (diagnostic.file && diagnostic.start) {
    const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
      diagnostic.start,
    );
    const fileName = path.relative(process.cwd(), diagnostic.file.fileName);
    const file = blue(fileName);
    const styledLine = yellow(`${line + 1}`);
    const column = yellow(`${character + 1}`);
    return `${file} (${styledLine}, ${column}): ${baseMessage}`;
  }

  return baseMessage;
}

export default function generateTSDiagnostics(messages: ts.Diagnostic[]): void {
  for (let i = 0, len = messages.length; i < len; i += 1) {
    createDiagnosticMessage(
      messages[i].category,
      createTSDiagnosticString(messages[i]),
    );
  }
}
