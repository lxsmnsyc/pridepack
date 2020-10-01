import { Box, Spacer } from 'ink';
import React from 'react';

// Hooks
import { LoadableEvent, useLoadableRace } from '../utils/hooks/useLoadableEvent';

// Components
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';
import BuildDevelopment from './BuildDevelopment';
import BuildProduction from './BuildProduction';

import { pendingMessage, successMessage } from '../core/styled-messages';

export interface BuildCJSProps extends LoadableEvent<void, undefined> {
}

const MAX_SUCCESS = 2;

export default function BuildCJS(
  props: BuildCJSProps,
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
        pending={pendingMessage('Generating', 'CommonJS build')}
        success={successMessage('Generated', 'CommonJS build')}
      />
      <Spacer />
      <Box flexDirection="column" marginLeft={2}>
        <BuildDevelopment
          onFailure={onFailure}
          onSuccess={onSuccess}
        />
        <Spacer />
        <BuildProduction
          onFailure={onFailure}
          onSuccess={onSuccess}
        />
      </Box>
      <Spacer />
    </Box>
  );
}