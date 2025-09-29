import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const WORKER_PATH = new URL('../workers/planeNoiseWorker.ts', import.meta.url);

const supportsOffscreenCanvas = () => {
  if (typeof window === 'undefined') return false;
  return (
    'OffscreenCanvas' in window &&
    typeof HTMLCanvasElement !== 'undefined' &&
    'transferControlToOffscreen' in HTMLCanvasElement.prototype
  );
};

const usePrefersReducedMotion = () => {
  const [prefers, setPrefers] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefers(media.matches);

    const handler = (event: MediaQueryListEvent) => setPrefers(event.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  return prefers;
};

export function PlaneNoiseBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const rafRef = useRef<number | null>(null);
  const tileNodesRef = useRef<HTMLElement[]>([]);
  const tileCentersBufferRef = useRef<Float32Array | null>(null);
  const tileCountRef = useRef(0);
  const isVisibleRef = useRef(false);
  const pendingTileUpdateRef = useRef<number | null>(null);
  const [dims, setDims] = useState(() => ({ w: 0, h: 0 }));

  const prefersReducedMotion = usePrefersReducedMotion();

  const hasOffscreen = useMemo(() => supportsOffscreenCanvas(), []);

  const stopLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const sendFrame = useCallback(
    (timestamp: number) => {
      const worker = workerRef.current;
      if (!worker || !isVisibleRef.current) {
        rafRef.current = null;
        return;
      }

      const tileCenters = tileCentersBufferRef.current;
      worker.postMessage({
        type: 'frame',
        now: timestamp,
        tileCenters: tileCenters ?? null,
        tileCount: tileCountRef.current,
      });

      rafRef.current = requestAnimationFrame(sendFrame);
    },
    []
  );

  const startLoop = useCallback(() => {
    if (rafRef.current !== null || !workerRef.current) return;
    rafRef.current = requestAnimationFrame(sendFrame);
  }, [sendFrame]);

  const applyTileUpdates = useCallback((buffer: ArrayBuffer) => {
    const nodes = tileNodesRef.current;
    if (!nodes.length) return;

    const values = new Float32Array(buffer);
    if (values.length / 4 !== nodes.length) return;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const base = i * 4;
      node.style.setProperty('--caustic-noise', values[base].toFixed(3));
      node.style.setProperty('--caustic-off-x', `${values[base + 1].toFixed(2)}px`);
      node.style.setProperty('--caustic-off-y', `${values[base + 2].toFixed(2)}px`);
      node.style.setProperty('--caustic-scale', values[base + 3].toFixed(3));
    }
  }, []);

  const computeTileCenters = useCallback(() => {
    const tiles = Array.from(
      document.querySelectorAll<HTMLElement>('.glass-tile, .glass-inner')
    );
    tileNodesRef.current = tiles;

    if (!tiles.length) {
      tileCentersBufferRef.current = null;
      tileCountRef.current = 0;
      return;
    }

    const centers = new Float32Array(tiles.length * 2);
    tiles.forEach((tile, index) => {
      const rect = tile.getBoundingClientRect();
      centers[index * 2] = rect.left + rect.width * 0.5;
      centers[index * 2 + 1] = rect.top + rect.height * 0.5;
    });

    tileCentersBufferRef.current = centers;
    tileCountRef.current = tiles.length;
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      stopLoop();
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    }
  }, [prefersReducedMotion, stopLoop]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateDims = () => {
      setDims({ w: window.innerWidth, h: window.innerHeight });
    };

    updateDims();
    const handleResize = () => {
      requestAnimationFrame(updateDims);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    computeTileCenters();
    const deferred = window.setTimeout(() => computeTileCenters(), 250);

    const handleScrollOrResize = () => {
      if (pendingTileUpdateRef.current !== null) return;
      pendingTileUpdateRef.current = requestAnimationFrame(() => {
        pendingTileUpdateRef.current = null;
        computeTileCenters();
      });
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
      if (pendingTileUpdateRef.current !== null) {
        cancelAnimationFrame(pendingTileUpdateRef.current);
        pendingTileUpdateRef.current = null;
      }
      window.clearTimeout(deferred);
    };
  }, [computeTileCenters]);

  useEffect(() => {
    if (!hasOffscreen || prefersReducedMotion) return;
    if (!canvasRef.current) return;
    if (dims.w === 0 || dims.h === 0) return;
    if (workerRef.current) return;

    const worker = new Worker(WORKER_PATH, { type: 'module' });
    const canvasEl = canvasRef.current;
    const offscreen = canvasEl.transferControlToOffscreen();
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);

    worker.postMessage(
      {
        type: 'init',
        canvas: offscreen,
        width: dims.w,
        height: dims.h,
        dpr,
      },
      [offscreen]
    );

    const handleMessage = (event: MessageEvent<{ type: string; updates?: ArrayBuffer }>) => {
      if (event.data.type === 'tileUpdate' && event.data.updates) {
        applyTileUpdates(event.data.updates);
      }
    };

    worker.addEventListener('message', handleMessage);

    workerRef.current = worker;

    if (isVisibleRef.current) {
      worker.postMessage({ type: 'resume' });
      startLoop();
    } else {
      worker.postMessage({ type: 'pause' });
    }

    return () => {
      worker.removeEventListener('message', handleMessage);
      worker.terminate();
      workerRef.current = null;
    };
  }, [applyTileUpdates, dims.h, dims.w, hasOffscreen, prefersReducedMotion, startLoop]);

  useEffect(() => {
    const worker = workerRef.current;
    if (!worker) return;
    if (dims.w === 0 || dims.h === 0) return;

    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    worker.postMessage({ type: 'resize', width: dims.w, height: dims.h, dpr });
  }, [dims]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isVisible = entry.isIntersecting;
        isVisibleRef.current = isVisible;

        const worker = workerRef.current;
        if (worker) {
          worker.postMessage({ type: isVisible ? 'resume' : 'pause' });
          if (isVisible) {
            startLoop();
          } else {
            stopLoop();
          }
        } else if (!isVisible) {
          stopLoop();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(canvas);
    return () => observer.disconnect();
  }, [prefersReducedMotion, startLoop, stopLoop]);

  useEffect(() => () => stopLoop(), [stopLoop]);

  useEffect(() => {
    if (hasOffscreen || prefersReducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawStatic = () => {
      const { w, h } = dims;
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, 'rgba(118, 208, 255, 0.1)');
      gradient.addColorStop(1, 'rgba(118, 208, 255, 0)');
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    };

    drawStatic();
  }, [dims, hasOffscreen, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      width={dims.w}
      height={dims.h}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    />
  );
}
