import { useEffect, useRef } from 'react';

/**
 * Returns true only during a component's first render.
 * Useful for disabling entrance animations until after the initial paint.
 */
export function useIsFirstRender() {
  const isFirst = useRef(true);

  useEffect(() => {
    isFirst.current = false;
  }, []);

  return isFirst.current;
}
