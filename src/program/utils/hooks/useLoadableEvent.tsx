/**
 * @license
 * MIT License
 *
 * Copyright (c) 2021 Lyon Software Technologies, Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
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
