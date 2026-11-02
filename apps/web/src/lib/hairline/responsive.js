import HL from './kernel.js';

/**
 * Responsive: one screen frame standing on a track, with a handle on its right edge. The
 * pointer's x sets its width, and the layout inside answers it the way a page does: the three
 * cards go from a row to two columns to a single stack, the nav links fold into a burger,
 * and the frame's corners round into a phone. The width catches at desktop, tablet and
 * mobile. The slider is the damping of the reflow: the lower, the further the blocks spring.
 *
 * The scene draws in whatever projection it is given, so the same code is the standalone
 * figure and the interface state of the hero. The pointer is read as a world x on the
 * frame's plane, never tested against the handle on screen (rule 01).
 */
const { clamp, fillet, lerp, poly, prism, put, r2, rings, seg, solid, mk, place, spring, stepS } = HL;

const WM = 30.5, WT = 60, WD = 100, H = 62, T = 2.4, M = 3, G = 2.5, CATCH = 6, WMIN = 26;
const NAMES = ['mobile', 'tablet', 'desktop'], PX = 1280 / WD, SNAPS = [WM, WT, WD], KS = [110, 90, 72];
const rr = (f, a, b, c, d, r) => poly(fillet([[a, b], [c, b], [c, d], [a, d]], [r, r, r, r]).map(([u, v]) => f(u, v)));

/** The three cards at frame width W for each layout: [mobile, tablet, desktop], each three rects [u0, v0, u1, v1]. */
function layouts(W) {
  const iw = W - 2 * M, hc = H - 34, top = M + hc;
  const row = (j) => { const cw = (iw - 2 * G) / 3, u = M + j * (cw + G); return [u, M, u + cw, top]; };
  const duo = (j) => { const cw = (iw - G) / 2, rh = (hc - G) / 2, u = M + (j % 2) * (cw + G), v1 = top - Math.floor(j / 2) * (rh + G); return [u, v1 - rh, u + cw, v1]; };
  const stack = (j) => { const rh = (hc - 2 * G) / 3, v1 = top - j * (rh + G); return [M, v1 - rh, M + iw, v1]; };
  return [[0, 1, 2].map(stack), [0, 1, 2].map(duo), [0, 1, 2].map(row)];
}

/** Card j between two layouts: s 0 is mobile, 1 tablet, 2 desktop; a spring's overshoot extrapolates. */
const at = (L, j, s) => { const a = L[s <= 1 ? 0 : 1][j], b = L[s <= 1 ? 1 : 2][j], f = s <= 1 ? s : s - 1; return a.map((v, k) => lerp(v, b[k], f)); };

/** Everything drawn on the screen: nav, hero and cards, as one path. b is the burger fold, 0 to 1. */
function content(W, ss, b, f) {
  const E = W - M - 2, vn = H - M - 3.5, hv1 = H - M - 9.5, hv0 = hv1 - 16, L = layouts(W), pic = clamp((W - 62) / 30, 0, 1) * 22;
  let d = rr(f, M, H - M - 7, W - M, H - M, 1.6) + rr(f, M + 2, vn - 1.7, M + 5.4, vn + 1.7, 0.9);
  for (let k = 0; k < 3; k++) {
    const ls = E - (3 - k) * 8 - (2 - k) * 3, v = lerp(vn, vn + (1 - k) * 2.2, b);
    d += seg(f(lerp(ls, E - 5, b), v), f(lerp(ls + 8, E, b), v));
  }
  d += rr(f, M, hv0, W - M, hv1, 1.6) + seg(f(M + 3, hv1 - 4), f(M + 3 + Math.min(22, (W - 2 * M) * 0.45), hv1 - 4))
    + seg(f(M + 3, hv1 - 7.2), f(M + 3 + Math.min(14, (W - 2 * M) * 0.3), hv1 - 7.2)) + rr(f, M + 3, hv0 + 2.5, M + 11, hv0 + 6, 1.4);
  if (pic > 1.5) d += rr(f, W - M - 3 - pic, hv0 + 2.5, W - M - 3, hv1 - 2.5, 1.6);
  ss.forEach((s, j) => {
    const [u0, v0, u1, v1] = at(L, j, clamp(s, -0.25, 2.25));
    d += rr(f, u0, v0, u1, v1, 1.2);
    if (u1 - u0 > 7 && v1 - v0 > 3.2) d += seg(f(u0 + 2, v1 - 2), f(u0 + Math.min(8, u1 - u0 - 4), v1 - 2));
  });
  return d;
}

export function responsiveScene(g, Q, front, { k = 1, damp = 12, wake = () => {} } = {}) {
  const Qs = (x, y, z) => Q((x - WD / 2) * k, (y - T / 2) * k, z * k - (H * k) / 2 + 12);
  const corners = (W, r) => fillet([[0, 0], [W, 0], [W, H], [0, H]], [r, r, r, r], 6);

  const track = mk('path', { d: seg(Qs(WM, T + 3, 0), Qs(WD, T + 3, 0)), class: 'nf lo dash feat' }, g);
  const marks = SNAPS.map((x) => { const el = mk('circle', { r: 1.4, class: 'dot off' }, g); place(el, Qs(x, T + 3, 0)); return el; });
  const rear = mk('path', { class: 'lo' }, g), plate = mk('path', { class: 'sil' }, g), body = mk('path', { class: 'nf lo feat' }, g);
  const handle = solid(g);
  handle.sil.classList.add('hi');

  const w = spring(WT), bs = spring(0, { k: 120, c: damp }), ss = KS.map((kk) => spring(1, { k: kk, c: damp }));
  let key = '', last = 0, snapped = -1;

  function draw() {
    const W = w.x, r = 2 + 6 * clamp((WT - W) / (WT - WM), 0, 1), k2 = [W, bs.x, ...ss.map((s) => s.x)].map(r2).join();
    if (k2 === key) return;
    key = k2;
    rear.setAttribute('d', poly(corners(W, r).map(([u, v]) => Qs(u, 0, v))));
    plate.setAttribute('d', poly(corners(W, r).map(([u, v]) => Qs(u, T, v))));
    body.setAttribute('d', content(W, ss.map((s) => s.x), clamp(bs.x, -0.2, 1.2), (u, v) => Qs(u, T, v)));
    const [ring, inner] = rings(W + 1.5, 0, W + 4.5, T, 1.1, 0.5);
    put(handle, prism(Qs, front, ring, inner, H / 2 - 8, H / 2 + 8));
  }

  /** Aims the frame at width wt: the layout follows the breakpoint it lands in, and the snap mark it caught lights. */
  function aim(wt, silent = false) {
    const bp = wt < (WM + WT) / 2 ? 0 : wt < (WT + WD) / 2 ? 1 : 2, sn = SNAPS.indexOf(wt);
    w.t = wt;
    ss.forEach((s) => { s.t = bp; });
    bs.t = bp === 0 ? 1 : 0;
    if (sn !== snapped) { snapped = sn; marks.forEach((m, i) => m.setAttribute('class', i === sn ? 'dot m' : 'dot off')); }
    if (!silent) wake();
    return `${NAMES[bp]} · ${Math.round(wt * PX)}px`;
  }

  aim(WT, true);
  draw();
  return {
    tick(now) {
      const dt = Math.min(Math.max((now - last) / 1000, 0), 0.05);
      last = now;
      const moving = [w, bs, ...ss].map((s) => stepS(s, dt)).some(Boolean);
      draw();
      return moving;
    },
    /** The pointer is at screen point p: the frame takes that width, caught by the nearest breakpoint. Returns the read-out. */
    move(p) {
      const x0 = Qs(0, T, 0)[0], x = clamp((p[0] - x0) / (Qs(1, T, 0)[0] - x0), WMIN, WD);
      return aim(SNAPS.find((s) => Math.abs(x - s) < CATCH) ?? x);
    },
    /** The auto-play's hand: the frame takes the width t (0 to 1) of the way from narrowest to widest. */
    to(t) { const x = lerp(WMIN, WD, t); return aim(SNAPS.find((s) => Math.abs(x - s) < CATCH) ?? x); },
    leave() { aim(WT); return 'rest'; },
    set(c) { bs.c = c; ss.forEach((s) => { s.c = c; }); },
  };
}
