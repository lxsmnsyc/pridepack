import { DependencyList, useCallback, useEffect, useState } from 'react';
import useMountedState from './useMountedState';

export interface AsyncSuccess<T> {
  status: 'success';
  result: T;
}

export interface AsyncFailure<E> {
  status: 'failure';
  result: E;
}

export interface AsyncPending {
  status: 'pending';
  result: undefined;
}

export type AsyncMemo<T, E> = AsyncSuccess<T> | AsyncFailure<E> | AsyncPending;
export type AsyncStatus = 'pending' | 'failure' | 'success';

export default function useAsyncMemo<T, E>(
  effect: () => Promise<T>,
  dependencies: DependencyList,
): AsyncMemo<T, E> {
  const [state, setState] = useState<AsyncMemo<T, E>>({
    status: 'pending',
    result: undefined,
  });
 
  const isMounted = useMountedState();

  const memoizedEffect = useCallback(effect, dependencies);

  useEffect(() => {
    setState({
      status: 'pending',
      result: undefined,
    });

    memoizedEffect().then(
      (result) => {
        if (isMounted()) {
          setState({
            status: 'success',
            result,
          });
        }
      },
      (result) => {
        if (isMounted()) {
          setState({
            status: 'failure',
            result,
          });
        }
      },
    );
  }, [memoizedEffect, isMounted]);

  return state;
}