import React from 'react';
import { DiagnosticCategory } from 'typescript';

// Hooks
import { AsyncStatus } from './hooks/useAsyncMemo';

// Components
import DiagnosticMessage from './DiagnosticMessage';
import IndefiniteMessage from './IndefiniteMessage';
import chalk from 'chalk';

interface SuperDiagnosticMessageProps {
  status: AsyncStatus;
  pending: string;
  success: string;
  failure?: string;
}

export default function SuperDiagnosticMessage(
  { status, success, pending, failure }: SuperDiagnosticMessageProps,
): JSX.Element {
  if (status === 'success') {
    return (
      <DiagnosticMessage
        category={DiagnosticCategory.Message}
        message={chalk.green(success)}
      />
    );
  }
  if (status === 'failure') {
    return (
      <DiagnosticMessage
        category={DiagnosticCategory.Error}
        message={chalk.red(failure ?? pending)}
      />
    )
  }
  return (
    <IndefiniteMessage
      color="yellow"
      message={chalk.yellow(pending)}
      type="dots"
    />
  );
}
