import React from 'react';
import { Box } from 'ink';
import { Diagnostic } from 'typescript';

// Hooks
import useAsyncMemo from '../utils/hooks/useAsyncMemo';
import useLoadableEvent, { LoadableEvent } from '../utils/hooks/useLoadableEvent';

// Core
import compileTypes from '../core/compile-types';
import { pendingMessage, successMessage } from '../core/styled-messages';

// Components
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';
import CompileTypesDiagnostics from './CompileTypesDiagnostics';

export interface CompileTypesProps extends LoadableEvent<Diagnostic[], Error> {
  noEmit: boolean;
}

export default function CompileTypes(
  { noEmit, ...props}: CompileTypesProps,
): JSX.Element {
  const data = useAsyncMemo<Diagnostic[], Error>(
    () => compileTypes(noEmit),
    [],
  );

  useLoadableEvent(props, data);

  return (
    <Box flexDirection="column">
      <SuperDiagnosticMessage
        status={data.status}
        pending={pendingMessage('Compiling', 'type declarations')}
        success={successMessage('Compiled', 'type declarations')}
        failure={(data.result && data.result instanceof Error ) ? data.result.message : undefined}
      />
      {
        data.status === 'success' && (
          <CompileTypesDiagnostics diagnostics={data.result} />
        )
      }
    </Box>
  );
}