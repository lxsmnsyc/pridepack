import { Box, Spacer } from 'ink';
import React from 'react';
import { pendingMessage, successMessage } from '../core/styled-messages';

// Hooks
import { LoadableEvent, useLoadableRace } from '../utils/hooks/useLoadableEvent';

// Components
import GenerateFileFromTemplate from './GenerateFileFromTemplate';
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';

export interface GenerateTSConfigProps extends LoadableEvent<void, undefined> {
  template: string;
  directory: string;
}

const MAX_SUCCESS = 2;

export default function GenerateTSConfig(
  { template, directory, ...props }: GenerateTSConfigProps,
): JSX.Element {
  const {
    status,
    onSuccess,
    onFailure,
  } = useLoadableRace(props, MAX_SUCCESS, [template, directory]);

  return (
    <Box flexDirection="column">
      <SuperDiagnosticMessage
        status={status}
        pending={pendingMessage('Generating', 'tsconfig files')}
        success={successMessage('Generated', 'tsconfig files')}
      />
      <Spacer />
      <Box flexDirection="column" marginLeft={2}>
        <GenerateFileFromTemplate
          template={template}
          directory={directory}
          sourceFile="tsconfig.json"
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
        <Spacer />
        <GenerateFileFromTemplate
          template={template}
          directory={directory}
          sourceFile="tsconfig.eslint.json"
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
      </Box>
    </Box>
  );
}