import React from 'react';

// Hooks
import useAsyncMemo from '../utils/hooks/useAsyncMemo';
import useLoadableEvent, { LoadableEvent } from '../utils/hooks/useLoadableEvent';

// Core
import copyFromTemplate from '../core/copy-from-template';

// Components
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';

export interface GenerateFileProps extends LoadableEvent<void, Error> {
  template: string;
  directory: string;
  sourceFile: string;
  targetFile?: string;
}

export default function GenerateFileFromTemplate(
  {
    template,
    directory,
    sourceFile,
    targetFile = sourceFile,
    ...props
  }: GenerateFileProps,
): JSX.Element {
  const data = useAsyncMemo<void, Error>(
    () => copyFromTemplate(template, directory, sourceFile, targetFile),
    [template, directory, sourceFile, targetFile],
  );

  useLoadableEvent(props, data);

  return (
    <SuperDiagnosticMessage
      status={data.status}
      pending={`Generating '${targetFile}'...`}
      success={`Generated '${targetFile}'.`}
      failure={data.result ? data.result.message : undefined}
    />
  );
}