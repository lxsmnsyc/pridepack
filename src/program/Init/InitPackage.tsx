import { Box, Spacer } from 'ink';
import React from 'react';

// Hooks
import { LoadableEvent, useLoadableRace } from '../utils/hooks/useLoadableEvent';

// Components
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';
import Timer from '../utils/Timer';
import GenerateTemplate from './GenerateTemplate';
import ManageDependencies from './ManageDependencies';

export interface InitPackageProps extends LoadableEvent<void, undefined> {
  template: string;
}

const MAX_SUCCESS = 2;

export default function InitPackage(
  { template, ...props }: InitPackageProps,
): JSX.Element {
  const {
    status,
    onSuccess,
    onFailure,
  } = useLoadableRace(props, MAX_SUCCESS, [template]);

  return (
    <Box flexDirection="column">
      <SuperDiagnosticMessage
        status={status}
        pending={`pridepack init ${template}`}
        success={`pridepack init ${template}`}
        failure={`pridepack init ${template}`}
      />
      <Spacer />
      <Box flexDirection="column" marginLeft={2}>
        <GenerateTemplate
          template={template}
          onFailure={onFailure}
          onSuccess={onSuccess}
        />
        <Spacer />
        <ManageDependencies
          template={template}
          onFailure={onFailure}
          onSuccess={onSuccess}
        />
      </Box>
      <Spacer />
      <Timer status={status} />
    </Box>
  );
}