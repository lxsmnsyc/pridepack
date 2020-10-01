import React from 'react';

// Hooks
import useAsyncMemo from '../utils/hooks/useAsyncMemo';
import useLoadableEvent, { LoadableEvent } from '../utils/hooks/useLoadableEvent';

// Core
import { installDeps } from '../core/install-deps';
import { pendingMessage, successMessage } from '../core/styled-messages';

// Components
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';

export interface InstallDependenciesProps extends LoadableEvent<void, Error> {
  template: string;
  directory: string;
}

export default function InstallDependencies(
  { template, directory, ...props }: InstallDependenciesProps,
): JSX.Element {
  const data = useAsyncMemo<void, Error>(
    () => installDeps(template, directory),
    [template, directory],
  );

  useLoadableEvent(props, data);

  return (
    <SuperDiagnosticMessage
      status={data.status}
      pending={pendingMessage('Installing', 'dependencies')}
      success={successMessage('Installed', 'dependencies')}
      failure={data.result ? data.result.message : undefined}
    />
  );
}