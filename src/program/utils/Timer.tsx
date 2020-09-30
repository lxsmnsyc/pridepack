import React, { useEffect } from 'react';
import { AsyncStatus } from './hooks/useAsyncMemo';
import useConstant from './hooks/useConstant';
import useForceUpdate from './hooks/useForceUpdate';
import SuperDiagnosticMessage from './SuperDiagnosticMessage';

interface TimerProps {
  status: AsyncStatus;
}

export default function Timer(
  { status }: TimerProps,
): JSX.Element {
  const startTime = useConstant(() => Date.now());

  const forceUpdate = useForceUpdate();

  useEffect(() => {
    if (status === 'pending') {
      const interval = setInterval(() => {
        forceUpdate();
      }, 100);

      return () => {
        clearInterval(interval);
      };
    }
    return undefined;
  }, [status]);

  const elapsed = `Time elapsed: ${(Date.now() - startTime) / 1000}s`;

  return (
    <SuperDiagnosticMessage
      status={status}
      pending={elapsed}
      success={elapsed}
      failure={elapsed}
    />
  );
}