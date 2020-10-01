import React from 'react';

// Core
import createPackage from '../core/create-package';
import { pendingMessage, successMessage } from '../core/styled-messages';

// Hooks
import useAsyncMemo from '../utils/hooks/useAsyncMemo';
import useLoadableEvent, { LoadableEvent } from '../utils/hooks/useLoadableEvent';

// Components
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';

interface CreatePackageJSONProps extends LoadableEvent<void, Error>  {
  packageName: string;
  directory: string;
}

export default function CreatePackageJSON(
  { packageName, directory, ...props }: CreatePackageJSONProps,
): JSX.Element {
  const data = useAsyncMemo<void, Error>(
    () => createPackage(packageName, directory),
    [packageName, directory],
  );

  useLoadableEvent(props, data);

  return (
    <SuperDiagnosticMessage
      status={data.status}
      pending={pendingMessage('Generating', "'package.json'")}
      success={successMessage('Generated', "'package.json'")}
      failure={data.result ? data.result.message : undefined}
    />
  );
}