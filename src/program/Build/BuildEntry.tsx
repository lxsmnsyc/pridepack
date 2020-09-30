import React from 'react';

// Hooks
import useAsyncMemo from '../utils/hooks/useAsyncMemo';
import useLoadableEvent, { LoadableEvent } from '../utils/hooks/useLoadableEvent';

// Core
import buildEntry from '../core/build-entry';

// Components
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';

export interface BuildEntryProps extends LoadableEvent<void, Error> {
}

export default function BuildEntry(
  props: BuildEntryProps,
): JSX.Element {
  const data = useAsyncMemo<void, Error>(
    () => buildEntry(),
    [],
  );

  useLoadableEvent(props, data);

  return (
    <SuperDiagnosticMessage
      status={data.status}
      pending="Building package entrypoint..."
      success="Built package entrypoint."
      failure={data.result ? data.result.message : undefined}
    />
  );
}