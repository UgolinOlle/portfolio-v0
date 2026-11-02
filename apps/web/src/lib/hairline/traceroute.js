import HL from './kernel.js';

/**
 * Traceroute: a laptop on the left, six hop nodes on a line, a server on the right. The pointer
 * slides along the line and the packet follows it, hopping between stops. Every hop it reaches
 * pulses once and raises a tick over itself, as tall as its latency; hop 4 is the slow one, so
 * its tick stands out. The slider is the damping of the packet's spring: the lower, the further
 * it overshoots a hop before settling back onto it.
 *
 * The scene draws in whatever projection it is given, so the same code is the standalone figure
 * and the network state of the hero. The pointer is read as a world x on the line, never tested
 * against the packet on screen (rule 01).
 */
const { clamp, lerp, poly, prism, put, r2, rings, seg, solid, mk, place, spring, stepS, tdone, tset, tval, tween } = HL;

const HOME = 8, STOP = [HOME, 18, 36, 54, 72, 90, 108, 120];
const NX = [18, 36, 54, 72, 90, 108, 131], NTOP = [4, 5, 4, 6, 4, 5, 16], LAT = [3, 7, 11, 38, 15, 19, 22];
const tickH = (ms) => Math.max(2.5, ms * 0.7);
const label = (i) => (i === 0 ? 'rest' : `${i === 7 ? 'server' : 'hop ' + i} · ${LAT[i - 1]}ms`);

export function tracerouteScene(g, Q, front, { k = 1, damp = 11, wake = () => {} } = {}) {
  const Qs = (x, y, z) => Q((x - 64) * k, y * k, (z - 10) * k + 12);
  const solidAt = (x0, y0, x1, y1, r, z1, z0 = 0, hi = false) => {
    const [ring, inner] = rings(x0, y0, x1, y1, r, 0.8), s = solid(g);
    put(s, prism(Qs, front, ring, inner, z0, z1));
    if (hi) s.sil.classList.add('hi');
    return s;
  };
  const dot = (p, cls = 'dot off') => { const el = mk('circle', { r: 1.4, class: cls }, g); if (p) place(el, p); return el; };
  const line = (d, cls = 'nf lo feat') => mk('path', { d, class: cls }, g);

  // the laptop: a screen behind, a base in front with its keys
  const fs = (u, v) => Qs(u, -4.4, v);
  solidAt(-10, -6, 4, -4.4, 0.8, 11, 1.8);
  line(poly([[-8, 3.4], [2, 3.4], [2, 9.4], [-8, 9.4]].map(([u, v]) => fs(u, v))) + seg(fs(-3, 2.2), fs(-3, 2.2)));
  solidAt(-10, -3.5, 4, 6.5, 2, 1.8);
  line(seg(Qs(-7, 0, 1.8), Qs(1, 0, 1.8)) + seg(Qs(-7, 2.8, 1.8), Qs(1, 2.8, 1.8)));

  line(seg(Qs(4, 0, 0), Qs(125, 0, 0)));

  // the hops, then the server
  const nodes = NX.slice(0, 6).map((x, i) => {
    solidAt(x - 4.5, -4.5, x + 4.5, 4.5, 2.6, NTOP[i]);
    dot(Qs(x - 2, 4.5, NTOP[i] / 2));
    dot(Qs(x + 2, 4.5, NTOP[i] / 2));
    return dot(Qs(x, 0, NTOP[i]));
  });
  solidAt(124, -5, 138, 5, 2.6, 16);
  line([5, 9, 13].map((v) => seg(Qs(127, 5, v), Qs(135, 5, v))).join(''));
  nodes.push(dot(Qs(131, 5, 3.4), 'dot m'));

  const ticks = NX.map(() => line('', 'nf lo feat')), rings_ = NX.map(() => line('', 'nf lo feat'));
  const pkt = solid(g), [pr, pi] = rings(-2.5, -2.5, 2.5, 2.5, 1.3, 0.7);
  pkt.sil.classList.add('hi');

  const pk = spring(HOME, { k: 100, c: damp });
  const th = NX.map(() => tween(0)), shown = NX.map(() => false), keys = NX.map(() => '');
  let pl = NX.map(() => tween(1)), want = 0, px = '', last = 0;

  function draw(now) {
    const key = r2(pk.x);
    if (key !== px) { px = key; put(pkt, prism((x, y, z) => Qs(x + pk.x, y, z + 0.5), front, pr, pi, 0, 3.2)); }
    NX.forEach((x, i) => {
      const h = tval(th[i], now), top = NTOP[i], p = tval(pl[i], now), pulsing = !tdone(pl[i], now), key2 = r2(h) + ',' + r2(p) + pulsing;
      if (key2 === keys[i]) return;
      keys[i] = key2;
      ticks[i].setAttribute('d', h > 0.1 ? seg(Qs(x, 0, top + 0.6), Qs(x, 0, top + 0.6 + h)) + seg(Qs(x, -2, top + 0.6 + h), Qs(x, 2, top + 0.6 + h)) : '');
      const R = lerp(5, 12, p);
      rings_[i].setAttribute('d', pulsing ? poly(Array.from({ length: 24 }, (_, s) => Qs(x + R * Math.cos((s / 24) * 2 * Math.PI), R * Math.sin((s / 24) * 2 * Math.PI), 0.2))) : '');
      nodes[i].setAttribute('class', pulsing ? 'dot' : i === 6 ? 'dot m' : 'dot off');
    });
  }

  function tick(now) {
    const dt = Math.min(Math.max((now - last) / 1000, 0), 0.05);
    last = now;
    let moving = stepS(pk, dt);
    NX.forEach((_, i) => {
      if (!shown[i] && want >= i + 1 && pk.x >= STOP[i + 1] - 0.6) {
        shown[i] = true;
        tset(th[i], tickH(LAT[i]), now, 0);
        pl[i] = tween(0);
        tset(pl[i], 1, now, 0);
      } else if (shown[i] && want < i + 1 && pk.x < STOP[i + 1] - 3) {
        shown[i] = false;
        tset(th[i], 0, now, 0);
      }
      if (!tdone(th[i], now) || !tdone(pl[i], now)) moving = true;
    });
    draw(now);
    return moving;
  }

  /** Aims the packet at stop i (0 is home): it springs there, and the hops it crosses answer as it passes. */
  function aim(i) {
    if (i === want) return label(i);
    want = i;
    pk.t = STOP[i];
    wake();
    return label(i);
  }

  draw(0);
  return {
    tick,
    /** The pointer is at screen point p: the packet heads for the stop nearest its world x on the line. */
    move(p) {
      const x0 = Qs(0, 0, 0)[0], x = (p[0] - x0) / (Qs(1, 0, 0)[0] - x0);
      return aim(STOP.reduce((best, s, i) => (Math.abs(s - x) < Math.abs(STOP[best] - x) ? i : best), 0));
    },
    /** The auto-play's hand: the packet heads for the stop t (0 to 1) of the way along the line. */
    to(t) { return aim(Math.round(clamp(t, 0, 1) * (STOP.length - 1))); },
    leave() { return aim(0); },
    set(c) { pk.c = c; },
  };
}
