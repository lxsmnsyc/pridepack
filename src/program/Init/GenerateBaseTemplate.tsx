import { Box, Spacer } from 'ink';
import React from 'react';

// Hooks
import { LoadableEvent, useLoadableRace } from '../utils/hooks/useLoadableEvent';

// Components
import GenerateFileFromTemplate from './GenerateFileFromTemplate';
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';

export interface GenerateBaseTemplateProps extends LoadableEvent<void, undefined> {
  template: string;
  directory: string;
}

const MAX_SUCCESS = 2;

export default function GenerateBaseTemplate(
  { template, directory, ...props }: GenerateBaseTemplateProps,
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
        pending="Generating base template..."
        success="Generated base template."
      />
      <Spacer />
      <Box flexDirection="column" marginLeft={2}>
        <GenerateFileFromTemplate
          template={template}
          directory={directory}
          sourceFile="src"
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
        <Spacer />
        <GenerateFileFromTemplate
          template={template}
          directory={directory}
          sourceFile="test"
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
      </Box>
    </Box>
  );
}