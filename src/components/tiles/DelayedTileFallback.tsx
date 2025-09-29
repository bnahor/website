import { useEffect, useState } from 'react';
import { TileSkeleton } from './TileSkeleton';

interface DelayedTileFallbackProps {
  delayMs?: number;
}

export function DelayedTileFallback({ delayMs = 100 }: DelayedTileFallbackProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setVisible(true), delayMs);
    return () => window.clearTimeout(timeout);
  }, [delayMs]);

  if (!visible) return null;
  return <TileSkeleton />;
}
