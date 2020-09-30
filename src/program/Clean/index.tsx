import React from 'react';
import fs from 'fs-extra';

// Hooks
import useAsyncMemo from '../utils/hooks/useAsyncMemo';

// Core
import readConfigWithCWD from '../core/read-config-with-cwd';

// Components
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';
import { Box, Spacer } from 'ink';
import Timer from '../utils/Timer';


export default function Clean(): JSX.Element {
  const data = useAsyncMemo<void, Error>(
    () => fs.remove(readConfigWithCWD().outDir),
    [],
  );

  return (
    <Box flexDirection="column" marginLeft={2}>
      <SuperDiagnosticMessage
        status={data.status}
        pending="pridepack clean"
        success="pridepack clean"
        failure="pridepack clean"
      />
      <Spacer />
      <Box flexDirection="column" marginLeft={2}>
        <SuperDiagnosticMessage
          status={data.status}
          pending={`Cleaning output directory...`}
          success={`Cleaned output directory.`}
          failure={data.result ? data.result.message : undefined}
        />
      </Box>
      <Timer status={data.status} />
    </Box>
  );
}