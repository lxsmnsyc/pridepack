import React from 'react';
import { BuildFailure, BuildResult } from 'esbuild';
import { Box } from 'ink';

// Hooks
import useAsyncMemo from '../utils/hooks/useAsyncMemo';
import useLoadableEvent, { LoadableEvent } from '../utils/hooks/useLoadableEvent';

// Core
import buildDevelopment from '../core/build-development';
import { pendingMessage, successMessage } from '../core/styled-messages';

// Components
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';
import BuildResultDiagnostics from './BuildResultDiagnostics';

export interface BuildDevelopmentProps extends LoadableEvent<BuildResult, BuildFailure> {
}

export default function BuildDevelopment(
  props: BuildDevelopmentProps,
): JSX.Element {
  const data = useAsyncMemo<BuildResult, BuildFailure>(
    () => buildDevelopment(),
    [],
  );

  useLoadableEvent(props, data);

  return (
    <Box flexDirection="column">
      <SuperDiagnosticMessage
        status={data.status}
        pending={pendingMessage('Generating', 'CommonJS development build')}
        success={successMessage('Generated', 'CommonJS development build')}
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