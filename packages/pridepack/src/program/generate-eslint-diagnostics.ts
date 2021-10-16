import chalk from 'chalk';
import { ESLint, Linter } from 'eslint';
import path from 'path';
import ts from 'typescript';
import createDiagnosticMessage from './create-diagnostic-message';

type SeverityMap = Record<Linter.Severity, ts.DiagnosticCategory>;

const diagnostics: SeverityMap = {
  0: ts.DiagnosticCategory.Message,
  1: ts.DiagnosticCategory.Warning,
  2: ts.DiagnosticCategory.Error,
};

function createESLintString(file: string, message: Linter.LintMessage): string {
  const baseMessage = message.message;
  const rule = chalk.blue(message.ruleId ? ` [${message.ruleId}]` : '');
  const line = chalk.yellow(message.line);
  const column = chalk.yellow(message.column);
  return `${chalk.blue(file)} (${line}, ${column}): ${baseMessage}${rule}`;
}

export default function generateESLintDiagnostics(results: ESLint.LintResult[]): void {
  for (let r = 0, rlen = results.length; r < rlen; r += 1) {
    const result = results[r];
    const file = path.relative(process.cwd(), result.filePath);
    for (let i = 0, len = result.messages.length; i < len; i += 1) {
      const message = result.messages[i];
      createDiagnosticMessage(
        diagnostics[message.severity],
        createESLintString(file, message),
      );
    }
  }
}
