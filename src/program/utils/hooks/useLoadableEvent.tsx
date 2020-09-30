import { DependencyList, useCallback, useEffect, useMemo } from 'react';

import { AsyncMemo } from './useAsyncMemo';
import useFreshState from './useFreshState';

export interface LoadableEvent<T, E> {
  onPending?: () => void;
  onSuccess?: (result: T) => void;
  onFailure?: (result: E) => void;
}

interface LoadableRace {
  status: 'pending' | 'failure' | 'success';
  onSuccess: () => void;
  onFailure: () => void;
}

export function convertToLoadable(
  success: number,
  hasError: boolean,
  maxSuccess: number,
): AsyncMemo<void, undefined> {
  if (success >= maxSuccess) {
    return {
      status: 'success',
      result: undefined,
    };
  }
  if (hasError) {
    return {
      status: 'failure',
      result: undefined,
    };
  }
  return {
    status: 'pending',
    result: undefined,
  }
}

export default function useLoadableEvent<T, E>(
  { onPending, onSuccess, onFailure }: LoadableEvent<T, E>,
  data: AsyncMemo<T, E>,
) {
  useEffect(() => {
    if (data.status === 'pending' && onPending) {
      onPending();
    }
    if (data.status === 'failure' && onFailure) {
      onFailure(data.result);
    }
    if (data.status === 'success' && onSuccess) {
      onSuccess(data.result);
    }
  }, [data]);
}

export function useLoadableRace(
  props: LoadableEvent<void, undefined>,
  maxSuccess: number,
  dependency: DependencyList,
): LoadableRace {
  const [success, setSuccess] = useFreshState(
    () => 0,
    dependency,
  );
  const [hasError, setHasError] = useFreshState(
    () => false,
    dependency,
  );

  const onSuccess = useCallback(() => {
    setSuccess((current) => {
      if (current < maxSuccess) {
        return current + 1;
      }
      return current;
    });
  }, [maxSuccess, setSuccess]);

  const onFailure = useCallback(() => {
    setHasError(true);
  }, [setHasError]);

  const loadable = useMemo(
    () => convertToLoadable(
      success,
      hasError,
      maxSuccess,
    ),
    [success, hasError, maxSuccess],
  );

  useLoadableEvent(props, loadable);

  return {
    status: loadable.status,
    onSuccess,
    onFailure,
  };
}
