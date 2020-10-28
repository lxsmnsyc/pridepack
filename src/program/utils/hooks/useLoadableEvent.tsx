import { DependencyList, useEffect } from 'react';

import { AsyncMemo } from './useAsyncMemo';
import useCallbackCondition from './useCallbackCondition';
import { defaultCompareList } from './useFreshLazyRef';
import useFreshState from './useFreshState';
import useMemoCondition from './useMemoCondition';

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
    defaultCompareList,
  );
  const [hasError, setHasError] = useFreshState(
    () => false,
    dependency,
    defaultCompareList,
  );

  const onSuccess = useCallbackCondition(() => {
    setSuccess((current) => {
      if (current < maxSuccess) {
        return current + 1;
      }
      return current;
    });
  }, [maxSuccess, setSuccess], defaultCompareList);

  const onFailure = useCallbackCondition(() => {
    setHasError(true);
  }, setHasError);

  const loadable = useMemoCondition(
    () => convertToLoadable(
      success,
      hasError,
      maxSuccess,
    ),
    [success, hasError, maxSuccess],
    defaultCompareList,
  );

  useLoadableEvent(props, loadable);

  return {
    status: loadable.status,
    onSuccess,
    onFailure,
  };
}
