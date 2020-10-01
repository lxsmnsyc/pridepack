import React from 'react';
import fs from 'fs-extra';

// Hooks
import useAsyncMemo from '../utils/hooks/useAsyncMemo';

// Core
import readConfigWithCWD from '../core/read-config-with-cwd';
import { commandTitle, pendingMessage, successMessage } from '../core/styled-messages';

// Components
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';
import { Box, Spacer } from 'ink';
import Timer from '../utils/Timer';


export default function Clean(): JSX.Element {
  const data = useAsyncMemo<void, Error>(
    () => fs.remove(readConfigWithCWD().outDir),
    [],
  );

  const title = commandTitle('clean');

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
          pending={pendingMessage('Cleaning', 'output directory')}
          success={successMessage('Cleaned', 'output directory')}
          failure={data.result ? data.result.message : undefined}
        />
      </Box>
      <Timer status={data.status} />
    </Box>
  );
}