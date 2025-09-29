import { useEffect, useRef, useState } from 'react';
import { Perlin2D } from '../utils/perlin';
import { VISUAL } from '../config/visual';

type PDot = {
  x: number;
  y: number;
};

export function PlaneNoiseBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const pointsRef = useRef<PDot[]>([]);
  const perlin = useRef(new Perlin2D()).current;
  const rafRef = useRef<number | null>(null);
  const tilesRef = useRef<HTMLElement[] | null>(null);
  const tileCentersRef = useRef<Array<{ el: HTMLElement; cx: number; cy: number }>>([]);
  const spriteRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const rebuild = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setDims({ w, h });

      const spacing = VISUAL.PLANE_GRID_SPACING_PX;
      const cols = Math.ceil(w / spacing) + 2;
      const rows = Math.ceil(h / spacing) + 2;
      const pts: PDot[] = [];
      for (let i = -1; i < cols; i++) {
        for (let j = -1; j < rows; j++) {
          pts.push({ x: i * spacing, y: j * spacing });
        }
      }
      pointsRef.current = pts;
    };
    rebuild();
    const onResize = () => requestAnimationFrame(rebuild);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);

    const ensureSize = () => {
      const { w, h } = dims;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    ensureSize();

    const buildSprite = () => {
      const sz = 64;
      const sprite = document.createElement('canvas');
      sprite.width = sz; sprite.height = sz;
      const sctx = sprite.getContext('2d');
      if (sctx) {
        const g = sctx.createRadialGradient(sz/2, sz/2, 0, sz/2, sz/2, sz/2);
        g.addColorStop(0, 'rgba(255,255,255,1)');
        g.addColorStop(0.5, 'rgba(118,208,255,0.7)');
        g.addColorStop(1, 'rgba(118,208,255,0)');
        sctx.fillStyle = g;
        sctx.beginPath();
        sctx.arc(sz/2, sz/2, sz/2, 0, Math.PI * 2);
        sctx.fill();
      }
      spriteRef.current = sprite;
    };
    if (!spriteRef.current) buildSprite();

    const refreshTileNodes = () => {
      tilesRef.current = Array.from(document.querySelectorAll<HTMLElement>('.glass-tile, .glass-inner'));
      computeTileCenters();
    };

    const computeTileCenters = () => {
      const arr: Array<{ el: HTMLElement; cx: number; cy: number }> = [];
      if (!tilesRef.current) return;
      for (const el of tilesRef.current) {
        const r = el.getBoundingClientRect();
        arr.push({ el, cx: r.left + r.width * 0.5, cy: r.top + r.height * 0.5 });
      }
      tileCentersRef.current = arr;
    };
    refreshTileNodes();
    let scrollRaf: number | null = null;
    const onScrollOrResize = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = null;
        computeTileCenters();
      });
    };
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', () => { ensureSize(); refreshTileNodes(); }, { passive: true });

    let start = performance.now();

    const step = (now: number) => {
      const { w, h } = dims;
      if (w === 0 || h === 0) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, w, h);

      const f1 = VISUAL.PLANE_NOISE_FREQ1;
      const f2 = VISUAL.PLANE_NOISE_FREQ2;
      const s1 = VISUAL.PLANE_NOISE_SPEED1;
      const s2 = VISUAL.PLANE_NOISE_SPEED2;
      const yAmp = VISUAL.PLANE_HEIGHT_AMP_PX;
      const lumaMin = VISUAL.PLANE_LUMA_MIN;
      const lumaMax = VISUAL.PLANE_LUMA_MAX;
      const sizePersp = VISUAL.PLANE_SIZE_PERSPECTIVE;

      for (const p of pointsRef.current) {
        const n1 = perlin.noise(p.x * f1, p.y * f1 + t * s1);
        const n2 = perlin.noise((p.x + 1000) * f2, (p.y - 500) * f2 + t * s2);
        const hval = Math.max(0, Math.min(1, 0.5 + 0.5 * ((n1 + 0.6 * n2) / 1.6)));
        const yOffset = (hval - 0.5) * 2 * yAmp;
        const persp = lumaMin + (lumaMax - lumaMin) * Math.min(1, Math.max(0, p.y / h));
        const size = (VISUAL.DOT_BASE_SIZE + hval * VISUAL.DOT_SIZE_RANGE) * (1 + sizePersp * (persp - 1));
        const alpha = (VISUAL.DOT_ALPHA_BASE + hval * VISUAL.DOT_ALPHA_RANGE) * persp;

        const x = p.x;
        const y = p.y + yOffset;

        const sprite = spriteRef.current;
        if (sprite) {
          ctx.globalAlpha = alpha;
          const d = size * 2;
          ctx.drawImage(sprite, x - size, y - size, d, d);
          ctx.globalAlpha = 1;
        }
      }

      if (!tilesRef.current || tilesRef.current.length === 0) {
        tilesRef.current = Array.from(document.querySelectorAll<HTMLElement>('.glass-tile, .glass-inner'));
        computeTileCenters();
      }
      const offMax = VISUAL.CAUSTIC_OFFSET_MAX_PX;
      const scaleBase = VISUAL.CAUSTIC_SCALE_BASE;
      const scaleRange = VISUAL.CAUSTIC_SCALE_RANGE;
      for (const entry of tileCentersRef.current) {
        const node = entry.el;
        const cx = entry.cx;
        const cy = entry.cy;

        const m = perlin.noise(cx * f1, cy * f1 + t * s1);
        const m2 = perlin.noise((cx + 200) * f2, (cy - 200) * f2 + t * s2);
        const val = Math.max(0, Math.min(1, 0.5 + 0.5 * ((m + 0.6 * m2) / 1.6)));
        node.style.setProperty('--caustic-noise', val.toFixed(3));

        const dx = 8; const dy = 8;
        const f = (x: number, y: number) => {
          const a = perlin.noise(x * f1, y * f1 + t * s1);
          const b = perlin.noise((x + 200) * f2, (y - 200) * f2 + t * s2);
          return (a + 0.6 * b) / 1.6;
        };
        const df_dx = (f(cx + dx, cy) - f(cx - dx, cy)) / (2 * dx);
        const df_dy = (f(cx, cy + dy) - f(cx, cy - dy)) / (2 * dy);

        let vx = -df_dx;
        let vy = -df_dy;
        const mag = Math.hypot(vx, vy) || 1;
        vx /= mag; vy /= mag;
        const strength = Math.min(1, Math.max(0, Math.hypot(df_dx, df_dy) * 120));
        const offX = (vx * strength * offMax).toFixed(2);
        const offY = (vy * strength * offMax).toFixed(2);
        node.style.setProperty('--caustic-off-x', `${offX}px`);
        node.style.setProperty('--caustic-off-y', `${offY}px`);
        const scl = (scaleBase + scaleRange * val).toFixed(3);
        node.style.setProperty('--caustic-scale', scl);
      }

      if (!prefersReduced) rafRef.current = requestAnimationFrame(step);
    };

    if (!prefersReduced) rafRef.current = requestAnimationFrame(step);
    else step(performance.now());
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      window.removeEventListener('scroll', onScrollOrResize as any);
    };
  }, [dims, perlin]);

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
