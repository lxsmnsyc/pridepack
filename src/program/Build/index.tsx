import { Box, Spacer } from 'ink';
import React from 'react';

// Hooks
import { LoadableEvent, useLoadableRace } from '../utils/hooks/useLoadableEvent';

// Components
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';
import Timer from '../utils/Timer';
import BuildDevelopment from './BuildDevelopment';
import BuildEntry from './BuildEntry';
import BuildESM from './BuildESM';
import BuildProduction from './BuildProduction';
import CompileTypes from './CompileTypes';

export interface BuildProps extends LoadableEvent<void, undefined> {
}

const MAX_SUCCESS = 5;

export default function Build(
  props: BuildProps,
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
        pending="pridepack build"
        success="pridepack build"
        failure="pridepack build"
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
        <Spacer />
        <BuildESM
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