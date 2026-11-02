import HL from './kernel.js';

/**
 * Scanner: a code file of eight lines standing up, with a scan bar lying across its face. The
 * pointer's height moves the bar; every line it crosses is checked, and on the line that holds an
 * API key the key is masked to four dots and a small shield marks the line. The slider is the
 * damping of the bar's spring: the lower, the further it sweeps past the pointer before gliding
 * back, checking the lines it passed on the way.
 *
 * The scene draws in whatever projection it is given, so the same code is the standalone figure
 * and the security state of the hero. The pointer is read as a world height on the file's plane,
 * never tested against the bar on screen (rule 01).
 */
const { clamp, fillet, lerp, poly, prism, put, r2, rings, seg, solid, mk, place, spring, stepS, tdone, tset, tval, tween } = HL;

const W = 54, H = 64, T = 2.4, N = 8, SECRET = 4, ZL = (i) => H - 8 - i * 6.8, HOME = H - 2, BAR = 2.2;
// each line is a few strokes [from, length] along the file, like tokens of code
const CODE = [[[0, 9], [11, 14]], [[0, 6], [8, 18], [28, 8]], [[4, 12], [18, 10]], [[4, 8], [14, 22]], [[0, 7], [9, 10]], [[4, 16]], [[0, 10], [12, 6], [20, 12]], [[0, 4]]];
const TOKEN = 22, TU = 21;

export function scannerScene(g, Q, front, { k = 1, damp = 11, wake = () => {}, onLabel = () => {} } = {}) {
  const Qs = (x, y, z) => Q((x - W / 2) * k, (y - T / 2) * k, (z - H / 2) * k + 12);
  const fl = (u, v) => Qs(u, T, v);
  const outline = (y) => fillet([[0, 0], [W, 0], [W, H - 10], [W - 10, H], [0, H]], [3, 3, 2, 2, 3], 5);

  // the file: a back edge for its thickness, the face, and the turned corner
  mk('path', { d: poly(outline().map(([u, v]) => Qs(u, 0, v))), class: 'lo' }, g);
  mk('path', { d: poly(outline().map(([u, v]) => fl(u, v))), class: 'sil' }, g);
  mk('path', { d: seg(fl(W - 10, H), fl(W - 10, H - 7)) + seg(fl(W - 10, H - 7), fl(W, H - 7)), class: 'nf lo' }, g);

  const lines = CODE.map((parts, i) => {
    const z = ZL(i), body = parts.map(([u, len]) => seg(fl(9 + u, z), fl(9 + u + len, z))).join('');
    return { z, body, el: mk('path', { class: 'nf lo' }, g), dot: mk('circle', { r: 1.2, class: 'dot off' }, g) };
  });
  lines.forEach((l) => { l.el.setAttribute('d', l.body); place(l.dot, fl(4, l.z)); });
  const masks = [0, 1, 2, 3].map((j) => { const el = mk('circle', { r: 0, class: 'dot m' }, g); place(el, fl(TU + 1 + j * 3.2, lines[SECRET].z)); return el; });
  const shield = mk('path', { class: 'nf' }, g);

  const bar = solid(g), [br, bi] = rings(-5, T + 1, W + 5, T + 4, 1.4, 0.6);
  bar.sil.classList.add('hi');

  const pk = spring(HOME, { k: 100, c: damp }), c = lines.map(() => tween(0)), mt = tween(0);
  const checked = lines.map(() => false);
  let active = false, last = 0, barKey = '', maskKey = '', text = 'rest';

  function draw(now) {
    const bk = r2(pk.x);
    if (bk !== barKey) { barKey = bk; put(bar, prism(Qs, front, br, bi, pk.x - BAR, pk.x + BAR)); }
    const m = tval(mt, now), mk2 = r2(m) + ',' + c.map((t) => r2(tval(t, now))).join();
    if (mk2 === maskKey) return;
    maskKey = mk2;
    lines.forEach((l, i) => {
      const on = tval(c[i], now) > 0.5;
      l.el.setAttribute('class', on ? 'nf feat' : 'nf lo');
      l.dot.setAttribute('class', on ? 'dot m' : 'dot off');
    });
    const s = lines[SECRET], len = lerp(TOKEN, 0, m), tok = len > 2.5 ? poly(fillet([[TU, s.z - 1.5], [TU + len, s.z - 1.5], [TU + len, s.z + 1.5], [TU, s.z + 1.5]], [1.2, 1.2, 1.2, 1.2]).map(([u, v]) => fl(9 + u - 9, v))) : '';
    s.el.setAttribute('d', s.body + tok);
    masks.forEach((el) => el.setAttribute('r', m > 0.4 ? 1.1 : 0));
    const sh = clamp((m - 0.5) * 2, 0, 1) * 3;
    shield.setAttribute('d', sh > 0.2 ? poly([[-0.87, 0.6], [0.87, 0.6], [0.87, -0.15], [0, -0.93], [-0.87, -0.15]].map(([u, v]) => fl(46 + u * sh, s.z + v * sh * 1.25))) : '');
  }

  function label() {
    if (!active) return 'rest';
    const i = clamp(Math.round((H - 8 - pk.x) / 6.8), 0, N - 1), done = checked[i];
    return `line ${i + 1} · ${i === SECRET && done ? 'secret masked' : done ? 'checked' : 'scanning'}`;
  }

  function tick(now) {
    const dt = Math.min(Math.max((now - last) / 1000, 0), 0.05);
    last = now;
    let moving = stepS(pk, dt);
    lines.forEach((l, i) => {
      if (!checked[i] && active && Math.abs(pk.x - l.z) < BAR) {
        checked[i] = true;
        tset(c[i], 1, now, 0);
        if (i === SECRET) tset(mt, 1, now, 0);
      }
      if (!tdone(c[i], now)) moving = true;
    });
    if (!tdone(mt, now)) moving = true;
    draw(now);
    const t = label();
    if (t !== text) { text = t; onLabel(t); }
    return moving;
  }

  draw(0);
  const up = Qs(0, 0, 0)[1] - Qs(0, 0, 1)[1];
  return {
    tick,
    /** The pointer is at screen point p: the bar heads for that height on the file's plane. */
    move(p) {
      const x0 = Qs(0, T, 0)[0], x = (p[0] - x0) / (Qs(1, T, 0)[0] - x0);
      pk.t = clamp((Qs(x, T, 0)[1] - p[1]) / up, 0, H - 1);
      active = true;
      wake();
    },
    /** The auto-play's hand: the bar heads for the point t (0 top, 1 bottom) of the way down the file. */
    to(t) {
      pk.t = clamp((1 - t) * (H - 1), 0, H - 1);
      active = true;
      wake();
    },
    /** The pointer is gone: the bar parks at the top and the lines clear, from the bar outwards. */
    leave() {
      const now = performance.now(), from = clamp(Math.round((H - 8 - pk.x) / 6.8), 0, N - 1);
      active = false;
      pk.t = HOME;
      lines.forEach((_, i) => { checked[i] = false; tset(c[i], 0, now, Math.abs(i - from) * 45); });
      tset(mt, 0, now, 0);
      wake();
    },
    set(v) { pk.c = v; },
  };
}
