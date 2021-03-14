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
import { useEffect, useRef } from 'react';
import useConstantCallback from './useConstantCallback';
import useForceUpdate from './useForceUpdate';
import useFreshLazyRef, { defaultCompare, MemoCompare } from './useFreshLazyRef';

export type RefreshStateInitialAction<T> = () => T;
export type RefreshStateInitial<T> = T | RefreshStateInitialAction<T>;

function isRefreshStateInitialAction<T>(
  initial: RefreshStateInitial<T>,
): initial is RefreshStateInitialAction<T> {
  return typeof initial === 'function';
}

export type RefreshStateAction<T> = (prev: T) => T;
export type RefreshStateSetState<T> = T | RefreshStateAction<T>;
export type RefreshStateDispatch<T> = (action: RefreshStateSetState<T>) => void;

function isRefreshStateAction<T>(
  state: RefreshStateSetState<T>,
): state is RefreshStateAction<T> {
  return typeof state === 'function';
}

export default function useFreshState<T, R>(
  initialState: RefreshStateInitial<T>,
  dependencies: R,
  shouldUpdate: MemoCompare<R> = defaultCompare,
): [T, RefreshStateDispatch<T>] {
  const stateRef = useFreshLazyRef<T, R>(
    () => (
      isRefreshStateInitialAction(initialState)
        ? initialState()
        : initialState
    ),
    dependencies,
    shouldUpdate,
  );

  const forceUpdate = useForceUpdate();

  const alive = useRef(false);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const setState: RefreshStateDispatch<T> = useConstantCallback(
    (action) => {
      if (alive.current) {
        const { current } = stateRef;
        const newState = (
          isRefreshStateAction(action)
            ? action(current)
            : action
        );

        if (!Object.is(current, newState)) {
          stateRef.current = newState;
          forceUpdate();
        }
      }
    },
  );

  return [stateRef.current, setState];
}
