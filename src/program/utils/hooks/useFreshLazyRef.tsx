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
import { DependencyList, MutableRefObject, useRef } from 'react';
import useLazyRef from './useLazyRef';

export function defaultCompare<R>(a: R, b: R): boolean {
  return !Object.is(a, b);
}

export function defaultCompareList(a: DependencyList, b: DependencyList): boolean {
  if (a.length !== b.length) {
    return true;
  }
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) {
      return true;
    }
  }
  return false;
}

export type MemoCompare<R> = (a: R, b: R) => boolean;

export default function useFreshLazyRef<T, R>(
  supplier: () => T,
  dependency: R,
  shouldUpdate: MemoCompare<R> = defaultCompare,
): MutableRefObject<T> {
  const value = useLazyRef(supplier);
  const prevDeps = useRef(dependency);

  if (shouldUpdate(prevDeps.current, dependency)) {
    value.current = supplier();
    prevDeps.current = dependency;
  }

  return value;
}
