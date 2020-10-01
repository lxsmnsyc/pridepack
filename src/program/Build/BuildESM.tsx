import React from 'react';
import { Box } from 'ink';
import { BuildResult, BuildFailure } from 'esbuild';

// Hooks
import useAsyncMemo from '../utils/hooks/useAsyncMemo';
import useLoadableEvent, { LoadableEvent } from '../utils/hooks/useLoadableEvent';

// Core
import buildESM from '../core/build-esm';
import { pendingMessage, successMessage } from '../core/styled-messages';

// Components
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';
import BuildResultDiagnostics from './BuildResultDiagnostics';

export interface BuildESMProps extends LoadableEvent<BuildResult, BuildFailure> {
}

export default function BuildESM(
  props: BuildESMProps,
): JSX.Element {
  const data = useAsyncMemo<BuildResult, BuildFailure>(
    () => buildESM(),
    [],
  );

  useLoadableEvent(props, data);

  return (
    <Box flexDirection="column">
      <SuperDiagnosticMessage
        status={data.status}
        pending={pendingMessage('Generating', 'ESM build')}
        success={successMessage('Generated', 'ESM build')}
      />
      {
        data.status === 'success' && (
          <BuildResultDiagnostics
            messages={data.result.warnings}
            isWarning
          />
        )
      }
      {
        data.status === 'failure' && (
          <>
            <BuildResultDiagnostics
              messages={data.result.errors}
            />
            <BuildResultDiagnostics
              messages={data.result.warnings}
            />
          </>
        )
      }
    </Box>
  );
}