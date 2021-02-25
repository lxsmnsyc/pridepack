import { Box, Spacer } from 'ink';
import React from 'react';

// Hooks
import { LoadableEvent, useLoadableRace } from '../utils/hooks/useLoadableEvent';

// Core
import getSafePackageName from '../core/get-safe-package-name';
import { pendingMessage, successMessage } from '../core/styled-messages';

// Components
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';
import InstallDependencies from './InstallDependencies';

export interface ManageDependenciesProps extends LoadableEvent<void, undefined> {
  template: string;
  packageName?: string;
}

const MAX_SUCCESS = 1;

export default function ManageDependencies(
  { template, packageName, ...props }: ManageDependenciesProps,
): JSX.Element {
  const directory = packageName
    ? getSafePackageName(packageName)
    : '.';

  const {
    status,
    onSuccess,
    onFailure,
  } = useLoadableRace(props, MAX_SUCCESS, [template, directory]);

  return (
    <Box flexDirection="column">
      <SuperDiagnosticMessage
        status={status}
        pending={pendingMessage('Managing', 'dependencies')}
        success={successMessage('Managed', 'dependencies')}
      />
      <Spacer />
      <Box flexDirection="column" marginLeft={2}>
        <InstallDependencies
          template={template}
          directory={directory}
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
      </Box>
    </Box>
  );
}