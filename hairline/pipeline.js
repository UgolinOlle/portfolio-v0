/**
 * Pipeline: four slabs stepping down from mockup to production, each carrying
 * what makes it that stage: a wireframe sheet, a block of code lines, a
 * ribbed container, a server rack beside a shield. The slab under the pointer
 * lifts and its neighbours lift less in turn; one request bead drops from the
 * top of the stack and settles on it. The slider is the lift.
 *
 * The pattern: discrete items, tweens, a stagger by distance, and a hit test
 * on each slab's rest pose (and the rest height of what stands on it).
 */
const {
  Cam,
  clamp,
  facing,
  fillet,
  fit,
  lerp,
  poly,
  prism,
  proj,
  put,
  rings,
  seg,
  solid,
  unproj,
  tdone,
  tset,
  tval,
  tween,
  disposer,
  mk,
  place,
  pointer,
  register,
} = HL;

const N = 4,
  XS = 44,
  W = 40,
  D = 52,
  T = 5,
  Z0 = [24, 15, 7, 0],
  FALL = [1, 0.46, 0.2, 0.08];
const STEP = 45,
  ZT = 54,
  BR = 2.4,
  SPOT = [20, 46],
  CB = 2;
const NAMES = ['maquette', 'code', 'conteneur', 'production'];
// what stands on each slab: u0, v0, u1, v1, corner radius, height
const BOX = [null, [4, 4, 36, 42, 3, CB], [5, 6, 27, 40, 2.5, 10], [10, 6, 28, 30, 2.5, 20]];

const sm = (t) => t * t * (3 - 2 * t);
const rr = (w, a, b, c, d, r) =>
  poly(
    fillet(
      [
        [a, b],
        [c, b],
        [c, d],
        [a, d],
      ],
      [r, r, r, r],
    ).map(([u, v]) => w(u, v, 0)),
  );
const ln = (w, rows, h = 0) =>
  rows.map(([u0, v0, u1, v1]) => seg(w(u0, v0, h), w(u1, v1, h))).join('');

/** The marks on slab i's top, as [path, class] pairs, and the led dots; `w(u, v, h)` projects a point of the slab's own plane. */
function marks(i, w) {
  if (i === 0) {
    return {
      m: [
        [rr(w, 5, 5, 35, 41, 3), 'nf'],
        [rr(w, 8, 8, 32, 13, 1.5), 'nf lo'],
        [rr(w, 8, 17, 32, 29, 1.5), 'nf lo'],
        [
          ln(w, [
            [8, 17, 32, 29],
            [32, 17, 8, 29],
          ]),
          'nf lo',
        ],
        [
          ln(w, [
            [8, 33, 28, 33],
            [8, 37, 20, 37],
          ]),
          'nf lo',
        ],
      ],
      dots: [],
    };
  }
  if (i === 1) {
    const rows = [
      [7, 26],
      [11, 31],
      [11, 22],
      [15, 33],
      [11, 27],
      [7, 19],
      [7, 30],
    ].map(([a, b], k) => [a, 9 + k * 5, b, 9 + k * 5]);
    return { m: [[ln(w, rows, CB), 'nf']], dots: [] };
  }
  if (i === 2) {
    const ribs = [];
    for (let v = 11; v <= 35; v += 4) ribs.push(seg(w(27, v, 2), w(27, v, 8)));
    for (let u = 9; u <= 23; u += 4) ribs.push(seg(w(u, 40, 2), w(u, 40, 8)));
    return { m: [[ribs.join(''), 'nf lo']], dots: [] };
  }
  const slots = [5, 10, 15],
    at = (u, h) => w(27 + u, 40, h),
    back = (u, h) => w(27 + u, 38.6, h);
  const shield = fillet(
    [
      [0, 15],
      [12, 15],
      [12, 7],
      [6, 0],
      [0, 7],
    ],
    [1.5, 1.5, 2.5, 1.5, 2.5],
  );
  const core = fillet(
    [
      [3, 12.4],
      [9, 12.4],
      [9, 8],
      [6, 3.6],
      [3, 8],
    ],
    [0.8, 0.8, 1, 0.8, 1],
  );
  return {
    m: [
      [slots.map((h) => seg(w(13, 30, h), w(23, 30, h))).join(''), 'nf lo'],
      [poly(shield.map(([u, h]) => back(u, h))), 'lo'],
      [poly(shield.map(([u, h]) => at(u, h))), ''],
      [poly(core.map(([u, h]) => at(u, h))), 'nf lo'],
    ],
    dots: slots.map((h) => w(25.7, 30, h)),
  };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let L = value,
    act = -1,
    dirty = true;

  // fitted to the most extreme pose: the top-most lift, and the bead at the top of the drop
  const C = Cam(45, 0.5, 1.75);
  fit(
    C,
    [
      [-2, -2, ZT + 3],
      [3 * XS + W + 2, D + 2, -2],
      [-2, D + 2, Z0[0]],
      [3 * XS + W + 2, -2, 51],
    ],
    200,
    166,
  );
  const P = proj(C),
    front = facing(C);

  const root = mk('g', {}, svg);
  const slabs = [];
  for (let i = 0; i < N; i++) {
    const ox = i * XS,
      g = mk('g', {}, root);
    const [ring, inner] = rings(ox, 0, ox + W, D, 6, 1.6);
    const sol = solid(g),
      b = BOX[i];
    const box = b && {
      sol: solid(g),
      h: b[5],
      rings: rings(ox + b[0], b[1], ox + b[2], b[3], b[4], 1),
    };
    const mm = marks(i, (u, v, h) => P(ox + u, v, Z0[i] + T + h));
    const els = mm.m.map(([, cls]) => mk('path', { class: cls }, g));
    const dots = mm.dots.map(() => mk('circle', { r: 0.8, class: 'dot off' }, g));
    slabs.push({ ox, ring, inner, sol, box, els, dots, f: tween(0), last: null });
  }
  const bead = { el: mk('circle', { r: BR, class: 'dot' }, root) };
  const spot = (i) =>
    i < 0 ? [SPOT[0], SPOT[1], ZT] : [i * XS + SPOT[0], SPOT[1], Z0[i] + T + L + BR * 0.9];
  bead.prev = bead.next = spot(-1);
  bead.tw = tween(1);
  let lastBead = '';

  /** The bead rises to the top of the drop, crosses over, then falls onto the slab (or stays up, for rest). */
  function beadAt(now) {
    const p = tval(bead.tw, now),
      a = bead.prev,
      b = bead.next,
      m = sm(clamp((p - 0.2) / 0.3, 0, 1));
    const z =
      p < 0.45
        ? lerp(a[2], ZT, sm(clamp(p / 0.25, 0, 1)))
        : lerp(ZT, b[2], sm(clamp((p - 0.45) / 0.55, 0, 1)));
    return [lerp(a[0], b[0], m), lerp(a[1], b[1], m), z];
  }

  function draw(i, lift) {
    const s = slabs[i],
      zt = Z0[i] + T + lift,
      w = (u, v, h) => P(s.ox + u, v, zt + h);
    put(s.sol, prism(P, front, s.ring, s.inner, Z0[i] + lift, zt));
    if (s.box) put(s.box.sol, prism(P, front, s.box.rings[0], s.box.rings[1], zt, zt + s.box.h));
    const mm = marks(i, w);
    mm.m.forEach(([d], k) => s.els[k].setAttribute('d', d));
    mm.dots.forEach((q, k) => place(s.dots[k], q));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    slabs.forEach((s, i) => {
      const lift = L * tval(s.f, now);
      if (!tdone(s.f, now)) moving = true;
      if (dirty || lift !== s.last) {
        s.last = lift;
        draw(i, lift);
      }
    });
    dirty = false;
    const q = beadAt(now),
      key = q.join();
    if (key !== lastBead) {
      lastBead = key;
      place(bead.el, P(q[0], q[1], q[2]));
    }
    return moving || !tdone(bead.tw, now);
  });
  bag.add(B.unregister);

  /** Slab under the pointer, from each slab's rest pose, at its top and at the top of what stands on it. */
  function hit([sx, sy]) {
    let best = -1,
      bs = 1.2;
    for (let i = 0; i < N; i++) {
      for (const h of [0, BOX[i] ? BOX[i][5] : 0]) {
        const [x, y] = unproj(C, sx, sy, Z0[i] + T + h);
        const s = Math.max(
          Math.abs((x - i * XS - W / 2) / (W / 2)),
          Math.abs((y - D / 2) / (D / 2)),
        );
        if (s < bs) {
          bs = s;
          best = i;
        }
      }
    }
    return best;
  }

  function setActive(a) {
    if (a === act) return;
    const now = performance.now(),
      from = a >= 0 ? a : act;
    act = a;
    slabs.forEach((s, i) => {
      tset(s.f, a < 0 ? 0 : FALL[Math.abs(i - a)], now, Math.abs(i - from) * STEP);
      s.sol.sil.classList.toggle('hi', i === a);
    });
    bead.prev = beadAt(now);
    bead.next = spot(a);
    bead.tw = tween(0);
    tset(bead.tw, 1, now, 0);
    read.textContent = a < 0 ? 'rest' : NAMES[a];
    B.wake();
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  B.wake();

  return {
    set: (v) => {
      L = v;
      dirty = true;
      if (act >= 0) bead.next = spot(act);
      B.wake();
    },
    destroy: bag.dispose,
  };
}

hairline({
  name: 'pipeline',
  means:
    'Four slabs from mockup to production: the one under the pointer lifts, and a request bead drops onto it.',
  rules: [1, 2, 4, 8],
  range: [8, 15, 22],
  tour: [[118, 123], [227, 188], [282, 211], null],
  mount,
});
