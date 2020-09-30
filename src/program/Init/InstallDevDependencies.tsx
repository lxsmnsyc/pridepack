import React from 'react';

// Hooks
import useAsyncMemo from '../utils/hooks/useAsyncMemo';
import useLoadableEvent, { LoadableEvent } from '../utils/hooks/useLoadableEvent';

// Core
import { installDevDeps } from '../core/install-deps';

// Components
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';

export interface InstallDevDependenciesProps extends LoadableEvent<void, Error> {
  template: string;
  directory: string;
}

export default function InstallDevDependencies(
  { template, directory, ...props }: InstallDevDependenciesProps,
): JSX.Element {
  const data = useAsyncMemo<void, Error>(
    () => installDevDeps(template, directory),
    [template, directory],
  );

  useLoadableEvent(props, data);

  return (
    <SuperDiagnosticMessage
      status={data.status}
      pending={`Installing devDependencies...`}
      success={`Installed devDependencies.`}
      failure={data.result ? data.result.message : undefined}
    />
  );
}