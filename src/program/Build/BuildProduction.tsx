import React from 'react';
import { Box } from 'ink';
import { BuildResult, BuildFailure } from 'esbuild';

// Hooks
import useAsyncMemo from '../utils/hooks/useAsyncMemo';
import useLoadableEvent, { LoadableEvent } from '../utils/hooks/useLoadableEvent';

// Core
import buildProduction from '../core/build-production';

// Components
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';
import BuildResultDiagnostics from './BuildResultDiagnostics';
import { pendingMessage } from '../core/styled-messages';

export interface BuildProductionProps extends LoadableEvent<BuildResult, BuildFailure> {
}

export default function BuildProduction(
  props: BuildProductionProps,
): JSX.Element {
  const data = useAsyncMemo<BuildResult, BuildFailure>(
    () => buildProduction(),
    [],
  );

  useLoadableEvent(props, data);

  return (
    <Box flexDirection="column">
      <SuperDiagnosticMessage
        status={data.status}
        pending={pendingMessage('Generating', 'CommonJS production build')}
        success={pendingMessage('Generated', 'CommonJS production build')}
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