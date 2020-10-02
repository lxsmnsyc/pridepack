import React from 'react';
import { Box, Spacer } from 'ink';

// Hooks
import useAsyncMemo from '../utils/hooks/useAsyncMemo';

// Core
import { commandTitle, pendingMessage, successMessage } from '../core/styled-messages';
import runJest from '../core/run-jest';

// Components
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';
import Timer from '../utils/Timer';

export default function Test(): JSX.Element {
  const data = useAsyncMemo<void, Error>(
    () => runJest(process.argv.slice(3)),
    [],
  );

  const title = commandTitle('jest');

  return (
    <Box flexDirection="column" marginLeft={2}>
      <SuperDiagnosticMessage
        status={data.status}
        pending={title}
        success={title}
        failure={title}
      />
      <Spacer />
      <Box flexDirection="column" marginLeft={2}>
        <SuperDiagnosticMessage
          status={data.status}
          pending={pendingMessage('Running', 'tests')}
          success={successMessage('Ran', 'tests')}
          failure={data.result ? data.result.message : undefined}
        />
      </Box>
      <Timer status={data.status} />
    </Box>
  );
}