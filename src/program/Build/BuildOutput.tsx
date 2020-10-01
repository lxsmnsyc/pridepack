import { Box, Spacer } from 'ink';
import React from 'react';

// Hooks
import { LoadableEvent, useLoadableRace } from '../utils/hooks/useLoadableEvent';

// Core
import { pendingMessage, successMessage } from '../core/styled-messages';

// Components
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';
import BuildESM from './BuildESM';
import BuildCJS from './BuildCJS';

export interface BuildOutputProps extends LoadableEvent<void, undefined> {
}

const MAX_SUCCESS = 2;

export default function BuildOutput(
  props: BuildOutputProps,
): JSX.Element {
  const {
    status,
    onSuccess,
    onFailure,
  } = useLoadableRace(props, MAX_SUCCESS, []);

  return (
    <Box flexDirection="column">
      <SuperDiagnosticMessage
        status={status}
        pending={pendingMessage('Generating', 'builds')}
        success={successMessage('Generated', 'builds')}
      />
      <Spacer />
      <Box flexDirection="column" marginLeft={2}>
        <BuildCJS
          onFailure={onFailure}
          onSuccess={onSuccess}
        />
        <Spacer />
        <BuildESM
          onFailure={onFailure}
          onSuccess={onSuccess}
        />
      </Box>
      <Spacer />
    </Box>
  );
}