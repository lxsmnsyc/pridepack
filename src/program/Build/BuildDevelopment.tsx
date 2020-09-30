import React from 'react';

// Hooks
import useAsyncMemo from '../utils/hooks/useAsyncMemo';
import useLoadableEvent, { LoadableEvent } from '../utils/hooks/useLoadableEvent';

// Core
import buildDevelopment from '../core/build-development';

// Components
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';

export interface BuildDevelopmentProps extends LoadableEvent<void, Error> {
}

export default function BuildDevelopment(
  props: BuildDevelopmentProps,
): JSX.Element {
  const data = useAsyncMemo<void, Error>(
    () => buildDevelopment(),
    [],
  );

  useLoadableEvent(props, data);

  return (
    <SuperDiagnosticMessage
      status={data.status}
      pending="Building CommonJS development build..."
      success="Built CommonJS development build."
      failure={data.result ? data.result.message : undefined}
    />
  );
}