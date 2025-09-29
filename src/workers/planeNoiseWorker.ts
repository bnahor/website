/// <reference lib="webworker" />

import { Perlin2D } from '../utils/perlin';
import { VISUAL } from '../config/visual';

type InitMessage = {
  type: 'init';
  canvas: OffscreenCanvas;
  width: number;
  height: number;
  dpr: number;
};

type ResizeMessage = {
  type: 'resize';
  width: number;
  height: number;
  dpr: number;
};

type FrameMessage = {
  type: 'frame';
  now: number;
  tileCenters: Float32Array | null;
  tileCount: number;
};

type PauseMessage = { type: 'pause' };
type ResumeMessage = { type: 'resume' };

type WorkerMessage = InitMessage | ResizeMessage | FrameMessage | PauseMessage | ResumeMessage;

const perlin = new Perlin2D();

let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;
let dimensions = { width: 0, height: 0, dpr: 1 };
let points: Array<{ x: number; y: number }> = [];
let startedAt: number | null = null;
let paused = false;
let latestTileCenters: Float32Array | null = null;
let latestTileCount = 0;
let spriteBitmap: ImageBitmap | null = null;

const buildGridPoints = () => {
  const { width, height } = dimensions;
  const spacing = VISUAL.PLANE_GRID_SPACING_PX;
  const cols = Math.ceil(width / spacing) + 2;
  const rows = Math.ceil(height / spacing) + 2;
  const nextPoints: Array<{ x: number; y: number }> = [];

  for (let i = -1; i < cols; i++) {
    for (let j = -1; j < rows; j++) {
      nextPoints.push({ x: i * spacing, y: j * spacing });
    }
  }

  points = nextPoints;
};

const ensureContext = () => {
  if (!canvas) return;
  if (!ctx) {
    ctx = canvas.getContext('2d');
  }

  if (!ctx) return;

  const { width, height, dpr } = dimensions;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  ctx.resetTransform();
  ctx.scale(dpr, dpr);
};

const ensureSprite = () => {
  if (spriteBitmap) return;

  const maxSize = (VISUAL.DOT_BASE_SIZE + VISUAL.DOT_SIZE_RANGE) * 2;
  const spriteCanvas = new OffscreenCanvas(maxSize, maxSize);
  const spriteCtx = spriteCanvas.getContext('2d');

  if (!spriteCtx) return;

  const gradient = spriteCtx.createRadialGradient(
    maxSize / 2,
    maxSize / 2,
    0,
    maxSize / 2,
    maxSize / 2,
    maxSize / 2
  );
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.5, 'rgba(118,208,255,0.7)');
  gradient.addColorStop(1, 'rgba(118,208,255,0)');
  spriteCtx.fillStyle = gradient;
  spriteCtx.beginPath();
  spriteCtx.arc(maxSize / 2, maxSize / 2, maxSize / 2, 0, Math.PI * 2);
  spriteCtx.fill();

  spriteBitmap = spriteCanvas.transferToImageBitmap();
};

const drawFrame = (now: number) => {
  if (!ctx || paused) return;

  const { width, height } = dimensions;
  if (width === 0 || height === 0) return;

  if (startedAt === null) {
    startedAt = now;
  }

  const t = (now - startedAt) / 1000;

  ctx.clearRect(0, 0, width, height);

  const f1 = VISUAL.PLANE_NOISE_FREQ1;
  const f2 = VISUAL.PLANE_NOISE_FREQ2;
  const s1 = VISUAL.PLANE_NOISE_SPEED1;
  const s2 = VISUAL.PLANE_NOISE_SPEED2;
  const yAmp = VISUAL.PLANE_HEIGHT_AMP_PX;
  const lumaMin = VISUAL.PLANE_LUMA_MIN;
  const lumaMax = VISUAL.PLANE_LUMA_MAX;
  const sizePersp = VISUAL.PLANE_SIZE_PERSPECTIVE;

  ensureSprite();

  for (const p of points) {
    const n1 = perlin.noise(p.x * f1, p.y * f1 + t * s1);
    const n2 = perlin.noise((p.x + 1000) * f2, (p.y - 500) * f2 + t * s2);
    const hval = Math.max(0, Math.min(1, 0.5 + 0.5 * ((n1 + 0.6 * n2) / 1.6)));
    const yOffset = (hval - 0.5) * 2 * yAmp;
    const persp = lumaMin + (lumaMax - lumaMin) * Math.min(1, Math.max(0, p.y / height));
    const size = (VISUAL.DOT_BASE_SIZE + hval * VISUAL.DOT_SIZE_RANGE) * (1 + sizePersp * (persp - 1));
    const alpha = (VISUAL.DOT_ALPHA_BASE + hval * VISUAL.DOT_ALPHA_RANGE) * persp;

    const x = p.x;
    const y = p.y + yOffset;

    if (spriteBitmap) {
      ctx.globalAlpha = alpha;
      const drawSize = size * 2;
      ctx.drawImage(spriteBitmap, x - size, y - size, drawSize, drawSize);
    }
  }

  ctx.globalAlpha = 1;

  if (latestTileCenters && latestTileCount > 0) {
    const updates = new Float32Array(latestTileCount * 4);
    const offMax = VISUAL.CAUSTIC_OFFSET_MAX_PX;
    const scaleBase = VISUAL.CAUSTIC_SCALE_BASE;
    const scaleRange = VISUAL.CAUSTIC_SCALE_RANGE;

    const computeField = (x: number, y: number) => {
      const a = perlin.noise(x * f1, y * f1 + t * s1);
      const b = perlin.noise((x + 200) * f2, (y - 200) * f2 + t * s2);
      return (a + 0.6 * b) / 1.6;
    };

    for (let i = 0; i < latestTileCount; i++) {
      const cx = latestTileCenters[i * 2];
      const cy = latestTileCenters[i * 2 + 1];

      const valRaw = computeField(cx, cy);
      const val = Math.max(0, Math.min(1, 0.5 + 0.5 * valRaw));

      const dx = 8;
      const dy = 8;
      const df_dx = (computeField(cx + dx, cy) - computeField(cx - dx, cy)) / (2 * dx);
      const df_dy = (computeField(cx, cy + dy) - computeField(cx, cy - dy)) / (2 * dy);

      let vx = -df_dx;
      let vy = -df_dy;
      const mag = Math.hypot(vx, vy) || 1;
      vx /= mag;
      vy /= mag;

      const strength = Math.min(1, Math.max(0, Math.hypot(df_dx, df_dy) * 120));
      const offX = vx * strength * offMax;
      const offY = vy * strength * offMax;
      const scale = scaleBase + scaleRange * val;

      const baseIndex = i * 4;
      updates[baseIndex] = val;
      updates[baseIndex + 1] = offX;
      updates[baseIndex + 2] = offY;
      updates[baseIndex + 3] = scale;
    }

    (self as DedicatedWorkerGlobalScope).postMessage({ type: 'tileUpdate', updates }, [updates.buffer]);
  }
};

(self as DedicatedWorkerGlobalScope).addEventListener('message', (event: MessageEvent<WorkerMessage>) => {
  const message = event.data;

  switch (message.type) {
    case 'init': {
      canvas = message.canvas;
      dimensions = { width: message.width, height: message.height, dpr: message.dpr };
      startedAt = null;
      ensureContext();
      buildGridPoints();
      break;
    }
    case 'resize': {
      dimensions = { width: message.width, height: message.height, dpr: message.dpr };
      ensureContext();
      buildGridPoints();
      break;
    }
    case 'frame': {
      if (message.tileCenters) {
        latestTileCenters = message.tileCenters;
        latestTileCount = message.tileCount;
      }
      drawFrame(message.now);
      break;
    }
    case 'pause': {
      paused = true;
      break;
    }
    case 'resume': {
      paused = false;
      startedAt = null;
      break;
    }
    default:
      break;
  }
});
