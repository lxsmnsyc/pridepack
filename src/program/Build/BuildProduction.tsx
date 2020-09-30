import React from 'react';

// Hooks
import useAsyncMemo from '../utils/hooks/useAsyncMemo';
import useLoadableEvent, { LoadableEvent } from '../utils/hooks/useLoadableEvent';

// Core
import buildProduction from '../core/build-production';

// Components
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';

export interface BuildProductionProps extends LoadableEvent<void, Error> {
}

export default function BuildProduction(
  props: BuildProductionProps,
): JSX.Element {
  const data = useAsyncMemo<void, Error>(
    () => buildProduction(),
    [],
  );

  useLoadableEvent(props, data);

  return (
    <SuperDiagnosticMessage
      status={data.status}
      pending="Building CommonJS production build..."
      success="Built CommonJS production build."
      failure={data.result ? data.result.message : undefined}
    />
  );
}