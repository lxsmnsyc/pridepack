/**
 * @license
 * MIT License
 *
 * Copyright (c) 2020 Alexis Munsayac
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
 *
 *
 * @author Alexis Munsayac <alexis.munsayac@gmail.com>
 * @copyright Alexis Munsayac 2020
 */
import {
  DependencyList,
  MutableRefObject,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import useForceUpdate from './useForceUpdate';

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

export default function useFreshState<T>(
  initialState: RefreshStateInitial<T>,
  dependencies: DependencyList,
): [T, RefreshStateDispatch<T>] {
  const stateRef = useMemo<MutableRefObject<T>>(() => ({
    current: (
      isRefreshStateInitialAction(initialState)
        ? initialState()
        : initialState
    ),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), dependencies);

  const forceUpdate = useForceUpdate();

  const alive = useRef(false);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const setState: RefreshStateDispatch<T> = useCallback((action) => {
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
  }, [forceUpdate, stateRef]);

  return [stateRef.current, setState];
}
