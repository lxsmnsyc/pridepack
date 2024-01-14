import ts from 'typescript';
import { cyan, green, red, yellow } from '../core/colors';

interface DiagnosticDisplay {
  symbol: string;
  color: (value: string) => string;
}

interface DiagnosticDisplayOptions {
  [key: string]: DiagnosticDisplay;
}

const DIAGNOSTIC_DISPLAYS: DiagnosticDisplayOptions = {
  [ts.DiagnosticCategory.Error]: {
    symbol: '✖',
    color: red,
  },
  [ts.DiagnosticCategory.Message]: {
    symbol: '✔',
    color: green,
  },
  [ts.DiagnosticCategory.Suggestion]: {
    symbol: 'ℹ',
    color: cyan,
  },
  [ts.DiagnosticCategory.Warning]: {
    symbol: '⚠',
    color: yellow,
  },
};

export default function createDiagnosticMessage(
  category: ts.DiagnosticCategory,
  message: string,
): void {
  const display = DIAGNOSTIC_DISPLAYS[category];
  console.log(`${display.color(display.symbol)} ${message}`);
}
