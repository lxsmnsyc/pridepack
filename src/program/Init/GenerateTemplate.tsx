/**
 * @license
 * MIT License
 *
 * Copyright (c) 2021 Lyon Software Technologies, Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import { Box, Spacer } from 'ink';
import React from 'react';

// Core
import getSafePackageName from '../core/get-safe-package-name';
import getCWDName from '../core/get-cwd-name';
import { pendingMessage, successMessage } from '../core/styled-messages';

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
        pending={pendingMessage('Generating', `template from '${template}'`)}
        success={successMessage('Generated', `template from '${template}'`)}
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
          sourceFile="pridepack.json"
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