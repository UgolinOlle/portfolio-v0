import HL from './kernel.js';

/**
 * Gateway: one low gate block along the front, four services behind it on dashed lines,
 * and a request token waiting on the gate's rail. The service under the pointer rises, its
 * line turns solid and bright, and the token travels gate → service and back. The slider is
 * how high the service rises; the token's speed follows it.
 *
 * The scene draws in whatever projection it is given, so the same code is the standalone
 * figure and the API state of the hero. Picking tests the services' rest poses, never the
 * pose on screen (rule 01): each is the column its footprint sweeps up to its raised top.
 */
const { clamp, lerp, open, poly, fillet, prism, put, r2, rings, seg, solid, mk, tdone, tset, tval, tween } = HL;

export const ROUTES = ['/orders → orders-svc', '/users → users-svc', '/pay → pay-svc', '/search → search-svc'];

const N = 4, CX = 38, CY = -25, GZ = 11, ZS = 10, X0 = 4, PITCH = 18, W = 14, SY0 = -62, SY1 = -44;
const REST = [1.5, 0, 3, 0.5], HOP = 56;
const cxOf = (i) => X0 + PITCH * i + W / 2;
const rr = (f, a, b, c, d, r) => poly(fillet([[a, b], [c, b], [c, d], [a, d]], [r, r, r, r]).map(([u, v]) => f(u, v)));

/** What each service carries on its front face, 14 wide and 10 high: a list, a person, a card, a loupe. */
function marks(i, f) {
  const c = cxOf(i);
  if (i === 0) return seg(f(c - 4.5, 7), f(c + 4.5, 7)) + seg(f(c - 4.5, 4.8), f(c + 2.5, 4.8)) + seg(f(c - 4.5, 2.6), f(c + 4.5, 2.6));
  if (i === 1) return rr(f, c - 1.6, 5.4, c + 1.6, 8.6, 1.5) + rr(f, c - 4.5, 1.6, c + 4.5, 4.4, 1.3);
  if (i === 2) return rr(f, c - 5, 2, c + 5, 7.6, 1.2) + seg(f(c - 5, 5.6), f(c + 5, 5.6)) + seg(f(c - 3.4, 3.6), f(c - 0.6, 3.6));
  return rr(f, c - 4.5, 3, c + 0.5, 8, 2.5) + seg(f(c + 1.2, 3.6), f(c + 4.6, 1.8));
}

export function gatewayScene(g, Q, front, { k = 1, lift = 16, slow = 1500, fast = 650, wake = () => {} } = {}) {
  const Qs = (x, y, z) => Q((x - CX) * k, (y - CY) * k, z * k);
  const speed = (l) => lerp(slow, fast, clamp((l - 10) / 12, 0, 1));

  const lines = Array.from({ length: N }, (_, i) => mk('path', { d: seg(Qs(cxOf(i), 0, 0), Qs(cxOf(i), SY1, 0)), class: 'nf lo dash feat' }, g));
  const svcs = Array.from({ length: N }, (_, i) => {
    const grp = mk('g', {}, g), [ring, inner] = rings(X0 + PITCH * i, SY0, X0 + PITCH * i + W, SY1, 3, 0.9);
    return { s: solid(grp), face: mk('path', { class: 'nf lo feat' }, grp), ring, inner, key: '' };
  });

  // the gate: a low block with an arch cut in its front and a rail along its top for the token
  const gate = rings(0, 0, 76, 12, 3, 0.9), gs = solid(g), fg = (u, v) => Qs(u, 12, v);
  put(gs, prism(Qs, front, gate[0], gate[1], 0, GZ));
  mk('path', { d: rr(fg, 31, 1, 45, 8.5, 5) + seg(fg(8, 5), fg(22, 5)) + seg(fg(54, 5), fg(68, 5)) + seg(Qs(6, 6, GZ), Qs(70, 6, GZ)), class: 'nf lo feat' }, g);

  const tok = solid(g), [tr, ti] = rings(-3, -3, 3, 3, 1.6, 0.8);
  tok.sil.classList.add('hi');

  const rz = REST.map((v) => tween(v));
  let tk = tween(0, speed(lift)), want = -1, route = 0, phase = 'idle', fresh = false, tkey = '';

  function place(i, now) {
    const sv = svcs[i], z = tval(rz[i], now), key = r2(z);
    if (key === sv.key) return;
    sv.key = key;
    put(sv.s, prism(Qs, front, sv.ring, sv.inner, z, z + ZS));
    sv.face.setAttribute('d', marks(i, (u, v) => Qs(u, SY1, z + v)));
  }

  /** The token's world point `s` of the way along route i (0 at the gate, 1 on the service). */
  function along(i, s, now) {
    const c = cxOf(i), d1 = Math.abs(c - CX), q = s * (d1 + HOP);
    if (q <= d1) return [CX + Math.sign(c - CX) * q, 6, GZ];
    const t = (q - d1) / HOP;
    return [c, 6 - HOP * t, lerp(GZ, ZS + tval(rz[i], now), t) + 7 * Math.sin(Math.PI * t)];
  }

  function tick(now) {
    if (phase === 'out' && (want !== route || tdone(tk, now))) { phase = 'back'; tset(tk, 0, now, 0); }
    else if (phase === 'back' && tdone(tk, now)) phase = 'idle';
    if (phase === 'idle' && fresh && want >= 0) { fresh = false; route = want; phase = 'out'; tset(tk, 1, now, 0); }
    for (let i = 0; i < N; i++) place(i, now);
    const p = along(route, tval(tk, now), now), key = p.map(r2).join();
    if (key !== tkey) {
      tkey = key;
      put(tok, prism((x, y, z) => Qs(x + p[0], y + p[1], z + p[2]), front, tr, ti, 0, 4.5));
    }
    return phase !== 'idle' || rz.some((t) => !tdone(t, now));
  }

  // the world point on the plane z under a screen point, from the two ground axes as the camera sees them
  const o = Qs(0, 0, 0), ex = Qs(1, 0, 0), ey = Qs(0, 1, 0);
  const ax = [ex[0] - o[0], ex[1] - o[1]], ay = [ey[0] - o[0], ey[1] - o[1]], det = ax[0] * ay[1] - ay[0] * ax[1];
  const ground = ([x, y], z) => {
    const oz = Qs(0, 0, z), dx = x - oz[0], dy = y - oz[1];
    return [(dx * ay[1] - dy * ay[0]) / det, (ax[0] * dy - ax[1] * dx) / det];
  };

  return {
    tick,
    /** The service whose rest column holds the screen point, or -1; the column sweeps up to the raised top. */
    hit(p) {
      for (const z of [0, ZS / 2, ZS + lift / 2, ZS + lift]) {
        const [x, y] = ground(p, z);
        if (y < SY0 || y > 0) continue;
        const i = Math.floor((x - X0 + (PITCH - W) / 2) / PITCH);
        if (i >= 0 && i < N && x >= X0 + PITCH * i && x <= X0 + PITCH * i + W) return i;
      }
      return -1;
    },
    pick(i) {
      if (i === want) return i;
      want = i;
      fresh = i >= 0;
      const now = performance.now();
      rz.forEach((t, j) => tset(t, j === i ? lift : REST[j], now, 0));
      lines.forEach((el, j) => el.setAttribute('class', j === i ? 'nf hi' : 'nf lo dash feat'));
      svcs.forEach((sv, j) => sv.s.sil.classList.toggle('hi', j === i));
      wake();
      return i;
    },
    /** The auto-play's hand: the service t (0 to 1) of the way along the row is picked; below 0 clears. */
    to(t) { return this.pick(t < 0 ? -1 : Math.min(N - 1, Math.floor(t * N))); },
    set(l) {
      lift = l;
      const now = performance.now();
      tk = tween(tval(tk, now), speed(l));
      if (want >= 0) rz.forEach((t, j) => tset(t, j === want ? lift : REST[j], now, 0));
    },
  };
}
