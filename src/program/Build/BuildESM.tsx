import React from 'react';

// Hooks
import useAsyncMemo from '../utils/hooks/useAsyncMemo';
import useLoadableEvent, { LoadableEvent } from '../utils/hooks/useLoadableEvent';

// Core
import buildESM from '../core/build-esm';

// Components
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';

export interface BuildESMProps extends LoadableEvent<void, Error> {
}

export default function BuildESM(
  props: BuildESMProps,
): JSX.Element {
  const data = useAsyncMemo<void, Error>(
    () => buildESM(),
    [],
  );

  useLoadableEvent(props, data);

  return (
    <SuperDiagnosticMessage
      status={data.status}
      pending="Building ESM build..."
      success="Built ESM build."
      failure={data.result ? data.result.message : undefined}
    />
  );
}