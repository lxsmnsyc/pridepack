import { useState } from 'react';
import useConstantCallback from './useConstantCallback';

export type RemountKey = 'versionA' | 'versionB';
export type Remount = () => void;

export default function useRemount(): [RemountKey, Remount] {
  const [state, setState] = useState(false);

  const remount = useConstantCallback(() => {
    setState((current) => !current);
  });

  return [state ? 'versionA' : 'versionB', remount];
}