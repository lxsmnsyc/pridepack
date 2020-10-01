import { Box, Spacer } from 'ink';
import React from 'react';
import { commandTitle } from '../core/styled-messages';

// Hooks
import { LoadableEvent, useLoadableRace } from '../utils/hooks/useLoadableEvent';

// Components
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';
import Timer from '../utils/Timer';
import BuildEntry from './BuildEntry';
import BuildOutput from './BuildOutput';
import CompileTypes from './CompileTypes';

export interface BuildProps extends LoadableEvent<void, undefined> {
}

const MAX_SUCCESS = 3;

export default function Build(
  props: BuildProps,
): JSX.Element {
  const {
    status,
    onSuccess,
    onFailure,
  } = useLoadableRace(props, MAX_SUCCESS, []);

  const title = commandTitle('build');

  return (
    <Box flexDirection="column">
      <SuperDiagnosticMessage
        status={status}
        pending={title}
        success={title}
        failure={title}
      />
      <Spacer />
      <Box flexDirection="column" marginLeft={2}>
        <BuildOutput
          onFailure={onFailure}
          onSuccess={onSuccess}
        />
        <Spacer />
        <BuildEntry
          onFailure={onFailure}
          onSuccess={onSuccess}
        />
        <Spacer />
        <CompileTypes
          noEmit={false}
          onFailure={onFailure}
          onSuccess={onSuccess}
        />
      </Box>
      <Spacer />
      <Timer status={status} />
    </Box>
  );
}