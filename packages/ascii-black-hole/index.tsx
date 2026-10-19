'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

type AsciiBlackHoleProps = React.ComponentProps<'div'> & {
  /** Colour of the glyphs. Any CSS colour. */
  color?: string;
  /** Colour behind the glyphs. */
  backgroundColor?: string;
  /** Rotation speed multiplier. `0` freezes the vortex. */
  speed?: number;
  /** Glyphs from empty to dense. The first one is the "empty" cell. */
  charSet?: string;
  /** Spiral tightness: higher values wind the arms more tightly around the core. */
  scale?: number;
  /** Number of spiral arms. */
  arms?: number;
  /** Glyph size in px. Smaller values give a finer, denser grid. */
  fontSize?: number;
  /** Stops the render loop (the last frame stays on screen). */
  paused?: boolean;
};

const DEFAULT_CHARSET = ' .:-=+*#%@';
const FONT_FAMILY = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const MAX_PIXEL_RATIO = 2;
/** Time shown when the vortex is static (reduced motion, `speed={0}`): arms are well spread. */
const STATIC_TIME = 6;
const BASE_SPIN = 0.3;
const DIFFERENTIAL = 0.9;

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function AsciiBlackHole({
  color = '#4db2ff',
  backgroundColor = '#000000',
  speed = 1,
  charSet = DEFAULT_CHARSET,
  scale = 1,
  arms = 3,
  fontSize = 10,
  paused = false,
  className,
  style,
  ...props
}: AsciiBlackHoleProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!container || !canvas || !ctx) return;

    const ramp = charSet.length > 1 ? charSet : DEFAULT_CHARSET;
    const last = ramp.length - 1;
    const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Per-cell values that never change between frames: polar angle, log radius, radial envelope.
    let cols = 0;
    let rows = 0;
    let lineHeight = 0;
    let theta = new Float32Array(0);
    let logR = new Float32Array(0);
    let radius = new Float32Array(0);
    let envelope = new Float32Array(0);

    let raf = 0;
    let onScreen = true;
    let tabVisible = !document.hidden;
    let elapsed = 0;
    let previous = 0;

    const draw = (time: number) => {
      const rowChars: string[] = [];
      for (let y = 0; y < rows; y++) {
        let line = '';
        const base = y * cols;
        for (let x = 0; x < cols; x++) {
          const i = base + x;
          const u = radius[i];
          // Rigid spin plus a breathing differential term (~ 1 / radius): inner rings race ahead, then relax,
          // so the arms stretch and curl without winding up forever.
          const spin = time * BASE_SPIN + (DIFFERENTIAL * Math.sin(time * 0.22)) / (0.15 + u);
          const phase = arms * (theta[i] - spin) - 2 * arms * scale * logR[i];
          const arm = smoothstep(0.1, 0.8, 0.5 + 0.5 * Math.cos(phase));
          const ring = Math.exp(-(((u - 0.12) / 0.03) ** 2)) * 0.5;
          const hole = smoothstep(0.05, 0.1, u);
          const value = Math.min(1, (envelope[i] * (0.04 + 0.96 * arm) + ring) * hole);
          line += ramp[Math.round(value * last)];
        }
        rowChars.push(line);
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let y = 0; y < rows; y++) ctx.fillText(rowChars[y], 0, y * lineHeight);
    };

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${fontSize}px ${FONT_FAMILY}`;
      ctx.fillStyle = color;
      ctx.textBaseline = 'top';

      const charWidth = ctx.measureText('M').width;
      lineHeight = fontSize * 1.05;
      cols = Math.ceil(width / charWidth) + 1;
      rows = Math.ceil(height / lineHeight) + 1;

      const count = cols * rows;
      theta = new Float32Array(count);
      logR = new Float32Array(count);
      radius = new Float32Array(count);
      envelope = new Float32Array(count);
      // The vortex reaches the corners, so the full-bleed field never shows an edge.
      const reach = Math.hypot(width, height) / 2;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const dx = (x + 0.5) * charWidth - width / 2;
          const dy = (y + 0.5) * lineHeight - height / 2;
          const u = Math.hypot(dx, dy) / reach;
          theta[i] = Math.atan2(dy, dx);
          radius[i] = u;
          logR[i] = Math.log(u + 0.04);
          envelope[i] = Math.exp(-u * 1.8) * 0.7 + 0.3;
        }
      }
    };

    const animated = () => speed !== 0 && !paused && !reduceQuery.matches;

    const frame = (now: number) => {
      raf = 0;
      elapsed += ((now - previous) / 1000) * speed;
      previous = now;
      draw(elapsed);
      schedule();
    };

    const schedule = () => {
      if (raf || !animated() || !onScreen || !tabVisible) return;
      previous = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const render = () => {
      resize();
      draw(animated() ? elapsed : speed === 0 || reduceQuery.matches ? STATIC_TIME : elapsed);
      schedule();
    };

    render();

    const resizeObserver = new ResizeObserver(render);
    resizeObserver.observe(container);
    const intersection = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) schedule();
      else stop();
    });
    intersection.observe(container);
    const onVisibility = () => {
      tabVisible = !document.hidden;
      if (tabVisible) schedule();
      else stop();
    };
    const onMotionChange = () => {
      stop();
      render();
    };
    document.addEventListener('visibilitychange', onVisibility);
    reduceQuery.addEventListener('change', onMotionChange);

    return () => {
      stop();
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      reduceQuery.removeEventListener('change', onMotionChange);
    };
  }, [color, speed, charSet, scale, arms, fontSize, paused]);

  return (
    <div
      ref={containerRef}
      data-slot="ascii-black-hole"
      className={cn('relative size-full overflow-hidden', className)}
      style={{ backgroundColor, ...style }}
      {...props}
    >
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full" />
    </div>
  );
}

export { AsciiBlackHole };
export type { AsciiBlackHoleProps };
