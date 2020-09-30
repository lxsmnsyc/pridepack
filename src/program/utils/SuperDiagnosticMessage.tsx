import React from 'react';
import { DiagnosticCategory } from 'typescript';

// Hooks
import { AsyncStatus } from './hooks/useAsyncMemo';

// Components
import DiagnosticMessage from './DiagnosticMessage';
import IndefiniteMessage from './IndefiniteMessage';

const DEFAULT_FAILURE = 'Something went wrong...';

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
        message={success}
      />
    );
  }
  if (status === 'failure') {
    return (
      <DiagnosticMessage
        category={DiagnosticCategory.Error}
        message={failure ?? DEFAULT_FAILURE}
      />
    )
  }
  return (
    <IndefiniteMessage
      color="yellow"
      message={pending}
      type="dots"
    />
  );
}
