import { Box, Spacer } from 'ink';
import React from 'react';

// Core
import getSafePackageName from '../core/get-safe-package-name';
import getCWDName from '../../utils/get-cwd-name';

// Hooks
import { LoadableEvent, useLoadableRace } from '../utils/hooks/useLoadableEvent';

// Components
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';
import CreatePackageJSON from './CreatePackageJSON';
import GenerateBaseTemplate from './GenerateBaseTemplate';
import GenerateFileFromTemplate from './GenerateFileFromTemplate';
import GenerateTSConfig from './GenerateTSConfig';

export interface GenerateTemplateProps extends LoadableEvent<void, undefined> {
  template: string;
  packageName?: string;
}

const MAX_SUCCESS = 6;

export default function GenerateTemplate(
  { template, packageName, ...props }: GenerateTemplateProps,
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
        pending={`Generating template from '${template}'...`}
        success={`Generated template from '${template}'.`}
      />
      <Spacer />
      <Box flexDirection="column" marginLeft={2}>
        <CreatePackageJSON
          packageName={packageName ?? getCWDName()}
          directory={directory}
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
        <Spacer />
        <GenerateFileFromTemplate
          template={template}
          directory={directory}
          sourceFile="_gitignore"
          targetFile=".gitignore"
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
        <Spacer />
        <GenerateFileFromTemplate
          template={template}
          directory={directory}
          sourceFile=".pridepackrc"
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
        <Spacer />
        <GenerateFileFromTemplate
          template={template}
          directory={directory}
          sourceFile=".eslintrc"
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
        <Spacer />
        <GenerateTSConfig
          template={template}
          directory={directory}
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
        <Spacer />
        <GenerateBaseTemplate
          template={template}
          directory={directory}
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
      </Box>
    </Box>
  );
}