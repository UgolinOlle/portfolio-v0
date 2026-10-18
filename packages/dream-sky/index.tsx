'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

type DreamSkyProps = React.ComponentProps<'div'> & {
  /** Sky colour at the top of the frame. */
  skyTop?: string;
  /** Sky colour at the horizon (bottom of the frame). */
  skyBottom?: string;
  /** Colour of the lit parts of the clouds. */
  cloudColor?: string;
  /** Animation speed multiplier. `0` freezes the sky. */
  speed?: number;
  /** Strength of the prismatic light streaks, `0` to `2`. */
  flareIntensity?: number;
  /** How much of the frame the clouds cover, `0` to `1`. */
  cloudDensity?: number;
  /** Strength of the thin concentric circles, `0` to `2`. */
  ringIntensity?: number;
  /** Upper bound for the canvas pixel ratio. The sky is soft, 1.5 is plenty. */
  maxPixelRatio?: number;
  /** Stops the render loop (the last frame stays on screen). */
  paused?: boolean;
};

type Uniforms = Record<
  'time' | 'res' | 'top' | 'bottom' | 'cloud' | 'density' | 'flare' | 'rings',
  WebGLUniformLocation | null
>;

/** Time shown when the sky is static (reduced motion, no animation): a balanced cloud layout. */
const STATIC_TIME = 18;

const VERTEX = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uRes;
uniform float uTime;
uniform vec3 uTop;
uniform vec3 uBottom;
uniform vec3 uCloud;
uniform float uDensity;
uniform float uFlare;
uniform float uRings;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec2 p = (uv - 0.5) * vec2(asp, 1.0);
  float t = uTime;

  // Sky: vertical gradient plus a soft glow behind the centre of the frame.
  vec3 col = mix(uBottom, uTop, smoothstep(0.0, 1.0, uv.y));
  col += vec3(0.07, 0.09, 0.1) * exp(-length(p - vec2(0.0, 0.05)) * 2.2);

  // Concentric circles: thin lines that breathe and slowly turn (angular modulation).
  float r = length(p);
  float ang = atan(p.y, p.x);
  float cycles = 7.0;
  float w = 0.75 / uRes.y * cycles;
  float d = abs(fract(r * cycles - t * 0.05) - 0.5);
  float line = smoothstep(0.5 - 2.0 * w, 0.5 - w, d);
  float turn = 0.55 + 0.45 * sin(ang * 5.0 + t * 0.12 + r * 3.0);
  float pulse = 0.75 + 0.25 * sin(t * 0.4 - r * 4.0);
  float ringFade = smoothstep(1.3, 0.25, r) * smoothstep(0.02, 0.22, r);
  col += line * turn * pulse * ringFade * 0.2 * uRings;

  // Prismatic streaks: elongated glows whose hue drifts along their length and over time.
  vec3 flare = vec3(0.0);
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    vec2 c = vec2(
      asp * 0.45 * sin(t * 0.05 * (1.0 + fi * 0.3) + fi * 2.1),
      0.42 * sin(t * 0.043 + fi * 1.7 + 1.3)
    );
    float a = -0.35 + 0.4 * sin(fi * 1.3 + t * 0.03);
    vec2 dir = vec2(cos(a), sin(a));
    vec2 dd = p - c;
    float along = dot(dd, dir);
    float perp = dot(dd, vec2(-dir.y, dir.x));
    float len = 0.18 + 0.07 * mod(fi, 3.0);
    float wid = 0.02 + 0.006 * mod(fi, 2.0);
    float s = exp(-pow(along / len, 2.0) - pow(perp / wid, 2.0));
    float h = fract(0.55 + fi * 0.17 + t * 0.012 + along * 1.2);
    vec3 rgb = 0.5 + 0.5 * cos(6.2832 * (h + vec3(0.0, 0.33, 0.67)));
    rgb = mix(vec3(1.0), rgb, 0.65);
    flare += rgb * s * (0.55 + 0.45 * sin(t * 0.2 + fi * 1.9));
  }
  col += flare * 0.35 * uFlare;

  // Clouds: domain-warped fbm, pushed towards the bottom and side edges so the centre stays clear.
  vec2 q = vec2(p.x * 1.4 + t * 0.03, p.y * 1.8 - t * 0.004);
  vec2 warp = vec2(fbm(q + vec2(0.0, t * 0.02)), fbm(q + vec2(5.2, 1.3) - t * 0.015));
  vec2 cq = q * 1.3 + warp * 0.9;
  float n = fbm(cq);
  float nUp = fbm(cq + vec2(0.0, 0.08));
  float bottom = smoothstep(0.62, 0.0, uv.y);
  float side = smoothstep(0.45, 1.0, abs(uv.x - 0.5) * 2.0) * (0.35 + 0.65 * (1.0 - uv.y));
  float mask = max(bottom, side * 0.85);
  float cover = n * 0.85 + mask * 0.5;
  float thr = 0.85 - 0.4 * uDensity;
  float cloud = smoothstep(thr, thr + 0.28, cover);
  float lit = clamp((n - nUp) * 6.0 + 0.5, 0.0, 1.0);
  vec3 cloudCol = mix(uCloud * vec3(0.8, 0.88, 0.97), uCloud, lit);
  col = mix(col, cloudCol, cloud * 0.92);

  // Dither to hide banding on the smooth gradients.
  col += (hash(gl_FragCoord.xy + fract(t)) - 0.5) / 255.0;
  gl_FragColor = vec4(min(col, 1.0), 1.0);
}
`;

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.trim().replace('#', '');
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  const n = Number.parseInt(h, 16);
  if (Number.isNaN(n) || h.length !== 6) return [1, 1, 1];
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function DreamSky({
  skyTop = '#0a78ff',
  skyBottom = '#5ec0ff',
  cloudColor = '#ffffff',
  speed = 1,
  flareIntensity = 1,
  cloudDensity = 0.55,
  ringIntensity = 1,
  maxPixelRatio = 1.5,
  paused = false,
  className,
  children,
  ...props
}: DreamSkyProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  // The render loop reads the latest props from a ref, so tuning never rebuilds the GL context.
  const live = {
    skyTop,
    skyBottom,
    cloudColor,
    speed,
    flareIntensity,
    cloudDensity,
    ringIntensity,
  };
  const liveRef = React.useRef(live);
  liveRef.current = live;
  const pausedRef = React.useRef(paused);
  pausedRef.current = paused;
  const maxPixelRatioRef = React.useRef(maxPixelRatio);
  maxPixelRatioRef.current = maxPixelRatio;
  const syncRef = React.useRef<() => void>(undefined);

  React.useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      powerPreference: 'low-power',
    });
    if (!gl) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let program: WebGLProgram | null = null;
    let buffer: WebGLBuffer | null = null;
    let uniforms: Uniforms | null = null;
    let raf = 0;
    let last = 0;
    let time = STATIC_TIME;
    let inView = true;
    let cssW = 1;
    let cssH = 1;

    const init = () => {
      const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
      program = gl.createProgram();
      if (!vs || !fs || !program) return false;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
      gl.useProgram(program);

      // One oversized triangle covers the viewport.
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(program, 'aPos');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      const u = (name: string) => gl.getUniformLocation(program!, name);
      uniforms = {
        time: u('uTime'),
        res: u('uRes'),
        top: u('uTop'),
        bottom: u('uBottom'),
        cloud: u('uCloud'),
        density: u('uDensity'),
        flare: u('uFlare'),
        rings: u('uRings'),
      };
      return true;
    };

    const draw = () => {
      if (!uniforms || gl.isContextLost()) return;
      const p = liveRef.current;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uniforms.time, motionQuery.matches || p.speed === 0 ? STATIC_TIME : time);
      gl.uniform2f(uniforms.res, canvas.width, canvas.height);
      gl.uniform3fv(uniforms.top, hexToRgb(p.skyTop));
      gl.uniform3fv(uniforms.bottom, hexToRgb(p.skyBottom));
      gl.uniform3fv(uniforms.cloud, hexToRgb(p.cloudColor));
      gl.uniform1f(uniforms.density, Math.min(Math.max(p.cloudDensity, 0), 1));
      gl.uniform1f(uniforms.flare, p.flareIntensity);
      gl.uniform1f(uniforms.rings, p.ringIntensity);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      canvas.dataset.ready = 'true';
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      // Clamp dt so returning to the tab never makes the sky jump.
      time += Math.min((now - last) / 1000, 0.1) * liveRef.current.speed;
      last = now;
      draw();
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, maxPixelRatioRef.current);
      canvas.width = Math.max(1, Math.round(cssW * dpr));
      canvas.height = Math.max(1, Math.round(cssH * dpr));
      draw();
    };

    const sync = () => {
      const active =
        inView &&
        !document.hidden &&
        !motionQuery.matches &&
        !pausedRef.current &&
        liveRef.current.speed !== 0;
      if (active && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!active) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        draw();
      }
    };
    syncRef.current = sync;

    if (!init()) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      cssW = entry.contentRect.width;
      cssH = entry.contentRect.height;
      resize();
    });
    resizeObserver.observe(container);

    const intersection = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    intersection.observe(container);

    const onLost = (event: Event) => {
      event.preventDefault();
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      canvas.dataset.ready = 'false';
    };
    const onRestored = () => {
      if (init()) {
        resize();
        sync();
      }
    };

    document.addEventListener('visibilitychange', sync);
    motionQuery.addEventListener('change', sync);
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);
    sync();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', sync);
      motionQuery.removeEventListener('change', sync);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      if (program) gl.deleteProgram(program);
      if (buffer) gl.deleteBuffer(buffer);
      canvas.dataset.ready = 'false';
      syncRef.current = undefined;
    };
  }, []);

  // Prop changes: restart/stop the loop (paused, speed) and repaint a still sky.
  React.useEffect(() => {
    syncRef.current?.();
  }, [paused, speed, skyTop, skyBottom, cloudColor, flareIntensity, cloudDensity, ringIntensity]);

  return (
    <div
      ref={containerRef}
      className={cn('relative isolate overflow-hidden', className)}
      {...props}
    >
      {/* CSS fallback: visible until the first frame, and when WebGL is unavailable. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: `linear-gradient(to top, ${skyBottom}, ${skyTop})` }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden
        data-ready="false"
        className="pointer-events-none absolute inset-0 -z-10 size-full opacity-0 transition-opacity duration-500 ease-out data-[ready=true]:opacity-100 motion-reduce:transition-none"
      />
      {children}
    </div>
  );
}

export { DreamSky };
export type { DreamSkyProps };
