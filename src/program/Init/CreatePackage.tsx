import { Box, Spacer } from 'ink';
import React from 'react';
import { commandTitle } from '../core/styled-messages';

// Hooks
import { LoadableEvent, useLoadableRace } from '../utils/hooks/useLoadableEvent';

// Components
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';
import Timer from '../utils/Timer';
import GenerateTemplate from './GenerateTemplate';
import ManageDependencies from './ManageDependencies';

export interface CreatePackageProps extends LoadableEvent<void, undefined> {
  template: string;
  packageName: string;
}

const MAX_SUCCESS = 2;

export default function CreatePackage(
  { template, packageName, ...props }: CreatePackageProps,
): JSX.Element {
  const {
    status,
    onSuccess,
    onFailure,
  } = useLoadableRace(props, MAX_SUCCESS, [template]);

  const title = commandTitle('create', packageName, template);

  return (
    <Box flexDirection="column" marginLeft={2}>
      <SuperDiagnosticMessage
        status={status}
        pending={title}
        success={title}
        failure={title}
      />
      <Box flexDirection="column" marginLeft={2}>
        <GenerateTemplate
          template={template}
          packageName={packageName}
          onFailure={onFailure}
          onSuccess={onSuccess}
        />
        <ManageDependencies
          template={template}
          packageName={packageName}
          onFailure={onFailure}
          onSuccess={onSuccess}
        />
      </Box>
      <Spacer />
      <Timer status={status} />
    </Box>
  );
}
