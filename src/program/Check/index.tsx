import React from 'react';
import { Box, Spacer } from 'ink';

// Hooks
import { LoadableEvent, useLoadableRace } from '../utils/hooks/useLoadableEvent';

// Core
import { commandTitle } from '../core/styled-messages';

// Components
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';
import Timer from '../utils/Timer';
import CompileTypes from '../Build/CompileTypes';

export interface CheckProps extends LoadableEvent<void, undefined> {
}

const MAX_SUCCESS = 1;

export default function Check(props: CheckProps): JSX.Element {
  const {
    status,
    onSuccess,
    onFailure,
  } = useLoadableRace(props, MAX_SUCCESS, []);

  const title = commandTitle('check');

  return (
    <Box flexDirection="column" marginLeft={2}>
      <SuperDiagnosticMessage
        status={status}
        pending={title}
        success={title}
        failure={title}
      />
      <Spacer />
      <Box flexDirection="column" marginLeft={2}>
        <CompileTypes
          noEmit={true}
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
      </Box>
      <Timer status={status} />
    </Box>
  );
}