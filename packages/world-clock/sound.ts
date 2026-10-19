/*
  A mechanical "tick" synthesised with Web Audio: no asset to ship, no network. A 12 ms noise burst
  through a band-pass filter reads as a click; whole hours get a lower, firmer detent. The context is
  created lazily from a user gesture (autoplay policy) and shared by every clock on the page.
*/

let context: AudioContext | null = null;
let noise: AudioBuffer | null = null;
let lastTick = 0;

function getContext() {
  if (typeof window === 'undefined') return null;
  if (!context) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    context = new Ctor();
  }
  if (context.state === 'suspended') void context.resume();
  return context;
}

/** Call from a pointer/keyboard handler so the browser lets the context start. */
export function primeSound() {
  getContext();
}

export function playTick(accent = false) {
  const ctx = getContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  // Fast drags would stack clicks into a buzz; keep them distinct.
  if (t - lastTick < 0.022) return;
  lastTick = t;

  if (!noise) {
    noise = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * 0.03), ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }

  const source = ctx.createBufferSource();
  source.buffer = noise;
  source.playbackRate.value = 0.94 + Math.random() * 0.12;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = accent ? 1500 : 2600;
  filter.Q.value = 3.2;

  const gain = ctx.createGain();
  const peak = accent ? 0.5 : 0.28;
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(peak, t + 0.0015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + (accent ? 0.04 : 0.025));

  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start(t);
  source.stop(t + 0.045);
}
