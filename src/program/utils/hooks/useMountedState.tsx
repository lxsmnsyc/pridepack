import { useEffect, useRef } from 'react';
import useConstantCallback from './useConstantCallback';

export default function useMountedState(): () => boolean {
  const lifecycle = useRef(false);
  
  useEffect(() => {
    lifecycle.current = true;
    return () => {
      lifecycle.current = false;
    };
  }, []);

  return useConstantCallback(() => lifecycle.current);
}
