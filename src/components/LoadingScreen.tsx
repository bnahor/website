import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  show: boolean;
  minDurationMs?: number;
}

export function LoadingScreen({ show, minDurationMs = 0 }: LoadingScreenProps) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    if (!show) {
      timeout = setTimeout(() => setVisible(false), minDurationMs);
    } else {
      setVisible(true);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [show, minDurationMs]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-brand/60 border-t-transparent animate-spin" />
          <div className="absolute inset-0 -z-10 blur-2xl rounded-full bg-brand/20" />
        </div>
        <div className="text-text-muted text-sm tracking-wide">
          Welcome…
        </div>
      </div>
    </div>
  );
}
