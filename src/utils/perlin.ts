/**
 * 2D Perlin noise implementation for smooth, natural-looking randomness.
 * Used for animating background effects with organic motion patterns.
 */
export class Perlin2D {
  /**
   * Generates a pseudo-random gradient vector at integer coordinates.
   * Uses a deterministic hash function based on sine for consistency.
   * Magic numbers (127.1, 311.7, 43758.5453123) are chosen to maximize
   * randomness distribution while maintaining deterministic behavior.
   */
  private randomGradient(ix: number, iy: number) {
    const s = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453123;
    const t = s - Math.floor(s); // Fractional part for [0, 1] range
    const ang = t * Math.PI * 2; // Convert to angle [0, 2π]
    return { x: Math.cos(ang), y: Math.sin(ang) };
  }

  /**
   * Computes dot product between gradient and distance vectors.
   * This is the core of Perlin noise - measuring influence of grid corners.
   */
  private dot(ix: number, iy: number, x: number, y: number) {
    const g = this.randomGradient(ix, iy);
    const dx = x - ix;
    const dy = y - iy;
    return dx * g.x + dy * g.y;
  }

  /**
   * Smoothstep interpolation function (3t² - 2t³).
   * Creates smooth transitions between grid points without visible seams.
   */
  private s(t: number) {
    return t * t * (3 - 2 * t);
  }

  /**
   * Linear interpolation between two values.
   */
  private lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
  }

  /**
   * Generates 2D Perlin noise value at given coordinates.
   * Returns a value roughly in the range [-1, 1].
   *
   * @param x - X coordinate (can be fractional)
   * @param y - Y coordinate (can be fractional)
   * @returns Noise value for smooth, continuous randomness
   */
  noise(x: number, y: number) {
    // Get the four corners of the unit square
    const x0 = Math.floor(x), x1 = x0 + 1;
    const y0 = Math.floor(y), y1 = y0 + 1;

    // Smooth interpolation weights
    const sx = this.s(x - x0);
    const sy = this.s(y - y0);

    // Interpolate between grid point gradients
    const n0 = this.dot(x0, y0, x, y);
    const n1 = this.dot(x1, y0, x, y);
    const ix0 = this.lerp(n0, n1, sx);

    const n2 = this.dot(x0, y1, x, y);
    const n3 = this.dot(x1, y1, x, y);
    const ix1 = this.lerp(n2, n3, sx);

    return this.lerp(ix0, ix1, sy);
  }
}

